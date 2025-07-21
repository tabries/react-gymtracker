import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoutine } from "@/services/api";
import type { Routine } from "@/routes/routines";

 export interface NewRoutine extends Omit<Routine, "id"> {
    id?: number;
  }

export const CreateRoutine = ({
  handleClose,
}: {
  handleClose: (reload?: boolean) => void;
}) => {
  const [form, setForm] = useState({
    name: "",
  });

  const queryClient = useQueryClient();

  const { mutate: createRoutineMutate, isPending, isError } = useMutation({
    mutationFn: (routine: NewRoutine) => createRoutine(routine),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      handleClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createRoutineMutate({name: form.name});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="absolute rounded-xl shadow-xl/30 -translate-x-2/4 -translate-y-2/4 w-[400] 
    border-2 border-solid border-black left-2/4 top-2/4 bg-white py-4 px-12"
    >
      <button
        onClick={() => handleClose()}
        className="font-bold text-[x-large] absolute right-3 top-1.5"
      >
        <CloseIcon />
      </button>
      <h1 className="text-[20px] text-center">New exercise</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-62 py-4">
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {isError && <Typography color="error">Error creating routine</Typography>}
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleClose()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  );
};
