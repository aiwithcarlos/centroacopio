import useSWR from 'swr';
import type { PaginatedResponse } from '@/lib/types/api';

interface CenterFilters {
  country_id?: string | null;
  state_id?: string | null;
  city_id?: string | null;
  lat?: number | null;
  lng?: number | null;
  page?: number;
  limit?: number;
}

const fetcher = (url: string): Promise<PaginatedResponse> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Error al cargar los centros');
    return res.json();
  });

export function useCenters(filters: CenterFilters) {
  const params = new URLSearchParams();
  if (filters.country_id) params.set('country_id', filters.country_id);
  if (filters.state_id) params.set('state_id', filters.state_id);
  if (filters.city_id) params.set('city_id', filters.city_id);
  if (filters.lat != null && filters.lat !== undefined)
    params.set('lat', String(filters.lat));
  if (filters.lng != null && filters.lng !== undefined)
    params.set('lng', String(filters.lng));
  params.set('page', String(filters.page || 1));
  params.set('limit', String(filters.limit || 12));

  const queryString = params.toString();
  const key = `/api/centers?${queryString}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, {
    dedupingInterval: 30000,
    revalidateOnFocus: true,
    refreshInterval: 60000,
  });

  return {
    centers: data?.centers || [],
    pagination: data?.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 },
    isLoading,
    isValidating,
    isError: !!error,
    mutate,
  };
}
