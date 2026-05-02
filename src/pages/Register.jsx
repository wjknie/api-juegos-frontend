import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    grupo_edad: "",
    tipo_usuario: "",
    correo: "",
    contrasena: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

    const handleRegister = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
          }
        );

        const data = await res.json();

        if (!res.ok) {
        alert(data.error || "Error en registro");
        return;
        }

        alert("Usuario creado");
        navigate("/");

    } catch (error) {
        alert("Error de conexión con el servidor");
    }
    };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required/>
        <input name="grupo_edad" placeholder="Edad" onChange={handleChange} required/>
        <select
            name="tipo_usuario"
            value={form.tipo_usuario || ""}
            onChange={handleChange}
            required
            >
            <option value="" disabled>Tipo de usuario</option>
            <option value="Normal">Normal</option>
            <option value="Administrador">Administrador</option>
            </select>
        <input name="correo" placeholder="Correo" onChange={handleChange} required/>
        <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required/>
        <button>Registrarse</button>
      </form>
    </div>
  );
}