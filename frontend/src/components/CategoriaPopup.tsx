import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  useEffect(() => {
    if (isOpen) {
      setNome(initialValue);
      setSnackbarOpen(false);
      setSnackbarMessage("");
    }
  }, [isOpen, initialValue]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      setSnackbarMessage("O nome da categoria é obrigatório.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (nome === initialValue) {
      setSnackbarMessage("Nenhuma alteração foi feita.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    try {
      await onSubmit(nome);
      setSnackbarMessage("Categoria salva com sucesso.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar categoria no frontend:", error);

      let errorMessage = "Erro desconhecido ao salvar categoria.";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
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
    </>
  );
};

export default CategoriaPopup;
