import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";

import Modal from "@mui/material/Modal";
import { useState } from "react";
import { ExerciseTimer } from "@/components/Exercise/ExerciseTimer";
import { DeleteExercise } from "@/components/Exercise/DeleteExercise";

interface ExerciseProps {
  id: number;
  name: string;
}

export const Exercise = ({ id, name }: ExerciseProps) => {
  const [openTimer, setOpenTimer] = useState(false);
  const handleOpenTimer = () => setOpenTimer(true);
  const handleCloseTimer = () => setOpenTimer(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes timer

  return (
    <div className="h-20 w-full pl-5 pr-4 bg-[#D0E7E2] flex justify-between rounded-xl">
      <div className="content-center text-[#474747]">
        <div className="">{name}</div>
      </div>
      <div className="content-center gap-0 flex items-center">
        <button className="w-12">
          <ChangeHistoryIcon
            onClick={handleOpenTimer}
            className="transform rotate-90"
          />
        </button>
        <button className="w-12">
          <DeleteOutlineIcon onClick={handleOpenDelete} />
        </button>
      </div>

      <Modal
        open={openTimer}
        onClose={handleCloseTimer}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ExerciseTimer exerciseName={name} exerciseId={id} handleClose={handleCloseTimer} />
      </Modal>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DeleteExercise exerciseId={id} handleClose={handleCloseDelete} />
      </Modal>
    </div>
  );
};
