// src/services/firebase.js
//
// La configuración se lee desde variables de entorno (archivo .env en la
// raíz del proyecto, ver .env.example). Así las credenciales no quedan
// escritas directamente en el código fuente ni se suben a GitHub
// (.env está en .gitignore).

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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
