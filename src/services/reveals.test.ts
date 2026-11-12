import { afterEach, describe, expect, it, vi } from 'vitest';
import { initializeReveals } from './reveals';

describe('native reveal coordinator', () => {
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    document.body.replaceChildren();
    document.documentElement.classList.remove('js-enabled');
    vi.restoreAllMocks();
  });

  it('reveals an existing element only after it intersects', () => {
    const el = document.createElement('div');
    el.dataset.reveal = 'viewport';
    document.body.appendChild(el);

    let notify: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(callback => {
      notify = callback as IntersectionObserverCallback;
      return { observe, unobserve, disconnect };
    }));

    cleanup = initializeReveals();

    expect(document.documentElement.classList.contains('js-enabled')).toBe(true);
    expect(observe).toHaveBeenCalledWith(el);
    expect(el.classList.contains('is-visible')).toBe(false);

    const rect = el.getBoundingClientRect();
    const entry: IntersectionObserverEntry = {
      target: el, isIntersecting: true, intersectionRatio: 1,
      boundingClientRect: rect, intersectionRect: rect, rootBounds: rect, time: 0,
    };
    notify?.([entry], {} as IntersectionObserver);
    expect(el.classList.contains('is-visible')).toBe(true);
    expect(unobserve).toHaveBeenCalledWith(el);

    cleanup();
    cleanup = undefined;
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('shows immediate reveals without waiting for the viewport', () => {
    const el = document.createElement('div');
    el.dataset.reveal = 'immediate';
    document.body.appendChild(el);
    cleanup = initializeReveals();
    expect(el.classList.contains('is-visible')).toBe(true);
  });

  it('registers elements added after the route mounts', async () => {
    const observe = vi.fn();
    vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(() =>
      ({ observe, unobserve: vi.fn(), disconnect: vi.fn() })));
    cleanup = initializeReveals();

    const node = document.createElement('section');
    const child = document.createElement('div');
    child.dataset.reveal = 'viewport';
    node.appendChild(child);
    document.body.appendChild(node);

    await vi.waitFor(() => expect(observe).toHaveBeenCalledWith(child));
    vi.unstubAllGlobals();
  });
});
