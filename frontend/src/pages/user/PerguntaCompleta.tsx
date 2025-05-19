import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import "./css/PerguntaCompleta.css";

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

const PerguntaCompleta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const [categoria, setCategoria] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPergunta = async () => {
      try {
        const perguntaRes = await api.get<Pergunta>(`/questions/${id}`);
        setPergunta(perguntaRes.data);

        const categoriaRes = await api.get<Categoria>(`/categories/${perguntaRes.data.category_id}`);
        setCategoria(categoriaRes.data.name);
      } catch (error) {
        console.error("Erro ao buscar dados da pergunta ou categoria:", error);
      }
    };

    fetchPergunta();
  }, [id]);

  if (!pergunta) {
    return (
      <div>
        <Navbar/>
        <p>Carregando pergunta...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
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
