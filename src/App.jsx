import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JuegoPalabras from "./pages/JuegoPalabras";
import SopaLetras from "./pages/SopaLetras"; // <-- 1. Importamos la Sopa de Letras
import Ranking from "./pages/Ranking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/juego-palabras" element={<JuegoPalabras />} />
        
        {/* 2. Añadimos la ruta que llamará el Dashboard */}
        <Route path="/sopa-letras" element={<SopaLetras />} /> 
        
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;