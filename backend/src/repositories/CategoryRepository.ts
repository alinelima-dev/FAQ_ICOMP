import { injectable } from 'inversify';
import pool from '../config/db';

@injectable()
export class CategoryRepository {
  async create(name: string) {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  async update(id: number, name: string) {
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  async delete(id: number) {
    try {
      await pool.query('DELETE FROM categories WHERE id = $1', [id]);
      return { message: 'Categoria deletada com sucesso' };
    } catch (error: any) {
      if (error.constraint === 'questions_category_id_fkey') {
        throw new Error(
          'Não é possível excluir esta categoria porque ela possui perguntas associadas.'
        );
      } else {
        throw new Error('Erro ao deletar categoria');
      }
    }
  }
}
