import type { Metadata } from "next";
import PrimaryNav from "@/components/site/PrimaryNav";
import LeftSidebar from "@/components/site/LeftSidebar";
import Footer from "@/components/site/Footer";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  
  return {
    // Base metadata - will be overridden by page-specific metadata
    metadataBase: new URL('https://bilråd.se'),
    
    // Global site settings
    openGraph: {
      locale: 'sv_SE',
      type: 'website',
      siteName: 'Bilråd.se',
    },
    twitter: {
      card: 'summary_large_image',
    },
    
    // Global robots settings
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    
    // Global other settings
    other: {
      'format-detection': 'telephone=no',
    },
  };
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="sv">
      <body>
        <PrimaryNav />
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-[272px_minmax(0,1fr)] gap-8">
            <aside className="hidden md:block">
              <LeftSidebar />
            </aside>
            <div className="w-full">
              {children}
            </div>
          </div>
        </div>
        <div id="footer-sentinel" aria-hidden="true"></div>
        <Footer />
      </body>
    </html>
  );
}
