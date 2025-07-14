import { DeleteRoutine } from "@/components/Routine/DeleteRoutine";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Modal } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RoutineProps {
  id: number;
  name: string;
}

export const Routine = ({ id, name }: RoutineProps) => {
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleClick = () => {
    navigate(`/routines/${id}/exercises`, { state: { id, name } });
  };

  return (
    <div className="h-20 w-full px-5 bg-blue-primary flex justify-between rounded-xl">
      <button
        onClick={handleClick}
        className="text-start text-white flex-1 cursor-pointer"
      >
        {name}
      </button>
      <div className="content-center cursor-pointer text-white">
        <DeleteOutlineIcon onClick={handleOpenDelete} />
      </div>

      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DeleteRoutine routineId={id} handleClose={handleCloseDelete} />
      </Modal>
    </div>
  );
};
