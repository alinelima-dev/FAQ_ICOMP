import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../services/api";
import "./css/EditarPergunta.css";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

interface Categoria {
  id: number;
  name: string;
}

interface Pergunta {
  id: number;
  title: string;
  content: string;
  category_id: number;
}

interface EditarPerguntaProps {
  pergunta: Pergunta;
  onClose: () => void;
  onPerguntaEditada: () => void;
}

const EditarPergunta: React.FC<EditarPerguntaProps> = ({
  pergunta,
  onClose,
  onPerguntaEditada,
}) => {
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    number | string
  >(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (pergunta) {
      setTitulo(pergunta.title);
      setContent(pergunta.content);
      setCategoriaSelecionada(pergunta.category_id.toString());
    }

    const fetchCategorias = async () => {
      try {
        const categoriasRes = await api.get<Categoria[]>("/categories");
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, [pergunta]);

  const validateFields = () => {
    const newErrors: typeof errors = {};
    if (!titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!content.trim()) newErrors.content = "O conteúdo é obrigatório.";
    if (categoriaSelecionada === "None")
      newErrors.categoria = "Você deve selecionar uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);

    try {
      await api.put(`/questions/${pergunta.id}`, {
        title: titulo,
        content,
        category_id: Number(categoriaSelecionada),
      });
      setDialogTitle("Sucesso");
      setDialogMessage("Pergunta editada com sucesso!");
      setOpenDialog(true);
    } catch (error) {
      setDialogTitle("Erro");
      setDialogMessage("Erro ao atualizar pergunta");
      setOpenDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    onPerguntaEditada();
    onClose();
    if (dialogTitle === "Sucesso") {
      navigate("/adm/perguntas");
    }
  };

  return (
    <Box p={3}>
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button
          onClick={onClose}
          aria-label="Fechar campo de edição de pergunta"
        >
          Fechar
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        Editar Pergunta
      </Typography>
      <Box display={"flex"} flexDirection={"column"} gap={3}>
        <TextField
          label="Titulo"
          variant="outlined"
          fullWidth
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          error={!!errors.titulo}
          helperText={errors.titulo}
          autoFocus
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
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <MenuItem value="None">Selecione uma categoria</MenuItem>
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
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={isSubmitting}
            aria-label="Salvar edições da pergunta"
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

export default EditarPergunta;
