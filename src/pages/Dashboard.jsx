import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setUser({ nombre: "Jugador" });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToGame = () => {
    navigate("/juego");
  };

  return (
    <div className="dashboard">
      
      {/* HEADER */}
      <div className="header">
        <h2 className="title_dash">Dashboard</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </div>

      {/* BIENVENIDA */}
      <div className="welcome">
        <h3>Bienvenido {user?.nombre}</h3>
        <p>Selecciona un juego para comenzar</p>
      </div>

      {/* CONTENIDO */}
      <div className="container">

        {/* JUEGO */}
        <div className="card game-card" onClick={goToGame}>
          <h3>Completar palabras</h3>
          <p>Pon a prueba tu mente completando palabras</p>
          <button className="play-btn">Jugar</button>
        </div>

        {/* RESULTADOS */}
        <div className="card">
          <h3>Resultados</h3>
          <p>Consulta tu progreso</p>
        </div>

        {/* RANKING */}
        <div className="card">
          <h3>Ranking</h3>
          <p>Compite con otros jugadores</p>
        </div>

      </div>
    </div>
  );
}