import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute } from "../constants/permissions";
import "../styles/main.css";

/**
 * Links de navegação disponíveis por perfil.
 * A função canAccessRoute (baseada em ROUTE_PERMISSIONS) controla o que cada perfil vê.
 */
const NAV_LINKS = [
  { path: "/",                   label: "Início" },
  { path: "/medicoes",           label: "Nova Medição" },
  { path: "/solicitacoes",       label: "Solicitar Materiais" },
  { path: "/status-solicitacoes",label: "Minhas Solicitações" },
  { path: "/upload",             label: "Enviar Arquivos" },
  // -- apenas supervisor e admin --
  { path: "/medicoes-lista",     label: "Lista de Medições" },
  { path: "/relatorios",         label: "Relatórios" },
  { path: "/obras",              label: "Obras" },
  // -- apenas admin --
  { path: "/admin",              label: "Administração" },
  // -- todos --
  { path: "/profile",            label: "Meu Perfil" },
];

const PERFIL_LABELS = {
  admin: "Administrador",
  supervisor: "Supervisor",
  encarregado: "Encarregado",
};

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const perfil = user?.perfil || null;

  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    await logout(); // AuthContext.logout() já chama /auth/logout no servidor
    navigate("/login");
  }

  return (
    <div>
      <header className="header">
        <div className="header-top">
          <h1>Gestão de Obras</h1>
          {user && (
            <div className="header-user-info">
              {user.nome && <span>{user.nome}</span>}
              <span className="header-perfil-badge">
                {PERFIL_LABELS[perfil] || perfil || "Usuário"}
              </span>
            </div>
          )}
        </div>

        <nav className="menu">
          {NAV_LINKS.filter(({ path }) => canAccessRoute(perfil, path)).map(({ path, label }) => (
            <Link key={path} to={path}>
              <button className={isActive(path) ? "active" : ""}>
                {label}
              </button>
            </Link>
          ))}

          <div className="menu-separator" />

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
