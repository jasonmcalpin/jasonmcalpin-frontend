import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { InlineIcon } from './index';

describe('SVG icons', () => {
  it.each([
    'angle-right', 'calendar-days', 'clock', 'link', 'envelope',
    'location-dot', 'building', 'gauge-high', 'github',
  ])('renders %s without an icon font', (iconName) => {
    const html = renderToStaticMarkup(<InlineIcon iconName={iconName} />);
    expect(html).toContain('<svg');
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('fa-solid');
    expect(html).not.toContain('fa-brands');
    expect(html).not.toContain('<i');
  });

  it('inherits color from surrounding typography', () => {
    const html = renderToStaticMarkup(<InlineIcon iconName="github" weight="brands" className="text-neon-blue" />);
    expect(html).toContain('text-neon-blue');
    expect(html).toContain('currentColor');
  });
});
