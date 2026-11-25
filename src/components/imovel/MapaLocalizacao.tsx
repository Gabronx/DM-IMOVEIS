/**
 * Mapa do Google com a localização APROXIMADA do imóvel.
 * Com coordenadas, elas são arredondadas (~150 m) e um círculo indica a região.
 * Sem coordenadas (imóveis cadastrados no painel sem latitude/longitude),
 * o mapa mostra o bairro.
 *
 * Com NEXT_PUBLIC_GOOGLE_MAPS_KEY usa a Maps Embed API oficial; sem a chave,
 * usa o embed público do Google Maps (o mesmo tipo de mapa do site atual).
 */
export default function MapaLocalizacao({
  lat,
  lng,
  rotulo,
}: {
  lat: number | null;
  lng: number | null;
  rotulo: string;
}) {
  const chave = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const temCoordenadas = lat != null && lng != null;
  let src: string;

  if (temCoordenadas) {
    const aLat = Math.round(lat * 700) / 700;
    const aLng = Math.round(lng * 700) / 700;
    src = chave
      ? `https://www.google.com/maps/embed/v1/view?key=${chave}&center=${aLat},${aLng}&zoom=15&maptype=roadmap&language=pt-BR`
      : `https://maps.google.com/maps?ll=${aLat},${aLng}&z=15&t=m&hl=pt-BR&output=embed`;
  } else {
    const q = encodeURIComponent(rotulo);
    src = chave
      ? `https://www.google.com/maps/embed/v1/place?key=${chave}&q=${q}&zoom=14&language=pt-BR`
      : `https://maps.google.com/maps?q=${q}&z=14&t=m&hl=pt-BR&output=embed`;
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] border border-line bg-mist sm:aspect-[16/8]">
      <iframe
        src={src}
        title={`Mapa da região do imóvel: ${rotulo}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full grayscale-[35%]"
      />
      {temCoordenadas && (
        // Círculo de região aproximada
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-gold/15"
        />
      )}
    </div>
  );
}
