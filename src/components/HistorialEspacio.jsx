// src/components/HistorialEspacio.jsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function formatearHora(ts) {
  return new Date(ts).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function HistorialEspacio({ historial }) {
  if (!historial || historial.length === 0) {
    return <p className="placeholder">Todavía no hay lecturas registradas para este espacio.</p>;
  }

  const datosGrafico = historial.map((h) => ({
    hora: formatearHora(h.fechaHora ?? h.timestamp),
    distancia: h.distanciaDetectada,
  }));

  return (
    <div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dfe7e2" />
            <XAxis dataKey="hora" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit="cm" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="distancia"
              stroke="#1f7a4d"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Fecha y hora</th>
            <th>Distancia</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {[...historial]
            .reverse()
            .map((h) => (
              <tr key={h.fechaHora ?? h.timestamp}>
                <td>{new Date(h.fechaHora ?? h.timestamp).toLocaleString("es-EC")}</td>
                <td>{h.distanciaDetectada?.toFixed(1)} cm</td>
                <td>{h.estado}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
