import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  Icon,
  Text,
  Divider,
} from "@chakra-ui/react";
import { Mail, Eye, LogOut, Download, RefreshCw } from "lucide-react";

interface EmailTopBarProps {
  onExit: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const EmailTopBar: React.FC<EmailTopBarProps> = ({
  onExit,
  onPreview,
  onDownload,
  onReset,
  canUndo,
  canRedo,
  undo,
  redo,
}) => {
  return (
    <Box
      h="64px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex h="full" align="center" justify="space-between">
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Box 
              p={1.5} 
              bg="primary.500" 
              rounded="xl" 
              color="white"
              boxShadow="0 4px 10px rgba(155, 2, 197, 0.3)"
            >
              <Icon as={Mail} fontSize="18px" />
            </Box>
            <Text
              fontSize="xl"
              fontWeight="900"
              letterSpacing="tight"
              color="gray.900"
            >
              Email<Text as="span" color="primary.500">Flow</Text>
            </Text>
          </HStack>
          <Divider orientation="vertical" h="24px" mx={2} />
          <HStack spacing={1}>
             <Button 
               size="xs" 
               variant="ghost" 
               onClick={undo} 
               isDisabled={!canUndo}
               rounded="md"
               fontWeight="700"
               color="gray.600"
             >Undo</Button>
             <Button 
               size="xs" 
               variant="ghost" 
               onClick={redo} 
               isDisabled={!canRedo}
               rounded="md"
               fontWeight="700"
               color="gray.600"
             >Redo</Button>
          </HStack>
          <Divider orientation="vertical" h="24px" mx={2} />
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={RefreshCw} fontSize="14px" />}
            onClick={onReset}
            color="red.500"
            fontWeight="700"
            rounded="xl"
            _hover={{ bg: "red.50" }}
          >
            Reset Template
          </Button>
        </HStack>

        <HStack spacing={4}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={LogOut} fontSize="16px" />}
            onClick={onExit}
            color="gray.500"
            fontWeight="700"
            rounded="xl"
            _hover={{ bg: "red.50", color: "red.600" }}
          >
            Exit
          </Button>
          <Button
            size="md"
            variant="outline"
            colorScheme="primary"
            leftIcon={<Icon as={Eye} fontSize="20px" />}
            onClick={onPreview}
            fontWeight="700"
            rounded="xl"
            px={8}
            h="44px"
            borderWidth="2px"
            borderColor="primary.500"
            color="primary.600"
            bg="white"
            _hover={{ 
              bg: "primary.50", 
              transform: "translateY(-2px)", 
              boxShadow: "0 4px 20px -5px rgba(155, 2, 197, 0.2)" 
            }}
            transition="all 0.2s"
          >
            Preview
          </Button>
          <Button
            size="md"
            variant="solid"
            colorScheme="primary"
            leftIcon={<Icon as={Download} fontSize="20px" />}
            onClick={onDownload}
            fontWeight="700"
            rounded="xl"
            px={10}
            h="44px"
            bg="primary.500"
            color="white"
            boxShadow="0 8px 25px -5px rgba(155, 2, 197, 0.4)"
            _hover={{ 
              bg: "primary.600", 
              transform: "translateY(-2px)", 
              boxShadow: "0 12px 30px -5px rgba(155, 2, 197, 0.5)" 
            }}
            _active={{ bg: "primary.700" }}
            transition="all 0.2s"
          >
            Download
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default EmailTopBar;
