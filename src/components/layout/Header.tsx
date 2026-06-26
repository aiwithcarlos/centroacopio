import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-90 transition-opacity">
          {/* Bandera de Venezuela SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 90 60"
            className="w-9 h-6 rounded-sm shadow-sm flex-shrink-0"
            aria-label="Bandera de Venezuela"
          >
            <rect width="90" height="20" fill="#FFD700" />
            <rect y="20" width="90" height="20" fill="#00247D" />
            <rect y="40" width="90" height="20" fill="#CF142B" />
            <g fill="white">
              <polygon points="45,8 46.5,13 52,13 47.5,16 49,21 45,18 41,21 42.5,16 38,13 43.5,13" />
              <polygon points="35,12 36,15 39,15 36.6,17 37.5,20 35,18 32.5,20 33.4,17 31,15 34,15" />
              <polygon points="55,12 56,15 59,15 56.6,17 57.5,20 55,18 52.5,20 53.4,17 51,15 54,15" />
              <polygon points="40,16 40.8,18.5 43.5,18.5 41.3,20 42.1,22.5 40,21 37.9,22.5 38.7,20 36.5,18.5 39.2,18.5" />
              <polygon points="50,16 50.8,18.5 53.5,18.5 51.3,20 52.1,22.5 50,21 47.9,22.5 48.7,20 46.5,18.5 49.2,18.5" />
              <polygon points="37,20 37.5,21.8 39.5,21.8 38,23 38.5,25 37,23.5 35.5,25 36,23 34.5,21.8 36.5,21.8" />
              <polygon points="43,20 43.5,21.8 45.5,21.8 44,23 44.5,25 43,23.5 41.5,25 42,23 40.5,21.8 42.5,21.8" />
              <polygon points="49,20 49.5,21.8 51.5,21.8 50,23 50.5,25 49,23.5 47.5,25 48,23 46.5,21.8 48.5,21.8" />
            </g>
          </svg>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary leading-tight">
              CAV
            </span>
            <span className="text-xs text-text-muted leading-tight hidden sm:block">
              Centro Acopio Venezuela
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/registrar"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-medium px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm transition-colors no-underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">+ Centro de Acopio</span>
            <span className="sm:hidden">+ Centro</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
