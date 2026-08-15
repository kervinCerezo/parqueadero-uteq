// src/services/geometria.js
//
// Convierte el cuadrilátero real del terreno (4 esquinas GPS) en una
// cuadrícula de 4 columnas x 20 espacios, usando interpolación bilineal.
// Así cada espacio obtiene coordenadas realistas dentro del polígono
// real del parqueadero, en vez de un rectángulo lat/lon "perfecto".

// Esquinas tal como fueron entregadas en el documento del proyecto.
// El orden P1 -> P2 -> P3 -> P4 recorre el perímetro del terreno.
export const ESQUINAS = {
  P1: { lat: -1.0122617572453996, lng: -79.4682858877737 },
  P2: { lat: -1.0125032549290254, lng: -79.4682998912032 },
  P3: { lat: -1.012570971500396, lng: -79.46748620024898 },
  P4: { lat: -1.0123403901396444, lng: -79.46746240847104 },
};

export const BOUNDING_BOX_GENERAL = {
  norte: -1.0122617572453996,
  sur: -1.012570971500396,
  oeste: -79.4682998912032,
  este: -79.46746240847104,
};

export const COLUMNAS = 4;
export const ESPACIOS_POR_COLUMNA = 20;
export const TOTAL_ESPACIOS = COLUMNAS * ESPACIOS_POR_COLUMNA;

// Dimensiones calculadas en el documento del proyecto
export const DIMENSIONES = {
  largoPromedioM: 91.37,
  anchoPromedioM: 26.34,
  areaAproximadaM2: 2405.74,
  anchoPorColumnaM: 26.34 / COLUMNAS, // 6.58 m
  largoPorEspacioM: 91.37 / ESPACIOS_POR_COLUMNA, // 4.57 m
  areaPorCeldaM2: (26.34 / COLUMNAS) * (91.37 / ESPACIOS_POR_COLUMNA), // ~30.08 m2
};

// Interpolación bilineal: u recorre el ancho (columnas, P1->P2 / P4->P3),
// v recorre el largo (espacios por columna, P1->P4 / P2->P3).
function interpolar(u, v) {
  const { P1, P2, P3, P4 } = ESQUINAS;
  const lat =
    (1 - u) * (1 - v) * P1.lat +
    u * (1 - v) * P2.lat +
    u * v * P3.lat +
    (1 - u) * v * P4.lat;
  const lng =
    (1 - u) * (1 - v) * P1.lng +
    u * (1 - v) * P2.lng +
    u * v * P3.lng +
    (1 - u) * v * P4.lng;
  return { lat, lng };
}

/**
 * Calcula el bounding box y el centro de una celda (columna, numero).
 * columna: 1..4, numero: 1..20
 */
export function celdaGeo(columna, numero) {
  const uIni = (columna - 1) / COLUMNAS;
  const uFin = columna / COLUMNAS;
  const vIni = (numero - 1) / ESPACIOS_POR_COLUMNA;
  const vFin = numero / ESPACIOS_POR_COLUMNA;

  const esquinas = [
    interpolar(uIni, vIni),
    interpolar(uFin, vIni),
    interpolar(uFin, vFin),
    interpolar(uIni, vFin),
  ];

  const lats = esquinas.map((p) => p.lat);
  const lngs = esquinas.map((p) => p.lng);

  const boundingBox = {
    norte: Math.max(...lats),
    sur: Math.min(...lats),
    oeste: Math.min(...lngs),
    este: Math.max(...lngs),
  };

  const centro = interpolar((uIni + uFin) / 2, (vIni + vFin) / 2);

  return { boundingBox, centro };
}

export function idEspacio(columna, numero) {
  const col = String(columna).padStart(2, "0");
  const num = String(numero).padStart(2, "0");
  return `ESP-C${col}-${num}`;
}
