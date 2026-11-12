/**
 * One browser-native reveal coordinator for CSS-only decorative animations.
 *
 * Contract: markup is always accessible without JavaScript; the 'js-enabled'
 * bootstrap class opts into transitions. Nodes reveal only once. MutationObserver
 * registers route-level and lazy-loaded content without per-component hooks.
 */
export function initializeReveals(): () => void {
  if (typeof document === 'undefined') return () => {};
  document.documentElement.classList.add('js-enabled');
  const targets = new WeakSet<Element>();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const show = (element: Element) => element.classList.add('is-visible');
  const observer = !reducedMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target);
        observer?.unobserve(entry.target);
      }
    }, { rootMargin: '120px 0px', threshold: 0.01 })
    : null;

  const register = (root: ParentNode) => {
    const elements: Element[] = [];
    if (root instanceof Element && root.matches('[data-reveal]')) elements.push(root);
    elements.push(...root.querySelectorAll('[data-reveal]'));
    for (const element of elements) {
      if (targets.has(element)) continue;
      targets.add(element);
      if (!observer || element.getAttribute('data-reveal') === 'immediate') show(element);
      else observer.observe(element);
    }
  };

  register(document);
  const changes = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) register(node);
      }
    }
  });
  changes.observe(document.documentElement, { subtree: true, childList: true });
  return () => { changes.disconnect(); observer?.disconnect(); };
}
