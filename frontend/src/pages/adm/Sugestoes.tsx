import React, { useEffect, useState } from "react";
import NavbarAdm from "../../components/NavbarAdm";
import { Table, Input } from "reactstrap";
import { Button } from "@mui/material";
import "./css/perguntas.css"; // reusa o estilo
import { useFaqService } from "@contexts/FaqServiceContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import { ISuggestion } from "types/faqTypes";

const Sugestoes: React.FC = () => {
  const faqService = useFaqService();
  const { showSnackbar } = useSnackbar();

  const [sugestoes, setSugestoes] = useState<ISuggestion[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await faqService.getSuggestions();
        setSugestoes(res);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        showSnackbar("Erro ao carregar sugestões", "error");
      }
    };

    fetchSuggestions();
  }, []);

  const sugestoesFiltradas = sugestoes.filter((s) =>
    s.title.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div>
      <NavbarAdm />
      <div className="container">
        <div className="perguntas-header">
          <h2>Sugestões Recebidas</h2>
        </div>

        <div className="filters-container">
          <div className="filter">
            <Input
              type="text"
              placeholder="Pesquisar por título"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="search-bar"
            />
          </div>
        </div>

        <Table striped hover responsive className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Conteúdo</th>
            </tr>
          </thead>
          <tbody>
            {sugestoesFiltradas.map((sugestao, index) => (
              <tr key={sugestao.id}>
                <td>{index + 1}</td>
                <td>{sugestao.title}</td>
                <td>{sugestao.content}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Sugestoes;
