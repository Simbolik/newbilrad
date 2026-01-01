import { WithContext, Organization } from 'schema-dts';

/**
 * Get the base URL for the current environment
 * - Development: http://localhost:3000
 * - Production: https://bilråd.se
 */
function getBaseUrl(): string {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side environment detection
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production - use the real domain
  return 'https://bilråd.se';
}

export function getOrganizationMainJson(): WithContext<Organization> {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#redaktionen`,
    "name": "Redaktionen på Bilråd.se",
    "url": `${baseUrl}/om-oss/`,
    "description": "Ett team av skribenter, fordonstekniker och bilintresserade som producerar innehåll för Bilråd.se. Vi erbjuder guider, råd och tips för bilägare i Sverige – med fokus på användarvärde, teknisk korrekthet och praktisk erfarenhet.",
    "logo": `${baseUrl}/wp-content/uploads/2025/05/cropped-Logo.png`,
    "sameAs": [
      "https://x.com/bilradsverige"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Kundservice",
      "email": "kontakt@bilråd.se",
      "url": `${baseUrl}/kontakt/`,
      "availableLanguage": ["sv"]
    },
  "member": [
    {
      "@type": "Person",
      "name": "Andreas Karlsson",
      "description": "Specialist på felsökning av personbilar med över 25 års erfarenhet av verkstadsarbete och reparationer. Har djup kunskap i både mekaniska och elektroniska system."
    },
    {
      "@type": "Person",
      "name": "Johan Lindström",
      "description": "Noggrann bilmekaniker med fokus på service och säkerhetskontroller av begagnade fordon. Känd för sitt raka och pålitliga arbetssätt."
    },
    {
      "@type": "Person",
      "name": "Patrik Svensson",
      "description": "Över 15 års erfarenhet av avancerad fordonsdiagnostik. Har arbetat med både mindre verkstäder och auktoriserade märkesanläggningar."
    },
    {
      "@type": "Person",
      "name": "Anna Sjöberg",
      "description": "Skadereglerare med lång erfarenhet av bilförsäkringar. Van vid att guida kunder genom skadeärenden på ett tydligt och sakligt sätt."
    }
    ]
  };
}
