import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    type?: 'website' | 'article' | 'business.business';
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    siteName?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  structuredData?: object;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Rest with Respect - Transgender Friendly Venues Across the UK',
  description = 'Find safe, welcoming spaces for transgender and non-binary people across the UK. Discover inclusive venues with verified transgender-friendly policies and facilities.',
  canonical,
  openGraph,
  twitter,
  structuredData,
  noIndex = false
}) => {
  const siteUrl = 'https://restwithrespect.org'; // Update with your actual domain
  const defaultImage = `${siteUrl}/lovable-uploads/a9e36d24-0a59-4b2f-b9e5-135d1f71c3f5.png`;

  const og = {
    type: 'website',
    title: title,
    description: description,
    image: defaultImage,
    url: canonical || siteUrl,
    siteName: 'Rest with Respect',
    ...openGraph
  };

  const twitterCard = {
    card: 'summary_large_image',
    site: '@restwithrespect', // Update with your Twitter handle
    title: title,
    description: description,
    image: defaultImage,
    ...twitter
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2D5AA0" />
      
      {/* SEO */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      
      {/* Language and Location */}
      <meta name="language" content="en-GB" />
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={og.type} />
      <meta property="og:title" content={og.title} />
      <meta property="og:description" content={og.description} />
      <meta property="og:image" content={og.image} />
      <meta property="og:url" content={og.url} />
      <meta property="og:site_name" content={og.siteName} />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard.card} />
      {twitterCard.site && <meta name="twitter:site" content={twitterCard.site} />}
      {twitterCard.creator && <meta name="twitter:creator" content={twitterCard.creator} />}
      <meta name="twitter:title" content={twitterCard.title} />
      <meta name="twitter:description" content={twitterCard.description} />
      <meta name="twitter:image" content={twitterCard.image} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Rest with Respect" />
      <meta name="keywords" content="transgender friendly, LGBTQ+ venues, inclusive spaces, transgender safe spaces, non-binary friendly, UK venues, trans rights, equality, diversity, inclusion" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;