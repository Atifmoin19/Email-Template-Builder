import React from 'react';
import {
  VStack,
  Box,
  Text,
  Heading,
  HStack,
  IconButton,
  Icon,
  Divider,
  Input,
  FormControl,
  FormLabel,
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
} from 'lucide-react';
import type { EmailNode, EmailSettings } from './types';
import { findNodeById, updateNodeInTree } from './utils/astHelpers';

interface EmailInspectorPanelProps {
  nodes: EmailNode[];
  setNodes: (nodes: EmailNode[]) => void;
  settings: EmailSettings;
  onUpdateSettings: (settings: Partial<EmailSettings>) => void;
  selectedNodeId: string | null;
  onDelete: (id: string) => void;
}

const EmailInspectorPanel: React.FC<EmailInspectorPanelProps> = ({
  nodes,
  setNodes,
  settings,
  onUpdateSettings,
  selectedNodeId,
  onDelete,
}) => {
  const bgColor = 'white';
  const borderColor = 'gray.200';

  const selectedNode = selectedNodeId ? findNodeById(nodes, selectedNodeId) : null;

  const updateNodeProps = (props: Record<string, any>) => {
    if (!selectedNodeId) return;
    const newNodes = updateNodeInTree(nodes, selectedNodeId, (node) => ({
      ...node,
      props: { ...node.props, ...props },
    }));
    setNodes(newNodes);
  };

  const renderTextSettings = () => (
    <VStack spacing={4} alignItems="stretch">
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">CONTENT</FormLabel>
        <Input 
          size="sm" 
          value={selectedNode?.props.content || ''} 
          onChange={(e) => updateNodeProps({ content: e.target.value })}
          placeholder="Enter text..."
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
          _placeholder={{ color: 'gray.400' }}
        />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">TEXT PRESET</FormLabel>
        <Select 
          size="sm"
          value={selectedNode?.props.variant || 'paragraph'}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => {
            const variant = e.target.value;
            let updates: any = { variant };
            if (variant === 'heading') {
              updates = { ...updates, fontSize: '32px', fontWeight: '800' };
            } else if (variant === 'subheader') {
              updates = { ...updates, fontSize: '24px', fontWeight: '700' };
            } else {
              updates = { ...updates, fontSize: '16px', fontWeight: 'normal' };
            }
            updateNodeProps(updates);
          }}
        >
          <option value="heading">Heading</option>
          <option value="subheader">Subheader</option>
          <option value="paragraph">Paragraph</option>
        </Select>
      </FormControl>
      <HStack>
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="800" color="gray.500">FONT SIZE</FormLabel>
          <Input 
            size="sm" 
            value={selectedNode?.props.fontSize ?? ''} 
            onChange={(e) => updateNodeProps({ fontSize: e.target.value })}
            placeholder="e.g. 16px"
            rounded="md"
            color="gray.800"
            borderColor="gray.300"
            _placeholder={{ color: 'gray.400' }}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="800" color="gray.500">TEXT COLOR</FormLabel>
          <Input 
            size="sm" 
            type="color"
            value={selectedNode?.props.color || '#000000'} 
            onChange={(e) => updateNodeProps({ color: e.target.value })}
            rounded="md"
          />
        </FormControl>
      </HStack>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">FONT WEIGHT</FormLabel>
        <Select 
          size="sm"
          value={selectedNode?.props.fontWeight ?? 'normal'}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => updateNodeProps({ fontWeight: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semi-Bold</option>
          <option value="700">Bold</option>
          <option value="800">Extra-Bold</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">ALIGNMENT</FormLabel>
        <HStack spacing={2}>
          <IconButton 
            aria-label="Align Left" 
            size="sm" 
            onClick={() => updateNodeProps({ textAlign: 'left' })} 
            colorScheme="primary"
            variant={selectedNode?.props.textAlign === 'left' ? 'solid' : 'outline'} 
            color={selectedNode?.props.textAlign === 'left' ? 'white' : 'primary.500'}
            icon={<Icon as={AlignLeft} fontSize="16px" />} 
          />
          <IconButton 
            aria-label="Align Center" 
            size="sm" 
            onClick={() => updateNodeProps({ textAlign: 'center' })} 
            colorScheme="primary"
            variant={selectedNode?.props.textAlign === 'center' ? 'solid' : 'outline'} 
            color={selectedNode?.props.textAlign === 'center' ? 'white' : 'primary.500'}
            icon={<Icon as={AlignCenter} fontSize="16px" />} 
          />
          <IconButton 
            aria-label="Align Right" 
            size="sm" 
            onClick={() => updateNodeProps({ textAlign: 'right' })} 
            colorScheme="primary"
            variant={selectedNode?.props.textAlign === 'right' ? 'solid' : 'outline'} 
            color={selectedNode?.props.textAlign === 'right' ? 'white' : 'primary.500'}
            icon={<Icon as={AlignRight} fontSize="16px" />} 
          />
        </HStack>
      </FormControl>
    </VStack>
  );

  const renderImageSettings = () => (
    <VStack spacing={4} alignItems="stretch">
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">IMAGE URL</FormLabel>
        <Input 
          size="sm" 
          value={selectedNode?.props.src || ''} 
          onChange={(e) => updateNodeProps({ src: e.target.value })}
          placeholder="https://example.com/image.png"
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
          _placeholder={{ color: 'gray.400' }}
        />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">ALT TEXT</FormLabel>
        <Input 
          size="sm" 
          value={selectedNode?.props.alt || ''} 
          onChange={(e) => updateNodeProps({ alt: e.target.value })}
          placeholder="Image description"
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
          _placeholder={{ color: 'gray.400' }}
        />
      </FormControl>
      <HStack>
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="800" color="gray.500">WIDTH (%)</FormLabel>
          <Input 
            size="sm" 
            value={selectedNode?.props.width ?? ''} 
            onChange={(e) => updateNodeProps({ width: e.target.value })}
            rounded="md"
            color="gray.800"
            borderColor="gray.300"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="800" color="gray.500">HEIGHT (PX)</FormLabel>
          <Input 
            size="sm" 
            value={selectedNode?.props.height ?? ''} 
            onChange={(e) => updateNodeProps({ height: e.target.value })}
            placeholder="Auto"
            rounded="md"
            color="gray.800"
            borderColor="gray.300"
            _placeholder={{ color: 'gray.400' }}
          />
        </FormControl>
      </HStack>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">OBJECT FIT</FormLabel>
        <Select 
          size="sm"
          value={selectedNode?.props.objectFit ?? 'contain'}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => updateNodeProps({ objectFit: e.target.value })}
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
          <option value="scale-down">Scale Down</option>
          <option value="none">None</option>
        </Select>
      </FormControl>
    </VStack>
  );

  const renderButtonSettings = () => (
    <VStack spacing={4} alignItems="stretch">
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">BUTTON TEXT</FormLabel>
        <Input 
          size="sm" 
          value={selectedNode?.props.content ?? ''} 
          onChange={(e) => updateNodeProps({ content: e.target.value })}
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
        />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">LINK URL</FormLabel>
        <Input 
          size="sm" 
          value={selectedNode?.props.href || ''} 
          onChange={(e) => updateNodeProps({ href: e.target.value })}
          placeholder="https://example.com"
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
          _placeholder={{ color: 'gray.400' }}
        />
      </FormControl>
      <HStack>
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="800" color="gray.500">BG COLOR</FormLabel>
          <Input 
            size="sm" 
            type="color"
            value={selectedNode?.props.backgroundColor || '#3182ce'} 
            onChange={(e) => updateNodeProps({ backgroundColor: e.target.value })}
            rounded="md"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs" fontWeight="800" color="gray.500">TEXT COLOR</FormLabel>
          <Input 
            size="sm" 
            type="color"
            value={selectedNode?.props.color || '#ffffff'} 
            onChange={(e) => updateNodeProps({ color: e.target.value })}
            rounded="md"
          />
        </FormControl>
      </HStack>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">ALIGNMENT</FormLabel>
        <Select 
          size="sm"
          value={selectedNode?.props.align ?? 'center'}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => updateNodeProps({ align: e.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </Select>
      </FormControl>
    </VStack>
  );

  const renderColumnSettings = () => (
    <VStack spacing={4} alignItems="stretch">
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">COLUMN SPAN</FormLabel>
        <Input 
          size="sm" 
          type="number"
          min={1} 
          max={4}
          value={selectedNode?.props.colSpan || 1}
          onChange={(e) => updateNodeProps({ colSpan: parseInt(e.target.value) })}
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
        />
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">WIDTH (%)</FormLabel>
        <Input 
          size="sm" 
          value={selectedNode?.props.width || '100%'} 
          onChange={(e) => updateNodeProps({ width: e.target.value })}
          placeholder="e.g. 50%"
          rounded="md"
          color="gray.800"
          borderColor="gray.300"
          _placeholder={{ color: 'gray.400' }}
        />
      </FormControl>
    </VStack>
  );

  const renderSectionSettings = () => (
    <VStack spacing={4} alignItems="stretch">
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">GRID COLUMNS</FormLabel>
        <Select 
          size="sm"
          value={selectedNode?.props.gridColumns || 1}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => updateNodeProps({ gridColumns: parseInt(e.target.value) })}
        >
          <option value={1}>1 Column</option>
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">LAYOUT TYPE</FormLabel>
        <Select 
          size="sm"
          value={selectedNode?.props.layout || 'full-width'}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => updateNodeProps({ layout: e.target.value })}
        >
          <option value="full-width">Full Width</option>
          <option value="boxed">Boxed (600px)</option>
        </Select>
      </FormControl>
    </VStack>
  );

  const renderGlobalSettings = () => (
    <VStack spacing={6} alignItems="stretch">
      <Heading size="xs" textTransform="uppercase" letterSpacing="widest" color="primary.600" fontWeight="900">
        PAGE SETTINGS
      </Heading>
      
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">PAGE BACKGROUND</FormLabel>
        <Input 
          size="sm" 
          type="color"
          value={settings.pageBackgroundColor} 
          onChange={(e) => onUpdateSettings({ pageBackgroundColor: e.target.value })}
          rounded="md"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">CONTENT BACKGROUND</FormLabel>
        <Input 
          size="sm" 
          type="color"
          value={settings.contentBackgroundColor} 
          onChange={(e) => onUpdateSettings({ contentBackgroundColor: e.target.value })}
          rounded="md"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">FONT FAMILY</FormLabel>
        <Select 
          size="sm"
          value={settings.fontFamily}
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
        >
          <option value="Helvetica, Arial, sans-serif">Helvetica/Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Courier New', monospace">Courier New</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">MAX WIDTH (PX)</FormLabel>
        <Input 
          size="sm" 
          value={settings.maxWidth} 
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => onUpdateSettings({ maxWidth: e.target.value })}
          rounded="md"
        />
      </FormControl>
      
      <FormControl>
        <FormLabel fontSize="xs" fontWeight="800" color="gray.500">INNER PADDING</FormLabel>
        <Input 
          size="sm" 
          value={settings.globalPadding} 
          color="gray.800"
          borderColor="gray.300"
          onChange={(e) => onUpdateSettings({ globalPadding: e.target.value })}
          rounded="md"
        />
      </FormControl>
    </VStack>
  );

  const renderCommonSettings = () => (
    <Accordion allowMultiple defaultIndex={[0]}>
      <AccordionItem border="none">
        <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
          <Box flex="1" textAlign="left">
            <Text fontSize="xs" fontWeight="900" letterSpacing="widest" color="primary.600">STYLE & LAYOUT</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} px={0}>
          <VStack spacing={4} alignItems="stretch">
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="800" color="gray.500">BACKGROUND COLOR</FormLabel>
              <Input 
                size="sm" 
                type="color"
                value={selectedNode?.props.backgroundColor || 'transparent'} 
                onChange={(e) => updateNodeProps({ backgroundColor: e.target.value })}
                rounded="md"
              />
            </FormControl>

            <Heading size="xs" mt={2} fontWeight="800" color="gray.400">PADDING</Heading>
            <HStack spacing={2}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="800" color="gray.500">TOP</FormLabel>
                <Input 
                  size="sm" 
                  value={selectedNode?.props.paddingTop ?? ''} 
                  onChange={(e) => updateNodeProps({ paddingTop: e.target.value })}
                  placeholder="0px"
                  rounded="md"
                  color="gray.800"
                  borderColor="gray.300"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="800" color="gray.500">BOTTOM</FormLabel>
                <Input 
                  size="sm" 
                  value={selectedNode?.props.paddingBottom ?? ''} 
                  onChange={(e) => updateNodeProps({ paddingBottom: e.target.value })}
                  placeholder="0px"
                  rounded="md"
                  color="gray.800"
                  borderColor="gray.300"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>
            </HStack>
            <HStack spacing={2}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="800" color="gray.500">LEFT</FormLabel>
                <Input 
                  size="sm" 
                  value={selectedNode?.props.paddingLeft ?? ''} 
                  onChange={(e) => updateNodeProps({ paddingLeft: e.target.value })}
                  placeholder="0px"
                  rounded="md"
                  color="gray.800"
                  borderColor="gray.300"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="800" color="gray.500">RIGHT</FormLabel>
                <Input 
                  size="sm" 
                  value={selectedNode?.props.paddingRight ?? ''} 
                  onChange={(e) => updateNodeProps({ paddingRight: e.target.value })}
                  placeholder="0px"
                  rounded="md"
                  color="gray.800"
                  borderColor="gray.300"
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>
            </HStack>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );

  return (
    <VStack h="full" bg={bgColor} spacing={0} alignItems="stretch" borderLeft="1px" borderColor={borderColor}>
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <Heading size="xs" textTransform="uppercase" letterSpacing="widest" color="gray.400" fontWeight="900">
          INSPECTOR
        </Heading>
      </Box>

      <Box flex={1} overflowY="auto" p={4}>
        {!selectedNode ? (
          renderGlobalSettings()
        ) : (
          <VStack spacing={6} alignItems="stretch">
            <HStack justify="space-between">
              <VStack alignItems="flex-start" spacing={0}>
                <Heading size="xs" textTransform="uppercase" letterSpacing="widest" color="primary.600" fontWeight="900">
                  {selectedNode.type}
                </Heading>
                <Text fontSize="10px" color="gray.400" fontWeight="700">ID: {selectedNode.id}</Text>
              </VStack>
              <IconButton
                aria-label="Delete"
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(selectedNode.id)}
                icon={<Icon as={Trash2} fontSize="14px" />}
              />
            </HStack>

            <Divider borderColor={borderColor} />

            {selectedNode.type === 'text' && renderTextSettings()}
            {selectedNode.type === 'image' && renderImageSettings()}
            {selectedNode.type === 'button' && renderButtonSettings()}
            {selectedNode.type === 'section' && renderSectionSettings()}
            {selectedNode.type === 'column' && renderColumnSettings()}
            {(selectedNode.type === 'header' || selectedNode.type === 'footer') && renderSectionSettings()}
            
            <Divider borderColor={borderColor} />
            {renderCommonSettings()}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default EmailInspectorPanel;
