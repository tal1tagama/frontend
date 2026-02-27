import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { canAccessRoute } from "../constants/permissions";
import "../styles/main.css";

function Layout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const perfil = (JSON.parse(localStorage.getItem("user") || "null") || {}).perfil;

  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
    } finally {
      logout();
      navigate("/login");
    }
  }

  return (
    <div>

      <header className="header">

        <h1>Sistema de Gestão de Obras</h1>

        <nav className="menu">

          {canAccessRoute(perfil, "/") && (
            <Link to="/">
              <button className={isActive("/") ? "active" : ""}>🏠 Início</button>
            </Link>
          )}

          {canAccessRoute(perfil, "/medicoes") && (
            <Link to="/medicoes">
              <button className={isActive("/medicoes") ? "active" : ""}>📏 Nova Medição</button>
            </Link>
          )}

          {canAccessRoute(perfil, "/solicitacoes") && (
            <Link to="/solicitacoes">
              <button className={isActive("/solicitacoes") ? "active" : ""}>🛒 Solicitar</button>
            </Link>
          )}

          {canAccessRoute(perfil, "/status-solicitacoes") && (
            <Link to="/status-solicitacoes">
              <button className={isActive("/status-solicitacoes") ? "active" : ""}>⏳ Status</button>
            </Link>
          )}

          {canAccessRoute(perfil, "/upload") && (
            <Link to="/upload">
              <button className={isActive("/upload") ? "active" : ""}>📤 Upload</button>
            </Link>
          )}

          {canAccessRoute(perfil, "/relatorios") && (
            <Link to="/relatorios">
              <button className={isActive("/relatorios") ? "active" : ""}>📊 Relatórios</button>
            </Link>
          )}

          {canAccessRoute(perfil, "/profile") && (
            <Link to="/profile">
              <button className={isActive("/profile") ? "active" : ""}>👤 Perfil</button>
            </Link>
          )}

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>

        </nav>

      </header>

      <main className="container">
        {children}
      </main>

    </div>
  );
}

export default Layout;