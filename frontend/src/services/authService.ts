// authService.ts
import api from './api';
import { AxiosError } from 'axios'; // Importando o tipo de erro do Axios

export async function login(usuario: string, senha: string) {
  try {
    // Envia a requisição POST para o backend com as credenciais
    const response = await api.post('/auth/login', { usuario, senha });
    
    // Extrai o token da resposta
    const { token } = response.data;
    console.log('Token recebido:', token);  // Adicionando log para debugar

    // Armazena o token no localStorage
    localStorage.setItem('token', token);

    return token; // Retorna o token para uso posterior
  } catch (error: unknown) {  // Definindo explicitamente o tipo de error como 'unknown'
    if (error instanceof AxiosError) {  // Verificando se é uma instância de AxiosError
      // Se a resposta de erro veio do servidor (ex: 401 - credenciais inválidas)
      if (error.response) {
        console.error('Erro ao fazer login:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Credenciais inválidas ou erro na autenticação');
      } else if (error.request) {
        // Se a requisição foi feita mas não houve resposta (ex: problema de rede)
        console.error('Erro na requisição:', error.request);
        throw new Error('Erro ao conectar com o servidor. Verifique sua conexão.');
      } else {
        // Erro inesperado
        console.error('Erro desconhecido:', error.message);
        throw new Error('Erro inesperado. Tente novamente mais tarde.');
      }
    } else if (error instanceof Error) {
      // Se o erro for um erro genérico (não do Axios)
      console.error('Erro desconhecido:', error.message);
      throw new Error('Erro inesperado. Tente novamente mais tarde.');
    } else {
      // Se o erro for de outro tipo (não instância de Error ou AxiosError)
      console.error('Erro desconhecido:', error);
      throw new Error('Erro inesperado. Tente novamente mais tarde.');
    }
  }
}
