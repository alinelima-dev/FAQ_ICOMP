import React from "react";
import CategoriaModal from "./CategoriaPopup";
import { Box } from "@mui/material";
import { useSnackbar } from "@contexts/SnackbarContext";
import { useFaqService } from "@contexts/FaqServiceContext";
import { Category } from "types/faqTypes";
import { SnackbarMessage } from "@locales/locale";

interface EditarCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: Category;
  onCategoriaEditada: () => void;
}

const EditarCategoria: React.FC<EditarCategoriaProps> = ({
  isOpen,
  onClose,
  categoria,
  onCategoriaEditada,
}) => {
  const { showSnackbar } = useSnackbar();
  const faqService = useFaqService();

  const handleSubmit = async (newName: string) => {
    try {
      await faqService.updateCategory(Number(categoria.id), { name: newName });

      showSnackbar(SnackbarMessage.editedCategory, "success");

      onCategoriaEditada();
      onClose();
    } catch (error) {
      showSnackbar(SnackbarMessage.errorEditCategory, "error");
    }
  };

  return (
    <Box>
      <CategoriaModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        initialValue={categoria.name}
        titulo="Editar Categoria"
      />
    </Box>
  );
};

export default EditarCategoria;
