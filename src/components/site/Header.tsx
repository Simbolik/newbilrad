import Image from 'next/image';
import Link from 'next/link';
import { getSiteInfo } from '@/lib/payload';
import { decodeHtmlEntities } from '@/lib/utils';

export default async function TopBar(){
  const siteInfo = await getSiteInfo();
  const siteTitle = decodeHtmlEntities(siteInfo?.title || 'Bilråd.se');
  const siteDescription = decodeHtmlEntities(siteInfo?.description || '');
  
  // Build H1 text from site title and description
  const h1Text = `${siteTitle}${siteDescription ? ` – ${siteDescription}` : ''}`;
  
  
  return (
    <div className="w-full bg-footer text-footerText">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={60} height={60} className="rounded-md" />
          </Link>
          <h1 className="font-light tracking-wide opacity-90" style={{ fontSize: '14px', margin: 0, fontWeight: 300 }}>
            {h1Text}
          </h1>
        </div>
      </div>
    </div>
  );
}
