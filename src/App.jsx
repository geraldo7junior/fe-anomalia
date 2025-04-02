import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

function App() {
  const [injecao, setInjecao] = useState("3000");
  const [potencia, setPotencia] = useState("6");
  const [latitude, setLatitude] = useState("39.7392");
  const [longitude, setLongitude] = useState("-104.9903");
  const [mes, setMes] = useState("JUL");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const meses = [
    { nome: "Janeiro", valor: "JAN" },
    { nome: "Fevereiro", valor: "FEV" },
    { nome: "Março", valor: "MAR" },
    { nome: "Abril", valor: "ABR" },
    { nome: "Maio", valor: "MAI" },
    { nome: "Junho", valor: "JUN" },
    { nome: "Julho", valor: "JUL" },
    { nome: "Agosto", valor: "AGO" },
    { nome: "Setembro", valor: "SET" },
    { nome: "Outubro", valor: "OUT" },
    { nome: "Novembro", valor: "NOV" },
    { nome: "Dezembro", valor: "DEZ" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const requestData = {
      injecao: parseFloat(injecao),
      potencia_instalada: parseFloat(potencia),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      mes: mes,
    };

    try {
      const res = await fetch("https://be-anomalia.onrender.com/detect_anomaly/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        throw new Error(`Erro: ${res.statusText}`);
      }

      const data = await res.json();
      console.log(data);
      setResponse(data);
    } catch (error) {
      setError("Erro ao conectar com a API.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-10">
        <h2 className="text-2xl font-bold text-center mb-4">Detecção de Anomalia</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold">Injeção Mensal (Kwh medido)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={injecao}
              onChange={(e) => setInjecao(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Potência Instalada</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={potencia}
              onChange={(e) => setPotencia(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Latitude</label>
            <input
              type="number"
              step="any"
              className="w-full p-2 border border-gray-300 rounded"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Longitude</label>
            <input
              type="number"
              step="any"
              className="w-full p-2 border border-gray-300 rounded"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Mês</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              required
            >
              {meses.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {response && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <h3 className="font-bold">Resultado:</h3>
            <p><strong>Anomalia Geral:</strong> {response.anomaly_detected ? "Sim" : "Não"}</p>
            <p><strong>Anomalia Fator:</strong> {response.anomaly_detected_factor ? "Sim" : "Não"}</p>
            <p><strong>Anomalia Solar:</strong> {response.solar_anomaly ? "Sim" : "Não"}</p>
          </div>
        )}
      </div>

      {/* Gráfico abaixo */}
      {response?.grafico &&
        response.grafico.producao_mensal_kwh?.length === 13 &&
        response.grafico.linha_media_3_meses?.length === 13 &&
        response.grafico.linha_fator_aneel?.length === 13 &&
        response.grafico.linha_inc_solar?.length === 13 && (
          <div className="w-full max-w-4xl bg-white p-6 shadow-lg rounded-lg">
            <h3 className="font-bold text-center mb-4 text-xl">Gráfico de Produção vs Anomalias</h3>
            <div style={{ position: "relative", width: "100%", height: "400px" }}>
              <Bar
                data={{
                  labels: Array.from({ length: 13 }, (_, i) =>
                    i < 12 ? `Mês ${i + 1}` : "Mês Atual"
                  ),
                  datasets: [
                    {
                      label: "Produção (KWh)",
                      data: response.grafico.producao_mensal_kwh,
                      backgroundColor: response.grafico.producao_mensal_kwh.map((_, i) =>
                        i === 12
                          ? "rgba(255, 99, 132, 0.7)"
                          : "rgba(59, 130, 246, 0.5)"
                      ),
                    },
                    {
                      type: "line",
                      label: "Média Últimos 3 Meses",
                      data: response.grafico.linha_media_3_meses,
                      borderColor: "orange",
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      type: "line",
                      label: "Fator ANEEL (115.2)",
                      data: response.grafico.linha_fator_aneel,
                      borderColor: "red",
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      type: "line",
                      label: "Mínimo Solar Estimado",
                      data: response.grafico.linha_inc_solar,
                      borderColor: "green",
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "kWh",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
