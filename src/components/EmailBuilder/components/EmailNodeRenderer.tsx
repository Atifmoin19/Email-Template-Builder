import React from 'react';
import type { EmailNode } from '../types';
import EmailNodeWrapper from './EmailNodeWrapper';
import Section from './Section';
import Column from './Column';
import Text from './Text';
import Image from './Image';
import Button from './Button';
import Divider from './Divider';
import Spacer from './Spacer';
import Header from './Header';
import Footer from './Footer';

interface EmailNodeRendererProps {
  node: EmailNode;
  selectedNodeId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}

const componentMap: Record<string, any> = {
  section: Section,
  column: Column,
  text: Text,
  image: Image,
  button: Button,
  divider: Divider,
  spacer: Spacer,
  header: Header,
  footer: Footer,
};

const EmailNodeRenderer: React.FC<EmailNodeRendererProps> = ({
  node,
  selectedNodeId,
  onSelect,
  onDelete,
}) => {
  const Component = componentMap[node.type];
  if (!Component) return null;

  return (
    <EmailNodeWrapper
      id={node.id}
      type={node.type}
      isSelected={selectedNodeId === node.id}
      onSelect={onSelect}
      onDelete={onDelete}
    >
      <Component node={node}>
        {node.children?.map((child) => (
          <EmailNodeRenderer
            key={child.id}
            node={child}
            selectedNodeId={selectedNodeId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </Component>
    </EmailNodeWrapper>
  );
};

export default EmailNodeRenderer;
