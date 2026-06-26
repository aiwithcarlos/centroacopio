interface TotalCountProps {
  total: number;
  isLoading: boolean;
}

export default function TotalCount({ total, isLoading }: TotalCountProps) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold text-text">
        Centros de Acopio
      </h2>
      {isLoading ? (
        <span className="inline-block w-8 h-5 bg-gray-200 rounded animate-pulse" />
      ) : (
        <span className="inline-flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full w-6 h-6">
          {total}
        </span>
      )}
    </div>
  );
}
