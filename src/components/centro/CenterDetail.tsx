'use client';

import type { CenterDetail as CenterDetailType } from '@/lib/types/center';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import CountryFlag from '@/components/shared/CountryFlag';
import ReportButton from './ReportButton';
import { formatDate, formatTime } from '@/lib/utils/formats';
import { DAYS_OF_WEEK } from '@/lib/constants/days';
import Link from 'next/link';

interface CenterDetailProps {
  center: CenterDetailType;
}

export default function CenterDetail({ center }: CenterDetailProps) {
  const scheduleDisplay = center.is_24h
    ? '24 horas'
    : `${formatTime(center.open_time || '')} – ${formatTime(center.close_time || '')}`;

  const daysDisplay = center.is_all_days
    ? 'Todos los días'
    : (center.days_of_week || [])
        .sort()
        .map((d) => DAYS_OF_WEEK.find((x) => x.value === d)?.label || '')
        .filter(Boolean)
        .join(', ');

  return (
    <div className="space-y-6">
      {/* Foto principal */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
        <ImageWithFallback
          src={center.photo_url}
          alt={`Centro de acopio en ${center.country?.name || 'desconocido'}`}
          className="w-full h-64 sm:h-80 object-cover"
        />
      </div>

      {/* Información principal */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-6">
        {/* Ubicación */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Ubicación
          </h2>
          <div className="flex items-center gap-2 mb-2">
            {center.country?.iso2 && (
              <CountryFlag iso2={center.country.iso2} className="text-2xl" />
            )}
            <span className="text-lg font-semibold text-text">
              {center.country?.name || 'Desconocido'}
            </span>
          </div>
          {center.state && (
            <p className="text-sm text-text mb-1">
              Estado: <span className="font-medium">{center.state.name}</span>
            </p>
          )}
          {center.city && (
            <p className="text-sm text-text mb-1">
              Ciudad: <span className="font-medium">{center.city.name}</span>
            </p>
          )}
          <p className="text-sm text-text mt-3 bg-gray-50 rounded-lg p-3 leading-relaxed">
            {center.address}
          </p>
        </section>

        <hr className="border-gray-100" />

        {/* Horario */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Horario de atención
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
                center.is_24h
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {scheduleDisplay}
            </span>
          </div>
          {daysDisplay && (
            <p className="text-sm text-text-muted mt-2">
              {daysDisplay}
            </p>
          )}
        </section>

        {/* Tags / Insumos */}
        {center.tags && center.tags.length > 0 && (
          <>
            <hr className="border-gray-100" />
            <section>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Insumos que se reciben
              </h2>
              <div className="flex flex-wrap gap-2">
                {center.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="inline-block bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Contacto */}
        {(center.contact_name || center.contact_phone) && (
          <>
            <hr className="border-gray-100" />
            <section>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Persona de contacto
              </h2>
              {center.contact_name && (
                <p className="text-sm text-text">
                  <span className="text-text-muted">Nombre:</span>{' '}
                  <span className="font-medium">{center.contact_name}</span>
                </p>
              )}
              {center.contact_phone && (
                <p className="text-sm text-text mt-1">
                  <span className="text-text-muted">Teléfono:</span>{' '}
                  <a
                    href={`tel:${center.contact_phone.replace(/[()\-\s]/g, '')}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {center.contact_phone}
                  </a>
                </p>
              )}
            </section>
          </>
        )}

        {/* Fecha de registro */}
        <hr className="border-gray-100" />
        <p className="text-xs text-text-muted">
          Registrado el {formatDate(center.created_at)}
        </p>
      </div>

      {/* Reportes */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <ReportButton
          centerId={center.id}
          initialReportCount={center.report_count}
        />
      </div>

      {/* Botón regresar */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text font-medium text-sm transition-colors no-underline"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        ← Regresar al mapa
      </Link>
    </div>
  );
}
