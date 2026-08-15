// src/hooks/useHistorialEspacio.jsx
import { useEffect, useState } from "react";
import { suscribirseAEspacio, suscribirseAHistorial } from "../services/firebase";

/**
 * Se suscribe en tiempo real a un espacio individual y a su historial
 * de cambios (nodo "historial/{id}").
 */
export default function useHistorialEspacio(id) {
  const [espacio, setEspacio] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
    setCargando(true);

    const detenerEspacio = suscribirseAEspacio(id, (valor) => {
      setEspacio(valor);
      setCargando(false);
    });
    const detenerHistorial = suscribirseAHistorial(id, (lista) => {
      setHistorial(lista);
    });

    return () => {
      detenerEspacio();
      detenerHistorial();
    };
  }, [id]);

  return { espacio, historial, cargando };
}
