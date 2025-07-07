import api from "./api";
import { AxiosError } from "axios";

export async function login(usuario: string, senha: string) {
  try {
    //requisição POST para o backend com as credenciais
    const response = await api.post("/auth/login", { usuario, senha });

    const { token } = response.data;

    localStorage.setItem("token", token);

    return token;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      //se a resposta de erro veio do servidor (ex: 401 - credenciais inválidas)
      if (error.response) {
        console.error(
          "Erro ao fazer login:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            "Credenciais inválidas ou erro na autenticação"
        );
      } else if (error.request) {
        //se a requisição foi feita mas não houve resposta (ex: problema de rede)
        console.error("Erro na requisição:", error.request);
        console.log(JSON.stringify(error));
        throw new Error(
          "Erro ao conectar com o servidor. Verifique sua conexão."
        );
      } else {
        //erro inesperado
        console.error("Erro desconhecido:", error.message);
        throw new Error("Erro inesperado. Tente novamente mais tarde.");
      }
    } else if (error instanceof Error) {
      //erro genérico (não do Axios)
      console.error("Erro desconhecido:", error.message);
      throw new Error("Erro inesperado. Tente novamente mais tarde.");
    } else {
      console.error("Erro desconhecido:", error);
      throw new Error("Erro inesperado. Tente novamente mais tarde.");
    }
  }
}
