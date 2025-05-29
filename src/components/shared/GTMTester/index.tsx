import React, { useState } from 'react';
import { triggerGTMEvent, checkGTMInitialization } from '../../../utils/gtmDebugger';
import './styles.scss';

interface GTMTesterProps {
  isVisible?: boolean;
}

/**
 * A component for testing GTM events in development and production
 * This component should only be visible in development or with a special query parameter
 */
const GTMTester: React.FC<GTMTesterProps> = ({ isVisible = false }) => {
  const [eventName, setEventName] = useState('test_event');
  const [eventParams, setEventParams] = useState('{"param1": "value1", "param2": "value2"}');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const handleTriggerEvent = () => {
    try {
      const params = JSON.parse(eventParams);
      triggerGTMEvent(eventName, params);
    } catch (error) {
      console.error('Invalid JSON for event parameters:', error);
      alert('Invalid JSON for event parameters. Please check the console for details.');
    }
  };

  const handleCheckGTM = () => {
    checkGTMInitialization();
  };

  return (
    <div className="gtm-tester">
      <div className="gtm-tester__header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>GTM Tester {isExpanded ? '▼' : '▶'}</h3>
      </div>

      {isExpanded && (
        <div className="gtm-tester__content">
          <div className="gtm-tester__field">
            <label htmlFor="event-name">Event Name:</label>
            <input
              id="event-name"
              type="text"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
            />
          </div>

          <div className="gtm-tester__field">
            <label htmlFor="event-params">Event Parameters (JSON):</label>
            <textarea
              id="event-params"
              value={eventParams}
              onChange={e => setEventParams(e.target.value)}
              rows={5}
            />
          </div>

          <div className="gtm-tester__actions">
            <button onClick={handleTriggerEvent}>Trigger Event</button>
            <button onClick={handleCheckGTM}>Check GTM Status</button>
          </div>

          <div className="gtm-tester__info">
            <p>
              <strong>GTM ID:</strong> {import.meta.env.VITE_GTM_ID || 'Not set'}
            </p>
            <p>
              <strong>Environment:</strong> {import.meta.env.MODE}
            </p>
            <p>
              <small>Check browser console for detailed GTM information</small>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GTMTester;
