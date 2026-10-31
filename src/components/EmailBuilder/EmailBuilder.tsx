import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, VStack, Icon, Text } from "@chakra-ui/react";
import { Type, ImageIcon, Layout } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { nanoid } from "nanoid";
import { useEmailHistory } from "./hooks/useEmailHistory";

import EmailCanvas from "./EmailCanvas";
import EmailInspectorPanel from "./EmailInspectorPanel";
import EmailPreviewModal from "./EmailPreviewModal";
import type { EmailNode, EmailNodeType, EmailSettings } from "./types";
import { generateEmailHtml } from "./utils/emailRenderer";
import { applyDrop } from "./utils/applyDrop";
import {
  findNodeById,
  findParentNode,
  removeNodeById,
} from "./utils/astHelpers";
import { DragStateProvider } from "./context/DragStateContext";
import { useDragState } from "./context/useDragState";
import type { Placement } from "./context/dragStateTypes";

import { emptyProject, instantiatePreset, templates, type TemplateId } from "./presets";
import { clearDraft, loadDraft } from "./utils/draftStorage";
import { useAutosave } from "./hooks/useAutosave";
import ConfirmDialog, { type ConfirmRequest } from "./ConfirmDialog";
import type { EmailProject } from "./types";
import EmailSidebar from "./EmailSidebar";
import EmailTopBar from "./EmailTopBar";

interface EmailBuilderProps {
  onNavigate?: (id: string) => void;
}

