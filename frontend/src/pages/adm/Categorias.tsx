import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Button } from "@mui/material";

import NavbarAdm from "../../components/NavbarAdm";
import CriarCategoria from "../../components/CriarCategoria";
import EditarCategoria from "../../components/EditarCategoria";
import { FaEdit, FaTrash } from "react-icons/fa";

import { useFaqService } from "@contexts/FaqServiceContext";
import { ICategory } from "types/faqTypes";
import { useSnackbar } from "@contexts/SnackbarContext";
import { GenericMessage, SnackbarMessage } from "@locales/locale";

const Categorias: React.FC = () => {
  const faqService = useFaqService();
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<ICategory | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { showSnackbar } = useSnackbar();

  const fetchCategorias = async () => {
    try {
      const data = await faqService.getCategories();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleEdit = (categoria: ICategory) => {
    setCategoriaSelecionada(categoria);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await faqService.deleteCategory(id);
      setCategorias(categorias.filter((c) => c.id !== id));
      showSnackbar(SnackbarMessage.deletedCategory, "success");
    } catch (error: any) {
      const msg = error?.message || SnackbarMessage.errorDeleteCategory;
      showSnackbar(msg, "error");
    }
  };

  return (
    <div>
      <NavbarAdm />
      <div className="container">
        <div className="categorias-header">
          <h2>{GenericMessage.categoryTitle}</h2>
          <CriarCategoria onCategoriaCriada={fetchCategorias} />
        </div>
        <Table striped hover responsive className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <tr key={categoria.id}>
                <td>{index + 1}</td>
                <td>{categoria.name}</td>
                <td>
                  <div className="actionButton">
                    <Button
                      color="primary"
                      className="action-button"
                      variant="contained"
                      onClick={() => handleEdit(categoria)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      color="error"
                      className="action-button"
                      variant="contained"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {categoriaSelecionada && (
          <EditarCategoria
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            categoria={categoriaSelecionada}
            onCategoriaEditada={fetchCategorias}
          />
        )}
      </div>
    </div>
  );
};

export default Categorias;
