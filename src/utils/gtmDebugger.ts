/**
 * Utility functions for debugging Google Tag Manager integration
 */

/**
 * Checks if Google Tag Manager is properly initialized
 * @returns {boolean} True if GTM is initialized, false otherwise
 */
export const checkGTMInitialization = (): boolean => {
  const hasDataLayer = typeof window.dataLayer !== 'undefined';

  const hasGTMScript = Array.from(document.getElementsByTagName('script')).some(
    script => script.src && script.src.includes('googletagmanager.com/gtm.js')
  );

  const hasGTMIframe = Array.from(document.getElementsByTagName('iframe')).some(
    iframe => iframe.src && iframe.src.includes('googletagmanager.com/ns.html')
  );

  console.log('GTM Debug Info:', {
    hasDataLayer,
    hasGTMScript,
    hasGTMIframe,
    dataLayerEvents: window.dataLayer ? [...window.dataLayer] : [],
    gtmId: import.meta.env.VITE_GTM_ID || 'Not set',
  });

  return hasDataLayer && hasGTMScript;
};

/**
 * Manually trigger a GTM event for testing
 * @param {string} eventName - The name of the event to trigger
 * @param {object} eventParameters - Additional parameters for the event
 */
export const triggerGTMEvent = (
  eventName: string,
  eventParameters: Record<string, unknown> = {}
): void => {
  if (typeof window.dataLayer === 'undefined') {
    console.error('GTM Debug: dataLayer is not defined, cannot trigger event');
    return;
  }

  window.dataLayer.push({
    event: eventName,
    ...eventParameters,
  });

  console.log(`GTM Debug: Triggered event "${eventName}" with parameters:`, eventParameters);
};

export interface DataLayerEvent {
  event?: string;
  [key: string]: unknown;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}
