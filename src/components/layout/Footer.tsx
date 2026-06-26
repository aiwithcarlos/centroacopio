import { EMERGENCY_CONTACTS } from '@/lib/constants/emergency';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-text text-center mb-6">
          Números de Emergencia
        </h2>
        <p className="text-center text-text-muted text-sm mb-6">
          Reporta y comunícate con las líneas oficiales 📞 🇻🇪
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((region) => (
            <div
              key={region.region}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <h3 className="font-semibold text-sm text-text mb-3 flex items-center gap-1.5">
                <span>{region.icon}</span>
                {region.region}
              </h3>
              <ul className="space-y-2">
                {region.numbers.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-text-muted flex-shrink-0">
                      {item.name}
                    </span>
                    <a
                      href={`tel:${item.phone.replace(/[()\-\s]/g, '')}`}
                      className="font-mono font-medium text-primary hover:underline whitespace-nowrap text-right"
                    >
                      {item.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-text-muted text-xs mt-8">
          CAV Centro Acopio Venezuela &copy; {new Date().getFullYear()} — Información para ayuda humanitaria
        </p>
      </div>
    </footer>
  );
}
