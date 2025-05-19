import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import "./css/Home.css";
import CardPergunta from "../../components/CardPergunta";

interface Pergunta {
  id: number;
  title: string;
  content: string;
  category_id: number;
}

interface Categoria {
  id: number;
  name: string;
}

const Home: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const perguntasRes = await api.get<Pergunta[]>("/questions");
        const categoriasRes = await api.get<Categoria[]>("/categories");
        setPerguntas(perguntasRes.data);
        setCategorias(categoriasRes.data);
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
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <Input
          type="select"
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
          style={{ width: "300px" }}
        >
          <option value="None">Todas as Categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </Input>
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
