import { useEffect, useRef } from 'react';

interface TurnstileApi {
  render: (container: HTMLElement, options: {
    sitekey: string;
    action: string;
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
  }) => string;
  remove: (widgetId: string) => void;
}
declare global {
  interface Window { turnstile?: TurnstileApi; }
}

interface Props {
  siteKey: string;
  onToken: (token: string | null) => void;
  onError: () => void;
  resetKey: number;
}

const SCRIPT_ID = 'cloudflare-turnstile-script';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Explicit widget lifecycle, scoped to the Contact page. */
export default function TurnstileChallenge({ siteKey, onToken, onError, resetKey }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  onTokenRef.current = onToken;
  onErrorRef.current = onError;

  useEffect(() => {
    let disposed = false;
    let widget: string | undefined;
    const render = () => {
      if (disposed || !container.current || !window.turnstile) return;
      widget = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action: 'contact_inquiry',
        callback: token => onTokenRef.current(token),
        'expired-callback': () => onTokenRef.current(null),
        'error-callback': () => { onTokenRef.current(null); onErrorRef.current(); }
      });
    };
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
    if (window.turnstile) render();
    else script.addEventListener('load', render);
    const onScriptError = () => { if (!disposed) onErrorRef.current(); };
    script.addEventListener('error', onScriptError);
    return () => {
      disposed = true;
      script?.removeEventListener('load', render);
      script?.removeEventListener('error', onScriptError);
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [siteKey, resetKey]);

  return <div className="consulting-turnstile" ref={container} aria-label="Spam prevention verification" />;
}
