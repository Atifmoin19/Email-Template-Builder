import React from 'react';
import { Box, Image as ChakraImage, Center, Icon, Text } from '@chakra-ui/react';
import { Image as ImageIcon } from 'lucide-react';
import type { EmailNode } from '../types';

interface ImageProps {
  node: EmailNode;
}

const Image: React.FC<ImageProps> = ({ node }) => {
  const { props } = node;
  
  if (!props.src) {
    return (
      <Center w="full" h="150px" bg="gray.50" border="1px dashed" borderColor="gray.200" rounded="md" flexDir="column">
        <Icon as={ImageIcon} fontSize="24px" color="gray.400" mb={2} />
        <Text fontSize="xs" fontWeight="700" color="gray.400">IMAGE PLACEHOLDER</Text>
      </Center>
    );
  }

  return (
    <Box w="full" display="flex" justifyContent={props.align || 'center'} minH="20px">
      <ChakraImage
        src={props.src}
        alt={props.alt || ''}
        w={props.width || '100%'}
        maxW="100%"
        h={props.height || 'auto'}
        objectFit={props.objectFit || 'contain'}
        display="block"
      />
    </Box>
  );
};

export default Image;
