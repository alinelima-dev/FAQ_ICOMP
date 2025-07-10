import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Typography,
  Button as MuiButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../../components/Navbar";
import { useFaqService } from "@contexts/FaqServiceContext";
import { IQuestion } from "types/faqTypes";
import AttachmentList from "@components/ListaAnexos";

const PerguntaCompleta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pergunta, setPergunta] = useState<IQuestion | null>(null);
  const [categoria, setCategoria] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const faqService = useFaqService();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const perguntaData = await faqService.getQuestionById(Number(id));
        setPergunta(perguntaData);

        const categoriaData = await faqService.getCategoryById(
          perguntaData.category_id
        );
        setCategoria(categoriaData.name);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, faqService]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="60vh"
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!pergunta) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <Typography variant="h6" color="error">
            Pergunta não encontrada.
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box>
      <Navbar />
      <Box
        maxWidth="900px"
        mx="auto"
        my={5}
        px={{ xs: 2, sm: 4 }}
        py={4}
        borderRadius={5}
        boxShadow={4}
        bgcolor="#fafafa"
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            color: "#fff",
            p: { xs: 3, sm: 4 },
            borderRadius: "16px 16px 0 0",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, fontSize: { xs: "1.7rem", sm: "2.2rem" } }}
          >
            {pergunta.title}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" mt={2}>
          <Chip
            label={categoria || "Sem Categoria"}
            color="primary"
            variant="outlined"
            sx={{
              fontSize: "0.95rem",
              fontWeight: 500,
              px: 2,
              py: 0.5,
              borderRadius: "8px",
            }}
          />
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff",
            mt: 3,
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.7,
            color: "#444",
            maxHeight: "65vh",
            overflowY: "auto",
          }}
          dangerouslySetInnerHTML={{ __html: pergunta.content }}
        />

        {pergunta.attachments && pergunta.attachments.length > 0 && (
          <Box mt={3}>
            <AttachmentList attachments={pergunta.attachments} />
          </Box>
        )}

        <Box display="flex" justifyContent="center" mt={4}>
          <MuiButton
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: 2,
            }}
            onClick={() => navigate(-1)}
          >
            Voltar
          </MuiButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PerguntaCompleta;
