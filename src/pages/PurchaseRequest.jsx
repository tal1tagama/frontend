import React, { useState } from "react";
import api from "../api/api";

function PurchaseRequest() {
  const materiais = [
    { nome: "Tijolos", medida: "2 milheiros" },
    { nome: "Cimento", medida: "10 sacos" },
    { nome: "Areia", medida: "5 m³" },
    { nome: "Brita", medida: "3 m³" },
    { nome: "Ferro", medida: "20 barras" },
    { nome: "Madeira", medida: "15 tábuas" },
    { nome: "Telhas", medida: "100 unidades" },
    { nome: "Canos PVC", medida: "30 metros" },
    { nome: "Fios Elétricos", medida: "50 metros" },
    { nome: "Azulejos", medida: "20 caixas" }
  ];

  const [items, setItems] = useState([]);
  const [materialSelecionado, setMaterialSelecionado] = useState(materiais[0]);
  const [status, setStatus] = useState(null);

  const addItem = () => {
    setItems([...items, materialSelecionado]);
  };

  const enviarSolicitacao = async () => {
    try {
      const response = await api.post("/purchases", { items });
      setStatus(response.data.data.status);
    } catch (error) {
      alert("Erro ao enviar solicitação");
    }
  };

  return (
    <div className="purchase-container">
      <h1>Solicitação de Compras</h1>

      <div>
        <select
          value={materialSelecionado.nome}
          onChange={(e) =>
            setMaterialSelecionado(
              materiais.find((m) => m.nome === e.target.value)
            )
          }
        >
          {materiais.map((mat, index) => (
            <option key={index} value={mat.nome}>
              {mat.nome}
            </option>
          ))}
        </select>

        <span style={{ marginLeft: "1rem" }}>
          Quantidade: {materialSelecionado.medida}
        </span>

        <button className="button" onClick={addItem}>
          Adicionar item
        </button>
      </div>

      <h2>Itens da solicitação</h2>
      {items.length === 0 ? (
        <p>Nenhum item adicionado.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.nome} → {item.medida}
            </li>
          ))}
        </ul>
      )}

      <button className="button" onClick={enviarSolicitacao}>
        Enviar Solicitação
      </button>

      {status && (
        <div className="status-box">
          <h3>Status da solicitação: {status}</h3>
        </div>
      )}
    </div>
  );
}

export default PurchaseRequest;
