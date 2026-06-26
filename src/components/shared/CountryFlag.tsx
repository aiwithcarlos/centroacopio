export default function CountryFlag({ iso2, className = '' }: { iso2: string; className?: string }) {
  // Renderizar bandera como emoji de bandera regional
  const flagEmoji = iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65));

  return (
    <span className={className} role="img" aria-label={`Bandera de ${iso2}`}>
      {flagEmoji}
    </span>
  );
}
