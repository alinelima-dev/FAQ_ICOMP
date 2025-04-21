import React, { useEffect, useState } from "react";
import './css/CategoriaPopup.css'

interface CategoriaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nome: string) => void;
  initialValue?: string;
  titulo: string;
}

const CategoriaPopup: React.FC<CategoriaPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValue = "",
  titulo,
}) => {
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    if (!nome.trim()) {
      alert("O nome da categoria é obrigatório.");
      return;
    }
    onSubmit(nome);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>{titulo}</h2>
        <input
          className="popup-input"
          type="text"
          placeholder="Digite o nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <div className="popup-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn confirm" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaPopup;
