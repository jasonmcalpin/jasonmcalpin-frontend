# SEO Guide for jasonmcalpin.com

This document provides an overview of the SEO features implemented on the site and guidance for maintaining good SEO practices.

## Implemented SEO Features

### 1. Meta Tags with React Helmet

The site uses `react-helmet-async` to dynamically manage meta tags for each page:

- **Title Tags**: Unique, descriptive titles for each page
- **Meta Descriptions**: Concise summaries of page content
- **Canonical URLs**: Prevent duplicate content issues
- **Open Graph Tags**: Optimize social media sharing
- **Twitter Card Tags**: Enhance Twitter sharing appearance

Implementation: `src/components/global/SEO/index.tsx`

### 2. Structured Data (JSON-LD)

Structured data helps search engines understand your content and can result in rich snippets in search results:

- **Website Schema**: Basic information about the website
- **Person Schema**: Information about Jason McAlpin
- **Byte Schema**: Details about blog posts
- **Project Schema**: Information about portfolio projects
- **BreadcrumbList Schema**: Navigation paths

Implementation: `src/utils/schema.ts`

### 3. Sitemap

An XML sitemap helps search engines discover and index your content:

- Lists all important pages on the site
- Includes lastmod dates, change frequency, and priority
- Referenced in robots.txt

Implementation: `public/sitemap.xml`

### 4. Robots.txt

Controls how search engines crawl your site:

- Allows crawling of main pages
- Prevents crawling of sensitive directories
- References the sitemap

Implementation: `robots.txt`

### 5. Security Headers

Security headers improve site security and can positively impact SEO:

- **Content-Security-Policy**: Prevents XSS attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Basic XSS protection
- **Strict-Transport-Security**: Enforces HTTPS

Implementation: `.htaccess` and `index.html`

## SEO Maintenance Tasks

### Regular Tasks

1. **Update Content Regularly**
   - Add new bytes and projects
   - Update existing content to keep it fresh
   - Remove outdated content

2. **Monitor Performance**
   - Use Google Search Console to track performance
   - Check for crawl errors and fix them
   - Monitor Core Web Vitals

3. **Update Meta Tags**
   - Ensure all new pages have proper meta tags
   - Optimize titles and descriptions based on performance

4. **Update Sitemap**
   - Add new pages to the sitemap
   - Update lastmod dates for changed content
   - Resubmit to search engines when significant changes are made

### Quarterly Tasks

1. **Conduct SEO Audit**
   - Check for broken links
   - Verify all pages have proper meta tags
   - Ensure structured data is valid
   - Test site speed and optimize if needed

2. **Review Analytics**
   - Analyze traffic patterns
   - Identify high-performing content
   - Find opportunities for improvement

3. **Update Keywords**
   - Research new relevant keywords
   - Update content to target new keywords
   - Optimize underperforming pages

## SEO Best Practices

### Content

1. **Create High-Quality Content**
   - Focus on providing value to users
   - Write comprehensive, in-depth bytes
   - Use proper heading structure (H1, H2, H3)
   - Include relevant keywords naturally

2. **Optimize Images**
   - Use descriptive file names
   - Add alt text to all images
   - Compress images for faster loading
   - Use responsive image techniques

3. **Internal Linking**
   - Link related content together
   - Use descriptive anchor text
   - Create a logical site structure
   - Update old content with links to new content

### Technical

1. **Maintain Fast Loading Times**
   - Optimize code and assets
   - Use lazy loading for images
   - Implement code splitting
   - Minimize HTTP requests

2. **Ensure Mobile Friendliness**
   - Test on various devices
   - Use responsive design
   - Ensure tap targets are properly sized
   - Avoid horizontal scrolling

3. **Secure Your Site**
   - Maintain HTTPS
   - Keep security headers updated
   - Regularly update dependencies

## SEO Tools

- **Google Search Console**: Monitor performance and issues
- **Google Analytics**: Track user behavior
- **PageSpeed Insights**: Test and optimize performance
- **Schema Validator**: Verify structured data
- **Screaming Frog**: Conduct site audits
- **Ahrefs/SEMrush**: Research keywords and backlinks

## Additional Resources

- [Google's SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz's Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Schema.org Documentation](https://schema.org/docs/gs.html)
- [Web.dev Learn SEO](https://web.dev/learn/seo/)

---

This guide should be reviewed and updated regularly as SEO best practices evolve.
