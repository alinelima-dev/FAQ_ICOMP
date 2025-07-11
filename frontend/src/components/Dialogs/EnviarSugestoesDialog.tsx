import { useFaqService } from "@contexts/FaqServiceContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EnviarSugestaoDialog: React.FC<Props> = ({ open, onClose }) => {
  const faqService = useFaqService();
  const { showSnackbar } = useSnackbar();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");

  const handleSubmit = async () => {
    try {
      await faqService.submitSuggestion({
        title: titulo,
        content: conteudo,
      });

      setTitulo("");
      setConteudo("");
      onClose();
      showSnackbar("Sugestão enviada com sucesso!", "success");
    } catch (error) {
      showSnackbar("Erro ao enviar sugestão.", "error");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Enviar sugestão de pergunta</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "visible",
        }}
      >
        <TextField
          label="Título da sugestão"
          variant="outlined"
          fullWidth
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <TextField
          label="Descrição / conteúdo"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnviarSugestaoDialog;
