import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute } from "../constants/permissions";
import Icon from "./Icons";
import "../styles/navbar.css";

/**
 * Itens do menu superior.
 * Itens com `items` geram dropdown; sem `items` são links diretos.
 */
const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
  },
  {
    key: "medicoes",
    label: "Medições",
    items: [
      { path: "/medicoes",       label: "Nova Medição",        iconKey: "ruler"     },
      { path: "/medicoes-lista", label: "Lista de Medições",   iconKey: "checklist" },
    ],
  },
  {
    key: "obra",
    label: "Obra",
    items: [
      { path: "/diario", label: "Diário de Obra",  iconKey: "clipboard" },
      { path: "/upload",  label: "Enviar Arquivos", iconKey: "upload"    },
    ],
  },
  {
    key: "solicitacoes",
    label: "Solicitações",
    items: [
      { path: "/solicitacoes",        label: "Solicitar Materiais", iconKey: "cart"      },
      { path: "/status-solicitacoes", label: "Minhas Solicitações", iconKey: "checklist" },
    ],
  },
  {
    key: "sincronizacao",
    label: "Sincronização",
    path: "/sincronizacao",
  },
  {
    key: "relatorios",
    label: "Relatórios",
    path: "/relatorios",
  },
  {
    key: "administracao",
    label: "Administração",
    items: [
      { path: "/obras",    label: "Obras",                 iconKey: "building"   },
      { path: "/register", label: "Cadastrar Funcionário", iconKey: "person-add" },
      { path: "/admin",    label: "Painel Administrativo", iconKey: "settings"   },
    ],
  },
];

function CaretDown() {
  return (
    <svg
      className="nav-caret"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 3.5L5 7L8.5 3.5" />
    </svg>
  );
}

/**
 * NavBar — Menu superior horizontal com dropdowns.
 * Substitui o menu lateral (Sidebar) para navegação principal do sistema.
 */
function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const navRef    = useRef(null);

  const [openKey,    setOpenKey]    = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const perfil = user?.perfil || null;

  /* ── Helpers ────────────────────────────────────────────── */
  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  const isGroupActive = (items) =>
    Array.isArray(items) && items.some(({ path }) => isActive(path));

  const handleNav = (path) => {
    navigate(path);
    setOpenKey(null);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setMobileOpen(false);
  };

  /* ── Fechar dropdown ao clicar fora ─────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenKey(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Fechar menu mobile ao navegar ──────────────────────── */
  useEffect(() => {
    setMobileOpen(false);
    setOpenKey(null);
  }, [location.pathname]);

  /* ── Filtra itens por permissão ─────────────────────────── */
  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.items) {
      return item.items.some(({ path }) => canAccessRoute(perfil, path));
    }
    return canAccessRoute(perfil, item.path);
  });

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <nav className="navbar" ref={navRef} aria-label="Menu principal">
      <div className="navbar-inner">

        {/* Logo */}
        <button className="navbar-logo" onClick={() => handleNav("/")}>
          <img src="/logo.png" alt="ObraLink" className="navbar-logo-img" />
          ObraLink
        </button>

        {/* ── Itens do menu (desktop) ──────────────────────── */}
        <div className="navbar-nav" role="menubar">
          {visibleItems.map((item) => {
            /* Link simples — sem dropdown */
            if (!item.items) {
              return (
                <div key={item.key} className="nav-item">
                  <button
                    className={`nav-link${isActive(item.path) ? " active" : ""}`}
                    onClick={() => handleNav(item.path)}
                    role="menuitem"
                  >
                    {item.label}
                  </button>
                </div>
              );
            }

            /* Dropdown */
            const visibleSub = item.items.filter(({ path }) =>
              canAccessRoute(perfil, path)
            );
            if (!visibleSub.length) return null;

            const isOpen     = openKey === item.key;
            const groupActive = isGroupActive(visibleSub);

            return (
              <div
                key={item.key}
                className={[
                  "nav-item",
                  "has-dropdown",
                  isOpen      ? "open"         : "",
                  groupActive ? "group-active" : "",
                ].filter(Boolean).join(" ")}
              >
                <button
                  className={`nav-link${groupActive ? " active" : ""}`}
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  role="menuitem"
                >
                  {item.label}
                  <CaretDown />
                </button>

                <div className="dropdown-menu" role="menu">
                  {visibleSub.map(({ path, label, iconKey }) => (
                    <button
                      key={path}
                      className={`dropdown-item${isActive(path) ? " active" : ""}`}
                      onClick={() => handleNav(path)}
                      role="menuitem"
                    >
                      <Icon name={iconKey} size={15} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Perfil (canto direito, desktop) ─────────────── */}
        <div
          className={[
            "nav-item",
            "has-dropdown",
            "navbar-perfil",
            openKey === "perfil" ? "open" : "",
          ].filter(Boolean).join(" ")}
        >
          <button
            className="nav-link navbar-perfil-btn"
            onClick={() => setOpenKey(openKey === "perfil" ? null : "perfil")}
            aria-haspopup="true"
            aria-expanded={openKey === "perfil"}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span className="navbar-perfil-nome">
              {user?.nome?.split(" ")[0] || "Perfil"}
            </span>
            <CaretDown />
          </button>

          <div className="dropdown-menu dropdown-menu--right" role="menu">
            {canAccessRoute(perfil, "/profile") && (
              <button
                className={`dropdown-item${isActive("/profile") ? " active" : ""}`}
                onClick={() => handleNav("/profile")}
                role="menuitem"
              >
                <Icon name="person" size={15} />
                Meu Perfil
              </button>
            )}
            <div className="dropdown-divider" />
            <button
              className="dropdown-item dropdown-item--danger"
              onClick={handleLogout}
              role="menuitem"
            >
              <Icon name="logout" size={15} />
              Sair
            </button>
          </div>
        </div>

        {/* ── Hamburguer (mobile) ──────────────────────────── */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ── Menu mobile expandido ────────────────────────────── */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          {visibleItems.map((item) => {
            if (!item.items) {
              return (
                <button
                  key={item.key}
                  className={`mobile-nav-item${isActive(item.path) ? " active" : ""}`}
                  onClick={() => handleNav(item.path)}
                >
                  {item.label}
                </button>
              );
            }

            const visibleSub = item.items.filter(({ path }) =>
              canAccessRoute(perfil, path)
            );
            if (!visibleSub.length) return null;

            return (
              <div key={item.key} className="mobile-nav-group">
                <span className="mobile-nav-group-label">{item.label}</span>
                {visibleSub.map(({ path, label, iconKey }) => (
                  <button
                    key={path}
                    className={`mobile-nav-item mobile-nav-sub${isActive(path) ? " active" : ""}`}
                    onClick={() => handleNav(path)}
                  >
                    <Icon name={iconKey} size={15} />
                    {label}
                  </button>
                ))}
              </div>
            );
          })}

          {/* Perfil no mobile */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Perfil</span>
            {canAccessRoute(perfil, "/profile") && (
              <button
                className={`mobile-nav-item mobile-nav-sub${isActive("/profile") ? " active" : ""}`}
                onClick={() => handleNav("/profile")}
              >
                <Icon name="person" size={15} />
                Meu Perfil
              </button>
            )}
            <button
              className="mobile-nav-item mobile-nav-sub mobile-nav-item--danger"
              onClick={handleLogout}
            >
              <Icon name="logout" size={15} />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
