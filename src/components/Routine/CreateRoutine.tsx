import axios from "axios";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export const CreateRoutine = ({
  handleClose,
}: {
  handleClose: (reload?: boolean) => void;
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    sets: "",
    reps: "",
    weight: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const port = import.meta.env.VITE_API_PORT || 8000;
      await axios.post(`http://localhost:${port}/api/routines/`, {
        name: form.name,
      });
      handleClose(true);
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
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outlined" onClick={() => handleClose()} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </form>
    </div>
  );
};
