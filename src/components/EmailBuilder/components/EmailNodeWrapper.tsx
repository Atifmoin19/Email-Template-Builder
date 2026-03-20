import React from 'react';
import {
  Box,
  IconButton,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDragState } from '../context/DragStateContext';

interface EmailNodeWrapperProps {
  id: string;
  type: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
  flex?: string | number;
  width?: string | number;
}

const EmailNodeWrapper: React.FC<EmailNodeWrapperProps> = ({
  id,
  type,
  isSelected,
  onSelect,
  onDelete,
  children,
  flex,
  width,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    data: {
      type,
    }
  });

  const { dragState } = useDragState();
  const isTargeted = dragState.overId === id;
  const showTopIndicator = isTargeted && dragState.placement === 'top';
  const showBottomIndicator = isTargeted && dragState.placement === 'bottom';
  const showLeftIndicator = isTargeted && dragState.placement === 'left';
  const showRightIndicator = isTargeted && dragState.placement === 'right';

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 0 : 1,
    position: 'relative' as const,
    opacity: isDragging ? 0.4 : 1,
  };

  const activeBorderColor = 'primary.500';
  const hoverBorderColor = 'primary.200';
  const dropIndicatorColor = 'primary.400';
  const dropBgColor = 'primary.50';

  return (
    <Box
      ref={setNodeRef}
      style={style}
      position="relative"
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      borderWidth={isSelected ? "2px" : "1px"}
      borderStyle={isSelected || isTargeted ? "solid" : "dashed"}
      borderColor={isSelected ? activeBorderColor : isTargeted ? activeBorderColor : 'gray.200'}
      bg={isTargeted ? dropBgColor : 'transparent'}
      _hover={{ 
        borderColor: isSelected ? activeBorderColor : 'primary.300', 
        bg: isSelected ? 'transparent' : 'gray.50' 
      }}
      transition="all 0.15s ease-in-out"
      p={isSelected || isTargeted ? "2px" : "1px"}
      role="group"
      cursor="pointer"
      pointerEvents={isDragging ? 'none' : 'auto'}
      flex={flex}
      w={width}
    >
      {/* Top Drop Indicator */}
      {showTopIndicator && (
        <Box
          position="absolute"
          top="-2px"
          left="0"
          right="0"
          h="4px"
          bg={dropIndicatorColor}
          rounded="full"
          zIndex={20}
          boxShadow={`0 0 10px ${dropIndicatorColor}`}
        />
      )}

      {/* Bottom Drop Indicator */}
      {showBottomIndicator && (
        <Box
          position="absolute"
          bottom="-2px"
          left="0"
          right="0"
          h="4px"
          bg={dropIndicatorColor}
          rounded="full"
          zIndex={20}
          boxShadow={`0 0 10px ${dropIndicatorColor}`}
        />
      )}

      {/* Left Drop Indicator */}
      {showLeftIndicator && (
        <Box
          position="absolute"
          top="0"
          bottom="0"
          left="-2px"
          w="4px"
          bg={dropIndicatorColor}
          rounded="full"
          zIndex={20}
          boxShadow={`0 0 10px ${dropIndicatorColor}`}
        />
      )}

      {/* Right Drop Indicator */}
      {showRightIndicator && (
        <Box
          position="absolute"
          top="0"
          bottom="0"
          right="-2px"
          w="4px"
          bg={dropIndicatorColor}
          rounded="full"
          zIndex={20}
          boxShadow={`0 0 10px ${dropIndicatorColor}`}
        />
      )}

      {/* Controls Overlay */}
      {isSelected && (
        <HStack
          position="absolute"
          top="-2px"
          right="-2px"
          transform="translateY(-100%)"
          bg="primary.500"
          p={0.5}
          rounded="md"
          roundedBottom="none"
          spacing={0}
          zIndex={50}
          boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
        >
          <Box {...listeners} {...attributes} cursor="grab" color="white" p={1}>
            <Icon as={GripVertical} fontSize="14px" />
          </Box>
          <IconButton
            aria-label="Delete node"
            size="xs"
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.300' }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            icon={<Icon as={Trash2} fontSize="14px" />}
          />
        </HStack>
      )}

      {children}
    </Box>
  );
};

export default EmailNodeWrapper;
