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
        <div className="page-container" style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
          <p>Carregando informações...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="page-container">
          <p className="erro-msg">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Meu Perfil</h1>
        <p style={{ fontSize: "var(--tamanho-fonte-base)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-lg)" }}>
          Informações da sua conta
        </p>
        <div className="summary">
          <div style={{ display: "grid", gap: "var(--espacamento-md)" }}>
            <div>
              <strong>Nome:</strong>
              <p style={{ marginTop: "var(--espacamento-xs)", fontSize: "var(--tamanho-fonte-grande)" }}>{user.nome || "-"}</p>
            </div>
            <div>
              <strong>Email:</strong>
              <p style={{ marginTop: "var(--espacamento-xs)" }}>{user.email}</p>
            </div>
            <div>
              <strong>Tipo de usuário:</strong>
              <p style={{ marginTop: "var(--espacamento-xs)", textTransform: "capitalize" }}>{user.perfil || "-"}</p>
            </div>
            <div>
              <strong>Obra atual:</strong>
              <p style={{ marginTop: "var(--espacamento-xs)" }}>{user.obraAtual || "Nenhuma obra atribuída"}</p>
            </div>
            <div>
              <strong>Conta criada em:</strong>
              <p style={{ marginTop: "var(--espacamento-xs)", color: "var(--cor-texto-secundario)", fontSize: "var(--tamanho-fonte-pequena)" }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleString("pt-BR") : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
