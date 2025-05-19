import React, { useState } from "react";
import api from "../services/api";
import CategoriaModal from "./CategoriaPopup";
import { Alert, Box, Snackbar } from "@mui/material";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (nome: string) => {
    try {
      await api.put(`/categories/${categoria.id}`, { name: nome });

      setSnackbarMessage("Categoria editada com sucesso!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      onCategoriaEditada();
      onClose();
    } catch (error) {
      setSnackbarMessage("Erro ao editar a categoria.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditarCategoria;
