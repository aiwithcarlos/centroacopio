import Link from 'next/link';
import type { CenterListItem } from '@/lib/types/center';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import CountryFlag from '@/components/shared/CountryFlag';
import { truncateAddress } from '@/lib/utils/formats';

interface CenterCardProps {
  center: CenterListItem;
}

// Colores suaves para placeholder de país sin foto
const PLACEHOLDER_COLORS = [
  { bg: '#DCFCE7', text: '#16A34A' },   // verde
  { bg: '#DBEAFE', text: '#2563EB' },   // azul
  { bg: '#F3E8FF', text: '#7C3AED' },   // violeta
  { bg: '#FEE2E2', text: '#DC2626' },   // rojo
  { bg: '#EDE9FE', text: '#6D28D9' },   // púrpura
];

function getPlaceholderColor(iso2: string) {
  const sum = (iso2 || '??').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PLACEHOLDER_COLORS[sum % PLACEHOLDER_COLORS.length];
}

export default function CenterCard({ center }: CenterCardProps) {
  const hasPhoto = !!center.photo_url;
  const iso2 = center.country?.iso2 || '??';
  const placeholder = getPlaceholderColor(iso2);

  return (
    <Link
      href={`/centro/${center.id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 no-underline group"
    >
      {/* Foto o placeholder con letras del país */}
      <div className="h-40 overflow-hidden">
        {hasPhoto ? (
          <ImageWithFallback
            src={center.photo_url}
            alt={`Centro de acopio en ${center.country?.name || 'desconocido'}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: placeholder.bg }}
          >
            <span
              className="text-5xl font-extrabold tracking-wider"
              style={{ color: placeholder.text, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
            >
              {iso2}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-1.5">
        {/* País con bandera */}
        <div className="flex items-center gap-1.5">
          {center.country?.iso2 ? (
            <CountryFlag iso2={center.country.iso2} className="text-lg" />
          ) : null}
          <span className="font-bold text-sm text-text truncate">
            {center.country?.name || 'Desconocido'}
          </span>
        </div>

        {/* Estado */}
        {center.state && (
          <p className="font-semibold text-xs text-text truncate">
            {center.state.name}
          </p>
        )}

        {/* Municipio */}
        {center.city && (
          <p className="font-semibold text-xs text-text truncate">
            {center.city.name}
          </p>
        )}

        {/* Dirección con icono */}
        <p className="text-xs text-text-muted leading-relaxed flex items-start gap-1">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{truncateAddress(center.address, 80)}</span>
        </p>

        {/* Persona de contacto con icono */}
        {center.contact_name && (
          <p className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium text-xs text-text">
              {center.contact_name}
            </span>
          </p>
        )}

        {/* Teléfono con icono */}
        {center.contact_phone && (
          <p className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="font-bold text-xs text-text">
              {center.contact_phone}
            </span>
          </p>
        )}

        {/* Reportes */}
        {center.report_count > 0 && (
          <span className="inline-block text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            ⚠️ {center.report_count} reporte{center.report_count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </Link>
  );
}
