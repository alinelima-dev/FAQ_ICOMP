import pool from './db'; // Arquivo onde você configurou a conexão com o banco

// Função para obter todas as categorias
export const getCategories = async () => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows; // Retorna todas as categorias do banco
  } catch (error) {
    console.error('Erro ao consultar categorias:', error);
    throw error;
  }
};

// Função para adicionar uma nova categoria
export const createCategory = async (name: string) => {
  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0]; // Retorna a categoria criada
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};
