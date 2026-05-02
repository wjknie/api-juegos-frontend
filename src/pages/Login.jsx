import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={(e) => setContrasena(e.target.value)} />
        <button>Ingresar</button>
      </form>

      <p onClick={() => navigate("/register")} style={{cursor: "pointer"}}>
        Ir a registro
      </p>
    </div>
  );
}