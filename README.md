# Parqueadero Inteligente UTEQ

Aplicación web (React + Vite) que simula un estacionamiento inteligente de
80 espacios (4 columnas × 20) ubicado en la UTEQ. Cada espacio está asociado
a un sensor simulado que escribe en tiempo real a **Firebase Realtime
Database**.

## Requisitos

- Node.js 18 o superior
- Una cuenta y proyecto de Firebase con **Realtime Database** habilitada

## 1. Instalación

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd parqueadero-uteq
npm install
```

## 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) → tu proyecto
   → ⚙️ **Configuración del proyecto** → pestaña **Tus apps** → app web (o
   crea una con el ícono `</>`).
2. Copia el objeto `firebaseConfig` que te entrega Firebase.
3. Pégalo en `src/services/firebase.js`, reemplazando los valores de
   ejemplo (`TU_API_KEY`, `TU_PROYECTO`, etc.).
4. En la sección **Realtime Database → Reglas**, para desarrollo puedes usar
   temporalmente:

   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

   > Para producción, restringe las reglas (por ejemplo, exigiendo
   > autenticación) antes de publicar el proyecto.

## 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre la URL que indica la terminal (por defecto `http://localhost:5173`).

## 4. Cargar los 80 espacios iniciales

Como tu Realtime Database está vacía, entra a la pestaña **Parqueadero**: la
app detecta que no hay datos y muestra un botón **"Sembrar 80 espacios en
Firebase"**. Al presionarlo:

- Se generan los 80 sensores (columna 1-4, número 1-20) con coordenadas
  reales calculadas por interpolación dentro del polígono del terreno
  (`src/services/geometria.js`).
- Se guardan en el nodo `espacios` de la RTDB.
- Se crea la primera entrada de `historial` para cada uno.

Desde ese momento, una simulación periódica (cada 8 segundos, ver
`src/services/simulador.js`) cambia la distancia/estado de varios sensores
al azar y registra cada cambio en el historial, tal como lo haría un sensor
ultrasónico real.

## 5. Estructura del proyecto

```
src/
├── components/
│   ├── ResumenEstacionamiento.jsx
│   ├── CuadriculaEstacionamiento.jsx
│   ├── EspacioCard.jsx
│   ├── FiltrosEspacios.jsx
│   ├── HistorialEspacio.jsx
│   └── MapaEstacionamiento.jsx
├── hooks/
│   ├── useEspacios.jsx
│   └── useHistorialEspacio.jsx
├── pages/
│   ├── Inicio.jsx
│   ├── Estacionamiento.jsx
│   └── DetalleEspacio.jsx
├── services/
│   ├── firebase.js       # inicialización y helpers de RTDB
│   ├── geometria.js      # cálculo de coordenadas de cada celda
│   └── simulador.js      # generación y simulación de sensores
├── App.jsx
└── main.jsx
```

## 6. Rutas

| Ruta                | Página                                    |
|----------------------|-------------------------------------------|
| `/`                  | Inicio: descripción del proyecto          |
| `/estacionamiento`   | Cuadrícula de 80 espacios + estadísticas  |
| `/espacios/:id`      | Detalle e historial de un espacio         |

## 7. Regla de estado del sensor

```js
const estado = distanciaDetectada <= 50 ? 'ocupado' : 'libre';
```

## 8. Build de producción

```bash
npm run build
npm run preview
```

## 9. Despliegue rápido (opcional)

El build generado en `dist/` puede publicarse en Firebase Hosting, Vercel o
Netlify sin configuración adicional.
