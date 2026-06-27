interface TotalCountProps {
  total: number;
  isLoading: boolean;
}

export default function TotalCount({ total, isLoading }: TotalCountProps) {
  return (
    <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-400 rounded-xl px-5 py-3">
      <span className="text-lg font-bold text-green-800">
        Centros de Acopio
      </span>
      {isLoading ? (
        <span className="inline-block w-10 h-7 bg-green-200 rounded animate-pulse" />
      ) : (
        <span
          className="text-2xl font-bold text-green-700"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
        >
          {total}
        </span>
      )}
    </div>
  );
}
