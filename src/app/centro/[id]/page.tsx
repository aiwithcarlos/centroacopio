import type { Metadata } from 'next';
import { headers } from 'next/headers';
import CenterDetailComponent from '@/components/centro/CenterDetail';
import ErrorMessage from '@/components/shared/ErrorMessage';
import Link from 'next/link';
import type { CenterDetail } from '@/lib/types/center';

async function getCenter(id: string): Promise<CenterDetail | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/centers/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const center = await getCenter(id);

  if (!center) {
    return {
      title: 'Centro no encontrado | CAV',
    };
  }

  return {
    title: `Centro de Acopio en ${center.country?.name || '...'} | CAV`,
    description: `Centro de acopio en ${center.country?.name || ''}, ${center.state?.name || ''}. Dirección: ${center.address.substring(0, 100)}`,
  };
}

export default async function CentroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const center = await getCenter(id);

  if (!center) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorMessage message="Centro de acopio no encontrado. Puede haber sido eliminado o la URL es incorrecta." />
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
          >
            ← Regresar al mapa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <CenterDetailComponent center={center} />
    </div>
  );
}
