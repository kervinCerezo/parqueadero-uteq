// src/components/FiltrosEspacios.jsx
const COLUMNAS = [1, 2, 3, 4];
const ESTADOS = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "libre", etiqueta: "Libres" },
  { valor: "ocupado", etiqueta: "Ocupados" },
];

export default function FiltrosEspacios({
  columnaActiva,
  estadoActivo,
  onCambiarColumna,
  onCambiarEstado,
}) {
  return (
    <div className="filtros">
      <div className="filtro-grupo">
        <button
          className={`filtro-btn ${columnaActiva === "todas" ? "activo" : ""}`}
          onClick={() => onCambiarColumna("todas")}
        >
          Todas
        </button>
        {COLUMNAS.map((col) => (
          <button
            key={col}
            className={`filtro-btn ${columnaActiva === col ? "activo" : ""}`}
            onClick={() => onCambiarColumna(col)}
          >
            Col {col}
          </button>
        ))}
      </div>

      <div className="filtro-grupo">
        {ESTADOS.map((e) => (
          <button
            key={e.valor}
            className={`filtro-btn ${estadoActivo === e.valor ? "activo" : ""}`}
            onClick={() => onCambiarEstado(e.valor)}
          >
            {e.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}
