import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';

/**
 * Build-time-only Markdown/GFM + Prism publisher.
 *
 * Input:  public/data/bytes.json (canonical authored Markdown)
 * Output: public/data/byte-html/<slug>.html (safe, inert HTML fragments)
 *
 * The SPA never imports these parsers, tokenizers or their language grammars.
 * ReactMarkdown's default URL transformer and disabled raw HTML handling
 * provide the safety boundary for inserting compiled HTML into the SPA.
 */
const source = resolve('public/data/bytes.json');
const output = resolve('public/data/byte-html');
const articles = JSON.parse(await readFile(source, 'utf8'));

if (!Array.isArray(articles)) throw new Error('Byte catalog must be an array');

function renderCode({ className, children, ...props }) {
  const match = /(?:^|\\s)language-([\\w+-]+)/.exec(className || '');
  const code = String(children).replace(/\\n$/, '');

  // Inline code and fenced code without a language remain plain <code>.
  // ReactMarkdown owns the surrounding <pre> for fenced blocks; never nest it.
  if (!match) return createElement('code', { className, ...props }, children);

  return createElement(Highlight, {
    theme: themes.nightOwl,
    code,
    language: match[1],
  }, ({ tokens, getLineProps, getTokenProps }) =>
    createElement('code', { className: 'language-' + match[1], ...props },
      tokens.map((line, index) =>
        createElement('span', {
          ...getLineProps({ line, key: index }),
          key: index,
          style: { display: 'block' },
        }, line.map((token, tokenIndex) =>
          createElement('span', {
            ...getTokenProps({ token, key: tokenIndex }),
            key: tokenIndex,
          })
        ))
      )
    )
  );
}

function renderArticle(byte) {
  if (typeof byte.content !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(byte.slug))
    throw new Error('Invalid article slug or content');

  // Article title is already rendered by the page heading.
  const content = byte.content.replace(/^#\\s+([^\\r\\n]+)\\r?\\n/, (whole, heading) =>
    heading.trim().toLowerCase() === byte.title.trim().toLowerCase() ? '' : whole);

  const html = renderToStaticMarkup(createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm],
    components: {
      code: renderCode,
      a: ({ node: _node, ...props }) => createElement('a',
        { ...props, target: '_blank', rel: 'noopener noreferrer' }),
    },
  }, content));

  // Explicitly fail closed if the publishing pipeline ever permits raw HTML
  // or unsafe URL schemes through. Compiled fragments are the only HTML the
  // client inserts with dangerouslySetInnerHTML.
  if (/<\\/?(?:script|iframe|object|embed|style)(?:\\s|>)/i.test(html) ||
      /\\son[a-z]+\\s*=/i.test(html) ||
      /(?:href|src)\\s*=\\s*["']\\s*(?:javascript|data):/i.test(html))
    throw new Error('Unsafe HTML generated for ' + byte.slug);
  return html;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const seen = new Set();
let characters = 0;
let highlighted = 0;
for (const byte of articles) {
  if (seen.has(byte.slug)) throw new Error('Duplicate article slug ' + byte.slug);
  seen.add(byte.slug);
  const html = renderArticle(byte);
  if (!html.includes('<p>')) throw new Error('Empty rendered article ' + byte.slug);
  highlighted += (html.match(/class="language-/g) || []).length;
  characters += html.length;
  await writeFile(join(output, byte.slug + '.html'), html + '\\n');
}
console.log('Precompiled ' + seen.size + ' article fragments (' + characters +
  ' HTML characters, ' + highlighted + ' highlighted code blocks).');
