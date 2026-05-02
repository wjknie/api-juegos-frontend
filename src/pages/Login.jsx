import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css"
import loginImg from "../assets/register_pro.png";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert("Error en login");
    }
  };

  return (
    <div className="login-wrapper">

      <div className="login-left">
        <img src={loginImg} alt="juegos mentales" />
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar sesión</h2>

          <form onSubmit={handleLogin}>
            <input
              placeholder="Correo electrónico"
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            <button type="submit">Ingresar</button>
          </form>

          <p className="register-link">
            ¿No tienes cuenta?{" "}
            <span onClick={() => navigate("/register")}>
              Crear cuenta
            </span>
          </p>
        </div>
      </div>

    </div>
  );
}