import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  Box,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Container,
} from "@mui/material";
import CardPergunta from "../../components/CardPergunta";
import { ICategory, IQuestion } from "types/faqTypes";
import { useFaqService } from "@contexts/FaqServiceContext";
import EnviarSugestaoDialog from "@components/Dialogs/EnviarSugestoesDialog";

const Home: React.FC = () => {
  const [perguntas, setPerguntas] = useState<IQuestion[]>([]);
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [openSugestao, setOpenSugestao] = useState(false);

  const faqService = useFaqService();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const perguntasRes = await faqService.getQuestions();
        const categoriasRes = await faqService.getCategories();

        setPerguntas(perguntasRes);
        if (!Array.isArray(perguntasRes)) {
          throw new Error("Retorno de perguntas não é um array");
        }

        setPerguntas(perguntasRes);
        setCategorias(categoriasRes);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const perguntasFiltradas = perguntas.filter((pergunta) => {
    const categoriaValida =
      categoriaSelecionada === "None" ||
      pergunta.categories.some(
        (cat) => cat.id === parseInt(categoriaSelecionada)
      );

    const pesquisaValida =
      pesquisa.trim() === "" ||
      pergunta.title.toLowerCase().includes(pesquisa.toLowerCase());
    return categoriaValida && pesquisaValida;
  });

  return (
    <>
      <Navbar onSearch={setPesquisa} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Filtro de categorias */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel id="categoria-label">Categoria</InputLabel>
            <Select
              labelId="categoria-label"
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
              label="Categoria"
              sx={{ borderRadius: 2, fontSize: 16, backgroundColor: "#fff" }}
            >
              <MenuItem value="None">Todas as Categorias</MenuItem>
              {categorias
                .filter((categoria) =>
                  perguntas.some((p) =>
                    p.categories?.some((cat) => cat.id === categoria.id)
                  )
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        {/* Conteúdo principal */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : perguntasFiltradas.length > 0 ? (
          <Grid container spacing={3} mb={3}>
            {perguntasFiltradas.map((pergunta) => (
              <Grid item xs={12} sm={6} md={4} key={pergunta.id}>
                <CardPergunta
                  key={pergunta.id}
                  id={pergunta.id}
                  title={pergunta.title}
                  content={pergunta.content}
                  categories={pergunta.categories || []}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Não encontramos nenhuma pergunta com esses critérios.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Se quiser, você pode enviar uma sugestão de pergunta.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSugestao(true)}
            >
              Enviar sugestão
            </Button>
          </Box>
        )}
      </Container>

      <EnviarSugestaoDialog
        open={openSugestao}
        onClose={() => setOpenSugestao(false)}
      />
    </>
  );
};

export default Home;
