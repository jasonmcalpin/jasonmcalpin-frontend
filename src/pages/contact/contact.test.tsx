import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Contact from './index';

vi.mock('../../components/global/SEO', () => ({ default: () => null }));
vi.mock('../../components/contact/TurnstileChallenge', () => ({
  default: ({ onToken, onError }: { onToken: (_token: string | null) => void; onError: () => void }) => (
    <div>
      <button type="button" onClick={() => onToken('valid-test-token-long-enough')}>
        Complete verification
      </button>
      <button type="button" onClick={onError}>Simulate verification failure</button>
    </div>
  )
}));

function configure() {
  vi.stubEnv('VITE_CONTACT_API_URL', 'https://example.execute-api.us-east-1.amazonaws.com/v1/inquiries');
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'public-test-site-key');
}

function fill() {
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Project Owner' } });
  fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'owner@example.org' } });
  fireEvent.change(screen.getByLabelText('What are you trying to accomplish?'), {
    target: { value: 'We need to modernize and integrate several existing business systems.' }
  });
  fireEvent.click(screen.getByRole('button', { name: 'Complete verification' }));
}

describe('contact inquiry', () => {
  beforeEach(() => { vi.unstubAllEnvs(); });
  afterEach(() => { vi.unstubAllEnvs(); });

  it('offers an alternative without exposing the recipient when the API is unconfigured', () => {
    vi.stubEnv('VITE_CONTACT_API_URL', '');
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', '');
    render(<Contact />);
    expect(screen.getByText(/inquiry form is being connected/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send inquiry' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact me on LinkedIn/ })).toHaveAttribute('href',
      expect.stringContaining('linkedin.com'));
  });

  it('submits only the documented inquiry contract and shows accepted confirmation', async () => {
    configure();
    const request = vi.fn().mockResolvedValue({ status: 202 });
    vi.stubGlobal('fetch', request);
    render(<Contact />);
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));
    await waitFor(() => expect(screen.getByText('Inquiry submitted')).toBeInTheDocument());
    const [url, options] = request.mock.calls[0];
    expect(url).toContain('/v1/inquiries');
    expect(options.credentials).toBe('omit');
    expect(JSON.parse(options.body)).toEqual({
      name: 'Project Owner',
      email: 'owner@example.org',
      message: 'We need to modernize and integrate several existing business systems.',
      timeline: '',
      website: '',
      turnstileToken: 'valid-test-token-long-enough'
    });
    expect(screen.getByRole('button', { name: 'Send another inquiry' })).toBeInTheDocument();
  });

  it('retains the visitor message for retry when the endpoint rejects delivery', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      status: 503,
      json: async () => ({ code: 'delivery_unavailable' })
    }));
    render(<Contact />);
    fill();
    fireEvent.click(screen.getByRole('button', { name: 'Send inquiry' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/could not be submitted/i));
    expect(screen.getByLabelText('What are you trying to accomplish?')).toHaveValue(
      'We need to modernize and integrate several existing business systems.');
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeDisabled();
  });

  it('provides a retry after a failed anti-spam challenge', () => {
    configure();
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: 'Simulate verification failure' }));
    expect(screen.getByRole('button', { name: 'Retry verification' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry verification' }));
    expect(screen.queryByRole('button', { name: 'Retry verification' })).not.toBeInTheDocument();
    fill();
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  });
});
