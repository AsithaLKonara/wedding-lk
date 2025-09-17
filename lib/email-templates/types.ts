export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlTemplate: string;
  textTemplate?: string;
  variables: string[];
  category: 'booking' | 'notification' | 'marketing' | 'system';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplateData {
  templateId: string;
  variables: Record<string, any>;
  recipientEmail: string;
  recipientName?: string;
}

export interface EmailTemplatePreview {
  templateId: string;
  subject: string;
  html: string;
  text?: string;
  variables: Record<string, any>;
}

export interface EmailTemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
}
