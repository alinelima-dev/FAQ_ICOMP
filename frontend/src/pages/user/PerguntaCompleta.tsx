import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import Navbar from "../../components/Navbar";
import "./css/PerguntaCompleta.css";
import { useFaqService } from "@contexts/FaqServiceContext";
import { Question } from "types/faqTypes";

const PerguntaCompleta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pergunta, setPergunta] = useState<Question | null>(null);
  const [categoria, setCategoria] = useState<string>("");
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
        console.error("Erro ao buscar dados da pergunta ou categoria:", error);
      }
    };

    fetchData();
  }, [id, faqService]);

  if (!pergunta) {
    return (
      <div>
        <Navbar />
        <p>Carregando pergunta...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pergunta-completa-container">
        <h1 className="pergunta-titulo">{pergunta.title}</h1>
        <p className="pergunta-categoria">
          Categoria: <strong>{categoria || "Sem Categoria"}</strong>
        </p>
        <div
          className="pergunta-conteudo"
          dangerouslySetInnerHTML={{ __html: pergunta.content }}
        />
        <Button color="secondary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default PerguntaCompleta;
