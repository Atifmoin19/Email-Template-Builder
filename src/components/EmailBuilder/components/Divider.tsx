import React from 'react';
import { Box, Divider as ChakraDivider } from '@chakra-ui/react';
import type { EmailNode } from '../types';

const Divider: React.FC<{ node: EmailNode }> = ({ node }) => {
  const { props } = node;
  return (
    <Box py={props.paddingY || 4} w="full">
      <ChakraDivider 
        borderColor={props.color || 'gray.200'} 
      />
    </Box>
  );
};

export default Divider;
