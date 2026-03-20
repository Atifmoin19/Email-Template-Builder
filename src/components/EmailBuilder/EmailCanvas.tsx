import React from 'react';
import {
  Box,
  VStack,
  Center,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { MousePointer2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { EmailNode } from './types';
import EmailNodeRenderer from './components/EmailNodeRenderer';

interface EmailCanvasProps {
  nodes: EmailNode[];
  selectedNodeId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}

const EmailCanvas: React.FC<EmailCanvasProps> = ({
  nodes,
  selectedNodeId,
  onSelect,
  onDelete,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
  });

  return (
    <Box w="full" maxW="900px" mx="auto">
      <HStack w="full" justify="space-between" mb={4}>
        <HStack spacing={2} color="gray.500">
          <Icon as={MousePointer2} fontSize="14px" />
          <Text color="gray.400" fontSize="10px" fontWeight="900" letterSpacing="widest">
            CANVAS WORKSPACE (A4)
          </Text>
        </HStack>
      </HStack>

      <Box
        ref={setNodeRef}
        bg="white"
        minH="800px"
        shadow="xl"
        rounded="2xl"
        transition="all 0.2s"
        outline={isOver ? '2px solid' : 'none'}
        outlineColor="primary.400"
        position="relative"
        p={4}
        pt={12}
        overflow="visible"
      >
        <SortableContext
          items={nodes.map((n) => n.id)}
          strategy={verticalListSortingStrategy}
        >
          {nodes.length === 0 ? (
            <Center h="800px" flexDir="column" p={10} textAlign="center">
              <VStack spacing={4}>
                <Box p={6} bg="primary.50" color="primary.500" rounded="3xl">
                  <Icon as={MousePointer2} fontSize="40px" />
                </Box>
                <VStack spacing={1}>
                  <Text fontWeight="900" fontSize="lg" color="gray.800">
                    Your canvas is empty
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Drag components from the left sidebar to start building your email.
                  </Text>
                </VStack>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={0} align="stretch" w="full">
              {nodes.map((node) => (
                <EmailNodeRenderer
                  key={node.id}
                  node={node}
                  selectedNodeId={selectedNodeId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
            </VStack>
          )}
        </SortableContext>
      </Box>
    </Box>
  );
};

export default EmailCanvas;
