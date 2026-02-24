import React, { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <Layout>
        <p>Carregando perfil...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Perfil do Usuário</h1>
        <div className="summary">
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Papel:</strong> {user.role}</p>
          <p><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
