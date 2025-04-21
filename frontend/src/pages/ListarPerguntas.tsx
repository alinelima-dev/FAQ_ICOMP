// src/pages/ListarPerguntas.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  CircularProgress,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

interface Pergunta {
  titulo: string;
  descricao: string;
}

const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");

const ListarPerguntas = () => {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]); // Definindo o tipo para perguntas

  useEffect(() => {
    axios
      .get("http://localhost:3002/quastions") // Substitua pela URL da sua API
      .then((res) => setPerguntas(res.data))
      .catch((err) => {
        console.error("Erro ao buscar perguntas:", err);
        setSnackbarMessage("Erro ao carregar as perguntas");
        setOpenSnackbar(true);
      });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Perguntas Frequentes
      </Typography>

      {/* Exibição do CircularProgress se não houver perguntas */}
      {!perguntas.length ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        // Se houver perguntas, exibe o Grid de Cards
        <Grid container spacing={3}>
          {perguntas.map((pergunta, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              {/* Card estilizado */}
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {pergunta.titulo}
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ mt: 2 }}>
                    {pergunta.descricao}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="secondary">
                    Ver mais
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ListarPerguntas;
