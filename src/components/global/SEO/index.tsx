import { Head } from '@unhead/react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'byte' | 'profile';
  byte?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  schema?: object;
}

const SEO = ({
  title,
  description,
  canonical,
  image = '/assets/images/placeholder.svg',
  type = 'website',
  byte,
  schema,
}: SEOProps) => {
  const siteUrl = 'https://jasonmcalpin.com';
  const fullTitle = `${title} | Jason McAlpin`;
  const url = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Jason McAlpin" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {type === 'byte' && byte && (
        <>
          {byte.publishedTime && (
            <meta property="byte:published_time" content={byte.publishedTime} />
          )}
          {byte.modifiedTime && (
            <meta property="byte:modified_time" content={byte.modifiedTime} />
          )}
          {byte.author && <meta property="byte:author" content={byte.author} />}
          {byte.tags &&
            byte.tags.map((tag, i) => (
              <meta key={i} property="byte:tag" content={tag} />
            ))}
        </>
      )}

      {/* JSON-LD Structured Data */}
      {schema && (
        <script type='application/ld+json'>
          {JSON.stringify(schema)}
        </script>
      )}
    </Head>
  );
};

export default SEO;
