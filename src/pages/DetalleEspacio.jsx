// src/pages/DetalleEspacio.jsx
import { Link, useParams } from "react-router-dom";
import useHistorialEspacio from "../hooks/useHistorialEspacio";
import HistorialEspacio from "../components/HistorialEspacio";
import MapaEstacionamiento from "../components/MapaEstacionamiento";

export default function DetalleEspacio() {
  const { id } = useParams();
  const { espacio, historial, cargando } = useHistorialEspacio(id);

  if (cargando) {
    return <p style={{ padding: 40 }}>Cargando espacio…</p>;
  }

  if (!espacio) {
    return (
      <div className="panel" style={{ marginTop: 30, textAlign: "center" }}>
        <h3>No se encontró el espacio {id}</h3>
        <Link className="boton secundario" to="/estacionamiento" style={{ marginTop: 14 }}>
          Volver al estacionamiento
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="detalle-encabezado">
        <div>
          <Link className="volver" to="/estacionamiento">← Volver al estacionamiento</Link>
          <h1 className="mono" style={{ fontSize: 26, marginTop: 6 }}>{espacio.id}</h1>
        </div>
        <span className={`estado-chip ${espacio.estado}`}>{espacio.estado}</span>
      </div>

      <div className="detalle-grid">
        <div className="panel">
          <h3>Ficha del espacio</h3>
          <div className="ficha-datos">
            <div className="fila"><span>Columna</span><span>{espacio.columna}</span></div>
            <div className="fila"><span>Número</span><span>{espacio.numero}</span></div>
            <div className="fila">
              <span>Distancia detectada</span>
              <span>{espacio.distanciaDetectada?.toFixed(1)} cm</span>
            </div>
            <div className="fila">
              <span>Última actualización</span>
              <span>{new Date(espacio.fechaHora).toLocaleString("es-EC")}</span>
            </div>
            <div className="fila">
              <span>Ubicación</span>
              <span>{espacio.ubicacion?.nombre}</span>
            </div>
            <div className="fila">
              <span>Lat / Lng centro</span>
              <span>
                {espacio.ubicacion?.latitud.toFixed(6)}, {espacio.ubicacion?.longitud.toFixed(6)}
              </span>
            </div>
            <div className="fila">
              <span>Bounding box (N/S)</span>
              <span>
                {espacio.ubicacion?.boundingBox.norte.toFixed(6)} / {espacio.ubicacion?.boundingBox.sur.toFixed(6)}
              </span>
            </div>
            <div className="fila">
              <span>Bounding box (O/E)</span>
              <span>
                {espacio.ubicacion?.boundingBox.oeste.toFixed(6)} / {espacio.ubicacion?.boundingBox.este.toFixed(6)}
              </span>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <MapaEstacionamiento
              latitud={espacio.ubicacion?.latitud}
              longitud={espacio.ubicacion?.longitud}
              alto={180}
            />
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: 14 }}>Historial de cambios</h3>
          <HistorialEspacio historial={historial} />
        </div>
      </div>
    </div>
  );
}
