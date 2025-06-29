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
  Snackbar,
  Alert,
} from "@mui/material";
import { Question } from "types/faqTypes";

interface ListarPerguntasProps {
  perguntas: Question[];
  loading: boolean;
  error?: string;
}

const ListarPerguntas: React.FC<ListarPerguntasProps> = ({
  perguntas,
  loading,
  error,
}) => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Perguntas Frequentes
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {perguntas.map((pergunta) => (
            <Grid item xs={12} sm={6} md={4} key={pergunta.id}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    {pergunta.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{
                      mt: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                    dangerouslySetInnerHTML={{ __html: pergunta.content }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() =>
                      window.location.assign(`/pergunta/${pergunta.id}`)
                    }
                  >
                    Ver mais
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ListarPerguntas;
