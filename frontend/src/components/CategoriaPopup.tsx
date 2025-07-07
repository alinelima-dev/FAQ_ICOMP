import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useSnackbar } from "@contexts/SnackbarContext";
import { SnackbarMessage } from "@locales/locale";

interface CategoriaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nome: string) => Promise<void>;
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

  const { showSnackbar } = useSnackbar();

  const handleSave = async () => {
    if (!nome.trim()) {
      showSnackbar(SnackbarMessage.mandatoryCategory, "error");
      return;
    }

    if (nome === initialValue) {
      showSnackbar(SnackbarMessage.noChanges, "info");
      return;
    }

    try {
      await onSubmit(nome);
      showSnackbar(SnackbarMessage.savedCategory, "success");
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar categoria no frontend:", error);

      let errorMessage = "Erro desconhecido ao salvar categoria.";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showSnackbar(errorMessage, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: "90%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" textAlign="center">
          {titulo}
        </Typography>

        <TextField
          fullWidth
          label="Nome da Categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 2,
          }}
        >
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoriaPopup;
