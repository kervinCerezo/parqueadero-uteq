// src/services/firebase.js
//
// IMPORTANTE: reemplaza los valores de firebaseConfig con los de TU
// proyecto (Firebase Console > Configuración del proyecto > Tus apps > SDK).
// Nunca subas tus credenciales reales de un proyecto de producción a un
// repositorio público sin restringir las reglas de la base de datos.

import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  get,
  child,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCIbTKo2fgN-sHRECp2JQEXvtUdkHZ-6FI",
  authDomain: "estacionamiento-99c64.firebaseapp.com",
  databaseURL: "https://estacionamiento-99c64-default-rtdb.firebaseio.com",
  projectId: "estacionamiento-99c64",
  storageBucket: "estacionamiento-99c64.firebasestorage.app",
  messagingSenderId: "818079996119",
  appId: "1:818079996119:web:ba9c7222723979fe083892"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// ---- Rutas de la base de datos ----
export const rutaEspacios = () => ref(db, "espacios");
export const rutaEspacio = (id) => ref(db, `espacios/${id}`);
export const rutaHistorialEspacio = (id) => ref(db, `historial/${id}`);

// ---- Lectura en tiempo real ----
export function suscribirseAEspacios(callback) {
  return onValue(rutaEspacios(), (snapshot) => {
    const data = snapshot.val() || {};
    callback(Object.values(data));
  });
}

export function suscribirseAEspacio(id, callback) {
  return onValue(rutaEspacio(id), (snapshot) => {
    callback(snapshot.val());
  });
}

export function suscribirseAHistorial(id, callback) {
  return onValue(rutaHistorialEspacio(id), (snapshot) => {
    const data = snapshot.val() || {};
    // Convertimos el objeto { timestamp: {...} } en un arreglo ordenado
    const lista = Object.entries(data)
      .map(([timestamp, valor]) => ({ timestamp: Number(timestamp), ...valor }))
      .sort((a, b) => a.timestamp - b.timestamp);
    callback(lista);
  });
}

// ---- Escritura ----
export async function guardarEspacio(espacio) {
  await set(rutaEspacio(espacio.id), espacio);
}

export async function actualizarEspacio(id, cambios) {
  await update(rutaEspacio(id), cambios);
}

export async function agregarHistorial(id, entrada) {
  await set(child(rutaHistorialEspacio(id), String(entrada.fechaHora)), entrada);
}

export async function obtenerEspaciosUnaVez() {
  const snapshot = await get(rutaEspacios());
  const data = snapshot.val() || {};
  return Object.values(data);
}
