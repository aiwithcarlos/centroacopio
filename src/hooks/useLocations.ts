import useSWR from 'swr';
import type { Country, State, City } from '@/lib/types/center';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Error al cargar ubicaciones');
    return res.json();
  });

export function useCountries() {
  const { data, error, isLoading } = useSWR<Country[]>(
    '/api/locations/countries',
    fetcher,
    {
      dedupingInterval: 300000, // 5 min, los países no cambian
      revalidateOnFocus: false,
    }
  );

  return {
    countries: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useStates(countryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR<State[]>(
    countryId ? `/api/locations/states?country_id=${countryId}` : null,
    fetcher,
    {
      dedupingInterval: 300000,
      revalidateOnFocus: false,
    }
  );

  return {
    states: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useCities(stateId: string | null | undefined) {
  const { data, error, isLoading } = useSWR<City[]>(
    stateId ? `/api/locations/cities?state_id=${stateId}` : null,
    fetcher,
    {
      dedupingInterval: 300000,
      revalidateOnFocus: false,
    }
  );

  return {
    cities: data || [],
    isLoading,
    isError: !!error,
  };
}
