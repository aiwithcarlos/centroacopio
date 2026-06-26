'use client';

import { useState } from 'react';
import { useCountries, useStates, useCities } from '@/hooks/useLocations';

interface FiltersProps {
  countryId: string | null;
  stateId: string | null;
  cityId: string | null;
  onCountryChange: (id: string | null) => void;
  onStateChange: (id: string | null) => void;
  onCityChange: (id: string | null) => void;
  onNearMe: (lat: number, lng: number) => void;
  onNearMeStart: () => void;
  onNearMeError: () => void;
}

export default function Filters({
  countryId,
  stateId,
  cityId,
  onCountryChange,
  onStateChange,
  onCityChange,
  onNearMe,
  onNearMeStart,
  onNearMeError,
}: FiltersProps) {
  const { countries, isLoading: loadingCountries } = useCountries();
  const { states, isLoading: loadingStates } = useStates(countryId);
  const { cities, isLoading: loadingCities } = useCities(countryId, stateId);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNearMe = () => {
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalización.');
      return;
    }

    setLoading(true);
    onNearMeStart();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onNearMe(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        onNearMeError();
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Permiso de ubicación denegado. Actívalo en la configuración de tu navegador.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('No se pudo obtener tu ubicación. Verifica tu conexión.');
            break;
          case err.TIMEOUT:
            setGeoError('Tiempo agotado al obtener tu ubicación. Intenta de nuevo.');
            break;
          default:
            setGeoError('Error al obtener tu ubicación.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        {/* País */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-xs font-medium text-text-muted">País</label>
          <select
            value={countryId || ''}
            onChange={(e) => onCountryChange(e.target.value || null)}
            disabled={loadingCountries}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
          >
            <option value="">Todos los países</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-xs font-medium text-text-muted">
            Estado / Departamento
          </label>
          <select
            value={stateId || ''}
            onChange={(e) => onStateChange(e.target.value || null)}
            disabled={!countryId || loadingStates}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
          >
            <option value="">Todos los estados</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Municipio */}
        <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
          <label className="text-xs font-medium text-text-muted">Municipio</label>
          <select
            value={cityId || ''}
            onChange={(e) => onCityChange(e.target.value || null)}
            disabled={!stateId || loadingCities}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
          >
            <option value="">Todos los municipios</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cerca de mí */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-muted invisible">
            Acción
          </label>
          <button
            onClick={handleNearMe}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Buscando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cerca de mí
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mensaje de error de geolocalización */}
      {geoError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {geoError}
        </p>
      )}
    </div>
  );
}
