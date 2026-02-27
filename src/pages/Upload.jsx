import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { saveFileOffline, getPendingFiles, markAsUploaded } from "../utils/db";
import { uploadFile } from "../services/filesService";
import { extractApiMessage } from "../services/response";
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
      setSuccess("Upload realizado com sucesso: " + (response?.nomeOriginal || response?.nome || "Arquivo enviado"));
    } catch (error) {
      setError("Erro ao enviar arquivo: " + extractApiMessage(error));
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
        <h2 className="page-title">Enviar Arquivos</h2>
        <p style={{ fontSize: "var(--tamanho-fonte-base)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-lg)" }}>
          Selecione um arquivo para enviar. Se estiver offline, o arquivo será enviado automaticamente quando a conexão voltar.
        </p>
        <div className="form-container">
          <label>Escolher arquivo</label>
          <input
            type="file"
            className="file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <p style={{ marginTop: "var(--espacamento-sm)", color: "var(--cor-texto-secundario)" }}>
              Arquivo selecionado: <strong>{file.name}</strong>
            </p>
          )}
          {error && <p className="erro-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <button className="button-primary" onClick={handleUpload} disabled={loading}>
            {loading ? "Enviando arquivo..." : "Enviar Arquivo"}
          </button>
        </div>

        <h3 style={{ marginTop: "var(--espacamento-xl)", marginBottom: "var(--espacamento-md)", fontSize: "var(--tamanho-subtitulo)", fontWeight: 600 }}>Arquivos Pendentes (Offline)</h3>
        {pendingFiles.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "var(--espacamento-lg)" }}>
            <p style={{ color: "var(--cor-texto-secundario)" }}>Nenhum arquivo aguardando envio</p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pendingFiles.map((f) => (
              <li key={f.id} className="card" style={{ marginBottom: "var(--espacamento-sm)" }}>
                📄 {f.file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default Upload;
