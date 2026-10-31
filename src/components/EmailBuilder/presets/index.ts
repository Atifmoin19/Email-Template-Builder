import type { EmailNode, EmailNodeProps, EmailProject, EmailSettings } from '../types';
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

// Small builders for the presets below. Ids are placeholders: presets are
// cloned with fresh ids by instantiatePreset() every time one is applied.
const t = (content: string, props: EmailNodeProps = {}): EmailNode => ({
  id: `text-${nanoid(6)}`,
  type: 'text',
  props: { content, fontSize: '16px', color: '#333333', ...props },
});
const gap = (height: string): EmailNode => ({ id: `spacer-${nanoid(6)}`, type: 'spacer', props: { height } });
const rule = (color = '#e2e8f0'): EmailNode => ({ id: `divider-${nanoid(6)}`, type: 'divider', props: { color, thickness: '1px' } });
const cta = (content: string, href: string, backgroundColor = '#2b6cb0'): EmailNode => ({
  id: `button-${nanoid(6)}`,
  type: 'button',
  props: { content, href, backgroundColor, color: '#ffffff', align: 'center', borderRadius: '6px' },
});
const section = (children: EmailNode[], props: EmailNodeProps = {}): EmailNode => ({
  id: `section-${nanoid(6)}`,
  type: 'section',
  props: { backgroundColor: '#ffffff', padding: '40px', ...props },
  children,
});
const column = (children: EmailNode[], width: string): EmailNode => ({
  id: `column-${nanoid(6)}`,
  type: 'column',
  props: { width },
  children,
});
const lineItem = (label: string, amount: string, bold = false): EmailNode => ({
  id: `section-${nanoid(6)}`,
  type: 'section',
  props: { padding: '6px 0' },
  children: [
    column([t(label, { fontSize: '15px', fontWeight: bold ? 'bold' : undefined })], '70%'),
    column([t(amount, { fontSize: '15px', textAlign: 'right', fontWeight: bold ? 'bold' : undefined })], '30%'),
  ],
});
const brandFooter = (): EmailNode =>
  section(
    [
      t('Fieldnote, 120 Harbor Street, Portland, OR 97204', { fontSize: '12px', color: '#718096', textAlign: 'center' }),
      t('You are receiving this email because you have a Fieldnote account.', { fontSize: '12px', color: '#718096', textAlign: 'center' }),
    ],
    { backgroundColor: '#f4f4f4', padding: '24px' },
  );

export const welcomeTemplate: EmailProject = {
  settings: defaultSettings,
  nodes: [
    section([
      t('Fieldnote', { fontSize: '20px', fontWeight: 'bold', color: '#2b6cb0', textAlign: 'center' }),
      gap('24px'),
      t('Welcome to Fieldnote, Sam', { fontSize: '26px', fontWeight: 'bold', textAlign: 'center', color: '#1a202c' }),
      gap('12px'),
      t('Your account is ready. Fieldnote keeps your team notes, decisions and follow-ups in one searchable place.', { textAlign: 'center', color: '#4a5568', lineHeight: '1.6' }),
      gap('24px'),
      cta('Open your workspace', 'https://example.com/workspace'),
      gap('32px'),
      rule(),
      gap('16px'),
      t('Three things to try first', { fontSize: '18px', fontWeight: 'bold', color: '#1a202c' }),
      t('1. Create a notebook for your current project.', { color: '#4a5568' }),
      t('2. Invite a teammate so you can share notes.', { color: '#4a5568' }),
      t('3. Turn any line into a task with a due date.', { color: '#4a5568' }),
      gap('16px'),
      t('Questions? Reply to this email and a real person on our support team will answer.', { fontSize: '14px', color: '#4a5568' }),
    ]),
    brandFooter(),
  ],
};

export const orderReceiptTemplate: EmailProject = {
  settings: defaultSettings,
  nodes: [
    section([
      t('Fieldnote', { fontSize: '20px', fontWeight: 'bold', color: '#2b6cb0' }),
      gap('20px'),
      t('Thanks for your order', { fontSize: '24px', fontWeight: 'bold', color: '#1a202c' }),
      t('Order #FN-20481 · placed 14 March 2026', { fontSize: '14px', color: '#4a5568' }),
      gap('20px'),
      rule(),
      lineItem('Team plan, annual (5 seats)', '$480.00'),
      lineItem('Extra storage, 50 GB', '$36.00'),
      rule(),
      lineItem('Subtotal', '$516.00'),
      lineItem('Tax', '$41.28'),
      lineItem('Total charged', '$557.28', true),
      rule(),
      gap('16px'),
      t('Charged to Visa ending 4242. A PDF invoice is available in your billing settings.', { fontSize: '14px', color: '#4a5568' }),
      gap('20px'),
      cta('View invoice', 'https://example.com/billing/invoices/FN-20481'),
    ]),
    brandFooter(),
  ],
};

export const passwordResetTemplate: EmailProject = {
  settings: defaultSettings,
  nodes: [
    section([
      t('Fieldnote', { fontSize: '20px', fontWeight: 'bold', color: '#2b6cb0', textAlign: 'center' }),
      gap('24px'),
      t('Reset your password', { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#1a202c' }),
      gap('12px'),
      t('We received a request to reset the password for sam@example.com. This link expires in 30 minutes.', { textAlign: 'center', color: '#4a5568', lineHeight: '1.6' }),
      gap('24px'),
      cta('Choose a new password', 'https://example.com/reset?token=example'),
      gap('24px'),
      t('If you did not ask to reset your password, you can ignore this email. Your password will not change.', { fontSize: '13px', textAlign: 'center', color: '#718096' }),
    ]),
    brandFooter(),
  ],
};

export interface TemplatePreset {
  name: string;
  description: string;
  project: EmailProject;
}

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
  Welcome: {
    name: 'Welcome',
    description: 'Onboarding email with a call to action and first steps',
    project: welcomeTemplate,
  },
  OrderReceipt: {
    name: 'Order receipt',
    description: 'Itemised receipt with totals and an invoice link',
    project: orderReceiptTemplate,
  },
  PasswordReset: {
    name: 'Password reset',
    description: 'Reset link with expiry and a safety note',
    project: passwordResetTemplate,
  },
} satisfies Record<string, TemplatePreset>;

export type TemplateId = keyof typeof templates;

export const emptyProject = (): EmailProject => ({ settings: { ...defaultSettings }, nodes: [] });

const cloneWithFreshIds = (node: EmailNode): EmailNode => ({
  ...node,
  id: `${node.type}-${nanoid(6)}`,
  props: { ...node.props },
  children: node.children?.map(cloneWithFreshIds),
});

/** Deep copy of a preset with new node ids, so applying it twice never shares ids. */
export const instantiatePreset = (project: EmailProject): EmailProject => ({
  settings: { ...project.settings },
  nodes: project.nodes.map(cloneWithFreshIds),
});
