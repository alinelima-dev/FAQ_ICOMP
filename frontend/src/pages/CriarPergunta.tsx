import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../services/api";
import "./css/CriarPergunta.css";
import CriarCategoria from "../components/CriarCategoria";

interface Categoria {
  id: number;
  name: string;
}

const CriarPergunta: React.FC = () => {
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    if (categoriaSelecionada === "None")
      newErrors.categoria = "Selecione uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      await api.post("/questions", {
        title: titulo,
        content,
        category_id: Number(categoriaSelecionada),
      });
      alert("Pergunta criada com sucesso!");
      navigate("/adm/perguntas");
    } catch (error) {
      console.error("Erro ao criar pergunta:", error);
      alert("Erro ao criar a pergunta.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
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
      <ReactQuill value={content} onChange={setContent} theme="snow" />
      {errors.content && (
        <Typography color="error" variant="body2">
          {errors.content}
        </Typography>
      )}
    </Box>

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

    <CriarCategoria onCategoriaCriada={fetchCategorias} />

    <Box display="flex" justifyContent="space-between">
      <Button variant="contained" color="success" onClick={handleSave}>
        Salvar
      </Button>
      <Button variant="outlined" onClick={() => navigate("/adm/perguntas")}>
        Cancelar
      </Button>
    </Box>
  </Box>
</Container>

  );
};

export default CriarPergunta;
