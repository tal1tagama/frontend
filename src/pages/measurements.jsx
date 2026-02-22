import React, { useEffect, useState } from "react";
import axios from "axios";

function Measurements() {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    async function fetchMeasurements() {
      const res = await axios.get("/api/measurements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMeasurements(res.data);
    }
    fetchMeasurements();
  }, []);

  return (
    <div>
      <h1>Medições</h1>
      <table>
        <thead>
          <tr>
            <th>Obra</th>
            <th>Área</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map(m => (
            <tr key={m._id}>
              <td>{m.obra?.nome}</td>
              <td>{m.area} m²</td>
              <td>{m.user?.nome}</td>
              <td>{m.status}</td>
              <td>{new Date(m.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Measurements;
