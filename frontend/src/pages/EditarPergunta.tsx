import React, { useEffect, useState } from "react";
import { Button, Input, Form, FormGroup, Label } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../services/api";
import "./css/EditarPergunta.css";

interface Categoria {
  id: number;
  name: string;
}

interface Pergunta {
  title: string;
  content: string;
  category_id: number;
}

const EditarPergunta: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [titulo, setTitulo] = useState("");
  const [content, setContent] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perguntaRes = await api.get<Pergunta>(`/questions/${id}`);
        setTitulo(perguntaRes.data.title);
        setContent(perguntaRes.data.content);
        setCategoriaSelecionada(perguntaRes.data.category_id.toString());

        const categoriasRes = await api.get<Categoria[]>("/categories");
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados da pergunta ou categorias:", error);
      }
    };

    fetchData();
  }, [id]);

  const validateFields = () => {
    const newErrors: typeof errors = {};
    if (!titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!content.trim()) newErrors.content = "O conteúdo é obrigatório.";
    if (categoriaSelecionada === "None")
      newErrors.categoria = "Você deve selecionar uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      await api.put(`/questions/${id}`, {
        title: titulo,
        content,
        category_id: Number(categoriaSelecionada),
      });
      alert("Pergunta atualizada com sucesso!");
      navigate("/adm/perguntas");
    } catch (error) {
      console.error("Erro ao atualizar pergunta:", error);
      alert("Erro ao atualizar pergunta.");
    }
  };

  return (
    <div className="editar-pergunta-container">
      <h2>Editar Pergunta</h2>
      <Form>
        <FormGroup>
          <Label for="titulo">Título</Label>
          <Input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            invalid={!!errors.titulo}
          />
          {errors.titulo && <p className="error-message">{errors.titulo}</p>}
        </FormGroup>
        <FormGroup>
          <Label for="content">Conteúdo (Resposta)</Label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            placeholder="Digite a resposta aqui..."
          />
          {errors.content && <p className="error-message">{errors.content}</p>}
        </FormGroup>
        <FormGroup>
          <Label for="categoria">Categoria</Label>
          <Input
            id="categoria"
            type="select"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            invalid={!!errors.categoria}
          >
            <option value="None">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </Input>
          {errors.categoria && <p className="error-message">{errors.categoria}</p>}
        </FormGroup>
        <Button color="success" onClick={handleSave}>
          Salvar
        </Button>{" "}
        <Button color="secondary" onClick={() => navigate("/adm/perguntas")}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default EditarPergunta;
