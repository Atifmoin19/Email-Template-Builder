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

export interface EmailNode {
  id: string;
  type: EmailNodeType;
  props: Record<string, any>;
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
