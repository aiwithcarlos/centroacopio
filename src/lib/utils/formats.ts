import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es });
}

export function formatTime(time: string): string {
  // time is in "HH:mm" format, e.g. "14:00"
  const [hours, minutes] = time.split(':').map(Number);
  if (hours === 0) return `12:${String(minutes).padStart(2, '0')} AM`;
  if (hours < 12) return `${hours}:${String(minutes).padStart(2, '0')} AM`;
  if (hours === 12) return `12:${String(minutes).padStart(2, '0')} PM`;
  return `${hours - 12}:${String(minutes).padStart(2, '0')} PM`;
}

export function truncateAddress(address: string, maxLength = 60): string {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength).trimEnd() + '...';
}

export function formatDayOfWeek(day: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[day] ?? '';
}
