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
  it('uses the selected Dazzle Line paths for link, calendar, and alarm clock', () => {
    const link = renderToStaticMarkup(<InlineIcon iconName="link" />);
    const calendar = renderToStaticMarkup(<InlineIcon iconName="calendar-days" />);
    const clock = renderToStaticMarkup(<InlineIcon iconName="clock" />);
    expect(link).toContain('M9.16488 17.6505');
    expect(calendar).toContain('M3 9H21M7 3V5');
    expect(clock).toContain('M3 5.5L5 3.5');
    expect(link).toContain('stroke-width="2"');
    expect(calendar).toContain('stroke-linejoin="round"');
  });

});
