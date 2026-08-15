// src/components/EspacioCard.jsx
function IconoAuto() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h.5a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-3.5A1.5 1.5 0 0 1 4.5 11H5zm1.9-.5h10.2l-1-3H7.9l-1 3zM7 16.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
  );
}

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
      <span className="espacio-icono">
        {estado === "ocupado" ? <IconoAuto /> : null}
      </span>
      <span className="espacio-texto">
        <span className="id">
          C{espacio.columna}-{String(espacio.numero).padStart(2, "0")}
        </span>
        <span className="distancia">
          {espacio.distanciaDetectada != null
            ? `${espacio.distanciaDetectada.toFixed(1)} cm`
            : "s/d"}
        </span>
      </span>
    </button>
  );
}