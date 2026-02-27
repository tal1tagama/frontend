import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../components/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout(); // invalida refreshToken no servidor e limpa localStorage
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h3>Sistema</h3>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}