import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import PurchaseRequest from "./pages/PurchaseRequest";
import "./App.css";

function App() {
    return (
        <div>
            <Navbar />
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/purchase" element={<PrivateRoute><PurchaseRequest /></PrivateRoute>} /> {/* nova rota */}
        </Routes>
        </div>
    );
}

export default App;
