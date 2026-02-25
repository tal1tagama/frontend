import React, { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/auth/me");
        setUser(response.data?.data || null);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setError("Nao foi possivel carregar o perfil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Layout>
        <p>Carregando perfil...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="erro-msg">{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Perfil do Usuário</h1>
        <div className="summary">
          <p><strong>ID:</strong> {user.id || user._id}</p>
          <p><strong>Nome:</strong> {user.nome || "-"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Perfil:</strong> {user.perfil || "-"}</p>
          <p><strong>Obra atual:</strong> {user.obraAtual || "-"}</p>
          <p><strong>Criado em:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</p>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
