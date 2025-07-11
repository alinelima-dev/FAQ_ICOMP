import React, { useEffect, useState } from "react";
import { Table, Input } from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { Button } from "@mui/material";
import NavbarAdm from "../../components/NavbarAdm";
import "./css/perguntas.css";
import { useFaqService } from "@contexts/FaqServiceContext";
import ConfirmarExclusao from "@components/Dialogs/ConfirmarExclusão";
import CriarPerguntaDialog from "@components/Dialogs/CriarPerguntaDialog";
import EditarPerguntaDialog from "@components/Dialogs/EditarPerguntaDialog";

import { IQuestion, ICategory } from "types/faqTypes";
import { useSnackbar } from "@contexts/SnackbarContext";
import { GenericMessage, SnackbarMessage } from "@locales/locale";

const Perguntas: React.FC = () => {
  const faqService = useFaqService();
  const [perguntas, setPerguntas] = useState<IQuestion[]>([]);
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("None");
  const [pesquisa, setPesquisa] = useState("");
  const [perguntaParaExcluir, setPerguntaParaExcluir] =
    useState<IQuestion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openCriar, setOpenCriar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [perguntaSelecionada, setPerguntaSelecionada] =
    useState<IQuestion | null>(null);

  const { showSnackbar } = useSnackbar();

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

  const atualizarPerguntasECategorias = async () => {
    try {
      const perguntasRes = await faqService.getQuestions();
      const categoriasRes = await faqService.getCategories();
      setPerguntas(perguntasRes);
      setCategorias(categoriasRes);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    }
  };

  const openModal = (pergunta: IQuestion) => {
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
      showSnackbar(SnackbarMessage.deletedQuestion, "success");
    } catch (error) {
      showSnackbar(SnackbarMessage.errorDeleteQuestion, "error");
      console.error(error);
    }
  };

  const perguntasFiltradas = (perguntas ?? []).filter((pergunta) => {
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
    <div>
      <NavbarAdm />
      <div className="container">
        <div className="perguntas-header">
          <h2>{GenericMessage.questionTitle}</h2>
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
                  {pergunta.categories && pergunta.categories.length > 0
                    ? pergunta.categories.map((c) => c.name).join(", ")
                    : "Sem Categoria"}
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
        onPerguntaCriada={atualizarPerguntasECategorias}
      />

      {perguntaSelecionada && (
        <EditarPerguntaDialog
          open={openEditar}
          pergunta={perguntaSelecionada}
          onClose={() => setOpenEditar(false)}
          onPerguntaEditada={atualizarPerguntasECategorias}
        />
      )}

      <ConfirmarExclusao
        open={modalOpen}
        itemDescricao={` "${perguntaParaExcluir?.title}"`}
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
};

export default Perguntas;
