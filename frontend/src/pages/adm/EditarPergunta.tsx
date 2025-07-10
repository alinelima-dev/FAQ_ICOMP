import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { IAttachment, ICategory, IQuestion } from "types/faqTypes";
import { useFaqService } from "@contexts/FaqServiceContext";
import { GenericMessage } from "@locales/locale";
import AttachmentList from "@components/ListaAnexos";
import AttachmentUploadList from "@components/ListaUploadAnexos";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface EditarPerguntaProps {
  pergunta: IQuestion;
  onClose: () => void;
  onPerguntaEditada: () => void;
}

const EditarPergunta: React.FC<EditarPerguntaProps> = ({
  pergunta,
  onClose,
  onPerguntaEditada,
}) => {
  const faqService = useFaqService();
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    number | string
  >(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<IAttachment[]>(
    []
  );
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (pergunta) {
      setTitulo(pergunta.title);
      setContent(pergunta.content);
      setCategoriaSelecionada(pergunta.category_id.toString());
      setExistingAttachments(pergunta.attachments || []);
    }

    const fetchCategorias = async () => {
      try {
        const data = await faqService.getCategories();
        setCategorias(data);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAttachment = (id: number) => {
    setExistingAttachments((prev) => prev.filter((att) => att.id !== id));
    setDeletedAttachmentIds((prev) => [...prev, id]);
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", titulo);
      formData.append("content", content);
      formData.append("category_id", categoriaSelecionada.toString());

      attachments.forEach((file) => formData.append("attachments", file));
      deletedAttachmentIds.forEach((id) => {
        formData.append("deleted_ids", id.toString());
      });

      await faqService.updateQuestion(pergunta.id, formData, true);
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

  const handleQuillChange = (value: string) => {
    setContent(value);
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
        {GenericMessage.editQuestionTitle}
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
              value={categoriaSelecionada}
              label="Categoria"
              onChange={(e) => setCategoriaSelecionada(Number(e.target.value))}
            >
              <MenuItem value="">Selecione uma categoria</MenuItem>
              {[...categorias]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((categoria) => (
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

          <FormControl fullWidth>
            {existingAttachments.length > 0 && (
              <Box mb={2}>
                <AttachmentList
                  attachments={existingAttachments}
                  onDelete={handleRemoveExistingAttachment}
                />
              </Box>
            )}

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
