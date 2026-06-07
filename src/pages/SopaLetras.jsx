import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/game.css";

export default function SopaLetras() {
  const navigate = useNavigate();
  const TAMANO_MATRIZ = 10; // <-- Reducido a 10x10 (Más fácil y compacto)
  const CANTIDAD_PALABRAS = 3; // <-- Buscaremos 3 palabras por partida

  const [listaPalabras, setListaPalabras] = useState([]); 
  const [matriz, setMatriz] = useState([]);
  
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [celdasDescubiertas, setCeldasDescubiertas] = useState([]);

  const cargarPalabras = async () => {
    try {
      const palabrasObtenidas = [];
      
      for (let i = 0; i < CANTIDAD_PALABRAS; i++) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/palabra-random`);
        const data = await res.json();
        
        const palabraFormateada = data.palabra.toUpperCase().replace(/\s+/g, "");
        
        // Controlamos que la palabra no sea más larga que el tablero (máximo 9 letras)
        if (palabraFormateada.length < TAMANO_MATRIZ && !palabrasObtenidas.some(p => p.palabra === palabraFormateada)) {
          palabrasObtenidas.push({
            palabra: palabraFormateada,
            definicion: data.definicion,
            categoria: data.categoria || "General",
            encontrada: false
          });
        } else {
          i--; // Si es muy larga o repetida, reintentamos
        }
      }
      
      setListaPalabras(palabrasObtenidas);
      setJuegoTerminado(false);
      setSeleccionadas([]);
      setCeldasDescubiertas([]);
      
      generarSopa(palabrasObtenidas);
    } catch (error) {
      console.error(error);
      alert("Error cargando el juego");
    }
  };

  useEffect(() => {
    cargarPalabras();
  }, []);

  const generarSopa = (palabras) => {
    let nuevaMatriz = Array(TAMANO_MATRIZ).fill(null).map(() => Array(TAMANO_MATRIZ).fill("-"));

    palabras.forEach(({ palabra }) => {
      let colocada = false;
      let intentos = 0;

      while (!colocada && intentos < 100) {
        intentos++;
        const direccion = Math.floor(Math.random() * 2); 
        let filaInicio, colInicio;

        if (direccion === 0) { // Horizontal
          filaInicio = Math.floor(Math.random() * TAMANO_MATRIZ);
          colInicio = Math.floor(Math.random() * (TAMANO_MATRIZ - palabra.length));
        } else { // Vertical
          filaInicio = Math.floor(Math.random() * (TAMANO_MATRIZ - palabra.length));
          colInicio = Math.floor(Math.random() * TAMANO_MATRIZ);
        }

        let espacioLibre = true;
        for (let i = 0; i < palabra.length; i++) {
          const f = direccion === 1 ? filaInicio + i : filaInicio;
          const c = direccion === 0 ? colInicio + i : colInicio;
          if (nuevaMatriz[f][c] !== "-" && nuevaMatriz[f][c] !== palabra[i]) {
            espacioLibre = false;
            break;
          }
        }

        if (espacioLibre) {
          for (let i = 0; i < palabra.length; i++) {
            const f = direccion === 1 ? filaInicio + i : filaInicio;
            const c = direccion === 0 ? colInicio + i : colInicio;
            nuevaMatriz[f][c] = palabra[i];
          }
          colocada = true;
        }
      }
    });

    const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    for (let f = 0; f < TAMANO_MATRIZ; f++) {
      for (let c = 0; c < TAMANO_MATRIZ; c++) {
        if (nuevaMatriz[f][c] === "-") {
          nuevaMatriz[f][c] = letras[Math.floor(Math.random() * letras.length)];
        }
      }
    }

    setMatriz(nuevaMatriz);
  };

  const seleccionarCelda = (fila, col) => {
    if (celdasDescubiertas.some(c => c.fila === fila && c.col === col)) return;

    const index = seleccionadas.findIndex(c => c.fila === fila && c.col === col);
    if (index !== -1) {
      setSeleccionadas(seleccionadas.filter((_, i) => i !== index));
    } else {
      setSeleccionadas([...seleccionadas, { fila, col }]);
    }
  };

  const verificarSeleccion = () => {
    const palabraIntentada = seleccionadas.map(coord => matriz[coord.fila][coord.col]).join("");

    const palabraEncontradaIndex = listaPalabras.findIndex(
      p => p.palabra === palabraIntentada && !p.encontrada
    );

    if (palabraEncontradaIndex !== -1) {
      const nuevaLista = [...listaPalabras];
      nuevaLista[palabraEncontradaIndex].encontrada = true;
      setListaPalabras(nuevaLista);

      setCeldasDescubiertas([...celdasDescubiertas, ...seleccionadas]);
      setPuntos((prev) => prev + 50); 
      setSeleccionadas([]);

      const todasEncontradas = nuevaLista.every(p => p.encontrada);
      if (todasEncontradas) {
        setPuntos((prev) => prev + 50); // Pequeño bono final
        setJuegoTerminado(true);
      }
    } else {
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      setSeleccionadas([]); 

      if (nuevasVidas <= 0) {
        alert(`Game Over\n\nPuntaje final: ${puntos}`);
        navigate("/dashboard");
      } else {
        alert("¡Combinación incorrecta!");
      }
    }
  };

  return (
    <div className="game">
      <div className="game-card" style={{ maxWidth: "450px" }}> {/* Tablero más angosto y estético */}
        
        {juegoTerminado ? (
          <div className="resultado">
            <h2>🎉 ¡Sopa Completada!</h2>
            <p>Encontraste todas las palabras:</p>
            
            <div className="lista-repaso" style={{ textAlign: "left", margin: "15px 0" }}>
              {listaPalabras.map((p, index) => (
                <p key={index} style={{ fontSize: "13px", margin: "6px 0" }}>
                  <strong>{p.palabra}</strong>: {p.definicion}
                </p>
              ))}
            </div>

            <p style={{ fontSize: "16px", fontWeight: "bold" }}>⭐ Puntos: {puntos}</p>
            <button onClick={cargarPalabras}>Jugar otra vez</button>
          </div>
        ) : (
          <>
            <h2>Sopa de Letras</h2>

            {/* LISTA DE PALABRAS COMPACTA */}
            <div className="panel-palabras" style={{ margin: "10px 0", background: "#f9f9f9", padding: "8px", borderRadius: "8px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                {listaPalabras.map((p, i) => (
                  <span 
                    key={i} 
                    style={{
                      textDecoration: p.encontrada ? "line-through" : "none",
                      color: p.encontrada ? "#2ecc71" : "#333",
                      fontWeight: "bold",
                      background: p.encontrada ? "#e8f8f5" : "#eef2f3",
                      padding: "4px 8px",
                      borderRadius: "10px",
                      fontSize: "12px"
                    }}
                  >
                    📌 {p.palabra} <small style={{ color: "#7f8c8d" }}>({p.categoria})</small>
                  </span>
                ))}
              </div>
            </div>

            <div className="stats" style={{ marginBottom: "10px" }}>
              <p>❤️ Vidas: {vidas}</p>
              <p>⭐ Puntos: {puntos}</p>
            </div>

            {/* TABLERO DE 10x10 CON CELDAS MEDIANAS */}
            <div 
              className="grid-sopa" 
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${TAMANO_MATRIZ}, 32px)`,
                gap: "4px",
                justifyContent: "center",
                margin: "15px 0"
              }}
            >
              {matriz.map((fila, fIndex) =>
                fila.map((letra, cIndex) => {
                  const yaDescubierta = celdasDescubiertas.some(s => s.fila === fIndex && s.col === cIndex);
                  const estaSeleccionada = seleccionadas.some(s => s.fila === fIndex && s.col === cIndex);
                  
                  let bgColor = "#f5f5f5";
                  let textColor = "#333";
                  if (yaDescubierta) {
                    bgColor = "#2ecc71"; 
                    textColor = "white";
                  } else if (estaSeleccionada) {
                    bgColor = "#ffca28"; 
                  }

                  return (
                    <button
                      key={`${fIndex}-${cIndex}`}
                      onClick={() => seleccionarCelda(fIndex, cIndex)}
                      className="celda-sopa"
                      style={{
                        width: "32px",
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        backgroundColor: bgColor,
                        color: textColor,
                        border: "1px solid #ddd",
                        cursor: yaDescubierta ? "not-allowed" : "pointer",
                        borderRadius: "4px"
                      }}
                    >
                      {letra}
                    </button>
                  );
                })
              )}
            </div>

            <div className="buttons">
              <button onClick={verificarSeleccion} disabled={seleccionadas.length === 0}>
                Validar ({seleccionadas.length})
              </button>
              <button onClick={() => setSeleccionadas([])} style={{ background: "#e74c3c", color: "white" }}>
                Limpiar
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}