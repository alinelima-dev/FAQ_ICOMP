import React from "react";
import api from "../services/api";
import CategoriaModal from "./CategoriaPopup";

interface Categoria {
  id: number;
  name: string;
}

interface EditarCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: Categoria;
  onCategoriaEditada: () => void;
}

const EditarCategoria: React.FC<EditarCategoriaProps> = ({
  isOpen,
  onClose,
  categoria,
  onCategoriaEditada,
}) => {
  const handleSubmit = async (nome: string) => {
    try {
      await api.put(`/categories/${categoria.id}`, { name: nome });
      alert("Categoria editada com sucesso!");
      onCategoriaEditada();
      onClose();
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
      alert("Erro ao editar a categoria.");
    }
  };

  return (
    <CategoriaModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValue={categoria.name}
      titulo="Editar Categoria"
    />
  );
};

export default EditarCategoria;
