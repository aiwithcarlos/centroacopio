'use client';

import { Suspense, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import Filters from '@/components/home/Filters';
import TotalCount from '@/components/home/TotalCount';
import CenterGrid from '@/components/home/CenterGrid';
import Pagination from '@/components/home/Pagination';
import { useCenters } from '@/hooks/useCenters';
import { useUrlParams } from '@/hooks/useUrlParams';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';

// Importar el mapa dinámicamente para evitar SSR (Leaflet usa window)
const CenterMap = dynamic(() => import('@/components/home/CenterMap'), {
    ssr: false,
    loading: () => (
        <div style={{ height: '450px' }} className="w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
            <LoadingSpinner />
        </div>
    ),
});

function HomeContent() {
    const { getParam, setParam, setMultipleParams } = useUrlParams();

    const countryId = getParam('country_id');
    const stateId = getParam('state_id');
    const cityId = getParam('city_id');
    const pageParam = getParam('page');
    const latParam = getParam('lat');
    const lngParam = getParam('lng');
    const page = pageParam ? parseInt(pageParam) : 1;

    const { centers, pagination, isLoading, isError, mutate } = useCenters({
        country_id: countryId,
        state_id: stateId,
        city_id: cityId,
        lat: latParam ? parseFloat(latParam) : null,
        lng: lngParam ? parseFloat(lngParam) : null,
        page,
        limit: 12,
    });

    const handleCountryChange = useCallback(
        (id: string | null) => {
            setMultipleParams({
                country_id: id,
                state_id: null,
                city_id: null,
            });
        },
        [setMultipleParams],
    );

    const handleStateChange = useCallback(
        (id: string | null) => {
            setMultipleParams({
                state_id: id,
                city_id: null,
            });
        },
        [setMultipleParams],
    );

    const handleCityChange = useCallback(
        (id: string | null) => {
            setParam('city_id', id);
        },
        [setParam],
    );

    const handleNearMe = useCallback(
        (lat: number, lng: number) => {
            setMultipleParams({
                lat: String(lat),
                lng: String(lng),
                country_id: null,
                state_id: null,
                city_id: null,
            });
        },
        [setMultipleParams],
    );

    const handlePageChange = useCallback(
        (newPage: number) => {
            setParam('page', String(newPage));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [setParam],
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Mensaje de bienvenida */}
            <WelcomeBanner />

            {/* Botón de registro */}
            <div className="flex justify-center">
                <Link
                    href="/registrar"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl text-base transition-all hover:shadow-lg no-underline"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Centro de Acopio
                </Link>
            </div>

            {/* Mapa */}
            <CenterMap centers={centers} />

            {/* Contador y filtros */}
            <div className="space-y-4">
                <TotalCount total={pagination.total} isLoading={isLoading} />

                <Filters
                    countryId={countryId}
                    stateId={stateId}
                    cityId={cityId}
                    onCountryChange={handleCountryChange}
                    onStateChange={handleStateChange}
                    onCityChange={handleCityChange}
                    onNearMe={handleNearMe}
                    nearMeLoading={false}
                />
            </div>

            {/* Mensaje de error */}
            {isError && (
                <ErrorMessage
                    message="No se pudieron cargar los centros de acopio."
                    onRetry={() => mutate()}
                />
            )}

            {/* Grid de centros */}
            {!isError && (
                <>
                    <CenterGrid centers={centers} isLoading={isLoading} />
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <LoadingSpinner />
                </div>
            }
        >
            <HomeContent />
        </Suspense>
    );
}
