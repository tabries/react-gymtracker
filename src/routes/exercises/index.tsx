import { Exercise } from "@/components/Exercise/index";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Modal from "@mui/material/Modal";
import { CreateExercise } from "@/components/Exercise/CreateExercise";

interface Exercise {
  id: number;
  routineId: number;
  name: string;
  description?: string;
  duration?: number;
  reps?: number;
  sets?: number;
  weight?: number;
}

export const Exercises = () => {
  const location = useLocation();
  const {id: routineId, name: routineName} = location.state; // Access the passed state object

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (reload?: boolean) => {
    if (reload) {
      fetchExercises();
    }
    setOpen(false);
  };

  const fetchExercises = useCallback(async () => {
    const port = import.meta.env.VITE_API_PORT;
    const api = axios.create({
      baseURL: `http://localhost:${port}`,
    });
    try {
      const response = await api.get(`/api/routines/${routineId}/exercises/`);
      setExercises(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [routineId]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching routines</div>;

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="overflow-scroll h-full">
        <h1 className="text-center pb-4 font-bold">
          {routineName} Exercises
        </h1>
        {exercises.length > 0 ? (
          <div className="flex flex-col gap-2">
            {exercises.map((exercise) => (
              <Exercise key={exercise.id} id={exercise.id} name={exercise.name} />
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
            className="transform rotate-90"
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
