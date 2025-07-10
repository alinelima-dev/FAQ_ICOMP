import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "@contexts/SnackbarContext";
import { GenericMessage, SnackbarMessage } from "@locales/locale";

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(usuario, senha);
      navigate("/adm/perguntas");
    } catch (error) {
      showSnackbar(SnackbarMessage.loginError, "error");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(50deg, #2575fc, #6a11cb)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 1s ease infinite",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 5 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            {GenericMessage.wellcomeMessage}
          </Typography>

          <TextField
            label="Usuário"
            fullWidth
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Box mt={3}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Entrar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
