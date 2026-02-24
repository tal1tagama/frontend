import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/main.css";

function Layout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
            <button>Início</button>
          </Link>

          <Link to="/medicoes">
            <button>Enviar Medição</button>
          </Link>

          <Link to="/solicitacoes">
            <button>Solicitação</button>
          </Link>

          <Link to="/relatorios">
            <button>Relatórios</button>
          </Link>

          <Link to="/profile">
            <button>Perfil</button>
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