// src/App.jsx
import { NavLink, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Estacionamiento from "./pages/Estacionamiento";
import DetalleEspacio from "./pages/DetalleEspacio";

export default function App() {
  return (
    <div className="app-shell">
      <nav className="barra-nav">
        <div className="marca">
          <span className="insignia">U</span>
          UTEQ Smart Parking
        </div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "activo" : "")}>
            Inicio
          </NavLink>
          <NavLink to="/estacionamiento" className={({ isActive }) => (isActive ? "activo" : "")}>
            Parqueadero
          </NavLink>
        </div>
        <div className="estado-rtdb">
          <span className="pulso" />
          RTDB en vivo
        </div>
      </nav>

      <div className="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/estacionamiento" element={<Estacionamiento />} />
          <Route path="/espacios/:id" element={<DetalleEspacio />} />
        </Routes>
      </div>
    </div>
  );
}
