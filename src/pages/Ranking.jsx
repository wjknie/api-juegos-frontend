import { useEffect, useState } from "react";
import "../assets/styles/ranking.css";

export default function Ranking() {
    const [ranking, setRanking] = useState([]);

    useEffect(() =>{
        obtenerRanking();
    }, []);
    const obtenerRanking = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/ranking`
            );
            const data = await res.json();

            setRanking(data);

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="ranking-container">
            <h1>Ranking Global</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Jugador</th>
                        <th>Puntaje</th>
                        <th>Aciertos</th>
                        <th>Tiempo</th>
                    </tr>
                </thead>
                <tbody>
                    {ranking.map((item, index) => (
                        <tr key={item.id_resultado}>
                            <td>{index + 1}</td>
                            <td>{item.partida.usuario.nombre}</td>
                            <td>{item.puntaje}</td>
                            <td>{item.aciertos}</td>
                            <td>{item.tiempo}s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}