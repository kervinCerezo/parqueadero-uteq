// src/pages/Estacionamiento.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useEspacios from "../hooks/useEspacios";
import ResumenEstacionamiento from "../components/ResumenEstacionamiento";
import CuadriculaEstacionamiento from "../components/CuadriculaEstacionamiento";
import FiltrosEspacios from "../components/FiltrosEspacios";
import MapaEstacionamiento from "../components/MapaEstacionamiento";
import { sembrarEspacios } from "../services/simulador";

export default function Estacionamiento() {
  const { espacios, cargando, resumen } = useEspacios({ simular: true });
  const [columnaActiva, setColumnaActiva] = useState("todas");
  const [estadoActivo, setEstadoActivo] = useState("todos");
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [sembrando, setSembrando] = useState(false);

  const handleSembrar = async () => {
    setSembrando(true);
    try {
      await sembrarEspacios();
    } finally {
      setSembrando(false);
    }
  };

  if (cargando) {
    return <p style={{ padding: 40 }}>Conectando con Firebase Realtime Database…</p>;
  }

  if (espacios.length === 0) {
    return (
      <div className="panel" style={{ marginTop: 30, textAlign: "center" }}>
        <h3>Todavía no hay espacios en la base de datos</h3>
        <p style={{ color: "var(--texto-suave)", margin: "10px 0 18px" }}>
          Genera los 80 sensores iniciales (4 columnas × 20 espacios) y guárdalos
          en Firebase para empezar la simulación.
        </p>
        <button className="boton" onClick={handleSembrar} disabled={sembrando}>
          {sembrando ? "Sembrando…" : "Sembrar 80 espacios en Firebase"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <ResumenEstacionamiento resumen={resumen} />

      <div className="layout-estacionamiento">
        <div className="panel">
          <div className="panel-encabezado">
            <h3>Vista operativa</h3>
            <div className="leyenda">
              <span><span className="punto libre" />Libre</span>
              <span><span className="punto ocupado" />Ocupado</span>
              <span><span className="punto sin-datos" />Sin información</span>
            </div>
          </div>

          <FiltrosEspacios
            columnaActiva={columnaActiva}
            estadoActivo={estadoActivo}
            onCambiarColumna={setColumnaActiva}
            onCambiarEstado={setEstadoActivo}
          />

          <CuadriculaEstacionamiento
            espacios={espacios}
            columnaActiva={columnaActiva}
            estadoActivo={estadoActivo}
            espacioSeleccionado={espacioSeleccionado}
            onSeleccionar={setEspacioSeleccionado}
          />
        </div>

        <div className="panel detalle-panel">
          <h3 style={{ marginBottom: 14 }}>Espacio seleccionado</h3>
          {!espacioSeleccionado ? (
            <p className="placeholder">Toca un espacio de la cuadrícula para ver su detalle.</p>
          ) : (
            <>
              <div className="mono" style={{ fontSize: 13, color: "var(--texto-suave)" }}>
                {espacioSeleccionado.id}
              </div>
              <span className={`estado-chip ${espacioSeleccionado.estado}`}>
                {espacioSeleccionado.estado}
              </span>
              <div className="lectura">
                {espacioSeleccionado.distanciaDetectada?.toFixed(1)} cm
              </div>

              <dl>
                <dt>Columna</dt>
                <dd>{espacioSeleccionado.columna}</dd>
                <dt>Número</dt>
                <dd>{espacioSeleccionado.numero}</dd>
                <dt>Última lectura</dt>
                <dd>{new Date(espacioSeleccionado.fechaHora).toLocaleTimeString("es-EC")}</dd>
              </dl>

              <Link
                className="boton"
                style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                to={`/espacios/${espacioSeleccionado.id}`}
              >
                Ver historial completo
              </Link>
            </>
          )}

          <div style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 13, marginBottom: 10 }}>Ubicación</h3>
            <MapaEstacionamiento alto={160} />
            <div className="distribucion-destacada">
              <span className="numero">4 × 20</span>
              <span className="etiqueta">Distribución del parqueadero · 80 espacios</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}