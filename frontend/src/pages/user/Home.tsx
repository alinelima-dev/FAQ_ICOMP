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
} from "@mui/material";
import CardPergunta from "../../components/CardPergunta";
import { Category, Question } from "types/faqTypes";
import { useFaqService } from "@contexts/FaqServiceContext";

const Home: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Question[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);

  const faqService = useFaqService();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const perguntasRes = await faqService.getQuestions();
        const categoriasRes = await faqService.getCategories();
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
      pergunta.category_id === parseInt(categoriaSelecionada);
    const pesquisaValida =
      pesquisa.trim() === "" ||
      pergunta.title.toLowerCase().includes(pesquisa.toLowerCase());
    return categoriaValida && pesquisaValida;
  });

  return (
    <div>
      <Navbar onSearch={setPesquisa} />

      {/* Filtros */}
      <Box sx={{ display: "flex", justifyContent: "center", my: 3, gap: 2 }}>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel sx={{ pb: 4 }} id="categoria-label">
            Categoria
          </InputLabel>
          <Select
            labelId="categoria-label"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            label="Categoria"
            sx={{
              borderRadius: 2,
              fontSize: 16,
              backgroundColor: "#fff",
            }}
          >
            <MenuItem value="None">Todas as Categorias</MenuItem>
            {categorias
              .filter((categoria) =>
                perguntas.some((p) => p.category_id === categoria.id)
              )
              .map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loader ou cards */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center" sx={{ px: 3 }}>
          {perguntasFiltradas.map((pergunta) => (
            <Grid item xs={12} sm={6} md={4} key={pergunta.id}>
              <CardPergunta
                id={pergunta.id}
                title={pergunta.title}
                content={pergunta.content}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Home;
