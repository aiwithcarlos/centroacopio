'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import Filters from '@/components/home/Filters';
import TotalCount from '@/components/home/TotalCount';
import CenterGrid from '@/components/home/CenterGrid';
import Pagination from '@/components/home/Pagination';
import { useCenters } from '@/hooks/useCenters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';

const CenterMap = dynamic(() => import('@/components/home/CenterMap'), {
    ssr: false,
    loading: () => (
        <div style={{ height: '450px' }} className="w-full rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
            <LoadingSpinner />
        </div>
    ),
});

function HomeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Estado local — fuente de verdad para los selects
    const [countryId, setCountryId] = useState<string | null>(
        () => searchParams.get('country_id')
    );
    const [stateId, setStateId] = useState<string | null>(
        () => searchParams.get('state_id')
    );
    const [cityId, setCityId] = useState<string | null>(
        () => searchParams.get('city_id')
    );
    const [latParam, setLatParam] = useState<string | null>(
        () => searchParams.get('lat')
    );
    const [lngParam, setLngParam] = useState<string | null>(
        () => searchParams.get('lng')
    );
    const pageParam = searchParams.get('page');
    const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
    const [nearMeLoading, setNearMeLoading] = useState(false);
    // Coordenadas del usuario para re-centrar el mapa
    const [userLat, setUserLat] = useState<number | null>(null);
    const [userLng, setUserLng] = useState<number | null>(null);

    // Sincronizar estado → URL (un solo router.replace por cambio)
    useEffect(() => {
        const params = new URLSearchParams();
        if (countryId) params.set('country_id', countryId);
        if (stateId) params.set('state_id', stateId);
        if (cityId) params.set('city_id', cityId);
        if (latParam) params.set('lat', latParam);
        if (lngParam) params.set('lng', lngParam);
        if (page > 1) params.set('page', String(page));

        const qs = params.toString();
        const newUrl = qs ? `${pathname}?${qs}` : pathname;
        router.replace(newUrl, { scroll: false });
    }, [countryId, stateId, cityId, latParam, lngParam, page, router, pathname]);

    // Grid paginado
    const { centers, pagination, isLoading, isError, mutate } = useCenters({
        country_id: countryId,
        state_id: stateId,
        city_id: cityId,
        lat: latParam ? parseFloat(latParam) : null,
        lng: lngParam ? parseFloat(lngParam) : null,
        page,
        limit: 12,
    });

    // Mapa: todos los centros que coinciden con los filtros (sin paginación)
    const { centers: allCenters } = useCenters({
        country_id: countryId,
        state_id: stateId,
        city_id: cityId,
        lat: latParam ? parseFloat(latParam) : null,
        lng: lngParam ? parseFloat(lngParam) : null,
        page: 1,
        limit: 0, // 0 = sin límite
    });

    const handleCountryChange = useCallback((id: string | null) => {
        setCountryId(id);
        setStateId(null);
        setCityId(null);
        setLatParam(null);
        setLngParam(null);
    }, []);

    const handleStateChange = useCallback((id: string | null) => {
        setStateId(id);
        setCityId(null);
        setLatParam(null);
        setLngParam(null);
    }, []);

    const handleCityChange = useCallback((id: string | null) => {
        setCityId(id);
        setLatParam(null);
        setLngParam(null);
    }, []);

    const handleNearMeStart = useCallback(() => {
        setNearMeLoading(true);
    }, []);

    const handleNearMeError = useCallback(() => {
        setNearMeLoading(false);
    }, []);

    const handleNearMe = useCallback((lat: number, lng: number) => {
        setNearMeLoading(false);
        setLatParam(String(lat));
        setLngParam(String(lng));
        setCountryId(null);
        setStateId(null);
        setCityId(null);
        setUserLat(lat);
        setUserLng(lng);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <WelcomeBanner />

            <div className="flex justify-center">
                <Link
                    href="/registrar"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl text-base transition-all hover:shadow-lg no-underline"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Centro de Acopio
                </Link>
            </div>

            <CenterMap centers={allCenters} userLat={userLat} userLng={userLng} />

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
                    onNearMeStart={handleNearMeStart}
                    onNearMeError={handleNearMeError}
                />
            </div>

            {isError && (
                <ErrorMessage
                    message="No se pudieron cargar los centros de acopio."
                    onRetry={() => mutate()}
                />
            )}

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