const EmailBuilderInner: React.FC<EmailBuilderProps> = ({ onNavigate }) => {
  // Restore the autosaved draft once on mount; otherwise start from the OTP preset.
  const [restoredDraft] = useState(() => loadDraft());
  const [initialProject] = useState(() => restoredDraft ?? instantiatePreset(templates.OTP.project));
  const { project, setProject, resetProject, undo, redo, canUndo, canRedo } = useEmailHistory(initialProject);
  const { status: saveStatus, markSaved } = useAutosave(project, restoredDraft);
  // The project as last loaded from a preset or "New template". Anything else
  // (including a restored draft) counts as unsaved edits worth confirming.
  const [pristineProject, setPristineProject] = useState<EmailProject | null>(
    restoredDraft ? null : initialProject,
  );
  const hasEdits = project !== pristineProject && project.nodes.length > 0;
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const { nodes, settings } = project;

  const setNodes = (newNodes: EmailNode[], coalesceKey?: string) => {
    setProject({ ...project, nodes: newNodes }, coalesceKey);
  };

  const setSettings = (newSettings: Partial<EmailSettings>) => {
    setProject(
      { ...project, settings: { ...settings, ...newSettings } },
      `settings:${Object.keys(newSettings).sort().join(",")}`,
    );
  };

  // Cmd/Ctrl+Z to undo, Shift+Cmd/Ctrl+Z or Ctrl+Y to redo. Left alone while
  // typing in a field so the browser's native text undo still works there.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<EmailNodeType | null>(null);

  const { dragState, setDragState, resetDragState } = useDragState();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const onPreviewOpen = () => setIsPreviewOpen(true);
  const onPreviewClose = () => setIsPreviewOpen(false);

  const borderColor = "gray.200";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type as EmailNodeType);
    setDragState({
      activeType: active.data.current?.type,
      isNew: !!active.data.current?.isNew,
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      resetDragState();
      return;
    }

    const overId = over.id as string;
    const overData = over.data.current;
    const activeData = active.data.current;
    const activeRect = active.rect.current.translated;
    const overRect = over.rect;

    const isRootLevelType = (type: string) =>
      ["section", "header", "footer"].includes(type);
    const activeType = activeData?.type as string;
    const overType = overData?.type as string;

    const isActiveRootLevel = isRootLevelType(activeType);
    const isOverContainer = ["section", "column", "header", "footer"].includes(
      overType,
    );

    let effectiveOverId = overId;
    let effectivePlacement: Placement = "inside";

    if (activeRect && overRect) {
      if (overType === "section" && activeType === "column") {
        const activeCenter = activeRect.left + activeRect.width / 2;
        const overCenter = overRect.left + overRect.width / 2;
        effectivePlacement = activeCenter < overCenter ? "left" : "right";
      } else if (isActiveRootLevel) {
        // Sections/Headers/Footers can only be siblings at the root
        if (overId === "canvas-root") {
          if (nodes.length > 0) {
            effectiveOverId = nodes[nodes.length - 1].id;
            effectivePlacement = "bottom";
          } else {
            effectivePlacement = "inside";
          }
        } else {
          // Find root level node if nested item is hovered
          const parent = findParentNode(nodes, overId);
          const rootNode = parent
            ? nodes.find((n) => findNodeById([n], overId))
            : findNodeById(nodes, overId);
          if (rootNode) {
            effectiveOverId = rootNode.id;
            const activeCenter = activeRect.top + activeRect.height / 2;
            const overCenter = overRect.top + overRect.height / 2;
            effectivePlacement = activeCenter < overCenter ? "top" : "bottom";
          }
        }
      } else {
        // Content being dragged (Text, Image, etc.) Must be INSIDE a container.
        if (overId === "canvas-root") {
          if (nodes.length > 0) {
            // Target the last section's inside
            effectiveOverId = nodes[nodes.length - 1].id;
            effectivePlacement = "inside";
          }
        } else if (isOverContainer) {
          // If dragging over a root-level section, prefer the INSIDE placement
          const isRootNode = !findParentNode(nodes, overId);
          if (isRootNode) {
            effectivePlacement = "inside";
          } else {
            const threshold = 20;
            const offsetTop = activeRect.top - overRect.top;
            const offsetBottom = overRect.bottom - activeRect.bottom;
            if (offsetTop < threshold) effectivePlacement = "top";
            else if (offsetBottom < threshold) effectivePlacement = "bottom";
            else effectivePlacement = "inside";
          }
        } else {
          // Over another content element inside a section
          const activeCenter = activeRect.top + activeRect.height / 2;
          const overCenter = overRect.top + overRect.height / 2;
          effectivePlacement = activeCenter < overCenter ? "top" : "bottom";
        }
      }
    }

    setDragState({
      overId: effectiveOverId,
      placement: effectivePlacement,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const finalPlacement = dragState.placement;
    const finalOverId = dragState.overId;

    setActiveId(null);
    setActiveType(null);
    resetDragState();

    if (!over) return;

    const overId = finalOverId || (over.id as string);
    const activeId = active.id as string;
    const activeData = active.data.current;

    let activeNode: EmailNode;
    let isNew = false;

    if (activeData?.isNew) {
      isNew = true;
      const type = activeData.type as EmailNodeType;
      activeNode = {
        id: `${type}-${nanoid(6)}`,
        type,
        props: {
          padding:
            type === "section" || type === "header" || type === "footer"
              ? "20px"
              : "10px",
          backgroundColor:
            type === "section" || type === "header" || type === "footer"
              ? "#ffffff"
              : type === "button"
                ? "#9b02c5"
                : "transparent",
          color:
            type === "button"
              ? "#ffffff"
              : type === "text"
                ? "#000000"
                : undefined,
          content:
            type === "text"
              ? "New Text Block"
              : type === "button"
                ? "Click Me"
                : undefined,
          src: type === "image" ? "" : undefined,
          width: "100%",
          colSpan: 1,
        },
        children:
          type === "section" ||
          type === "column" ||
          type === "header" ||
          type === "footer"
            ? []
            : undefined,
      };
    } else {
      const found = findNodeById(nodes, activeId);
      if (!found) return;
      activeNode = found;
    }

    const next = applyDrop({
      nodes,
      activeNode,
      isNew,
      overId,
      placement: finalPlacement,
    });
    if (next) setNodes(next);
  };

  const handleNodeSelect = (id: string | null) => {
    setSelectedNodeId(id);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(removeNodeById(nodes, id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleDownload = () => {
    const html = generateEmailHtml(project);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startNewTemplate = () => {
    const fresh = emptyProject();
    clearDraft();
    resetProject(fresh);
    markSaved(fresh);
    setPristineProject(fresh);
    setSelectedNodeId(null);
  };

  const handleNewTemplate = () => {
    setConfirmRequest({
      title: "Start a new template?",
      body: "This clears the canvas, your saved draft and the undo history. It cannot be undone.",
      confirmLabel: "Start new",
      onConfirm: startNewTemplate,
    });
  };

  const handleApplyTemplate = (id: TemplateId) => {
    const apply = () => {
      const next = instantiatePreset(templates[id].project);
      setProject(next); // a normal history step, so Undo brings the old document back
      setPristineProject(next);
      setSelectedNodeId(null);
    };
    if (!hasEdits) return apply();
    setConfirmRequest({
      title: `Replace with "${templates[id].name}"?`,
      body: "Your current design will be replaced. You can get it back with Undo.",
      confirmLabel: "Replace",
      onConfirm: apply,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[snapCenterToCursor, restrictToWindowEdges]}
    >
      <Box h="100vh" bg="white" overflow="hidden" display="flex" flexDir="column">
        {/* New Top Bar */}
        <EmailTopBar
           onExit={() => onNavigate?.('landing')}
           onPreview={onPreviewOpen}
           onDownload={handleDownload}
           onNewTemplate={handleNewTemplate}
           onApplyTemplate={handleApplyTemplate}
           saveStatus={saveStatus}
           undo={undo}
           redo={redo}
           canUndo={canUndo}
           canRedo={canRedo}
        />

        <Flex flex={1} overflow="hidden">
          <Box w="300px" borderRight="1px" borderColor={borderColor}>
            <EmailSidebar />
          </Box>

          <Box flex={1} bg="gray.100" overflowY="auto" p={8}>
            <EmailCanvas
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelect={handleNodeSelect}
              onDelete={handleDeleteNode}
            />
          </Box>

          <Box w="340px" borderLeft="1px" borderColor={borderColor}>
            <EmailInspectorPanel
              nodes={nodes}
              setNodes={setNodes}
              settings={settings}
              onUpdateSettings={setSettings}
              selectedNodeId={selectedNodeId}
              onDelete={handleDeleteNode}
            />
          </Box>
        </Flex>

        <ConfirmDialog request={confirmRequest} onClose={() => setConfirmRequest(null)} />
        <EmailPreviewModal
          isOpen={isPreviewOpen}
          onClose={onPreviewClose}
          project={project}
        />

        <DragOverlay
          dropAnimation={{
            duration: 250,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
          zIndex={1000}
        >
          {activeId && activeType ? (
            <Box
              p={3}
              bg="white"
              color="primary.600"
              rounded="xl"
              shadow="2xl"
              minW="200px"
              textAlign="left"
              fontWeight="800"
              fontSize="xs"
              border="2px solid"
              borderColor="primary.600"
              opacity={0.9}
            >
              <HStack spacing={3}>
                <Box p={2} bg="primary.50" rounded="lg">
                  <Icon
                    as={
                      activeType === "text"
                        ? Type
                        : activeType === "image"
                          ? ImageIcon
                          : Layout
                    }
                    fontSize="14px"
                  />
                </Box>
                <VStack alignItems="flex-start" spacing={0}>
                  <Text
                    textTransform="uppercase"
                    letterSpacing="widest"
                    fontSize="10px"
                  >
                    DRAGGING
                  </Text>
                  <Text color="gray.700" fontSize="sm">
                    {activeType.toUpperCase()}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};

const EmailBuilder: React.FC<EmailBuilderProps> = (props) => (
  <DragStateProvider>
    <EmailBuilderInner {...props} />
  </DragStateProvider>
);

export default EmailBuilder;
