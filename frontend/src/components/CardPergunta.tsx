import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenericMessage } from "@locales/locale";

interface CardPerguntaProps {
  id: number;
  title: string;
  content: string;
}

const CardPergunta: React.FC<CardPerguntaProps> = ({ id, title, content }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: "5px",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          backgroundColor: "white",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 300,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold", color: "#2575fc" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="#2575fc"
            sx={{
              mt: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button
            size="small"
            color="primary"
            onClick={() => navigate(`/pergunta/${id}`)}
          >
            {GenericMessage.viewMore}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default CardPergunta;
