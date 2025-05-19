import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { Button } from "@mui/material"

import NavbarAdm from "../../components/NavbarAdm";
import CriarCategoria from "../../components/CriarCategoria";
import EditarCategoria from "../../components/EditarCategoria";
import api from "../../services/api";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Categoria {
  id: number;
  name: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchCategorias = async () => {
    try {
      const response = await api.get<Categoria[]>("/categories");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleEdit = (categoria: Categoria) => {
    setCategoriaSelecionada(categoria);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategorias(categorias.filter((c) => c.id !== id));
      alert("Categoria deletada com sucesso!");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Erro ao deletar categoria";
      alert(msg);
    }

    
  };

  return (
    <div>
      <NavbarAdm />
      <div className="container">
        <div className="categorias-header">
          <h2>Categorias</h2>
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
