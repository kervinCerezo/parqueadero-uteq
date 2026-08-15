// src/components/EspacioCard.jsx
export default function EspacioCard({ espacio, seleccionado, onSeleccionar }) {
  const estado = espacio?.estado || "sin-datos";
  const clase = ["espacio-celda", estado, seleccionado ? "seleccionado" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={clase}
      onClick={() => onSeleccionar(espacio)}
      title={`${espacio.id} · ${estado}`}
    >
      <span className="id">
        C{espacio.columna}-{String(espacio.numero).padStart(2, "0")}
      </span>
      <span className="distancia">
        {espacio.distanciaDetectada != null
          ? `${espacio.distanciaDetectada.toFixed(1)} cm`
          : "s/d"}
      </span>
    </button>
  );
}
