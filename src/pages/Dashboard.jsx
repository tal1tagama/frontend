import React, { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [medicoes, setMedicoes] = useState([]);

  useEffect(() => {
    const fetchMedicoes = async () => {
      try {
        const response = await api.get("/measurements/minhas?page=1&limit=10");
        setMedicoes(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar medições:", error);
      }
    };
    fetchMedicoes();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Minhas Mediçōes</h1>
      <ul>
        {medicoes.map((m) => (
          <li key={m._id}>
            {m.obra} - {m.data} - {m.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
