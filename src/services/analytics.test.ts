import { beforeEach, describe, expect, it, vi } from 'vitest';

const { initialize, consent } = vi.hoisted(() => ({
  initialize: vi.fn(),
  consent: vi.fn(() => false),
}));

vi.mock('react-gtm-module', () => ({ default: { initialize } }));
vi.mock('../components/global/CookieConsent/consentUtils', () => ({
  hasConsentedTo: consent,
}));

describe('consent-gated analytics initialization', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv('VITE_GTM_ID', 'GTM-TEST');
  });

  it('does not load analytics before consent', async () => {
    consent.mockReturnValue(false);
    const { initializeAnalytics } = await import('./analytics');
    expect(initializeAnalytics()).toBe(false);
    expect(initialize).not.toHaveBeenCalled();
  });

  it('does not load analytics without an ID', async () => {
    consent.mockReturnValue(true);
    vi.stubEnv('VITE_GTM_ID', '');
    const { initializeAnalytics } = await import('./analytics');
    expect(initializeAnalytics()).toBe(false);
    expect(initialize).not.toHaveBeenCalled();
  });

  it('loads once after consent and remains idempotent', async () => {
    consent.mockReturnValue(true);
    const { initializeAnalytics } = await import('./analytics');
    expect(initializeAnalytics()).toBe(true);
    expect(initializeAnalytics()).toBe(false);
    expect(initialize).toHaveBeenCalledOnce();
    expect(initialize).toHaveBeenCalledWith({ gtmId: 'GTM-TEST' });
  });
});
