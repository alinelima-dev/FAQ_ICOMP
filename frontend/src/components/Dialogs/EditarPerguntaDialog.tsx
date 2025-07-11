import React from "react";
import { Dialog } from "@mui/material";
import EditarPergunta from "@pages/adm/EditarPergunta";
import { IQuestion } from "types/faqTypes";

interface EditarPerguntaDialogProps {
  pergunta: IQuestion;
  open: boolean;
  onClose: () => void;
  onPerguntaEditada: () => void;
}

const EditarPerguntaDialog: React.FC<EditarPerguntaDialogProps> = ({
  pergunta,
  open,
  onClose,
  onPerguntaEditada,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <EditarPergunta
        pergunta={pergunta}
        onClose={onClose}
        onPerguntaEditada={onPerguntaEditada}
      />
    </Dialog>
  );
};

export default EditarPerguntaDialog;
