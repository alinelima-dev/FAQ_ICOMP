import { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useSnackbar } from "@contexts/SnackbarContext";
import { useFaqService } from "@contexts/FaqServiceContext";

const EsqueciSenha: React.FC = () => {
  const faqService = useFaqService();
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await faqService.forgotPassword(email);
      showSnackbar("Se o e-mail existir, enviaremos um link.", "info");
      setEmail("");
    } catch (error) {
      showSnackbar("Erro ao tentar enviar o link de redefinição.", "error");
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
        animation: "gradientMove 15s ease infinite",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: { xs: 3, sm: 5 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Esqueci minha senha
          </Typography>

          <TextField
            label="E-mail cadastrado"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Box mt={3}>
            <Button type="submit" variant="contained" fullWidth>
              Enviar link de redefinição
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EsqueciSenha;
