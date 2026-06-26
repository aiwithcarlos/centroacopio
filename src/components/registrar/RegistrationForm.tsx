'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCountries, useStates, useCities } from '@/hooks/useLocations';
import TagsSelector from './TagsSelector';
import ScheduleSelector from './ScheduleSelector';
import ContactInfo from './ContactInfo';
import PhotoUpload from './PhotoUpload';

export default function RegistrationForm() {
    const router = useRouter();

    // Ubicación
    const [countryId, setCountryId] = useState<string | null>(null);
    const [stateId, setStateId] = useState<string | null>(null);
    const [cityId, setCityId] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const { countries, isLoading: loadingCountries } = useCountries();
    const { states } = useStates(countryId);
    const { cities } = useCities(stateId);

    // Tags
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Horario
    const [is24h, setIs24h] = useState(false);
    const [openTime, setOpenTime] = useState('6:00 AM');
    const [closeTime, setCloseTime] = useState('10:00 PM');
    const [isAllDays, setIsAllDays] = useState(true);
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

    // Contacto
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    // Foto
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    // Estado del formulario
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validación básica
        if (!countryId) {
            setError('Por favor selecciona un país.');
            return;
        }
        if (!address.trim()) {
            setError('Por favor ingresa la dirección a detalle.');
            return;
        }

        setSubmitting(true);

        try {
            let photoUrl: string | null = null;

            // Subir foto primero si hay una
            if (photoFile) {
                const formData = new FormData();
                formData.append('file', photoFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    throw new Error(err.error || 'Error al subir la foto');
                }

                const uploadData = await uploadRes.json();
                photoUrl = uploadData.url;
            }

            // Obtener coordenadas de la ciudad o estado o país seleccionado
            let latitude: number | null = null;
            let longitude: number | null = null;

            if (cityId) {
                const selectedCity = cities.find((c) => c.id === cityId);
                // Las ciudades que devuelve la API no tienen lat/lng en el tipo City.
                // Para MVP, usar coordenadas aproximadas del estado o país.
            }

            if (stateId && latitude == null) {
                const selectedState = states.find((s) => s.id === stateId);
                // Similar, usar coordenadas del país.
            }

            if (countryId && latitude == null) {
                const selectedCountry = countries.find(
                    (c) => c.id === countryId,
                );
                // Para MVP: las coordenadas no se obtienen directamente de la API de países.
                // En producción, esto se resolvería con una consulta a la BD.
            }

            // Crear centro de acopio
            const payload = {
                country_id: countryId,
                state_id: stateId,
                city_id: cityId,
                address: address.trim(),
                latitude,
                longitude,
                contact_name: contactName.trim() || null,
                contact_phone: contactPhone.trim() || null,
                photo_url: photoUrl,
                is_24h: is24h,
                open_time: is24h ? null : openTime,
                close_time: is24h ? null : closeTime,
                is_all_days: isAllDays,
                days_of_week: isAllDays ? null : daysOfWeek,
                tags: selectedTags,
            };

            const res = await fetch('/api/centers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(
                    err.error || 'Error al registrar el centro de acopio',
                );
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Error al registrar el centro de acopio',
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <svg
                    className="w-16 h-16 text-green-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h2 className="text-xl font-bold text-green-800 mb-2">
                    ¡Centro de acopio registrado con éxito!
                </h2>
                <p className="text-green-700 text-sm mb-4">
                    Tu centro de acopio ha sido registrado. Serás redirigido al
                    mapa en unos segundos...
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                    Ir al mapa ahora
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Ubicación */}
            <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-base font-semibold text-text">Ubicación</h3>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text">
                        País <span className="text-danger">*</span>
                    </label>
                    <select
                        value={countryId || ''}
                        onChange={(e) => {
                            setCountryId(e.target.value || null);
                            setStateId(null);
                            setCityId(null);
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text">
                        Estado / Departamento
                    </label>
                    <select
                        value={stateId || ''}
                        onChange={(e) => {
                            setStateId(e.target.value || null);
                            setCityId(null);
                        }}
                        disabled={!countryId}
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text">
                        Ciudad / Municipio
                    </label>
                    <select
                        value={cityId || ''}
                        onChange={(e) => setCityId(e.target.value || null)}
                        disabled={!stateId}
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

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text">
                        Dirección a detalle{' '}
                        <span className="text-danger">*</span>
                    </label>
                    <p className="text-xs text-text-muted">
                        Agrega calle, avenida, urbanización, barrio, hotel,
                        casa, parque, tienda, refugio, etc.
                    </p>
                    <textarea
                        rows={5}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Av. Principal, Calle 5, Urbanización El Paraíso, Casa #23..."
                        required
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
                    />
                </div>
            </section>

            {/* Insumos */}
            <section className="bg-white border border-gray-200 rounded-xl p-5">
                <TagsSelector
                    selected={selectedTags}
                    onChange={setSelectedTags}
                />
            </section>

            {/* Horario */}
            <section className="bg-white border border-gray-200 rounded-xl p-5">
                <ScheduleSelector
                    is24h={is24h}
                    openTime={openTime}
                    closeTime={closeTime}
                    isAllDays={isAllDays}
                    daysOfWeek={daysOfWeek}
                    onIs24hChange={setIs24h}
                    onOpenTimeChange={setOpenTime}
                    onCloseTimeChange={setCloseTime}
                    onIsAllDaysChange={setIsAllDays}
                    onDaysOfWeekChange={setDaysOfWeek}
                />
            </section>

            {/* Contacto */}
            <section className="bg-white border border-gray-200 rounded-xl p-5">
                <ContactInfo
                    name={contactName}
                    phone={contactPhone}
                    onNameChange={setContactName}
                    onPhoneChange={setContactPhone}
                />
            </section>

            {/* Foto */}
            <section className="bg-white border border-gray-200 rounded-xl p-5">
                <PhotoUpload onFileChange={setPhotoFile} />
            </section>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Registrando...
                        </span>
                    ) : (
                        'Registrar centro de acopio'
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-text font-medium px-6 py-3 rounded-xl text-base transition-colors"
                >
                    Regresar al mapa
                </button>
            </div>
        </form>
    );
}
