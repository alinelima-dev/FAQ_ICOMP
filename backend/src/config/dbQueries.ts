import pool from "./db";

//obter todas as categorias
export const getCategories = async () => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
  } catch (error) {
    console.error("Erro ao consultar categorias:", error);
    throw error;
  }
};

//adicionar uma nova categoria
export const createCategory = async (name: string) => {
  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
};
