// src/components/Modal.jsx
// Modal minimalista para exibir Termos, Política de Privacidade e Ajuda
import { useEffect } from "react";
import "../styles/modal.css";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Previne scroll no body quando modal está aberto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button type="button" className="button-secondary modal-btn-close" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
