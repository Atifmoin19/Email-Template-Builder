export type EmailNodeType = 
  | 'section' 
  | 'column' 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'divider' 
  | 'spacer' 
  | 'header' 
  | 'footer';

/**
 * Every prop the editor reads or writes. All optional: each node type uses a
 * subset, and the renderer falls back to defaults for anything missing.
 */
export interface EmailNodeProps {
  // Text and button content
  content?: string;
  variant?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right';
  // Image
  src?: string;
  alt?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  // Button
  href?: string;
  borderRadius?: string;
  // Box model
  width?: string;
  height?: string;
  align?: string;
  backgroundColor?: string;
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  thickness?: string;
  // Layout
  layout?: string;
  gridColumns?: number;
  colSpan?: number;
}

export interface EmailNode {
  id: string;
  type: EmailNodeType;
  props: EmailNodeProps;
  children?: EmailNode[];
}

export interface EmailSettings {
  pageBackgroundColor: string;
  contentBackgroundColor: string;
  fontFamily: string;
  globalPadding: string;
  maxWidth: string;
}

export interface EmailProject {
  nodes: EmailNode[];
  settings: EmailSettings;
}

export interface EmailState {
  past: EmailProject[];
  present: EmailProject;
  future: EmailProject[];
}

export interface EmailTemplate {
  name: string;
  description: string;
  project: EmailProject;
}
