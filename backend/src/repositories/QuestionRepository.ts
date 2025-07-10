import { injectable } from "inversify";
import pool from "../config/db";

@injectable()
export class QuestionRepository {
  async create(
    title: string,
    content: string,
    categoryId: number,
    files?: Express.Multer.File[]
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        "INSERT INTO questions (title, content, category_id) VALUES ($1, $2, $3) RETURNING *",
        [title, content, categoryId]
      );

      const question = result.rows[0];

      if (files && files.length > 0) {
        for (const file of files) {
          await client.query(
            `INSERT INTO attachments (filename, filepath, mimetype, question_id) 
             VALUES ($1, $2, $3, $4)`,
            [file.originalname, file.path, file.mimetype, question.id]
          );
        }
      }

      await client.query("COMMIT");
      return question;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll() {
    const questionsResult = await pool.query("SELECT * FROM questions");
    const questions = questionsResult.rows;

    for (const question of questions) {
      const attachmentsResult = await pool.query(
        "SELECT id, filename, filepath, mimetype FROM attachments WHERE question_id = $1",
        [question.id]
      );
      question.attachments = attachmentsResult.rows;
    }

    return questions;
  }

  async findById(id: number) {
    const questionResult = await pool.query(
      "SELECT * FROM questions WHERE id = $1",
      [id]
    );
    const question = questionResult.rows[0];

    if (!question) return null;

    const attachmentsResult = await pool.query(
      "SELECT id, filename, filepath, mimetype FROM attachments WHERE question_id = $1",
      [id]
    );

    question.attachments = attachmentsResult.rows;

    return question;
  }

  async update(
    id: number,
    title: string,
    content: string,
    categoryId: number,
    files?: Express.Multer.File[]
  ) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE questions
       SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
        [title, content, categoryId, id]
      );

      const question = result.rows[0];

      if (files && files.length > 0) {
        for (const file of files) {
          await client.query(
            `INSERT INTO attachments (filename, filepath, mimetype, question_id)
           VALUES ($1, $2, $3, $4)`,
            [file.originalname, file.path, file.mimetype, id]
          );
        }
      }

      await client.query("COMMIT");
      return question;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number) {
    const result = await pool.query(
      "DELETE FROM questions WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}
