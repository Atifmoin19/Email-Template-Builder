import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  Icon,
  Text,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Mail, Eye, LogOut, Download, FilePlus, LayoutTemplate, ChevronDown } from "lucide-react";
import { templates, type TemplateId } from "./presets";
import type { SaveStatus } from "./hooks/useAutosave";

const SAVE_LABEL: Record<SaveStatus, { text: string; color: string }> = {
  saved: { text: "Saved", color: "green.700" },
  saving: { text: "Saving…", color: "gray.600" },
  error: { text: "Not saved (storage unavailable)", color: "red.600" },
};

interface EmailTopBarProps {
  onExit: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onNewTemplate: () => void;
  onApplyTemplate: (id: TemplateId) => void;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const EmailTopBar: React.FC<EmailTopBarProps> = ({
  onExit,
  onPreview,
  onDownload,
  onNewTemplate,
  onApplyTemplate,
  saveStatus,
  canUndo,
  canRedo,
  undo,
  redo,
}) => {
  return (
    <Box
      h="64px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex h="full" align="center" justify="space-between">
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Box 
              p={1.5} 
              bg="primary.500" 
              rounded="xl" 
              color="white"
              boxShadow="0 4px 10px rgba(155, 2, 197, 0.3)"
            >
              <Icon as={Mail} fontSize="18px" />
            </Box>
            <Text
              fontSize="xl"
              fontWeight="900"
              letterSpacing="tight"
              color="gray.900"
            >
              Email<Text as="span" color="primary.500">Template</Text>Flow
            </Text>
          </HStack>
          <Divider orientation="vertical" h="24px" mx={2} />
          <HStack spacing={1}>
             <Button 
               size="xs" 
               variant="ghost" 
               onClick={undo} 
               isDisabled={!canUndo}
               title="Undo (Ctrl/Cmd+Z)"
               rounded="md"
               fontWeight="700"
               color="gray.600"
             >Undo</Button>
             <Button 
               size="xs" 
               variant="ghost" 
               onClick={redo} 
               isDisabled={!canRedo}
               title="Redo (Shift+Ctrl/Cmd+Z)"
               rounded="md"
               fontWeight="700"
               color="gray.600"
             >Redo</Button>
          </HStack>
          <Divider orientation="vertical" h="24px" mx={2} />
          <Menu placement="bottom-start">
            <MenuButton
              as={Button}
              size="sm"
              variant="ghost"
              leftIcon={<Icon as={LayoutTemplate} fontSize="14px" />}
              rightIcon={<Icon as={ChevronDown} fontSize="14px" />}
              color="gray.700"
              fontWeight="700"
              rounded="xl"
            >
              Templates
            </MenuButton>
            <MenuList zIndex={200} py={2} minW="300px">
              {(Object.keys(templates) as TemplateId[]).map((id) => (
                <MenuItem key={id} onClick={() => onApplyTemplate(id)} py={2}>
                  <Box>
                    <Text fontSize="sm" fontWeight="700" color="gray.800">
                      {templates[id].name}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {templates[id].description}
                    </Text>
                  </Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={FilePlus} fontSize="14px" />}
            onClick={onNewTemplate}
            color="gray.700"
            fontWeight="700"
            rounded="xl"
          >
            New template
          </Button>
          <Text
            fontSize="xs"
            fontWeight="700"
            color={SAVE_LABEL[saveStatus].color}
            role="status"
            aria-live="polite"
            minW="60px"
          >
            {SAVE_LABEL[saveStatus].text}
          </Text>
        </HStack>

        <HStack spacing={4}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={LogOut} fontSize="16px" />}
            onClick={onExit}
            color="gray.600"
            fontWeight="700"
            rounded="xl"
            _hover={{ bg: "red.50", color: "red.600" }}
          >
            Exit
          </Button>
          <Button
            size="md"
            variant="outline"
            colorScheme="primary"
            leftIcon={<Icon as={Eye} fontSize="20px" />}
            onClick={onPreview}
            fontWeight="700"
            rounded="xl"
            px={8}
            h="44px"
            borderWidth="2px"
            borderColor="primary.500"
            color="primary.600"
            bg="white"
            _hover={{ 
              bg: "primary.50", 
              transform: "translateY(-2px)", 
              boxShadow: "0 4px 20px -5px rgba(155, 2, 197, 0.2)" 
            }}
            transition="all 0.2s"
          >
            Preview
          </Button>
          <Button
            size="md"
            variant="solid"
            colorScheme="primary"
            leftIcon={<Icon as={Download} fontSize="20px" />}
            onClick={onDownload}
            fontWeight="700"
            rounded="xl"
            px={10}
            h="44px"
            bg="primary.500"
            color="white"
            boxShadow="0 8px 25px -5px rgba(155, 2, 197, 0.4)"
            _hover={{ 
              bg: "primary.600", 
              transform: "translateY(-2px)", 
              boxShadow: "0 12px 30px -5px rgba(155, 2, 197, 0.5)" 
            }}
            _active={{ bg: "primary.700" }}
            transition="all 0.2s"
          >
            Download
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default EmailTopBar;
