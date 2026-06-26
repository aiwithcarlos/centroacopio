'use client';

import { DAYS_OF_WEEK, TIME_OPTIONS } from '@/lib/constants/days';

interface ScheduleSelectorProps {
  is24h: boolean;
  openTime: string;
  closeTime: string;
  isAllDays: boolean;
  daysOfWeek: number[];
  onIs24hChange: (val: boolean) => void;
  onOpenTimeChange: (val: string) => void;
  onCloseTimeChange: (val: string) => void;
  onIsAllDaysChange: (val: boolean) => void;
  onDaysOfWeekChange: (days: number[]) => void;
}

export default function ScheduleSelector({
  is24h,
  openTime,
  closeTime,
  isAllDays,
  daysOfWeek,
  onIs24hChange,
  onOpenTimeChange,
  onCloseTimeChange,
  onIsAllDaysChange,
  onDaysOfWeekChange,
}: ScheduleSelectorProps) {
  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      onDaysOfWeekChange(daysOfWeek.filter((d) => d !== day));
    } else {
      onDaysOfWeekChange([...daysOfWeek, day].sort());
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-text">Horario de atención</h3>

      {/* Toggle 24h */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={is24h}
            onChange={(e) => onIs24hChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
        </div>
        <span className="text-sm font-medium text-text">24 horas</span>
      </label>

      {/* Horario personalizado */}
      {!is24h && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-muted">Desde</label>
            <select
              value={openTime}
              onChange={(e) => onOpenTimeChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-muted">Hasta</label>
            <select
              value={closeTime}
              onChange={(e) => onCloseTimeChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Días */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isAllDays}
            onChange={(e) => onIsAllDaysChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
        </div>
        <span className="text-sm font-medium text-text">Todos los días</span>
      </label>

      {/* Días específicos */}
      {!isAllDays && (
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = daysOfWeek.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-muted border-gray-200 hover:border-primary/40'
                }`}
                title={day.label}
              >
                {day.short}
              </button>
            );
          })}
        </div>
      )}

      {!isAllDays && daysOfWeek.length > 0 && (
        <p className="text-xs text-text-muted">
          {daysOfWeek
            .sort()
            .map((d) => DAYS_OF_WEEK.find((x) => x.value === d)?.label)
            .join(', ')}
        </p>
      )}
    </div>
  );
}
