// src/components/MapaEstacionamiento.jsx
import { BOUNDING_BOX_GENERAL } from "../services/geometria";

export default function MapaEstacionamiento({ latitud, longitud, alto }) {
  const { norte, sur, oeste, este } = BOUNDING_BOX_GENERAL;
  const margen = 0.0006; // pequeño margen para que el polígono no toque el borde
  const bbox = [oeste - margen, sur - margen, este + margen, norte + margen].join(",");
  const centroLat = latitud ?? (norte + sur) / 2;
  const centroLng = longitud ?? (oeste + este) / 2;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centroLat},${centroLng}`;

  return (
    <div>
      <div className="mapa-contenedor" style={{ height: alto || 260 }}>
        <iframe title="Ubicación del parqueadero UTEQ" src={src} loading="lazy" />
      </div>
      <p className="mapa-caption">
        Facultad de Ciencias de la Ingeniería, UTEQ · {centroLat.toFixed(6)},{" "}
        {centroLng.toFixed(6)}
      </p>
    </div>
  );
}
