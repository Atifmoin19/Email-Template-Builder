import React, { useState } from "react";
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
import type { EmailNode, EmailNodeType } from "./types";
import { generateEmailHtml } from "./utils/emailRenderer";
import {
  findNodeById,
  findParentNode,
  updateNodeInTree,
  removeNodeById,
} from "./utils/astHelpers";
import { DragStateProvider, useDragState } from "./context/DragStateContext";

import { templates } from "./presets";
import EmailSidebar from "./EmailSidebar";
import EmailTopBar from "./EmailTopBar";

interface EmailBuilderProps {
  onNavigate?: (id: string) => void;
}

const EmailBuilderInner: React.FC<EmailBuilderProps> = ({ onNavigate }) => {
  const { project, setProject, resetProject, undo, redo, canUndo, canRedo } = useEmailHistory(
    templates.OTP.project,
  );
  const { nodes, settings } = project;

  const setNodes = (newNodes: EmailNode[]) => {
    setProject({ ...project, nodes: newNodes });
  };

  const setSettings = (newSettings: any) => {
    setProject({ ...project, settings: { ...settings, ...newSettings } });
  };

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
    let effectivePlacement: any = "inside";

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

    const isActiveRootLevel = ["section", "header", "footer"].includes(
      activeNode.type,
    );
    const newNodesWithoutActive = isNew
      ? nodes
      : removeNodeById(nodes, activeId);

    // 1. Drop on canvas-root (append to end)
    if (overId === "canvas-root") {
      if (isActiveRootLevel) {
        setNodes([...newNodesWithoutActive, activeNode]);
      } else if (newNodesWithoutActive.length > 0) {
        const lastRoot =
          newNodesWithoutActive[newNodesWithoutActive.length - 1];
        setNodes(
          updateNodeInTree(newNodesWithoutActive, lastRoot.id, (node) => ({
            ...node,
            children: [...(node.children || []), activeNode],
          })),
        );
      } else {
        const newSection: EmailNode = {
          id: `section-${nanoid(6)}`,
          type: "section",
          props: {
            padding: "20px",
            backgroundColor: "#ffffff",
            gridColumns: 1,
          },
          children: [activeNode],
        };
        setNodes([newSection]);
      }
      return;
    }

    const overNode = findNodeById(newNodesWithoutActive, overId);
    if (!overNode) return;

    const overParent = findParentNode(newNodesWithoutActive, overId);

    // 2. Sibling Placement (top, bottom, left, right)
    const isSiblingPlacement =
      finalPlacement === "top" ||
      finalPlacement === "bottom" ||
      finalPlacement === "left" ||
      finalPlacement === "right";

    if (isSiblingPlacement) {
      if (overParent) {
        // Nested sibling move
        setNodes(
          updateNodeInTree(newNodesWithoutActive, overParent.id, (node) => {
            const index =
              node.children?.findIndex((c) => c.id === overId) ?? -1;
            const newChildren = [...(node.children || [])];
            const insertIndex =
              finalPlacement === "top" || finalPlacement === "left"
                ? index
                : index + 1;
            newChildren.splice(insertIndex, 0, activeNode);
            return { ...node, children: newChildren };
          }),
        );
      } else {
        // Root-level sibling move
        if (isActiveRootLevel) {
          const index = newNodesWithoutActive.findIndex((n) => n.id === overId);
          if (index !== -1) {
            const newNodes = [...newNodesWithoutActive];
            const insertIndex =
              finalPlacement === "top" || finalPlacement === "left"
                ? index
                : index + 1;
            newNodes.splice(insertIndex, 0, activeNode);
            setNodes(newNodes);
          }
        } else {
          // Content element tried to be root sibling - force into the target section
          setNodes(
            updateNodeInTree(newNodesWithoutActive, overId, (node) => ({
              ...node,
              children:
                finalPlacement === "top"
                  ? [activeNode, ...(node.children || [])]
                  : [...(node.children || []), activeNode],
            })),
          );
        }
      }
      return;
    }

    // 3. Container Placement (inside)
    const isContainer =
      overNode.type === "section" ||
      overNode.type === "column" ||
      overNode.type === "header" ||
      overNode.type === "footer";
    if (isContainer) {
      if (activeNode.type === "section" && overNode.type === "section") return; // No nesting sections

      setNodes(
        updateNodeInTree(newNodesWithoutActive, overId, (node) => ({
          ...node,
          children: [...(node.children || []), activeNode],
        })),
      );
    }
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

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the template? ALL your changes and history will be lost.")) {
      resetProject(templates.OTP.project);
      setSelectedNodeId(null);
    }
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
           onReset={handleReset}
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
