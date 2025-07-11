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
  Checkbox,
  ListItemText,
} from "@mui/material";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "./css/CriarPergunta.css";
import CriarCategoria from "../../components/CriarCategoria";
import { useFaqService } from "@contexts/FaqServiceContext";
import { ICategory } from "types/faqTypes";
import { GenericMessage } from "@locales/locale";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AttachmentUploadList from "@components/ListaUploadAnexos";
import { useSnackbar } from "@contexts/SnackbarContext";

interface CriarPerguntaProps {
  onClose: () => void;
  onPerguntaCriada: () => void;
}

const CriarPergunta: React.FC<CriarPerguntaProps> = ({
  onClose,
  onPerguntaCriada,
}) => {
  const faqService = useFaqService();
  const { showSnackbar } = useSnackbar();

  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    number[]
  >([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const fetchCategorias = async () => {
    try {
      const data = await faqService.getCategories();
      setCategorias(data);
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
    if (categoriasSelecionadas.length === 0)
      newErrors.categoria = "Você deve selecionar ao menos uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", titulo);
      formData.append("content", content);
      const categoryIds = Array.isArray(categoriasSelecionadas)
        ? categoriasSelecionadas.map((id) => Number(id))
        : [Number(categoriasSelecionadas)];
      categoryIds.forEach((id) =>
        formData.append("category_id", id.toString())
      );

      attachments.forEach((file) => formData.append("attachments", file));

      await faqService.createQuestion(formData, true);
      showSnackbar("Pergunta criada com sucesso!", "success");
      onPerguntaCriada();
      onClose();
    } catch (error: any) {
      console.error("Erro ao criar pergunta:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao criar pergunta.";

      showSnackbar(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuillChange = (value: string) => {
    setContent(value);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={onClose}>Fechar</Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        {GenericMessage.createQuestionTitle}
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
            theme="snow"
            value={content}
            onChange={handleQuillChange}
            style={{ height: "200px", marginBottom: "50px" }}
          />
          {errors.content && (
            <Typography color="error" variant="body2">
              {errors.content}
            </Typography>
          )}
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
          mt={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <FormControl fullWidth error={!!errors.categoria}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoriasSelecionadas}
              label="Categoria"
              multiple
              onChange={(e) =>
                setCategoriasSelecionadas(e.target.value as number[])
              }
              renderValue={(selected) =>
                categorias
                  .filter((c) => selected.includes(c.id))
                  .map((c) => c.name)
                  .join(", ")
              }
            >
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  <Checkbox
                    checked={categoriasSelecionadas.includes(categoria.id)}
                  />
                  <ListItemText primary={categoria.name} />
                </MenuItem>
              ))}
            </Select>

            {errors.categoria && (
              <Typography color="error" variant="body2">
                {errors.categoria}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <AttachmentUploadList
              files={attachments}
              onRemove={handleRemoveFile}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileIcon />}
              sx={{ textTransform: "none" }}
            >
              Anexar arquivos
              <input
                type="file"
                hidden
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx"
                onChange={handleFileChange}
              />
            </Button>

            <Typography variant="caption" color="text.secondary" mt={1}>
              Tipos permitidos: JPG, PNG, PDF, XLS, XLSX — Tamanho máximo por
              arquivo: 5MB
            </Typography>
          </FormControl>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "stretch",
            justifyContent: { xs: "center", sm: "space-between" },
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            <CriarCategoria onCategoriaCriada={fetchCategorias} />
          </Box>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ width: { xs: "100%", sm: "auto" } }}
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
    </Box>
  );
};

export default CriarPergunta;
