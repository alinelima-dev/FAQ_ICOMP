import React, { useState } from "react";
import { Button } from "@mui/material";
import CategoriaPopup from "./CategoriaPopup";
import "./css/CriarCategoria.css";
import { MdAddCircle } from "react-icons/md";
import { useFaqService } from "@contexts/FaqServiceContext";
import { GenericMessage } from "@locales/locale";

interface CriarCategoriaProps {
  onCategoriaCriada: () => void;
}

const CriarCategoria: React.FC<CriarCategoriaProps> = ({
  onCategoriaCriada,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const faqService = useFaqService();

  const handleSubmit = async (nome: string) => {
    await faqService.createCategory({ name: nome });
    onCategoriaCriada();
    setIsOpen(false);
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
        {GenericMessage.createCategory}
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
