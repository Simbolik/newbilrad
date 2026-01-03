/**
 * Script to create a post via the API
 * Usage: node scripts/create-post.mjs
 * 
 * Body format supports markdown-style headings:
 * - # Heading 1 (h1)
 * - ## Heading 2 (h2)
 * - ### Heading 3 (h3)
 * - #### Heading 4 (h4)
 * - Regular text becomes paragraphs
 */

const API_URL = 'http://localhost:3000/api/create-post'
const API_KEY = 'jhkasd87678hjklasdlhkj'

// Dummy data for testing with structured content
const postData = {
  // Page title (appears in browser tab and as post title)
  title: '6 Komplett guide till teknisk SEO 2024',
  
  // URL slug
  slug: '6-guide-teknisk-seo-2024',
  
  // Meta description for SEO
  metaDescription: 'Lär dig allt om teknisk SEO. Vår kompletta guide täcker sidladdning, mobilanpassning, SSL, sitemaps och mer för att förbättra din ranking i Google.',
  
  // Hero image URL (will be downloaded and uploaded to media)
  image: 'https://xn--bilrd-pra.se/wp-content/uploads/2025/07/basta-familjebilarna-guide-2025-scaled.png',
  
  // Alt text for the image (for accessibility and SEO)
  imageAlt: '6 Teknisk SEO guide illustration med dator och analysverktyg',
  
  // Body content with markdown headings (use ## for h2, ### for h3 - title is already h1)
  body: `6  Teknisk SEO är grunden för en väloptimerad webbplats. Utan en solid teknisk grund kommer ditt innehåll aldrig att nå sin fulla potential i sökresultaten.

## 3 Vad är teknisk SEO?

Teknisk SEO handlar om att optimera din webbplats infrastruktur så att sökmotorer enkelt kan crawla, indexera och ranka ditt innehåll. Det är fundamentet som resten av din SEO-strategi bygger på.

## Viktiga områden inom teknisk SEO

Här går vi igenom de viktigaste delarna du behöver fokusera på.

### Sidladdningshastighet

Google prioriterar snabba webbplatser. Använd verktyg som PageSpeed Insights för att mäta och förbättra din sajts prestanda. Sikta på en laddningstid under 3 sekunder.

### Mobilanpassning

Mer än hälften av all webbtrafik kommer från mobila enheter. Din sajt måste fungera felfritt på alla skärmstorlekar. Google använder mobile-first indexering.

### SSL-certifikat

HTTPS är ett rankingfaktor. Se till att hela din webbplats är säker med ett giltigt SSL-certifikat. Detta bygger också förtroende hos besökarna.

## Tekniska verktyg du behöver

För att lyckas med teknisk SEO behöver du rätt verktyg.

### XML Sitemap

Hjälp sökmotorer att hitta alla dina sidor genom att skapa och skicka in en sitemap till Google Search Console.

### Robots.txt

Styr vilka delar av din webbplats som ska indexeras. Blockera sidor som inte ska synas i sökresultaten.

## Sammanfattning

Investera tid i teknisk SEO tidigt. Det är mycket enklare att bygga rätt från början än att fixa problem i efterhand. En tekniskt optimerad sajt ger dig en stabil grund för framgångsrik SEO.`
}

async function createPost() {
  try {
    console.log('Creating post:', postData.title)
    console.log('API URL:', API_URL)
    console.log('')

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(postData)
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✓ Post created successfully!')
      console.log('')
      console.log('Response:')
      console.log(JSON.stringify(result, null, 2))
    } else {
      console.error('✗ Failed to create post')
      console.error('Status:', response.status)
      console.error('Error:', result)
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message)
  }
}

createPost()
