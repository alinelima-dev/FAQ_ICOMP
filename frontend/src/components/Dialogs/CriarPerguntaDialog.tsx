import React from "react";
import { Dialog } from "@mui/material";
import CriarPergunta from "@pages/adm/CriarPergunta";

interface CriarPerguntaDialogProps {
  open: boolean;
  onClose: () => void;
  onPerguntaCriada: () => void;
}

const CriarPerguntaDialog: React.FC<CriarPerguntaDialogProps> = ({
  open,
  onClose,
  onPerguntaCriada,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <CriarPergunta onClose={onClose} onPerguntaCriada={onPerguntaCriada} />
    </Dialog>
  );
};

export default CriarPerguntaDialog;
