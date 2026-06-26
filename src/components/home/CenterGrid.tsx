import type { CenterListItem } from '@/lib/types/center';
import CenterCard from './CenterCard';
import SkeletonCard from '@/components/shared/SkeletonCard';
import EmptyState from '@/components/shared/EmptyState';

interface CenterGridProps {
  centers: CenterListItem[];
  isLoading: boolean;
}

export default function CenterGrid({ centers, isLoading }: CenterGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (centers.length === 0) {
    return (
      <EmptyState
        title="No hay centros de acopio"
        description="No se encontraron centros de acopio para los filtros seleccionados. ¡Sé el primero en registrar uno!"
        actionLabel="+ Registrar Centro de Acopio"
        onAction={() => {
          window.location.href = '/registrar';
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {centers.map((center) => (
        <CenterCard key={center.id} center={center} />
      ))}
    </div>
  );
}
