import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import type { EmailNode } from '../types';
import { useDragState } from '../context/DragStateContext';

interface ColumnProps {
  node: EmailNode;
  children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ node, children }) => {
  const { props } = node;
  const { dragState } = useDragState();
  
  const { setNodeRef, isOver } = useDroppable({
    id: node.id,
    data: {
      type: 'column',
      node,
    }
  });

  const isOverMeDirectly = dragState.overId === node.id;
  const childIndex = node.children?.findIndex(c => c.id === dragState.overId) ?? -1;
  const isOverChild = childIndex !== -1;
  const isDraggingColumn = dragState.activeType === 'column' || dragState.activeType === 'section';
  
  const showPlaceholder = (isOverMeDirectly || isOverChild) && !isDraggingColumn && dragState.activeType;
  const showHighlight = isOver && !isDraggingColumn;

  const placeholderIndex = isOverChild 
    ? (dragState.placement === 'top' ? childIndex : childIndex + 1)
    : (dragState.placement === 'top' ? 0 : node.children?.length || 0);

  const placeholder = (
    <Box 
      key="placeholder-item"
      w="full" 
      h="40px" 
      border="2px dashed" 
      borderColor="primary.300" 
      bg="primary.50" 
      rounded="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="all 0.2s"
    >
      <Text fontSize="10px" fontWeight="800" color="primary.500" letterSpacing="widest">PLACEHOLDER ITEM</Text>
    </Box>
  );

  const renderedChildren = React.Children.toArray(children);
  if (showPlaceholder) {
    renderedChildren.splice(placeholderIndex, 0, placeholder);
  }

  const hoverBg = 'primary.50'; // Workaround for v3
  
  return (
    <Box
      flex={1}
      w={props.width || '100%'}
      minH="50px"
      p={props.padding || '10px'}
      transition="all 0.2s"
    >
      <VStack 
        ref={setNodeRef}
        spacing={4} 
        alignItems="stretch" 
        w="full"
        minH="40px"
        bg={showHighlight ? hoverBg : 'transparent'}
        rounded="md"
        p={showHighlight ? 2 : 0}
        outline={showHighlight ? '2px dashed' : 'none'}
        outlineColor="primary.200"
        transition="all 0.2s"
      >
        {renderedChildren.length === 0 ? (
          <Box border="1px dashed" borderColor="gray.100" p={4} textAlign="center" color="gray.300" fontSize="xs" fontWeight="700">
            DROP COMPONENTS HERE
          </Box>
        ) : (
          renderedChildren
        )}
      </VStack>
    </Box>
  );
};

export default Column;
