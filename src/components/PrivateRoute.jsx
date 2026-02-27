// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute } from "../constants/permissions";

const PrivateRoute = ({ children, routePath }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (routePath && !canAccessRoute(user?.perfil, routePath)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;