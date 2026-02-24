import React, { useState, useEffect } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { saveFileOffline, getPendingFiles, markAsUploaded } from "../utils/db";
import "../styles/pages.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo primeiro!");
      return;
    }

    if (!navigator.onLine) {
      // offline → salva localmente
      await saveFileOffline(file);
      alert("Sem conexão. Arquivo salvo localmente e será enviado quando a internet voltar.");
      await loadPendingFiles(); // atualiza lista
      return;
    }

    // online → envia direto
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload realizado com sucesso: " + response.data.message);
    } catch (error) {
      alert("Erro ao enviar arquivo: " + error.response?.data?.message);
    }
  };

  // carregar arquivos pendentes
  const loadPendingFiles = async () => {
    const files = await getPendingFiles();
    setPendingFiles(files.filter((f) => !f.uploaded));
  };

  // sincronizar automaticamente quando voltar a internet
  useEffect(() => {
    const handleOnline = async () => {
      const pending = await getPendingFiles();
      for (const item of pending) {
        if (!item.uploaded) {
          const formData = new FormData();
          formData.append("file", item.file);

          try {
            await api.post("/files/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            await markAsUploaded(item.id);
            alert("Arquivo pendente enviado com sucesso!");
          } catch (err) {
            console.error("Erro ao enviar arquivo pendente:", err);
          }
        }
      }
      await loadPendingFiles(); // atualiza lista após sincronização
    };

    window.addEventListener("online", handleOnline);
    loadPendingFiles(); // carrega ao abrir página

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Upload de Arquivos</h2>
        <div className="form-container">
          <label>Selecionar arquivo</label>
          <input
            type="file"
            className="file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="button-primary" onClick={handleUpload} style={{ marginTop: 12 }}>
            Enviar
          </button>
        </div>

        <h3 style={{ marginTop: 24, marginBottom: 8 }}>Arquivos pendentes (offline)</h3>
        {pendingFiles.length === 0 ? (
          <p>Nenhum arquivo pendente.</p>
        ) : (
          <ul>
            {pendingFiles.map((f) => (
              <li key={f.id}>{f.file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default Upload;
