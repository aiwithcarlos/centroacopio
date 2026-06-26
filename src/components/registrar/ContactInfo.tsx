'use client';

interface ContactInfoProps {
  name: string;
  phone: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
}

export default function ContactInfo({
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: ContactInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-text">Persona de contacto</h3>
      <p className="text-xs text-text-muted">
        Información de quien está a cargo o liderando los insumos (opcional)
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nombre de la persona de contacto"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text">Teléfono</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="+58 412 1234567"
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
    </div>
  );
}
