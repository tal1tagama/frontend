import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/pages.css";
import "./App.css";           
import "./styles/main.css";   

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Service Worker somente em produção.
// Em desenvolvimento, remove qualquer SW ativo para evitar cache antigo.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/service-worker.js");
    } else {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    }
  });
}