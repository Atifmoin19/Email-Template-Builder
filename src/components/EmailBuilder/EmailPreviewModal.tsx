import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Icon,
  Text,
  HStack,
  Button,
  VStack,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { Global } from "@emotion/react";
import {
  Monitor,
  Smartphone,
  Tablet,
  X,
  AlertTriangle,
  Mail,
  Copy,
  Download as DownloadIcon,
} from "lucide-react";
import { generateEmailHtml } from "./utils/emailRenderer";
import type { EmailProject } from "./types";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EmailProject;
}

type PreviewMode = "desktop" | "tablet" | "mobile";

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [mode, setMode] = useState<PreviewMode>("desktop");
  const toast = useToast();
  const html = generateEmailHtml(project);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    toast({
      title: "Code Copied",
      description: "Email HTML has been copied to your clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.settings.maxWidth || "email"}-template.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your email template is being downloaded.",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const getDeviceWidth = () => {
    switch (mode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <>
      <Global
        styles={{
          ".preview-modal-content iframe": {
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          },
          ".preview-modal-content iframe::-webkit-scrollbar": {
            display: "none",
          },
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="slideInBottom">
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
        <ModalContent bg="gray.50" m={0} rounded={0}>
          <ModalBody p={0} display="flex" flexDir="column" h="100vh">
            {/* Professional Light Header Sync with Builder */}
            <Flex
              bg="white"
              h="64px"
              px={6}
              align="center"
              justify="space-between"
              color="gray.800"
              borderBottom="1px solid"
              borderColor="gray.200"
              zIndex={10}
            >
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
                   <VStack spacing={0} align="flex-start">
                     <Text fontSize="md" fontWeight="900" letterSpacing="tight" color="gray.900">
                       Preview <Text as="span" color="primary.500">Mode</Text>
                     </Text>
                     <Text fontSize="10px" color="gray.400" fontWeight="700">
                       SIMULATED PRODUCTION VIEW
                     </Text>
                   </VStack>
                </HStack>
              </HStack>

              <HStack 
                bg="gray.100" 
                p={1.5} 
                rounded="2xl" 
                spacing={1}
                border="1px solid"
                borderColor="gray.200"
              >
                {[
                  { id: "desktop", icon: Monitor, label: "Desktop" },
                  { id: "tablet", icon: Tablet, label: "Tablet" },
                  { id: "mobile", icon: Smartphone, label: "Mobile" },
                ].map((m) => (
                  <Button
                    key={m.id}
                    size="sm"
                    variant={mode === m.id ? "solid" : "ghost"}
                    bg={mode === m.id ? "primary.500" : "transparent"}
                    color={mode === m.id ? "white" : "gray.600"}
                    _hover={mode === m.id ? { bg: "primary.600" } : { bg: "gray.200", color: "gray.800" }}
                    rounded="xl"
                    onClick={() => setMode(m.id as PreviewMode)}
                    px={6}
                    h="36px"
                    fontSize="xs"
                    fontWeight="800"
                    leftIcon={<Icon as={m.icon} fontSize="16px" />}
                    transition="all 0.2s"
                  >
                    {m.label}
                  </Button>
                ))}
              </HStack>

              <Button
                rightIcon={<Icon as={X} fontSize="18px" />}
                variant="outline"
                size="md"
                rounded="xl"
                onClick={onClose}
                fontWeight="700"
                px={6}
                h="44px"
                color="gray.600"
                borderColor="gray.300"
                borderWidth="2px"
                _hover={{ bg: "red.50", color: "red.600", borderColor: "red.200", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Exit Preview
              </Button>
            </Flex>

            <Flex flex={1} overflow="hidden">
              {/* Sidebar: Compatibility Status */}
              <Box 
                w="320px" 
                bg="white" 
                borderRight="1px solid" 
                borderColor="gray.200" 
                p={6}
                display={{ base: "none", xl: "block" }}
              >
                 <VStack align="stretch" spacing={6}>
                    <Box>
                      <Text fontSize="xs" fontWeight="900" color="gray.400" letterSpacing="widest" mb={4}>
                        COMPATIBILITY STATUS (AI)
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        <Box p={4} bg="orange.50" rounded="xl" border="1px solid" borderColor="orange.200">
                           <HStack spacing={3} mb={2}>
                             <Icon as={AlertTriangle} color="orange.500" />
                             <Text fontWeight="900" color="orange.800" fontSize="xs">
                               OUTLOOK COMPATIBILITY
                             </Text>
                           </HStack>
                           <Text fontSize="xs" color="orange.700" lineHeight="tall" fontWeight="600">
                             Some images are missing Alt text. Outlook and Gmail may flag this as spam.
                           </Text>
                        </Box>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="900" color="gray.400" letterSpacing="widest" mb={4}>
                        EXPORT OPTIONS
                      </Text>
                      <VStack spacing={2}>
                        <Button 
                          w="full" 
                          variant="outline" 
                          color="primary.600"
                          borderColor="primary.500"
                          borderWidth="2px"
                          size="md" 
                          rounded="xl" 
                          fontWeight="800" 
                          fontSize="sm"
                          leftIcon={<Icon as={Copy} fontSize="16px" />}
                          onClick={handleCopy}
                          _hover={{ bg: "primary.50" }}
                        >
                          COPY CODE
                        </Button>
                        <Button 
                          w="full" 
                          bg="primary.500"
                          color="white"
                          size="md" 
                          rounded="xl" 
                          fontWeight="800" 
                          fontSize="sm"
                          leftIcon={<Icon as={DownloadIcon} fontSize="16px" />}
                          onClick={handleDownload}
                          boxShadow="0 4px 12px rgba(155, 2, 197, 0.2)"
                          _hover={{ bg: "primary.600", transform: "translateY(-1px)", boxShadow: "0 6px 15px rgba(155, 2, 197, 0.3)" }}
                        >
                          DOWNLOAD .HTML
                        </Button>
                      </VStack>
                    </Box>
                 </VStack>
              </Box>

              {/* Main Workspace */}
              <Box flex={1} p={10} bg="gray.100" position="relative" overflow="auto" display="flex" justifyContent="center" alignItems="flex-start">
                  <Box
                    w={getDeviceWidth()}
                    h={mode === "desktop" ? "calc(100vh - 160px)" : "calc(100vh - 180px)"}
                    bg="white"
                    shadow="2xl"
                    rounded={mode === "desktop" ? "lg" : "3xl"}
                    border={mode === "desktop" ? "1px solid" : "12px solid"}
                    borderColor={mode === "desktop" ? "gray.200" : "gray.900"}
                    overflow="hidden"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    className="preview-modal-content"
                    position="relative"
                  >
                    {mode === "desktop" && (
                       <Flex h="40px" bg="gray.100" borderBottom="1px solid" borderColor="gray.200" align="center" px={4}>
                         <HStack spacing={1.5}>
                            <Box w="10px" h="10px" rounded="full" bg="red.400" />
                            <Box w="10px" h="10px" rounded="full" bg="yellow.400" />
                            <Box w="10px" h="10px" rounded="full" bg="green.400" />
                         </HStack>
                         <Box flex={1} mx={4} bg="white" h="24px" rounded="md" border="1px solid" borderColor="gray.300" />
                       </Flex>
                    )}
                    <iframe
                      srcDoc={html}
                      title="Email Preview"
                      style={{
                        width: "100%",
                        height: mode === "desktop" ? "calc(100% - 40px)" : "100%",
                        border: "none",
                        overflow: "hidden"
                      }}
                    />
                  </Box>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmailPreviewModal;
