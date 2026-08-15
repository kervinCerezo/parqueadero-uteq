// src/components/ResumenEstacionamiento.jsx
export default function ResumenEstacionamiento({ resumen }) {
  const { total, libres, ocupados, porcentajeDisponible } = resumen;

  return (
    <div className="resumen-grid">
      <div className="tarjeta-resumen">
        <div className="etiqueta">Total de espacios</div>
        <div className="numero">{total}</div>
      </div>
      <div className="tarjeta-resumen libres">
        <div className="etiqueta">Espacios libres</div>
        <div className="numero">{libres}</div>
      </div>
      <div className="tarjeta-resumen ocupados">
        <div className="etiqueta">Espacios ocupados</div>
        <div className="numero">{ocupados}</div>
      </div>
      <div className="tarjeta-resumen">
        <div className="etiqueta">Disponibilidad</div>
        <div className="numero">{porcentajeDisponible.toFixed(0)}%</div>
        <div className="barra-disponibilidad">
          <div style={{ width: `${porcentajeDisponible}%` }} />
        </div>
      </div>
    </div>
  );
}
