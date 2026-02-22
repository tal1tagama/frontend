import { Link } from "react-router-dom";
import "../styles/main.css";

function Layout({ children }) {
  return (
    <div>

      <header className="header">

        <h1>Sistema Obras</h1>

        <nav className="menu">

          <Link to="/dashboard">
            <button>Início</button>
          </Link>

          <Link to="/medicao">
            <button>Enviar Medição</button>
          </Link>

          <Link to="/solicitacao">
            <button>Solicitação</button>
          </Link>

          <Link to="/relatorios">
            <button>Relatórios</button>
          </Link>

          <Link to="/status">
            <button>Status</button>
          </Link>

        </nav>

      </header>

      <main className="container">
        {children}
      </main>

    </div>
  );
}

export default Layout;