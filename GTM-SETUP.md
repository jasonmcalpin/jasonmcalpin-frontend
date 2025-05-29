# Google Tag Manager (GTM) Setup

This document explains how Google Tag Manager is implemented in this project and how to test it.

## Implementation Overview

GTM is implemented with privacy and environment considerations in mind:

1. **Privacy-First Approach**: GTM only initializes if the user has explicitly consented to analytics.
2. **Environment-Specific**: GTM only loads in production environments, not in development or staging.
3. **Secure Configuration**: The GTM ID is stored as a GitHub secret and injected during the build process.

## How It Works

### 1. Initialization in main.tsx

GTM is initialized in `main.tsx` using environment variables:

```typescript
// Initialize GTM if user has consented to analytics and GTM ID is available
if (hasConsentedTo('analytics')) {
  const tagManagerArgs = {
    gtmId: import.meta.env.VITE_GTM_ID || '',
  };

  // Only initialize if GTM ID is available
  if (tagManagerArgs.gtmId) {
    console.log('Initializing GTM with ID:', tagManagerArgs.gtmId);
    TagManager.initialize(tagManagerArgs);
  }
}
```

### 2. Environment Variable Injection

The GTM ID is injected as an environment variable during the build process in the CI/CD pipeline:

```yaml
- name: Build project
  env:
    # Only set GTM_ID for production builds (when triggered by a version tag)
    VITE_GTM_ID: ${{ startsWith(github.ref, 'refs/tags/v') && secrets.GTM_ID || '' }}
  run: npm run build
```

This ensures that:

- Production builds (triggered by version tags) get the real GTM ID
- Development and staging builds get an empty GTM ID

### 3. User Consent Management

The `CookieConsent` component manages user consent for analytics. GTM only initializes if the user has consented to analytics:

```typescript
// In CookieConsent component
export const hasConsentedTo = (option: keyof ConsentOptions): boolean => {
  const consent = getUserConsent();
  if (!consent || !consent.consented) return false;
  return consent.options[option] || false;
};
```

## Testing GTM

### GTM Tester Component

A `GTMTester` component is included to help test GTM functionality. It's visible:

- In development mode
- When the URL includes `?debug` or `?gtm_debug` parameters

The tester allows you to:

- Check if GTM is properly initialized
- Trigger test events with custom parameters
- View GTM status information

### Testing in Production

To test GTM in production:

1. **Deploy with a version tag**:

   ```bash
   git tag v1.0.3
   git push origin v1.0.3
   ```

2. **Verify GTM is loaded**:

   - Visit the production site with `?gtm_debug=x` parameter
   - Open browser DevTools → Console
   - You should see GTM debug messages
   - Use the GTM Tester by adding `?debug=1` to the URL

3. **Check with Tag Assistant**:
   - Install the [Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
   - Visit your production site
   - Click on the Tag Assistant icon
   - It should show your GTM container as properly implemented

### Debugging Utilities

The project includes debugging utilities in `src/utils/gtmDebugger.ts`:

```typescript
// Check if GTM is initialized
checkGTMInitialization();

// Trigger a test event
triggerGTMEvent('test_event', { param1: 'value1' });
```

## Troubleshooting

If GTM is not working in production:

1. **Check GitHub Secrets**:

   - Ensure the `GTM_ID` secret is properly set in your GitHub repository settings

2. **Verify Build Process**:

   - Check GitHub Actions logs to ensure the build completed successfully
   - Verify that the environment variable was properly set during build

3. **Check User Consent**:

   - Clear localStorage and accept analytics cookies again
   - Use the browser console to check `localStorage.getItem('user_consent_status')`

4. **Inspect Network Requests**:

   - Check for requests to `googletagmanager.com` in the Network tab
   - Look for any errors related to GTM in the Console

5. **Use the GTM Tester**:
   - Add `?debug=1` to the URL to show the GTM Tester
   - Use it to check GTM status and trigger test events

## Reverting to Previous Implementation

If needed, you can revert to the previous implementation that used string replacement:

1. Update `main.tsx` to use the placeholder:

   ```typescript
   const tagManagerArgs = {
     gtmId: '__GTM_ID_PLACEHOLDER__',
   };
   ```

2. Update the CI/CD workflow to use sed replacement:
   ```yaml
   - name: Inject GTM ID for production
     run: |
       find dist -type f -name "*.js" -exec sed -i 's/__GTM_ID_PLACEHOLDER__/${{ secrets.GTM_ID }}/g' {} \;
   ```
