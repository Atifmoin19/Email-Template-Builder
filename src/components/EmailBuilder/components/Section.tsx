import React from 'react';
import { Box, VStack, Text, SimpleGrid, GridItem } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import type { EmailNode } from '../types';
import { useDragState } from '../context/DragStateContext';

interface SectionProps {
  node: EmailNode;
  children?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ node, children }) => {
  const { props } = node;
  const childIds = node.children?.map(c => c.id) || [];
  const { dragState } = useDragState();
  
  const { setNodeRef, isOver } = useDroppable({
    id: node.id,
    data: {
      type: 'section',
      node,
    }
  });

  const gridColumns = props.gridColumns || 1;

  const isOverMeDirectly = dragState.overId === node.id;
  const childIndex = node.children?.findIndex(c => c.id === dragState.overId) ?? -1;
  const isOverChild = childIndex !== -1;
  const showPlaceholder = (isOverMeDirectly || isOverChild) && (dragState.activeType === 'column' || dragState.activeType === 'section');

  const placeholderIndex = isOverChild 
    ? (dragState.placement === 'left' ? childIndex : childIndex + 1)
    : (dragState.placement === 'left' ? 0 : node.children?.length || 0);

  const placeholder = (
    <GridItem key="placeholder-column" colSpan={1}>
      <Box
        flex={1}
        minH="100px"
        border="2px dashed"
        borderColor="primary.300"
        bg="primary.50"
        rounded="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="all 0.2s"
        m={1}
      >
        <VStack spacing={1}>
          <Text fontSize="10px" fontWeight="800" color="primary.500" letterSpacing="widest">PLACEHOLDER</Text>
        </VStack>
      </Box>
    </GridItem>
  );

  const renderedChildren = React.Children.toArray(children).map((child, idx) => {
    const childNode = node.children?.[idx];
    return (
      <GridItem key={childNode?.id || idx} colSpan={childNode?.props?.colSpan || 1}>
        {child}
      </GridItem>
    );
  });

  if (showPlaceholder) {
    renderedChildren.splice(placeholderIndex, 0, placeholder);
  }

  const hoverBg = 'primary.50';

  return (
    <Box
      w="full"
      bg={props.backgroundColor || 'transparent'}
      p={props.padding || '20px'}
      minH="80px"
      transition="all 0.2s"
    >
      <SortableContext items={childIds} strategy={rectSortingStrategy}>
        <SimpleGrid 
          columns={gridColumns}
          ref={setNodeRef}
          spacing={0} 
          w="full" 
          minH="60px"
          rounded="md"
          bg={isOver ? hoverBg : 'transparent'}
          outline={isOver ? '2px dashed' : 'none'}
          outlineColor="primary.200"
          transition="all 0.2s"
        >
          {renderedChildren.length === 0 ? (
            <GridItem colSpan={gridColumns}>
              <Box w="full" border="1px dashed" borderColor="gray.200" p={8} textAlign="center" color="gray.400" fontSize="xs" fontWeight="700">
                DROP CONTENT HERE
              </Box>
            </GridItem>
          ) : (
            renderedChildren
          )}
        </SimpleGrid>
      </SortableContext>
    </Box>
  );
};

export default Section;
