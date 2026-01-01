import Link from 'next/link';

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navigationLinks = [
    { href: '/om-oss', label: 'Om oss' },
    { href: '/kontakt', label: 'Kontakt' },
    { href: '/integritetspolicy', label: 'Integritetspolicy' }
  ];
  
  return (
    <footer className="w-full bg-footer border-t border-gray-300">
      <div className="py-6 px-4">
        <div className="mx-auto max-w-[1200px]">
          {/* Navigation Links */}
          <div className="flex items-center justify-center mb-4">
            <nav>
              <div className="flex items-center space-x-1 text-sm">
                {navigationLinks.map((link, index) => (
                  <div key={link.href} className="flex items-center">
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 px-2 py-1"
                    >
                      {link.label}
                    </Link>
                    {index < navigationLinks.length - 1 && (
                      <span className="text-gray-400 text-xs">|</span>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
          
          {/* Copyright */}
          <div className="text-center">
            <div className="text-sm text-gray-500">
              © {currentYear} Bilråd.se – Alla rättigheter förbehålles
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
