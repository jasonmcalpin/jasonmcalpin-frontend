import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { parseBytes, parseProjects, parseExperiences, parseLogos } from './contentValidation';
import bytesReducer, { filterBytes, fetchBytes, selectFilteredBytes } from '../store/slices/bytesSlice';
import projectsReducer, { filterProjects, fetchProjects, selectFilteredProjects } from '../store/slices/projectsSlice';
import experienceReducer from '../store/slices/experienceSlice';
import logoReducer from '../store/slices/logoSlice';
import uiReducer from '../store/slices/uiSlice';

const byte = { id: '1', slug: 'example', title: 'Example', excerpt: 'Summary', content: 'Body',
  imageUrl: '/a.png', author: 'Author', date: '2026-01-01', tags: ['React'], readingTime: 3 };
const project = { id: '1', slug: 'example', title: 'Example', description: 'Work',
  technologies: ['React'], featured: true };

describe('content contracts', () => {
  it('validates and normalizes articles and optional project images', () => {
    expect(parseBytes([byte])[0]).toMatchObject(byte);
    expect(parseProjects([project])[0].imageUrl).toBe('');
  });
  it('rejects malformed records and duplicate article routes', () => {
    expect(() => parseBytes([{ ...byte, tags: 'React' }])).toThrow('bytes[0].tags');
    expect(() => parseBytes([byte, byte])).toThrow('duplicate slug');
    expect(() => parseProjects([{ ...project, featured: 'yes' }])).toThrow('projects[0].featured');
    expect(() => parseProjects([project, project])).toThrow('duplicate slug');
  });
  it('validates experience and logo catalogs', () => {
    expect(parseExperiences([{ company: 'Example', title: 'Engineer', location: 'Remote',
      startDate: '2024-01', endDate: null, description: 'Work', technologies: [] }])).toHaveLength(1);
    expect(() => parseLogos([{ companyName: 'Example' }])).toThrow('logos[0].logoSrc');
  });
});

describe('derived catalog filtering', () => {
  const store = configureStore({ reducer: { bytes: bytesReducer, projects: projectsReducer, experience: experienceReducer, logos: logoReducer, ui: uiReducer } });
  it('retains filters when records are reloaded', () => {
    store.dispatch(filterBytes('React'));
    store.dispatch(fetchBytes.fulfilled([byte, { ...byte, id: '2', slug: 'second', tags: ['Other'] }], 'req', undefined));
    expect(selectFilteredBytes(store.getState())).toHaveLength(1);
    store.dispatch(fetchBytes.fulfilled([{ ...byte, id: '3', slug: 'third', tags: ['React'] }], 'req2', undefined));
    expect(selectFilteredBytes(store.getState())[0].id).toBe('3');
    store.dispatch(filterProjects('featured'));
    store.dispatch(fetchProjects.fulfilled([{ ...project, imageUrl: '' }, { ...project, id: '2', slug: 'two', featured: false, imageUrl: '' }], 'req3', undefined));
    expect(selectFilteredProjects(store.getState())).toHaveLength(1);
  });
});
