'use client';

import { useState } from 'react';

interface ReportButtonProps {
  centerId: string;
  initialReportCount: number;
}

export default function ReportButton({ centerId, initialReportCount }: ReportButtonProps) {
  const [reportCount, setReportCount] = useState(initialReportCount);
  const [reported, setReported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`reported_${centerId}`) === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async () => {
    if (reported || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/centers/${centerId}/report`, {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setReportCount(data.report_count);
        setReported(true);
        localStorage.setItem(`reported_${centerId}`, 'true');
      } else if (res.status === 429) {
        // Ya reportó en 24h
        setReportCount(data.report_count);
        setReported(true);
        localStorage.setItem(`reported_${centerId}`, 'true');
      } else {
        setError(data.error || 'Error al reportar');
      }
    } catch {
      setError('Error de conexión al reportar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <p className="text-sm text-amber-800 mb-3">
        {reportCount > 0 ? (
          <>
            <strong>{reportCount}</strong> persona{reportCount !== 1 ? 's' : ''} ha
            {reportCount !== 1 ? 'n' : ''} reportado este centro como inhabilitado.
          </>
        ) : (
          <>Este centro de acopio no tiene reportes de inhabilitación.</>
        )}
      </p>
      {reportCount > 0 && (
        <p className="text-xs text-amber-600 mb-3">
          Esta información te ayuda a saber si el centro aún está activo.
        </p>
      )}
      <button
        onClick={handleReport}
        disabled={reported || loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          reported
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow'
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Reportando...
          </span>
        ) : reported ? (
          '✓ Reportado como inhabilitado'
        ) : (
          'Reportar como inhabilitado'
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
