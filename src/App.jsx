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
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Medicoes from "./pages/EnviarMedicao";
import Solicitacoes from "./pages/PurchaseRequest";
import Relatorios from "./pages/MeusRelatorios";
import StatusSolicitacao from "./pages/StatusSolicitacao";
import Upload from "./pages/Upload";
import Measurements from "./pages/measurements";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Páginas protegidas */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/medicoes" element={<PrivateRoute><Medicoes /></PrivateRoute>} />
          <Route path="/solicitacoes" element={<PrivateRoute><Solicitacoes /></PrivateRoute>} />
          <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
          <Route path="/status-solicitacoes" element={<PrivateRoute><StatusSolicitacao /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/medicoes-lista" element={<PrivateRoute><Measurements /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;