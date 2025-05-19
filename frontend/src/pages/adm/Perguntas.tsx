import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { Dialog, Button } from "@mui/material";
import axios from "axios";
import NavbarAdm from "../../components/NavbarAdm";
import api from "../../services/api";
import "./css/perguntas.css";
import CriarPergunta from "../adm/CriarPergunta";
import EditarPergunta from "../adm/EditarPergunta";
//import EditarPergunta from "../components/EditarPergunta";

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

const Perguntas: React.FC = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [pesquisa, setPesquisa] = useState("");
  const [perguntaParaExcluir, setPerguntaParaExcluir] =
    useState<Pergunta | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mostrarCriarPergunta, setMostrarCriarPergunta] = useState(false);
  const [openCriar, setOpenCriar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [mostrarEditarPergunta, setMostrarEditarPergunta] = useState(false);
  const [perguntaSelecionada, setPerguntaSelecionada] =
    useState<Pergunta | null>(null);

  const fetchPerguntas = async () => {
    try {
      const response = await axios.get("http://localhost:3002/api/questions");
      setPerguntas(response.data);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perguntasRes = await api.get<Pergunta[]>("/questions");
        const categoriasRes = await api.get<Categoria[]>("/categories");
        setPerguntas(perguntasRes.data);
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = (pergunta: Pergunta) => {
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
      await api.delete(`/questions/${perguntaParaExcluir.id}`);
      setPerguntas(perguntas.filter((p) => p.id !== perguntaParaExcluir.id));
      closeModal();
      alert("Pergunta deletada com sucesso!");
    } catch (error) {
      alert("Erro ao deletar a pergunta.");
      console.error(error);
    }
  };

  /* const handleEditarClick = (id: string) => {
    setPerguntaParaEditarId(id);
    setMostrarEditarPergunta(true);
  }; */

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
            <Dialog
              open={openCriar}
              onClose={() => setOpenCriar(false)}
              maxWidth="md"
              fullWidth
            >
              <CriarPergunta
                onClose={() => setOpenCriar(false)}
                onPerguntaCriada={fetchPerguntas} // ou outro callback para atualizar a lista
              />
            </Dialog>
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
                    <Dialog
                      open={openEditar}
                      onClose={() => setOpenEditar(false)}
                      maxWidth="md"
                      fullWidth
                    >
                      {perguntaSelecionada && (
                        <EditarPergunta
                          pergunta={perguntaSelecionada}
                          onClose={() => setOpenEditar(false)}
                          onPerguntaEditada={fetchPerguntas}
                        />
                      )}
                    </Dialog>
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

      {/* Modal de confirmação */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Confirmar exclusão</ModalHeader>
        <ModalBody>
          Tem certeza que deseja excluir a pergunta "
          <strong>{perguntaParaExcluir?.title}</strong>"?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleDelete}>
            Sim, excluir
          </Button>{" "}
          <Button color="secondary" onClick={closeModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {mostrarCriarPergunta && (
        <CriarPergunta
          onClose={() => setMostrarCriarPergunta(false)}
          onPerguntaCriada={() => {
            setMostrarCriarPergunta(false);
            api
              .get<Pergunta[]>("/questions")
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
              .get<Pergunta[]>("/questions/")
              .then((res) => setPerguntas(res.data));
          }}
        />
      )}
    </div>
  );
};

export default Perguntas;
