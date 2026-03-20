import React from 'react';
import { Button as ChakraButton, Box } from '@chakra-ui/react';
import type { EmailNode } from '../types';

interface ButtonProps {
  node: EmailNode;
}

const Button: React.FC<ButtonProps> = ({ node }) => {
  const { props } = node;
  
  return (
    <Box w="full" display="flex" justifyContent={props.align || 'center'}>
      <ChakraButton
        bg={props.backgroundColor || 'primary.500'}
        color={props.color || 'white'}
        fontSize={props.fontSize || '16px'}
        fontWeight="800"
        px={props.paddingX || 8}
        py={props.paddingY || 6}
        rounded={props.borderRadius || 'md'}
        _hover={{ opacity: 0.9 }}
      >
        {props.content || 'Click Me'}
      </ChakraButton>
    </Box>
  );
};

export default Button;
