# Security Policy

## Supported Versions

This project is currently being actively maintained and security updates are provided for the latest version.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to contact@jasonmcalpin.com. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

- Type of vulnerability
- Full path of the affected file(s)
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

## Security Measures Implemented

This project implements several security measures to protect against common web vulnerabilities:

### HTTP Security Headers

- **X-Frame-Options**: Prevents clickjacking attacks by ensuring the site cannot be embedded in iframes on other domains.
- **X-Content-Type-Options**: Prevents MIME type sniffing attacks.
- **X-XSS-Protection**: Provides protection against cross-site scripting (XSS) attacks.
- **Strict-Transport-Security (HSTS)**: Ensures all connections use HTTPS.
- **Content-Security-Policy (CSP)**: Restricts which resources can be loaded, preventing various attacks including XSS.

### CORS Protection

- Restricted Cross-Origin Resource Sharing (CORS) to prevent unauthorized domains from accessing resources.

### Other Security Measures

- HTTPS enforcement for all connections
- Protection against directory listing
- Protection of sensitive files
- Automatic dependency scanning via Dependabot to identify and fix vulnerable dependencies

## Best Practices for Contributors

When contributing to this project, please ensure you follow these security best practices:

1. **Keep dependencies updated**: Always use the latest stable versions of dependencies.
2. **Avoid inline scripts**: Use external JavaScript files whenever possible.
3. **Validate and sanitize all data**: Even if not directly from user input, treat all data as potentially malicious.
4. **Follow the principle of least privilege**: Components should only have access to the resources they need.
5. **Use secure coding practices**: Follow OWASP guidelines for secure coding.
