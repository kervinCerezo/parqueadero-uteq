// src/services/simulador.js
//
// Genera los 80 espacios de estacionamiento y simula el comportamiento
// de los sensores: cada cierto tiempo, algunos sensores cambian su
// distancia detectada (y por lo tanto su estado), y ese cambio queda
// registrado en el historial.

import { celdaGeo, idEspacio, COLUMNAS, ESPACIOS_POR_COLUMNA } from "./geometria";
import { guardarEspacio, actualizarEspacio, agregarHistorial } from "./firebase";

const NOMBRE_UBICACION = "Parqueadero UTEQ";

export function calcularEstado(distanciaDetectada) {
  return distanciaDetectada <= 50 ? "ocupado" : "libre";
}

function distanciaAleatoria(estadoDeseado) {
  // ocupado: sensor detecta un vehículo cerca (0 - 50 cm)
  // libre: sensor no detecta nada cerca (51 - 400 cm)
  if (estadoDeseado === "ocupado") {
    return Math.round((Math.random() * 50) * 10) / 10;
  }
  return Math.round((51 + Math.random() * 349) * 10) / 10;
}

/**
 * Crea el objeto de un espacio individual. Por defecto, aproximadamente
 * el 45% de los espacios nace ocupado, evitando que todos tengan el
 * mismo estado (como pide el enunciado).
 */
export function crearEspacio(columna, numero) {
  const id = idEspacio(columna, numero);
  const { boundingBox, centro } = celdaGeo(columna, numero);
  const estadoInicial = Math.random() < 0.45 ? "ocupado" : "libre";
  const distanciaDetectada = distanciaAleatoria(estadoInicial);

  return {
    id,
    columna,
    numero,
    ubicacion: {
      nombre: NOMBRE_UBICACION,
      latitud: centro.lat,
      longitud: centro.lng,
      boundingBox,
    },
    distanciaDetectada,
    estado: calcularEstado(distanciaDetectada),
    fechaHora: Date.now(),
  };
}

export function generarEspaciosIniciales() {
  const espacios = [];
  for (let columna = 1; columna <= COLUMNAS; columna++) {
    for (let numero = 1; numero <= ESPACIOS_POR_COLUMNA; numero++) {
      espacios.push(crearEspacio(columna, numero));
    }
  }
  return espacios;
}

/**
 * Escribe los 80 espacios en Firebase RTDB (nodo "espacios") y crea la
 * primera entrada de historial para cada uno. Se usa una sola vez para
 * "sembrar" la base de datos vacía.
 */
export async function sembrarEspacios() {
  const espacios = generarEspaciosIniciales();
  for (const espacio of espacios) {
    await guardarEspacio(espacio);
    await agregarHistorial(espacio.id, {
      distanciaDetectada: espacio.distanciaDetectada,
      estado: espacio.estado,
      fechaHora: espacio.fechaHora,
    });
  }
  return espacios;
}

/**
 * Simula la lectura de un sensor: genera una nueva distancia (con una
 * probabilidad de cambiar de estado) y la guarda en Firebase, junto con
 * su registro en el historial.
 */
export async function simularLecturaSensor(espacio) {
  const cambiaEstado = Math.random() < 0.5;
  const nuevoEstado = cambiaEstado
    ? espacio.estado === "libre"
      ? "ocupado"
      : "libre"
    : espacio.estado;

  const distanciaDetectada = distanciaAleatoria(nuevoEstado);
  const estado = calcularEstado(distanciaDetectada);
  const fechaHora = Date.now();

  await actualizarEspacio(espacio.id, { distanciaDetectada, estado, fechaHora });
  await agregarHistorial(espacio.id, { distanciaDetectada, estado, fechaHora });

  return { ...espacio, distanciaDetectada, estado, fechaHora };
}

/**
 * Inicia una simulación periódica: cada `intervaloMs`, elige entre
 * `minCambios` y `maxCambios` espacios al azar de la lista actual y
 * simula una nueva lectura de sensor para cada uno.
 * Devuelve una función para detener la simulación (clearInterval).
 */
export function iniciarSimulacionPeriodica(
  obtenerEspaciosActuales,
  { intervaloMs = 3000, minCambios = 2, maxCambios = 6 } = {}
) {
  const id = setInterval(() => {
    const espacios = obtenerEspaciosActuales();
    if (!espacios || espacios.length === 0) return;

    const cantidad =
      minCambios + Math.floor(Math.random() * (maxCambios - minCambios + 1));
    const elegidos = [...espacios]
      .sort(() => Math.random() - 0.5)
      .slice(0, cantidad);

    elegidos.forEach((espacio) => {
      simularLecturaSensor(espacio).catch((err) =>
        console.error("Error simulando sensor", espacio.id, err)
      );
    });
  }, intervaloMs);

  return () => clearInterval(id);
}
