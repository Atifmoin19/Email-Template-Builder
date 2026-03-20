import React from 'react';
import { Box } from '@chakra-ui/react';
import type { EmailNode } from '../types';

const Spacer: React.FC<{ node: EmailNode }> = ({ node }) => {
  const { props } = node;
  return <Box h={props.height || '20px'} w="full" bg={props.backgroundColor || 'transparent'} />;
};

export default Spacer;
