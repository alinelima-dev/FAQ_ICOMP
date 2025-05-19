import React, { useState } from "react";
import { Button } from "@mui/material";


import api from "../services/api";
import CategoriaPopup from "./CategoriaPopup";
import "./css/CriarCategoria.css";

import { MdAddCircle } from "react-icons/md";

interface CriarCategoriaProps {
  onCategoriaCriada: () => void;
}

const CriarCategoria: React.FC<CriarCategoriaProps> = ({
  onCategoriaCriada,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (nome: string) => {
    try {
      await api.post("/categories", { name: nome });
      alert("Categoria criada com sucesso!");
      onCategoriaCriada();
      setIsOpen(false);
    } catch (err) {
      alert("Erro ao criar categoria.");
    }
  };

  return (
    <div className="button-container">
      <Button
        color="primary"
        className="action-button"
        variant="contained"
        onClick={() => setIsOpen(true)}
      >
        <MdAddCircle size={20} style={{ marginRight: 5 }} />
        Criar Categoria
      </Button>
      <CategoriaPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialValue=""
        titulo="Criar Nova Categoria"
      />
    </div>
  );
};

export default CriarCategoria;
