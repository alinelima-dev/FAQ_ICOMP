import { injectable } from "inversify";
import pool from "../config/db";

@injectable()
export class SuggestionRepository {
  async create(title: string, content: string, email?: string, ip?: string) {
    const result = await pool.query(
      `INSERT INTO suggestions (title, content, ip_address)
       VALUES ($1, $2, $3) RETURNING *`,
      [title, content, ip || null]
    );

    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      "SELECT id, title, content, ip_address, created_at FROM suggestions ORDER BY created_at DESC"
    );
    return result.rows;
  }
}
