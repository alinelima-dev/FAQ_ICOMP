import "./css/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Button, Input, Label } from "reactstrap";
import { useAuth } from "../../contexts/AuthContext";
import { GenericMessage } from "@locales/locale";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(usuario, senha);
      navigate("/adm/perguntas");
    } catch (error) {
      alert("Credenciais inválidas");
    }
  };

  return (
    <div className="login-container">
      <Form className="centered-form" onSubmit={handleSubmit}>
        <h2>{GenericMessage.wellcomeMessage}</h2>
        <FormGroup>
          <Label for="usuario">Usuário</Label>
          <Input
            id="usuario"
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </FormGroup>
        <Button type="submit">Entrar</Button>
      </Form>
    </div>
  );
};

export default Login;
