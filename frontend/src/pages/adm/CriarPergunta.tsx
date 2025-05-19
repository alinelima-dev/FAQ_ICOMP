import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../services/api";
import "./css/CriarPergunta.css";
import CriarCategoria from "../../components/CriarCategoria";

interface Categoria {
  id: number;
  name: string;
}

interface CriarPerguntaProps {
  onClose: () => void;
  onPerguntaCriada: () => void;
}

const CriarPergunta: React.FC<CriarPerguntaProps> = ({
  onClose,
  onPerguntaCriada,
}) => {
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    number | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchCategorias = async () => {
    try {
      const response = await api.get<Categoria[]>("/categories");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const validateFields = () => {
    const newErrors: typeof errors = {};
    if (!titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!content.trim()) newErrors.content = "O conteúdo é obrigatório.";
    if (!categoriaSelecionada) newErrors.categoria = "Selecione uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);

    try {
      await api.post("/questions", {
        title: titulo,
        content,
        category_id: categoriaSelecionada,
      });
      setDialogTitle("Sucesso");
      setDialogMessage("Pergunta criada com sucesso!");
      setOpenDialog(true);
    } catch (error) {
      console.error("Erro ao criar pergunta:", error);
      setDialogTitle("Erro");
      setDialogMessage("Erro ao criar a pergunta.");
      setOpenDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    onPerguntaCriada();
    onClose();
    if (dialogTitle === "Sucesso") {
      navigate("/adm/perguntas");
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={onClose}>Fechar</Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        Criar Nova Pergunta
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          label="Título"
          variant="outlined"
          fullWidth
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          error={!!errors.titulo}
          helperText={errors.titulo}
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Conteúdo (Resposta)
          </Typography>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            aria-label="Editor de conteúdo"
          />
          {errors.content && (
            <Typography color="error" variant="body2">
              {errors.content}
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between">
          <FormControl fullWidth error={!!errors.categoria}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoriaSelecionada}
              label="Categoria"
              onChange={(e) => setCategoriaSelecionada(Number(e.target.value))}
            >
              <MenuItem>Selecione uma categoria</MenuItem>
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoria && (
              <Typography color="error" variant="body2">
                {errors.categoria}
              </Typography>
            )}
          </FormControl>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <CriarCategoria onCategoriaCriada={fetchCategorias} />
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Salvar"
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
              open={openDialog}
              autoHideDuration={2000}
              onClose={handleDialogClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleDialogClose}
                severity={dialogTitle === "Sucesso" ? "success" : "error"}
                sx={{ width: "100%" }}
              >
                {dialogMessage}
              </Alert>
            </Snackbar>
    </Box>
  );
};

export default CriarPergunta;
