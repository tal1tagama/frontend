import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/main.css";

function Layout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>

      <header className="header">

        <h1>Sistema Obras</h1>

        <nav className="menu">

          <Link to="/">
            <button className={isActive("/") ? "active" : ""}>Inicio</button>
          </Link>

          <Link to="/medicoes">
            <button className={isActive("/medicoes") ? "active" : ""}>Enviar Medicao</button>
          </Link>

          <Link to="/solicitacoes">
            <button className={isActive("/solicitacoes") ? "active" : ""}>Solicitacao</button>
          </Link>

          <Link to="/status-solicitacoes">
            <button className={isActive("/status-solicitacoes") ? "active" : ""}>Status</button>
          </Link>

          <Link to="/upload">
            <button className={isActive("/upload") ? "active" : ""}>Upload</button>
          </Link>

          <Link to="/relatorios">
            <button className={isActive("/relatorios") ? "active" : ""}>Relatorios</button>
          </Link>

          <Link to="/profile">
            <button className={isActive("/profile") ? "active" : ""}>Perfil</button>
          </Link>

          <button className="btn-logout" onClick={handleLogout}>
            Sair
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