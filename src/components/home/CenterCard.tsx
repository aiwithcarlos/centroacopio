import Link from 'next/link';
import type { CenterListItem } from '@/lib/types/center';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import CountryFlag from '@/components/shared/CountryFlag';
import { truncateAddress } from '@/lib/utils/formats';

interface CenterCardProps {
  center: CenterListItem;
}

export default function CenterCard({ center }: CenterCardProps) {
  return (
    <Link
      href={`/centro/${center.id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 no-underline group"
    >
      <div className="h-40 overflow-hidden">
        <ImageWithFallback
          src={center.photo_url}
          alt={`Centro de acopio en ${center.country?.name || 'desconocido'}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          {center.country?.iso2 ? (
            <CountryFlag iso2={center.country.iso2} className="text-lg" />
          ) : null}
          <span className="font-medium text-sm text-text truncate">
            {center.country?.name || 'Desconocido'}
          </span>
        </div>
        {center.state && (
          <p className="text-xs text-text-muted mb-0.5 truncate">
            {center.state.name}
          </p>
        )}
        {center.city && (
          <p className="text-xs text-text-muted mb-1 truncate">
            {center.city.name}
          </p>
        )}
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
          {truncateAddress(center.address, 80)}
        </p>
        {center.report_count > 0 && (
          <span className="inline-block mt-2 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            ⚠️ {center.report_count} reporte{center.report_count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  );
}
