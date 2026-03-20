import React from 'react';
import { Text as ChakraText, Box } from '@chakra-ui/react';
import type { EmailNode } from '../types';

interface TextProps {
  node: EmailNode;
}

const Text: React.FC<TextProps> = ({ node }) => {
  const { props } = node;
  
  return (
    <Box w="full" textAlign={props.textAlign || 'left'} minH="1em">
      <ChakraText
        fontSize={props.fontSize || '16px'}
        fontWeight={props.fontWeight || 'normal'}
        color={props.color || 'inherit'}
        lineHeight={props.lineHeight || '1.5'}
        fontFamily={props.fontFamily || 'sans-serif'}
      >
        {props.content || 'Click to edit text...'}
      </ChakraText>
    </Box>
  );
};

export default Text;
