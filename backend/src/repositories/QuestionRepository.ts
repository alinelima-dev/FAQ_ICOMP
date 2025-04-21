import { injectable } from 'inversify';
import pool from '../config/db';

@injectable()
export class QuestionRepository {
  async create(title: string, content: string, categoryId: number) {
    const result = await pool.query(
      'INSERT INTO questions (title, content, category_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, categoryId]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query('SELECT * FROM questions');
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    return result.rows[0];
  }

  async update(id: number, title: string, content: string, categoryId: number) {
    const result = await pool.query(
      'UPDATE questions SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, content, categoryId, id]
    );
    return result.rows[0];
  }

  async delete(id: number) {
    const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}
