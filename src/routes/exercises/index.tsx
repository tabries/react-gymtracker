import { Exercise } from "@/components/Exercise/index";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Modal from "@mui/material/Modal";
import { CreateExercise } from "@/components/Exercise/CreateExercise";
import { getExercises } from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Exercise {
  id: number;
  routine: number;
  name: string;
  description?: string;
  duration?: number;
  reps?: number;
  sets?: number;
  weight?: number;
}

export const Exercises = () => {
  const location = useLocation();
  const { id: routineId, name: routineName } = location.state;
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (reload?: boolean) => {
    if (reload) {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    }
    setOpen(false);
  };

  const { data: exercises, isLoading, error } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getExercises().then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching exercises</div>;

  return (
    <div className="h-full w-[98%] flex flex-col justify-between">
      <div className="overflow-auto h-full font-roboto font-bold">
        <h1 className="text-center pb-4 font-oswald text-3xl font-bold">
          <span className="text-blue-primary mr-2">{routineName}</span>
          <span>exercises</span>
        </h1>
        {exercises.length > 0 ? (
          <div className="flex flex-col gap-2">
            {exercises.map((exercise: Exercise) => (
              <Exercise
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center h-4/5 items-center text-[gray]">
            Add exercises for this routine
          </div>
        )}
      </div>
      <div className="flex justify-center p-2">
        <button>
          <AddCircleOutlineIcon
            onClick={handleOpen}
            fontSize="large"
            className="transform rotate-90 cursor-pointer"
          />
        </button>
      </div>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          {!!routineId && (
            <CreateExercise routineId={routineId} handleClose={handleClose} />
          )}
        </>
      </Modal>
    </div>
  );
};
