import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import NavbarAdm from "../components/NavbarAdm";
import CriarCategoria from "../components/CriarCategoria";
import EditarCategoria from "../components/EditarCategoria";
import api from "../services/api";

interface Categoria {
  id: number;
  name: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
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
        <Table striped>
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
                  <Button color="warning" size="sm" onClick={() => handleEdit(categoria)}>
                    Editar
                  </Button>{" "}
                  <Button color="danger" size="sm" onClick={() => handleDelete(categoria.id)}>
                    Deletar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {categoriaSelecionada && (
          <EditarCategoria
            isOpen={isEditOpen}
            toggle={() => setIsEditOpen(!isEditOpen)}
            categoria={categoriaSelecionada}
            onCategoriaEditada={fetchCategorias}
          />
        )}
      </div>
    </div>
  );
};

export default Categorias;
