import React, { useEffect, useState } from "react";
import { Table, Input } from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { Button } from "@mui/material";
import NavbarAdm from "../../components/NavbarAdm";
import api from "../../services/api";
import "./css/perguntas.css";
import CriarPergunta from "../adm/CriarPergunta";
import EditarPergunta from "../adm/EditarPergunta";
import { useFaqService } from "@contexts/FaqServiceContext";
import ConfirmarExclusao from "@components/Dialogs/ConfirmarExclusão";
import CriarPerguntaDialog from "@components/Dialogs/CriarPerguntaDialog";
import EditarPerguntaDialog from "@components/Dialogs/EditarPerguntaDialog";

import { Question, Category } from "types/faqTypes";

const Perguntas: React.FC = () => {
  const faqService = useFaqService();
  const [perguntas, setPerguntas] = useState<Question[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [pesquisa, setPesquisa] = useState("");
  const [perguntaParaExcluir, setPerguntaParaExcluir] =
    useState<Question | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mostrarCriarPergunta, setMostrarCriarPergunta] = useState(false);
  const [openCriar, setOpenCriar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [mostrarEditarPergunta, setMostrarEditarPergunta] = useState(false);
  const [perguntaSelecionada, setPerguntaSelecionada] =
    useState<Question | null>(null);

  const fetchPerguntas = async () => {
    try {
      const data = await faqService.getQuestions();
      setPerguntas(data);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perguntasRes = await faqService.getQuestions();
        const categoriasRes = await faqService.getCategories();
        setPerguntas(perguntasRes);
        setCategorias(categoriasRes);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = (pergunta: Question) => {
    setPerguntaParaExcluir(pergunta);
    setModalOpen(true);
  };

  const closeModal = () => {
    setPerguntaParaExcluir(null);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!perguntaParaExcluir) return;
    try {
      await faqService.deleteQuestion(perguntaParaExcluir.id);
      setPerguntas(perguntas.filter((p) => p.id !== perguntaParaExcluir.id));
      closeModal();
      alert("Pergunta deletada com sucesso!");
    } catch (error) {
      alert("Erro ao deletar a pergunta.");
      console.error(error);
    }
  };

  const perguntasFiltradas = perguntas.filter((pergunta) => {
    const categoriaValida =
      categoriaSelecionada === "None" ||
      pergunta.category_id === Number(categoriaSelecionada);
    const pesquisaValida =
      pesquisa.trim() === "" ||
      pergunta.title.toLowerCase().includes(pesquisa.toLowerCase());
    return categoriaValida && pesquisaValida;
  });

  return (
    <div>
      <NavbarAdm />
      <div className="container">
        <div className="perguntas-header">
          <h2>Perguntas</h2>
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
          <div className="filter">
            <Input
              type="select"
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
              className="dropdown-filter"
            >
              <option value="None">Todas as Categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </Input>
          </div>

          <div className="button-container">
            <Button
              color="primary"
              className="action-button"
              variant="contained"
              onClick={() => setOpenCriar(true)}
            >
              <MdAddCircle size={20} style={{ marginRight: 5 }} />
              Criar Pergunta
            </Button>
          </div>
        </div>

        <Table striped hover responsive className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {perguntasFiltradas.map((pergunta, index) => (
              <tr key={pergunta.id}>
                <td>{index + 1}</td>
                <td>{pergunta.title}</td>
                <td>
                  {categorias.find((c) => c.id === pergunta.category_id)
                    ?.name || "Sem Categoria"}
                </td>
                <td>
                  <div className="actionButton">
                    <Button
                      color="primary"
                      className="action-button"
                      variant="contained"
                      onClick={() => {
                        setPerguntaSelecionada(pergunta);
                        setOpenEditar(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      color="error"
                      className="action-button"
                      variant="contained"
                      onClick={() => openModal(pergunta)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CriarPerguntaDialog
        open={openCriar}
        onClose={() => setOpenCriar(false)}
        onPerguntaCriada={fetchPerguntas}
      />

      {perguntaSelecionada && (
        <EditarPerguntaDialog
          open={openEditar}
          pergunta={perguntaSelecionada}
          onClose={() => setOpenEditar(false)}
          onPerguntaEditada={fetchPerguntas}
        />
      )}

      <ConfirmarExclusao
        open={modalOpen}
        itemDescricao={` "${perguntaParaExcluir?.title}"`}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />

      {mostrarCriarPergunta && (
        <CriarPergunta
          onClose={() => setMostrarCriarPergunta(false)}
          onPerguntaCriada={() => {
            setMostrarCriarPergunta(false);
            api
              .get<Question[]>("/questions")
              .then((res) => setPerguntas(res.data));
          }}
        />
      )}

      {mostrarEditarPergunta && perguntaSelecionada && (
        <EditarPergunta
          pergunta={perguntaSelecionada}
          onClose={() => setMostrarEditarPergunta(false)}
          onPerguntaEditada={() => {
            setMostrarEditarPergunta(false);
            api
              .get<Question[]>("/questions/")
              .then((res) => setPerguntas(res.data));
          }}
        />
      )}
    </div>
  );
};

export default Perguntas;
