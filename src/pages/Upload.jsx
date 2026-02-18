import React, { useState } from "react";
import api from "../api/api";

function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Selecione um arquivo primeiro!");
      return;
    }

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

  return (
    <div className="upload-container">
      <h1>Upload de Arquivos</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button className="button" onClick={handleUpload}>
        Enviar
      </button>
    </div>
  );
}

export default Upload;
