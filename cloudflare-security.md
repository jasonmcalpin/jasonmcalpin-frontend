# Cloudflare Security Configuration Guide

This document provides recommended Cloudflare settings to enhance the security of your website. Cloudflare acts as a Web Application Firewall (WAF) and can significantly improve your site's protection against various threats.

## Getting Started with Cloudflare

1. Sign up for a Cloudflare account at [cloudflare.com](https://www.cloudflare.com/)
2. Add your domain to Cloudflare
3. Update your domain's nameservers to point to Cloudflare's nameservers
4. Wait for DNS propagation (usually takes 24-48 hours)

## Recommended Security Settings

### SSL/TLS

1. Navigate to **SSL/TLS** in your Cloudflare dashboard
2. Set **SSL/TLS encryption mode** to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**
5. Under **Edge Certificates**:
   - Enable **Always Use HTTPS**
   - Enable **Minimum TLS Version** and set to TLS 1.2
   - Enable **Opportunistic Encryption**
   - Enable **TLS 1.3**
   - Enable **Automatic HTTPS Rewrites**

### Firewall

1. Navigate to **Security > WAF** in your Cloudflare dashboard
2. Enable **WAF Managed Rules**
3. Set the following rule sets to **On**:
   - Cloudflare Managed Ruleset
   - OWASP Core Ruleset
   - Cloudflare Browser Integrity Check

### Page Rules

Create the following page rules (in order of priority):

1. **Always Use HTTPS**
   - URL pattern: `http://*jasonmcalpin.com/*`
   - Setting: Always Use HTTPS

2. **Browser Cache TTL**
   - URL pattern: `*jasonmcalpin.com/assets/*`
   - Setting: Browser Cache TTL: 1 month

3. **Security Level**
   - URL pattern: `*jasonmcalpin.com/*`
   - Setting: Security Level: High

### Rate Limiting

1. Navigate to **Security > WAF > Rate limiting rules**
2. Create a new rate limiting rule:
   - Name: "General Rate Limiting"
   - If incoming requests match: All incoming requests
   - And the rate exceeds: 100 requests per minute
   - Then: Block

### Bot Fight Mode

1. Navigate to **Security > Bots**
2. Enable **Bot Fight Mode**

### Firewall Rules

Create the following firewall rules:

1. **Block Bad User Agents**
   - Name: "Block Bad User Agents"
   - Field: User Agent
   - Operator: Matches Regex
   - Value: `(?i)(curl|wget|scrapy|zgrab|censys|nmap)`
   - Action: Block

2. **Block Access to Sensitive Files**
   - Name: "Block Access to Sensitive Files"
   - Field: URI Path
   - Operator: Matches Regex
   - Value: `(?i)\.(env|git|htaccess|htpasswd|log|bak|swp|sql|config|ini)$`
   - Action: Block

### Additional Security Measures

1. **HTTP Security Headers**
   - Navigate to **Rules > Transform Rules**
   - Create a new rule to add security headers (these complement the headers already set in your .htaccess file)

2. **Email Security**
   - Navigate to **Email > Email Security**
   - Set up SPF, DKIM, and DMARC records

3. **Page Shield**
   - Navigate to **Security > Page Shield**
   - Enable Page Shield to detect malicious JavaScript

## Monitoring and Alerts

1. Navigate to **Analytics > Security**
2. Review security events regularly
3. Set up email notifications for security events

## Regular Maintenance

1. Review Firewall Events weekly
2. Update WAF rules as needed
3. Monitor for false positives and adjust rules accordingly

---

**Note**: These settings provide a strong security baseline but may need adjustment based on your specific needs. Some settings may impact site performance or functionality, so test thoroughly after implementation.
