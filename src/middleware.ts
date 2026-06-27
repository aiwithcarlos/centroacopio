import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://centroacopio.com',
  'https://www.centroacopio.com',
  'http://localhost:3000',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo aplicar a rutas de API con métodos de escritura
  if (pathname.startsWith('/api/')) {
    const method = request.method;
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    // Verificación de origen para POST/PUT/DELETE
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      const requestOrigin = origin || (referer ? new URL(referer).origin : null);

      if (requestOrigin) {
        const isAllowed = ALLOWED_ORIGINS.some(
          (allowed) => allowed === requestOrigin
        );

        if (!isAllowed) {
          return NextResponse.json(
            { error: 'Origen no permitido' },
            { status: 403 }
          );
        }
      }
      // Si no hay Origin ni Referer (ej. curl), permitir en desarrollo
      // En producción, Vercel maneja esto con sus propios headers
    }
  }

  const response = NextResponse.next();

  // Cabeceras de seguridad en todas las respuestas
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(), geolocation=(self)'
  );

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
