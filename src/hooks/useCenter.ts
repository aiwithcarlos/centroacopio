import useSWR from 'swr';
import type { CenterDetail } from '@/lib/types/center';

const fetcher = (url: string): Promise<CenterDetail> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Centro no encontrado');
    return res.json();
  });

export function useCenter(id: string | null) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/centers/${id}` : null,
    fetcher,
    {
      dedupingInterval: 30000,
    }
  );

  return {
    center: data || null,
    isLoading,
    isError: !!error,
  };
}
