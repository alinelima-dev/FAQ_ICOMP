import React, { useState } from "react";
import api from "../services/api";
import CategoriaPopup from "./CategoriaPopup";

interface CriarCategoriaProps {
  onCategoriaCriada: () => void;
}

const CriarCategoria: React.FC<CriarCategoriaProps> = ({ onCategoriaCriada }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (nome: string) => {
    try {
      await api.post("/categories", { name: nome });
      alert("Categoria criada com sucesso!");
      onCategoriaCriada();
      setIsOpen(false); // fecha o modal após criar
    } catch (err) {
      alert("Erro ao criar categoria.");
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn confirm">
        Criar Categoria
      </button>
      <CategoriaPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialValue=""
        titulo="Criar Nova Categoria"
      />
    </>
  );
};

export default CriarCategoria;
