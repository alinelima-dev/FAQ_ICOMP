import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
        boxShadow: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 300,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", color: "white" }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="white"
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
          color="secondary"
          onClick={() => navigate(`/pergunta/${id}`)}
        >
          Ver mais
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardPergunta;
