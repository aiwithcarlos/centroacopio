import type { Metadata } from 'next';
import RegistrationForm from '@/components/registrar/RegistrationForm';

export const metadata: Metadata = {
  title: 'Registrar Centro de Acopio | CAV',
  description: 'Registra un nuevo centro de acopio para ayuda humanitaria a Venezuela.',
};

export default function RegistrarPage() {
  // Token con timestamp del servidor para prevenir envíos instantáneos (bots)
  const timestampToken = String(Date.now());

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-text mb-1">
        Registrar Centro de Acopio
      </h1>
      <p className="text-text-muted text-sm mb-8">
        Completa la información para registrar un nuevo centro de acopio y ayudar
        a quienes más lo necesitan.
      </p>

      <RegistrationForm timestampToken={timestampToken} />
    </div>
  );
}
