'use client';

import { useCountries, useStates, useCities } from '@/hooks/useLocations';

interface LocationSelectorsProps {
  countryId: string | null;
  stateId: string | null;
  cityId: string | null;
  onCountryChange: (id: string | null) => void;
  onStateChange: (id: string | null) => void;
  onCityChange: (id: string | null) => void;
}

export default function LocationSelectors({
  countryId,
  stateId,
  cityId,
  onCountryChange,
  onStateChange,
  onCityChange,
}: LocationSelectorsProps) {
  const { countries, isLoading: loadingCountries } = useCountries();
  const { states, isLoading: loadingStates } = useStates(countryId);
  const { cities, isLoading: loadingCities } = useCities(stateId);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-text">Ubicación</h3>

      {/* País */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">
          País <span className="text-danger">*</span>
        </label>
        <select
          value={countryId || ''}
          onChange={(e) => {
            onCountryChange(e.target.value || null);
            onStateChange(null);
            onCityChange(null);
          }}
          disabled={loadingCountries}
          required
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
        >
          <option value="">Selecciona un país</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Estado */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">Estado / Departamento</label>
        <select
          value={stateId || ''}
          onChange={(e) => {
            onStateChange(e.target.value || null);
            onCityChange(null);
          }}
          disabled={!countryId || loadingStates}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
        >
          <option value="">Sin selección</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Municipio */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">Ciudad / Municipio</label>
        <select
          value={cityId || ''}
          onChange={(e) => onCityChange(e.target.value || null)}
          disabled={!stateId || loadingCities}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50"
        >
          <option value="">Sin selección</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dirección */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">
          Dirección a detalle <span className="text-danger">*</span>
        </label>
        <p className="text-xs text-text-muted">
          Agrega calle, avenida, urbanización, barrio, hotel, casa, parque, tienda, refugio, etc.
        </p>
        <textarea
          rows={5}
          placeholder="Ej: Av. Principal, Calle 5, Urbanización El Paraíso, Casa #23..."
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
        />
      </div>
    </div>
  );
}
