import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/dashboard.css"

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <div class="header">
        <h2 class="title_dash">Dashboard</h2>
      </div>
      <p>Bienvenido, estás logueado</p>
      <div class="container">
          <div></div>
      </div>
    </div>
  );
}