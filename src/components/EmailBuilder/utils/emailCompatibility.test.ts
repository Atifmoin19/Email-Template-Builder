import { describe, expect, it } from 'vitest';
import { validateCompatibility } from './emailCompatibility';
import type { EmailNode } from '../types';

const inSection = (...children: EmailNode[]): EmailNode[] => [{ id: 's', type: 'section', props: {}, children }];

describe('validateCompatibility', () => {
  it('passes a well-formed image and linked button', () => {
    expect(
      validateCompatibility(
        inSection(
          { id: 'image-1', type: 'image', props: { src: 'https://x.test/a.png', alt: 'Logo', width: '100%' } },
          { id: 'button-1', type: 'button', props: { href: 'https://x.test' } },
        ),
      ),
    ).toEqual([]);
  });

  it('flags nested images without src or alt, oversize px widths and unlinked buttons', () => {
    const messages = validateCompatibility(
      inSection(
        { id: 'image-1', type: 'image', props: { width: '800px' } },
        { id: 'button-1', type: 'button', props: { href: '#' } },
      ),
    ).map((w) => `${w.id}: ${w.message.split('.')[0]}`);
    expect(messages).toEqual([
      'image-1: Image has no source URL and will render as a broken image',
      'image-1: Image is missing alt text',
      'image-1: Image width exceeds 600px',
      'button-1: Button has no link URL',
    ]);
  });

  it('does not treat percentage widths as pixels', () => {
    const w = validateCompatibility(inSection({ id: 'i', type: 'image', props: { src: 'x', alt: 'y', width: '150%' } }));
    expect(w).toEqual([]);
  });
});
