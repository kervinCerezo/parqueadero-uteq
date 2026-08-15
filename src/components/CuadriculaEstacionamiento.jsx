// src/components/CuadriculaEstacionamiento.jsx
import EspacioCard from "./EspacioCard";

export default function CuadriculaEstacionamiento({
  espacios,
  columnaActiva,
  estadoActivo,
  espacioSeleccionado,
  onSeleccionar,
}) {
  const columnas = [1, 2, 3, 4];

  const pasaFiltro = (espacio) => {
    const pasaColumna = columnaActiva === "todas" || espacio.columna === columnaActiva;
    const pasaEstado = estadoActivo === "todos" || espacio.estado === estadoActivo;
    return pasaColumna && pasaEstado;
  };

  return (
    <div className="cuadricula-columnas">
      {columnas.map((col) => {
        if (columnaActiva !== "todas" && columnaActiva !== col) return null;
        const espaciosColumna = espacios
          .filter((e) => e.columna === col)
          .sort((a, b) => a.numero - b.numero);

        return (
          <div key={col}>
            <div className="columna-titulo">Columna {col}</div>
            <div className="columna-espacios">
              {espaciosColumna.map((espacio) => {
                if (!pasaFiltro(espacio)) return null;
                return (
                  <EspacioCard
                    key={espacio.id}
                    espacio={espacio}
                    seleccionado={espacioSeleccionado?.id === espacio.id}
                    onSeleccionar={onSeleccionar}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
