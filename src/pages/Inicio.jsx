// src/pages/Inicio.jsx
import { Link } from "react-router-dom";
import { DIMENSIONES, TOTAL_ESPACIOS } from "../services/geometria";

export default function Inicio() {
  return (
    <div>
      <section className="hero">
        <div className="hero-texto">
          <div className="eyebrow">UTEQ · Facultad de Ciencias de la Ingeniería</div>
          <h1>Parqueadero inteligente</h1>
          <p>
            Simulación de {TOTAL_ESPACIOS} sensores ultrasónicos organizados en
            cuatro columnas. Cada movimiento en el patio se actualiza en tiempo
            real desde Firebase Realtime Database y queda registrado en el
            historial de cada espacio.
          </p>
          <Link className="boton" to="/estacionamiento">
            Ver estacionamiento en vivo →
          </Link>
        </div>

        <div className="hero-tarjeta">
          <div className="fila">
            <span>Regla de estado</span>
            <span>distancia ≤ 50 cm → ocupado</span>
          </div>
          <div className="fila">
            <span>Espacios totales</span>
            <span>{TOTAL_ESPACIOS}</span>
          </div>
          <div className="fila">
            <span>Distribución</span>
            <span>4 columnas × 20</span>
          </div>
          <div className="fila">
            <span>Fuente de datos</span>
            <span>Firebase RTDB</span>
          </div>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: 14 }}>Cálculo del terreno</h3>
        <div className="ficha-tecnica">
          <div className="item">
            <div className="valor">{DIMENSIONES.largoPromedioM} m</div>
            <div className="etiqueta">Largo promedio del terreno</div>
          </div>
          <div className="item">
            <div className="valor">{DIMENSIONES.anchoPromedioM} m</div>
            <div className="etiqueta">Ancho promedio del terreno</div>
          </div>
          <div className="item">
            <div className="valor">{DIMENSIONES.areaAproximadaM2} m²</div>
            <div className="etiqueta">Área aproximada total</div>
          </div>
          <div className="item">
            <div className="valor">{DIMENSIONES.anchoPorColumnaM.toFixed(2)} m</div>
            <div className="etiqueta">Ancho por columna</div>
          </div>
          <div className="item">
            <div className="valor">{DIMENSIONES.largoPorEspacioM.toFixed(2)} m</div>
            <div className="etiqueta">Largo por espacio</div>
          </div>
          <div className="item">
            <div className="valor">{DIMENSIONES.areaPorCeldaM2.toFixed(2)} m²</div>
            <div className="etiqueta">Superficie por celda</div>
          </div>
        </div>
      </section>
    </div>
  );
}
