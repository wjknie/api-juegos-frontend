import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/game.css";

export default function JuegoPalabras() {
  const navigate = useNavigate();

  const [palabra, setPalabra] = useState("");
  const [definicion, setDefinicion] = useState("");
  const [categoria, setCategoria] = useState(""); // <-- Nuevo estado para la categoría
  const [input, setInput] = useState("");

  const [vidas, setVidas] = useState(5);
  const [puntos, setPuntos] = useState(0);

  const [mostrarDefinicion, setMostrarDefinicion] = useState(false);
  const [letrasDescubiertas, setLetrasDescubiertas] = useState([]);

  const cargarPalabra = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/palabra-random`
      );

      const data = await res.json();

      setPalabra(data.palabra);
      setDefinicion(data.definicion);
      setCategoria(data.categoria || "General"); // <-- Guardamos la categoría de inmediato

      setInput("");
      setMostrarDefinicion(false);
      setLetrasDescubiertas([]);
    } catch (error) {
      console.error(error);
      alert("Error cargando palabra");
    }
  };

  useEffect(() => {
    cargarPalabra();
  }, []);

  const palabraOculta = palabra
    .split("")
    .map((letra, index) =>
      letrasDescubiertas.includes(index)
        ? letra
        : "_"
    )
    .join(" ");

  const usarAyuda = () => {
    const ocultas = [];

    palabra.split("").forEach((_, index) => {
      if (!letrasDescubiertas.includes(index)) {
        ocultas.push(index);
      }
    });

    if (ocultas.length === 0) return;

    const random =
      ocultas[
        Math.floor(
          Math.random() * ocultas.length
        )
      ];

    const nuevasPosiciones = [...letrasDescubiertas, random];
    setLetrasDescubiertas(nuevasPosiciones);

    // Restar puntos por usar la ayuda
    setPuntos((prev) => Math.max(0, prev - 10));

    // REQUERIMIENTO: Si la ayuda completó la palabra, muestra descripción sin ganar puntos extra
    const completa = palabra
      .split("")
      .every((_, index) => nuevasPosiciones.includes(index));

    if (completa) {
      setMostrarDefinicion(true);
      setInput("");
    }
  };

  const verificar = () => {
    const respuesta = input.trim().toUpperCase();

    if (!respuesta) return;

    // Intento de palabra completa
    if (respuesta.length > 1) {
      if (respuesta === palabra) {
        setPuntos((prev) => prev + 100);
        setMostrarDefinicion(true);
        setInput("");
        return;
      }

      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);

      if (nuevasVidas <= 0) {
        alert(`Game Over\n\nPuntaje final: ${puntos}`);
        navigate("/dashboard");
      }

      setInput("");
      return;
    }

    // Intento de letra
    const letra = respuesta;
    let encontrada = false;
    const nuevasPosiciones = [...letrasDescubiertas];

    palabra.split("").forEach((char, index) => {
      if (
        char === letra &&
        !nuevasPosiciones.includes(index)
      ) {
        nuevasPosiciones.push(index);
        encontrada = true;
      }
    });

    if (encontrada) {
      setLetrasDescubiertas(nuevasPosiciones);
      setPuntos((prev) => prev + 5);

      const completa = palabra
        .split("")
        .every((_, index) => nuevasPosiciones.includes(index));

      if (completa) {
        // REQUERIMIENTO: Aquí ya no sumamos los 25 puntos de bonificación automáticos
        // Solo mostramos la definición directamente.
        setMostrarDefinicion(true);
        setInput("");
        return;
      }
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);

      if (nuevasVidas <= 0) {
        alert(`Game Over\n\nPuntaje final: ${puntos}`);
        navigate("/dashboard");
      }
    }

    setInput("");
  };

  const siguientePalabra = () => {
    cargarPalabra();
  };

  return (
    <div className="game">
      <div className="game-card">

        {mostrarDefinicion ? (
          <div className="resultado">
            <h2>🎉 ¡Palabra Revelada!</h2>
            <h3>{palabra}</h3>
            <p className="definicion"><strong>Definición:</strong> {definicion}</p>
            <p>⭐ Puntaje actual: {puntos}</p>
            <button onClick={siguientePalabra}>Siguiente palabra</button>
          </div>
        ) : (
          <>
            <h2>Juego de Palabras</h2>

            {/* Pista de categoría mostrada de inmediato */}
            <div className="pista-categoria">
              <p>📌 <strong>Categoría:</strong> {categoria}</p>
            </div>

            <div className="stats">
              <p>❤️ Vidas: {vidas}</p>
              <p>⭐ Puntos: {puntos}</p>
            </div>

            <h1 className="palabra">{palabraOculta}</h1>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="Escribe una letra o la palabra completa"
            />

            <div className="buttons">
              <button onClick={verificar}>Verificar</button>
              <button onClick={usarAyuda}>💡 Ayuda (-10)</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}