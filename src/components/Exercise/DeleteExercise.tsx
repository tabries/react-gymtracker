import axios from "axios";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const DeleteExercise = ({
  exerciseId,
  handleClose,
}: {
  exerciseId: number;
  handleClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const port = import.meta.env.VITE_API_PORT || 8000;
      await axios.delete(
        `http://localhost:${port}/api/exercises/${exerciseId}/`
      );
      handleClose();
    } catch (err) {
      setError(`Error creating exercise ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute rounded-xl shadow-xl/30 -translate-x-2/4 -translate-y-2/4 w-[400] 
    border-2 border-solid border-black left-2/4 top-2/4 bg-white py-4 px-12"
    >
      <button
        onClick={handleClose}
        className="font-bold text-[x-large] absolute right-3 top-1.5"
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
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </div>
    </div>
  );
};
