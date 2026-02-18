import React, { useEffect, useState } from "react";
import api from "../api/api";

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
    return <p>Carregando perfil...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Perfil do Usuário</h1>
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Papel:</strong> {user.role}</p>
      <p><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default Profile;
