import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../config/db";

export class PasswordResetService {
  async generateResetToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    const updateQuery = `
      UPDATE usuarios 
      SET reset_token = $1, reset_token_expires = $2 
      WHERE email = $3
    `;
    await pool.query(updateQuery, [token, expires, email]);

    return token;
  }

  async resetPassword(token: string, novaSenha: string): Promise<boolean> {
    const query = `
      SELECT * FROM usuarios 
      WHERE reset_token = $1 AND reset_token_expires > NOW()
    `;
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) return false;

    const hashedSenha = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      `UPDATE usuarios 
       SET senha = $1, reset_token = NULL, reset_token_expires = NULL 
       WHERE id = $2`,
      [hashedSenha, result.rows[0].id]
    );

    return true;
  }
}
