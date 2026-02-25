import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { saveFileOffline, getPendingFiles, markAsUploaded } from "../utils/db";
import { uploadFile } from "../services/filesService";
import "../styles/pages.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError("Selecione um arquivo primeiro.");
      return;
    }

    if (!navigator.onLine) {
      // offline → salva localmente
      await saveFileOffline(file);
      setSuccess("Sem conexao. Arquivo salvo localmente e sera enviado quando a internet voltar.");
      await loadPendingFiles(); // atualiza lista
      return;
    }

    // online → envia direto
    try {
      setLoading(true);
      const response = await uploadFile(file);
      setSuccess("Upload realizado com sucesso: " + (response?.message || "Arquivo enviado"));
    } catch (error) {
      setError("Erro ao enviar arquivo: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
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
          try {
            await uploadFile(item.file);
            await markAsUploaded(item.id);
            setSuccess("Arquivo pendente enviado com sucesso!");
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
          {error && <p className="erro-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <button className="button-primary" onClick={handleUpload} style={{ marginTop: 12 }} disabled={loading}>
            {loading ? "Enviando..." : "Enviar"}
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
