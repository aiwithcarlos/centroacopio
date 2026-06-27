import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-3 no-underline hover:opacity-90 transition-opacity"
                >
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
                            <polygon points="15,30 17.5,25 20,30 14,27 21,27" />
                            <polygon points="25,30 27.5,25 30,30 24,27 31,27" />
                            <polygon points="35,30 37.5,25 40,30 34,27 41,27" />
                            <polygon points="45,30 47.5,25 50,30 44,27 51,27" />
                            <polygon points="55,30 57.5,25 60,30 54,27 61,27" />
                            <polygon points="65,30 67.5,25 70,30 64,27 71,27" />
                            <polygon points="75,30 77.5,25 80,30 74,27 81,27" />
                        </g>
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary leading-tight">
                            CAV - Centros de Acopio para Venezuela
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
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        <span className="hidden sm:inline">
                            Centro de Acopio
                        </span>
                        <span className="sm:hidden">Centro</span>
                    </Link>
                </nav>
            </div>

            {/* Líneas tricolor de la bandera venezolana (una debajo de otra) */}
            <div className="h-[3px] w-full" style={{ backgroundColor: '#FFD700' }} />
            <div className="h-[3px] w-full" style={{ backgroundColor: '#00247D' }} />
            <div className="h-[3px] w-full" style={{ backgroundColor: '#CF142B' }} />
        </header>
    );
}
