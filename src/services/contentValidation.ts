import type { Byte } from '../store/slices/bytesSlice';
import type { Project } from '../store/slices/projectsSlice';
import type { CompanyLogos, Experience } from '../types';

type RecordValue = Record<string, unknown>;

function record(value: unknown, path: string): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`${path}: expected object`);
  return value as RecordValue;
}
function string(value: unknown, path: string): string {
  if (typeof value !== 'string') throw new Error(`${path}: expected string`);
  return value;
}
function optionalString(value: unknown, path: string): string | undefined {
  return value === undefined ? undefined : string(value, path);
}
function strings(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${path}: expected string array`);
  return value.map((item, i) => string(item, `${path}[${i}]`));
}
function array<T>(value: unknown, path: string, parse: (value: unknown, path: string) => T): T[] {
  if (!Array.isArray(value)) throw new Error(`${path}: expected array`);
  return value.map((item, i) => parse(item, `${path}[${i}]`));
}
function uniqueSlugs<T extends { slug?: string }>(items: T[], path: string): T[] {
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.slug) continue;
    if (seen.has(item.slug)) throw new Error(`${path}: duplicate slug "${item.slug}"`);
    seen.add(item.slug);
  }
  return items;
}

/** Validate content at the untrusted fetch/TOML boundary, before it enters Redux. */
export function parseBytes(value: unknown): Byte[] {
  return uniqueSlugs(array(value, 'bytes', (value, path): Byte => {
    const a = record(value, path);
    if (typeof a.readingTime !== 'number' || !Number.isFinite(a.readingTime) || a.readingTime < 0)
      throw new Error(`${path}.readingTime: expected non-negative number`);
    const date = string(a.date, `${path}.date`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))
      throw new Error(`${path}.date: invalid date`);
    return {
      id: string(a.id, `${path}.id`), slug: string(a.slug, `${path}.slug`),
      title: string(a.title, `${path}.title`), excerpt: string(a.excerpt, `${path}.excerpt`),
      content: string(a.content, `${path}.content`), imageUrl: string(a.imageUrl, `${path}.imageUrl`),
      author: string(a.author, `${path}.author`), date,
      tags: strings(a.tags, `${path}.tags`), readingTime: a.readingTime,
    };
  }), 'bytes').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
export function parseProjects(value: unknown): Project[] {
  return uniqueSlugs(array(value, 'projects', (value, path): Project => {
    const p = record(value, path);
    if (typeof p.featured !== 'boolean') throw new Error(`${path}.featured: expected boolean`);
    return {
      id: string(p.id, `${path}.id`), slug: optionalString(p.slug, `${path}.slug`),
      title: string(p.title, `${path}.title`), description: string(p.description, `${path}.description`),
      imageUrl: optionalString(p.imageUrl, `${path}.imageUrl`) ?? '',
      technologies: strings(p.technologies, `${path}.technologies`),
      githubUrl: optionalString(p.githubUrl, `${path}.githubUrl`),
      liveUrl: optionalString(p.liveUrl, `${path}.liveUrl`), featured: p.featured,
    };
  }), 'projects');
}
export function parseExperiences(value: unknown): Experience[] {
  return array(value, 'experience', (value, path): Experience => {
    const e = record(value, path);
    return {
      company: string(e.company, `${path}.company`), title: string(e.title, `${path}.title`),
      location: string(e.location, `${path}.location`),
      startDate: string(e.startDate, `${path}.startDate`),
      endDate: e.endDate === null ? null : string(e.endDate, `${path}.endDate`),
      description: string(e.description, `${path}.description`),
      technologies: strings(e.technologies, `${path}.technologies`),
    };
  });
}
export function parseLogos(value: unknown): CompanyLogos[] {
  return array(value, 'logos', (value, path): CompanyLogos => {
    const logo = record(value, path);
    return {
      companyName: string(logo.companyName, `${path}.companyName`),
      logoSrc: string(logo.logoSrc, `${path}.logoSrc`),
      altText: string(logo.altText, `${path}.altText`),
    };
  });
}
