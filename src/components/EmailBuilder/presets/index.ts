import type { EmailProject, EmailSettings } from '../types';
import { nanoid } from 'nanoid';

export const defaultSettings: EmailSettings = {
  pageBackgroundColor: '#f4f4f4',
  contentBackgroundColor: '#ffffff',
  fontFamily: 'Helvetica, Arial, sans-serif',
  globalPadding: '20px',
  maxWidth: '600px',
};

export const otpTemplate: EmailProject = {
  settings: defaultSettings,
  nodes: [
    {
      id: `section-${nanoid(6)}`,
      type: 'section',
      props: { backgroundColor: '#ffffff', padding: '40px' },
      children: [
        {
          id: `image-${nanoid(6)}`,
          type: 'image',
          props: { src: 'https://picsum.photos/200/300', width: '150%', align: 'center', height: '200px', objectFit: 'cover' }
        },
        {
          id: `spacer-${nanoid(6)}`,
          type: 'spacer',
          props: { height: '30px' }
        },
        {
          id: `text-${nanoid(6)}`,
          type: 'text',
          props: {
            content: 'Verification Code',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#000000'
          }
        },
        {
          id: `text-${nanoid(6)}`,
          type: 'text',
          props: {
            content: 'Your verification code is:',
            fontSize: '16px',
            textAlign: 'center',
            color: '#666666'
          }
        },
        {
          id: `spacer-${nanoid(6)}`,
          type: 'spacer',
          props: { height: '20px' }
        },
        {
          id: `text-${nanoid(6)}`,
          type: 'text',
          props: {
            content: '123456',
            fontSize: '36px',
            fontWeight: '900',
            textAlign: 'center',
            color: '#3182ce',
            letterSpacing: '5px'
          }
        },
        {
          id: `spacer-${nanoid(6)}`,
          type: 'spacer',
          props: { height: '30px' }
        },
        {
          id: `text-${nanoid(6)}`,
          type: 'text',
          props: {
            content: 'If you did not request this, please ignore this email.',
            fontSize: '12px',
            textAlign: 'center',
            color: '#999999'
          }
        }
      ]
    }
  ]
};

export const newsletterTemplate: EmailProject = {
  settings: {
    ...defaultSettings,
    pageBackgroundColor: '#f8f9fa',
  },
  nodes: [
    {
      id: `section-${nanoid(6)}`,
      type: 'section',
      props: { backgroundColor: '#f8f9fa', padding: '20px' },
      children: [
        {
          id: `image-${nanoid(6)}`,
          type: 'image',
          props: { src: 'https://placeholder.com/banner.png', width: '600', align: 'center' }
        },
        {
          id: `section-${nanoid(6)}`,
          type: 'section',
          props: { backgroundColor: '#ffffff', padding: '30px' },
          children: [
            {
              id: `text-${nanoid(6)}`,
              type: 'text',
              props: { content: 'Weekly Digest', fontSize: '28px', fontWeight: 'bold' }
            },
            {
              id: `divider-${nanoid(6)}`,
              type: 'divider',
              props: { color: '#3182ce', thickness: '3px' }
            },
            {
              id: `section-${nanoid(6)}`,
              type: 'section',
              props: { padding: '20px 0' },
              children: [
                {
                  id: `column-${nanoid(6)}`,
                  type: 'column',
                  props: { width: '50%' },
                  children: [
                    { id: `image-${nanoid(6)}`, type: 'image', props: { src: 'https://placeholder.com/300x200', width: '100%' } },
                    { id: `text-${nanoid(6)}`, type: 'text', props: { content: 'Article 1', fontWeight: 'bold' } },
                    { id: `button-${nanoid(6)}`, type: 'button', props: { content: 'Read More', fontSize: '12px', paddingX: '15px' } }
                  ]
                },
                {
                  id: `column-${nanoid(6)}`,
                  type: 'column',
                  props: { width: '50%' },
                  children: [
                    { id: `image-${nanoid(6)}`, type: 'image', props: { src: 'https://placeholder.com/300x200', width: '100%' } },
                    { id: `text-${nanoid(6)}`, type: 'text', props: { content: 'Article 2', fontWeight: 'bold' } },
                    { id: `button-${nanoid(6)}`, type: 'button', props: { content: 'Read More', fontSize: '12px', paddingX: '15px' } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const templates = {
  OTP: {
    name: 'OTP Template',
    description: 'Clean verification code template',
    project: otpTemplate,
  },
  Newsletter: {
    name: 'Newsletter Template',
    description: 'Professional weekly newsletter',
    project: newsletterTemplate,
  },
};
