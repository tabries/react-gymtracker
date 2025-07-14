import { Routine } from "@/components/Routine/index";
import axios from "axios";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Modal from "@mui/material/Modal";
import { CreateRoutine } from "@/components/Routine/CreateRoutine";

interface Routine {
  id: number;
  date: string;
  name: string;
}

export const Routines = () => {

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (reload?: boolean) => {
    if (reload) {
      fetchRoutines();
    }
    setOpen(false);
  };

  const fetchRoutines = async () => {
    const port = import.meta.env.VITE_API_PORT;
    const api = axios.create({
      baseURL: `http://localhost:${port}`,
    });
    try {
      const response = await api.get(`/api/routines/`);
      setRoutines(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching routines</div>;

  return (
    <div className="h-full w-[98%] flex flex-col justify-between">
      <div className="overflow-auto h-full font-roboto font-bold">
        <h1 className="text-center pb-4 font-oswald text-3xl font-bold">Routines</h1>
        {routines.length > 0 ? (
          <div className="flex flex-col gap-2">
            {routines.map((routine) => (
              <Routine key={routine.id} id={routine.id} name={routine.name} />
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
        <CreateRoutine handleClose={handleClose} />
      </Modal>
    </div>
  );
};
