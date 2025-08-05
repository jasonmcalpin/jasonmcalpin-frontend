export interface ConsentOptions {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
}

export interface ConsentStatus {
  consented: boolean;
  timestamp: number;
  options: ConsentOptions;
  policyVersion: string;
}

export const CONSENT_STORAGE_KEY = 'user_consent_status';

// Update this when privacy policy changes
export const POLICY_VERSION = '1.0.0'; 

export const getUserConsent = (): ConsentStatus | null => {
  const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!storedConsent) return null;

  try {
    return JSON.parse(storedConsent) as ConsentStatus;
  } catch (error) {
    console.error('Error parsing consent data:', error);
    return null;
  }
};

export const hasUserConsented = (): boolean => {
  const consent = getUserConsent();
  return consent?.consented || false;
};

export const hasConsentedTo = (option: keyof ConsentOptions): boolean => {
  const consent = getUserConsent();
  if (!consent || !consent.consented) return false;
  return !!consent.options[option];
};

export const revokeConsent = (): void => {
  const consentStatus: ConsentStatus = {
    consented: false,
    timestamp: Date.now(),
    options: { essential: true, preferences: false, analytics: false },
    policyVersion: POLICY_VERSION
  };

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentStatus));
};