// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";              
import "./styles/main.css";    
import "./styles/pages.css";

// Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Medicoes from "./pages/EnviarMedicao";
import Solicitacoes from "./pages/PurchaseRequest";
import Relatorios from "./pages/MeusRelatorios";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página de login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard e páginas internas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/medicoes"
            element={
              <PrivateRoute>
                <Medicoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/solicitacoes"
            element={
              <PrivateRoute>
                <Solicitacoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Relatorios />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;