// src/hooks/useEspacios.jsx
import { useEffect, useRef, useState } from "react";
import { suscribirseAEspacios } from "../services/firebase";
import { iniciarSimulacionPeriodica } from "../services/simulador";

/**
 * Se suscribe en tiempo real al nodo "espacios" de Firebase RTDB y,
 * opcionalmente, arranca la simulación periódica de sensores.
 */
export default function useEspacios({ simular = true } = {}) {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const espaciosRef = useRef([]);

  useEffect(() => {
    const detenerSuscripcion = suscribirseAEspacios((lista) => {
      espaciosRef.current = lista;
      setEspacios(lista);
      setCargando(false);
    });

    let detenerSimulacion = () => {};
    if (simular) {
      detenerSimulacion = iniciarSimulacionPeriodica(() => espaciosRef.current);
    }

    return () => {
      detenerSuscripcion();
      detenerSimulacion();
    };
  }, [simular]);

  const total = espacios.length;
  const libres = espacios.filter((e) => e.estado === "libre").length;
  const ocupados = espacios.filter((e) => e.estado === "ocupado").length;
  const porcentajeDisponible = total > 0 ? (libres / total) * 100 : 0;

  return {
    espacios,
    cargando,
    resumen: { total, libres, ocupados, porcentajeDisponible },
  };
}
