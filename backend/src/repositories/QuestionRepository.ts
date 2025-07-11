import { injectable } from "inversify";
import pool from "../config/db";

@injectable()
export class QuestionRepository {
  async findByTitle(title: string) {
    const result = await pool.query(
      "SELECT * FROM questions WHERE LOWER(title) = LOWER($1)",
      [title]
    );
    return result.rows[0];
  }
  async create(
    title: string,
    content: string,
    categoryIds: number[],
    files?: Express.Multer.File[]
  ) {
    const existing = await this.findByTitle(title);
    if (existing) {
      throw new Error("Já existe uma pergunta com este título.");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        "INSERT INTO questions (title, content) VALUES ($1, $2) RETURNING *",
        [title, content]
      );

      const question = result.rows[0];

      for (const categoryId of categoryIds) {
        await client.query(
          "INSERT INTO question_categories (question_id, category_id) VALUES ($1, $2)",
          [question.id, categoryId]
        );
      }

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

      const categoriesResult = await pool.query(
        `SELECT c.id, c.name FROM categories c
     INNER JOIN question_categories qc ON c.id = qc.category_id
     WHERE qc.question_id = $1`,
        [question.id]
      );
      question.categories = categoriesResult.rows;
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

    const categoriesResult = await pool.query(
      `SELECT c.id, c.name FROM categories c
   INNER JOIN question_categories qc ON c.id = qc.category_id
   WHERE qc.question_id = $1`,
      [id]
    );
    question.categories = categoriesResult.rows;

    return question;
  }

  async update(
    id: number,
    title: string,
    content: string,
    categoryIds: number[],
    files?: Express.Multer.File[]
  ) {
    const existing = await this.findByTitle(title);
    if (existing && existing.id !== id) {
      throw new Error("Já existe outra pergunta com este título.");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE questions
       SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
        [title, content, id]
      );

      const question = result.rows[0];

      await client.query(
        `DELETE FROM question_categories WHERE question_id = $1`,
        [id]
      );

      for (const categoryId of categoryIds) {
        await client.query(
          "INSERT INTO question_categories (question_id, category_id) VALUES ($1, $2)",
          [id, categoryId]
        );
      }

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
