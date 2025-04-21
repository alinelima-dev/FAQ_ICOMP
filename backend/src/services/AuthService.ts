import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import pool from '../config/db'; // Certifique-se de que a conexão com o banco está correta

export class AuthService {
  // Função para verificar credenciais e gerar um token
  async login(usuario: string, senha: string): Promise<string | null> {
    try {
      // Buscar o usuário no banco de dados pelo nome de usuário
      console.log('🔍 Buscando usuário no banco...');
      const query = 'SELECT * FROM usuarios WHERE usuario = $1'; // Ajuste o nome da tabela conforme sua estrutura
      const result = await pool.query(query, [usuario]);

      if (result.rows.length === 0) {
        console.log('❌ Usuário não encontrado no banco.');
        return null; // Usuário não encontrado
      }

      const user = result.rows[0];
      console.log('✅ Usuário encontrado:', user);

      // Comparar a senha fornecida com a senha armazenada (com hash)
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      console.log('🔐 Senha válida?', isPasswordValid);

      if (!isPasswordValid) {
        console.log('❌ Senha inválida');
        return null; // Senha inválida
      }

      // Gerar o token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username }, // Payload do JWT
        process.env.JWT_SECRET as string, // Chave secreta do JWT (no .env)
        { expiresIn: '1h' } // Expiração do token (1 hora)
      );

      console.log('✅ Token gerado com sucesso!');
      return token; // Retorna o token JWT
    } catch (error) {
      console.error('🔥 Erro detalhado ao autenticar o usuário:', error);
      throw new Error('Erro ao autenticar o usuário');
    }
  }
}
