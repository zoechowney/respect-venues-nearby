import { Venue } from '@/types/venue';

// Organization structured data
export const getOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rest with Respect",
    "description": "A platform connecting transgender and non-binary people with safe, inclusive venues across the UK",
    "url": "https://restwithrespect.org",
    "logo": "https://restwithrespect.org/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
      "addressRegion": "England"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "contact@restwithrespect.org"
    },
    "sameAs": [
      "https://twitter.com/restwithrespect",
      "https://facebook.com/restwithrespect"
    ],
    "keywords": "transgender friendly venues, LGBTQ+ inclusive spaces, trans safe spaces, non-binary friendly, UK venues"
  };
};

// Website structured data
export const getWebsiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rest with Respect",
    "url": "https://restwithrespect.org",
    "description": "Find transgender-friendly venues and inclusive spaces across the UK",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://restwithrespect.org/directory?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Rest with Respect"
    }
  };
};

// Local business structured data for venues
export const getVenueStructuredData = (venue: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": venue.business_name,
    "description": venue.description || `${venue.business_name} is a transgender-friendly ${venue.business_type.toLowerCase()} committed to providing inclusive and welcoming services.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": venue.address,
      "addressCountry": "GB"
    },
    "telephone": venue.phone,
    "url": venue.website,
    "openingHours": venue.hours ? [venue.hours] : undefined,
    "priceRange": "$$",
    "acceptsReservations": true,
    "accessibilityFeature": [
      "transgender-friendly facilities",
      "inclusive staff training",
      "safe space policy"
    ],
    "amenityFeature": venue.features?.map((feature: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    })) || [],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Transgender Friendly",
        "value": true
      },
      {
        "@type": "PropertyValue", 
        "name": "Inclusive Training",
        "value": true
      },
      {
        "@type": "PropertyValue",
        "name": "Safe Space",
        "value": true
      }
    ]
  };

  // Add specific business type
  switch (venue.business_type.toLowerCase()) {
    case 'restaurant':
    case 'café':
      return {
        ...baseData,
        "@type": "Restaurant",
        "servesCuisine": "Various",
        "acceptsReservations": true
      };
    case 'pub':
    case 'bar':
      return {
        ...baseData,
        "@type": "BarOrPub"
      };
    case 'shop':
    case 'retail':
      return {
        ...baseData,
        "@type": "Store"
      };
    case 'gym':
    case 'fitness':
      return {
        ...baseData,
        "@type": "SportsActivityLocation"
      };
    case 'hotel':
    case 'accommodation':
      return {
        ...baseData,
        "@type": "LodgingBusiness"
      };
    default:
      return baseData;
  }
};

// Aggregate rating structured data
export const getVenueRatingStructuredData = (venue: any) => {
  if (!venue.rating || !venue.reviews_count) return null;

  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": venue.rating,
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": venue.reviews_count
  };
};

// Review structured data
export const getReviewStructuredData = (review: any, venue: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": venue.business_name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "Verified User" // Anonymous for privacy
    },
    "reviewBody": review.review_text,
    "datePublished": review.created_at
  };
};

// Breadcrumb structured data
export const getBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// FAQ structured data
export const getFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Collection page structured data for directory
export const getDirectoryStructuredData = (venues: any[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Transgender-Friendly Venue Directory",
    "description": "A comprehensive directory of transgender-friendly venues across the UK",
    "url": "https://restwithrespect.org/directory",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": venues.length,
      "itemListElement": venues.slice(0, 10).map((venue, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": venue.business_name,
          "description": venue.description,
          "address": venue.address,
          "url": `https://restwithrespect.org/venue/${venue.id}`
        }
      }))
    }
  };
};