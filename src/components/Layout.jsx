import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute, PERFIL_LABELS } from "../constants/permissions";
import Icon from "./Icons";
import "../styles/main.css";

/**
 * Links de navegação disponíveis por perfil.
 * A função canAccessRoute (baseada em ROUTE_PERMISSIONS) controla o que cada perfil vê.
 */
const NAV_LINKS = [
  { path: "/",                    label: "Início",                iconKey: "home"        },
  { path: "/medicoes",            label: "Nova Medição",          iconKey: "ruler"       },
  { path: "/solicitacoes",        label: "Solicitar Materiais",   iconKey: "cart"        },
  { path: "/status-solicitacoes", label: "Minhas Solicitações",   iconKey: "clipboard"   },
  { path: "/upload",              label: "Enviar Arquivos",       iconKey: "upload"      },
  // -- apenas supervisor e admin --
  { path: "/medicoes-lista",      label: "Lista de Medições",     iconKey: "checklist"   },
  { path: "/relatorios",          label: "Relatórios",            iconKey: "chart"       },
  { path: "/obras",               label: "Obras",                 iconKey: "building"    },
  // -- apenas admin --
  { path: "/admin",               label: "Administração",         iconKey: "settings"    },
  { path: "/register",            label: "Cadastrar Funcionário", iconKey: "person-add"  },
  // -- todos --
  { path: "/profile",             label: "Meu Perfil",            iconKey: "person"      },
];

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const perfil = user?.perfil || null;

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function handleNavClick(path) {
    navigate(path);
    setMenuAberto(false);
  }

  return (
    <div>
      <header className="header">
        <div className="header-top">
          {/* Logo clicável leva ao início */}
          <Link to="/" className="header-logo-link" onClick={() => setMenuAberto(false)}>
            <span className="header-logo-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="18" height="13" rx="1" />
                <path d="M8 22V9" />
                <path d="M16 22V9" />
                <path d="M3 14h18" />
                <path d="M8 6h8l2 3H6z" />
              </svg>
            </span>
            <span className="header-logo-text">Gestão de Obras</span>
          </Link>

          <div className="header-top-right">
            {user && (
              <div className="header-user-info">
                {user.nome && <span className="header-user-nome">{user.nome}</span>}
                <span className="header-perfil-badge">
                  {PERFIL_LABELS[perfil] || perfil || "Usuário"}
                </span>
              </div>
            )}
            {/* Botão hambúrguer — visível apenas no mobile */}
            <button
              className="menu-hamburger"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((prev) => !prev)}
            >
              {menuAberto ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <nav
          className={`menu${menuAberto ? " menu-aberto" : ""}`}
          aria-label="Menu principal"
        >
          {NAV_LINKS.filter(({ path }) => canAccessRoute(perfil, path)).map(({ path, label, iconKey }) => (
            <button
              key={path}
              className={isActive(path) ? "active" : ""}
              onClick={() => handleNavClick(path)}
            >
              <Icon name={iconKey} size={15} />
              {label}
            </button>
          ))}

          <div className="menu-separator" />

          <button className="btn-logout" onClick={handleLogout}>
            <Icon name="logout" size={15} />
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
