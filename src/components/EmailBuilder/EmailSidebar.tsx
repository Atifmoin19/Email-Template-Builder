import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  Heading,
} from '@chakra-ui/react';
import {
  Rows,
  Type,
  Image as ImageIcon,
  Columns,
  RectangleHorizontal,
  SeparatorHorizontal,
  Square,
  PanelTop,
  PanelBottom,
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { EmailNodeType } from './types';

interface SidebarItemProps {
  type: EmailNodeType;
  label: string;
  icon: any;
  isSelected?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, icon, isSelected }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type,
      isNew: true,
    },
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      p={3}
      bg={isSelected ? "primary.50" : "white"}
      border="1px solid"
      borderColor={isSelected ? "primary.200" : "gray.100"}
      rounded="xl"
      cursor="grab"
      transition="all 0.2s"
      _hover={{
        borderColor: "primary.300",
        shadow: "md",
        transform: "translateY(-1px)",
        bg: "primary.50"
      }}
      opacity={isDragging ? 0.5 : 1}
      position="relative"
    >
      <HStack spacing={3}>
        <Box 
          p={2} 
          bg={isSelected ? "primary.500" : "gray.50"} 
          color={isSelected ? "white" : "gray.500"}
          rounded="lg"
          transition="all 0.2s"
        >
          <Icon as={icon} fontSize="18px" />
        </Box>
        <Text fontSize="xs" fontWeight="800" color="gray.700" letterSpacing="tight">
          {label}
        </Text>
      </HStack>
    </Box>
  );
};

interface EmailSidebarProps {
  selectedType?: EmailNodeType | null;
}

const EmailSidebar: React.FC<EmailSidebarProps> = ({ selectedType }) => {
  const borderColor = 'gray.200';

  const components = [
    { type: 'section' as EmailNodeType, label: 'Section', icon: Rows },
    { type: 'column' as EmailNodeType, label: 'Column', icon: Columns },
    { type: 'text' as EmailNodeType, label: 'Text Block', icon: Type },
    { type: 'image' as EmailNodeType, label: 'Image', icon: ImageIcon },
    { type: 'button' as EmailNodeType, label: 'Button', icon: RectangleHorizontal },
    { type: 'divider' as EmailNodeType, label: 'Divider', icon: SeparatorHorizontal },
    { type: 'spacer' as EmailNodeType, label: 'Spacer', icon: Square },
    { type: 'header' as EmailNodeType, label: 'Header', icon: PanelTop },
    { type: 'footer' as EmailNodeType, label: 'Footer', icon: PanelBottom },
  ];

  return (
    <VStack h="full" spacing={0} alignItems="stretch" bg="white">
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <Heading size="xs" fontWeight="900" letterSpacing="widest" color="gray.400">
          COMPONENTS
        </Heading>
      </Box>

      <VStack p={4} spacing={3} alignItems="stretch" flex={1} overflowY="auto">
        <Text fontSize="10px" fontWeight="900" color="gray.400" letterSpacing="widest" mb={1}>
          DRAG & DROP
        </Text>
        {components.map((comp) => (
          <SidebarItem
            key={comp.type}
            type={comp.type}
            label={comp.label}
            icon={comp.icon}
            isSelected={selectedType === comp.type}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default EmailSidebar;
