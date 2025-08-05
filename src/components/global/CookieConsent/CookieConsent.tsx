import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CONSENT_STORAGE_KEY,
  POLICY_VERSION
} from './consentUtils';

import type {
  ConsentOptions,
  ConsentStatus
} from './consentUtils';
import './styles.css';


interface CookieConsentProps {
  policyVersion: string;
  onAccept: (_options: ConsentOptions) => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({
  policyVersion = POLICY_VERSION,
  onAccept,
  onDecline
}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConsentOptions>({
    essential: true,
    preferences: true,
    analytics: true
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!storedConsent) {
      setVisible(true);
      return;
    }

    try {
      const consentData: ConsentStatus = JSON.parse(storedConsent);

      if (consentData.policyVersion !== policyVersion) {
        setVisible(true);
        return;
      }

      if (consentData.consented) {
        onAccept(consentData.options);
      } else {
        onDecline();
      }
    } catch (error) {
      console.error('Error parsing consent data:', error);
      setVisible(true);
    }
  }, [policyVersion, onAccept, onDecline]);

  const handleAccept = () => {
    const consentStatus: ConsentStatus = {
      consented: true,
      timestamp: Date.now(),
      options,
      policyVersion
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentStatus));
    onAccept(options);
    setVisible(false);
  };

  const handleDecline = () => {
    const consentStatus: ConsentStatus = {
      consented: false,
      timestamp: Date.now(),
      options: { essential: true, preferences: false, analytics: false },
      policyVersion
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentStatus));
    onDecline();
    setVisible(false);
  };

  const handleOptionChange = (option: keyof ConsentOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-labelledby="cookie-consent-title">
      <div className="cookie-consent__container">
        <div className="cookie-consent__content">
          <h2 id="cookie-consent-title" className="cookie-consent__title">Privacy Settings</h2>
          <p className="cookie-consent__message">
            This website uses localStorage to enhance your experience in the games and AI features to remember conversations.
            All data is stored locally on your device and is not transmitted to our servers.
          </p>

          <div className="cookie-consent__options">
            <div className="cookie-consent__option">
              <input
                type="checkbox"
                id="consent-essential"
                checked={options.essential}
                disabled={true}
                onChange={() => {}}
              />
              <label htmlFor="consent-essential">
                <strong>Essential</strong> - Required for the website to function
              </label>
            </div>

            <div className="cookie-consent__option">
              <input
                type="checkbox"
                id="consent-preferences"
                checked={options.preferences}
                onChange={() => handleOptionChange('preferences')}
              />
              <label htmlFor="consent-preferences">
                <strong>Preferences</strong> - Remembers your settings and preferences
              </label>
            </div>

            <div className="cookie-consent__option">
              <input
                type="checkbox"
                id="consent-analytics"
                checked={options.analytics}
                onChange={() => handleOptionChange('analytics')}
              />
              <label htmlFor="consent-analytics">
                <strong>Analytics</strong> - Helps us understand how you use the website
              </label>
            </div>
          </div>

          <div className="cookie-consent__footer">
            <Link to="/privacy-policy" className="cookie-consent__link">
              Privacy Policy
            </Link>

            <div className="cookie-consent__buttons">
              <button
                className="cookie-consent__button cookie-consent__button--decline"
                onClick={handleDecline}
              >
                Decline
              </button>
              <button
                className="cookie-consent__button cookie-consent__button--accept"
                onClick={handleAccept}
              >
                Accept Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;