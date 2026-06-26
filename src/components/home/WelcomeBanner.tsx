export default function WelcomeBanner() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
      <h1 className="text-xl sm:text-2xl font-bold text-text mb-2">
        Bienvenido a Centro de Acopio
      </h1>
      <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        Un servicio web destinado a otorgarte información sobre los diferentes
        centros de acopio registrados a nivel mundial a los cuales puedes llevar
        ayuda humanitaria para Venezuela.
      </p>
    </div>
  );
}
