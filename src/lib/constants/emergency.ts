export interface EmergencyContact {
  region: string;
  icon: string;
  numbers: { name: string; phone: string }[];
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    region: 'Líneas Nacionales',
    icon: '📍',
    numbers: [
      { name: 'VEN 911', phone: '911' },
      { name: 'Protección Civil', phone: '166' },
      { name: 'Bomberos', phone: '167' },
      { name: 'Sede Central PC', phone: '0800-7248451' },
    ],
  },
  {
    region: 'Caracas',
    icon: '🏙️',
    numbers: [
      { name: 'Bomberos', phone: '(0212) 545-4545' },
      { name: 'Protección Civil DC', phone: '(0212) 575-3332' },
    ],
  },
  {
    region: 'Carabobo (Epicentro)',
    icon: '🎯',
    numbers: [
      { name: 'Protección Civil', phone: '(0241) 859-2171' },
      { name: 'Bomberos Valencia', phone: '(0241) 838-7372' },
      { name: 'Bomberos Pto. Cabello', phone: '(0242) 362-2461' },
    ],
  },
  {
    region: 'La Guaira',
    icon: '🌊',
    numbers: [
      { name: 'Protección Civil', phone: '(0424) 207-5335' },
      { name: 'Bomberos', phone: '(0212) 332-2165' },
    ],
  },
  {
    region: 'Yaracuy',
    icon: '⛰️',
    numbers: [
      { name: 'Protección Civil', phone: '(0424) 781-7515' },
    ],
  },
];
