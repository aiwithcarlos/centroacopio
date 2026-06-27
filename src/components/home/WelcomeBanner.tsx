export default function WelcomeBanner() {
  return (
    <div
      className="relative rounded-2xl p-6 sm:p-8 text-center shadow-sm overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF9E6 0%, #E8F0FE 50%, #FDE8E8 100%)',
      }}
    >
      {/* Borde decorativo con los colores de la bandera */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{
          background: 'linear-gradient(90deg, #FFD700 0%, #00247D 50%, #CF142B 100%)',
        }}
      />

      <h1 className="text-xl sm:text-2xl font-bold text-text mb-2 relative">
        Bienvenido a Centros de Acopio
      </h1>
      <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed relative">
        Un servicio web destinado a otorgarte información sobre los diferentes
        <b className="text-text"> centros de acopio</b> registrados a nivel mundial a los cuales puedes llevar
        ayuda humanitaria para <b className="text-text">Venezuela</b>.
      </p>
    </div>
  );
}
