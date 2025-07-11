import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenericMessage } from "@locales/locale";
import { ICategory } from "types/faqTypes";

interface CardPerguntaProps {
  id: number;
  title: string;
  content: string;
  categories: ICategory[];
}

const CardPergunta: React.FC<CardPerguntaProps> = ({
  id,
  title,
  content,
  categories,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: 4,
        p: "4px",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
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
          <Box display="flex" mt={1} gap={0.5} flexWrap="wrap">
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                color="primary"
                variant="outlined"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  borderRadius: "8px",
                }}
              />
            ))}
          </Box>

          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              whiteSpace: "normal",
              maxHeight: 120,
            }}
            dangerouslySetInnerHTML={{
              __html: content.trim().replace(/^\s*<p>\s*<\/p>/gi, ""),
            }}
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
