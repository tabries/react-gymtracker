import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { deleteExercise } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const DeleteExercise = ({
  exerciseId,
  handleClose,
}: {
  exerciseId: number;
  handleClose: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate: deleteExerciseMutate, isPending } = useMutation({
    mutationFn: (id: number) => deleteExercise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      handleClose();
    },
    onError: (err) => setError(`Error deleting exercise ${err}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    deleteExerciseMutate(exerciseId);
  };

  return (
    <div
      className="absolute rounded-xl shadow-xl/30 -translate-x-2/4 -translate-y-2/4 w-[400] 
    border-2 border-solid border-black left-2/4 top-2/4 bg-white py-4 px-12 justify-items-center font-roboto"
    >
      <button
        onClick={handleClose}
        className="font-bold text-[x-large] absolute right-3 top-1.5 cursor-pointer"
      >
        <CloseIcon />
      </button>
      <h1 className="text-[20px] text-center">
        Are you sure you want to delete this exercise?
      </h1>
      <div className="flex flex-col gap-4 w-62 py-4">
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outlined" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
        </Box>
      </div>
    </div>
  );
};
