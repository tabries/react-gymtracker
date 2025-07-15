import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeights, createWeight, deleteWeight } from "@/services/api";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

interface Weight {
  date: string;
  weightKg: number;
  notes: string;
}

export default function WeightPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    date: null as Date | null,
    weightKg: "",
    notes: "",
  });

  // Fetch weights
  const { data, isLoading } = useQuery({
    queryKey: ["weights"],
    queryFn: () => getWeights().then((res) => res.data),
  });

  // Add weight mutation
  const addWeightMutation = useMutation({
    mutationFn: (payload: Weight) =>
      createWeight(payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weights"] });
      setOpen(false);
      setForm({ date: null, weightKg: "", notes: "" });
    },
  });

  // Delete weight mutation
  const deleteWeightMutation = useMutation({
    mutationFn: (id: number) => deleteWeight(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weights"] }),
  });

  // Dates that already have a registry
  const usedDates = useMemo(
    () => (data ? data.map((w: Weight) => w.date) : []),
    [data]
  );

  // Chart data
  const chartData = useMemo(() => {
    if (!data) return null;
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
    return {
      labels: sorted.map((w) => w.date),
      datasets: [
        {
          label: "Weight (kg)",
          data: sorted.map((w) => w.weightKg),
          fill: false,
          borderColor: "#1976d2",
          backgroundColor: "#1976d2",
          tension: 0.2,
        },
      ],
    };
  }, [data]);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Kg" }, beginAtZero: false },
    },
  };

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.weightKg) return;
    addWeightMutation.mutate({
      date: form.date.toISOString().slice(0, 10),
      weightKg: Number(form.weightKg),
      notes: form.notes,
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Weight Evolution
      </Typography>
      <Box sx={{ mb: 2 }}>
        {isLoading ? (
          <CircularProgress />
        ) : chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Typography>No data yet.</Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpen(true)}
        >
          Add Weight
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>
        Weight Logs
      </Typography>
      <List>
        {data &&
          [...data]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((w) => (
              <ListItem key={w.id} divider>
                <ListItemText
                  primary={`${w.weightKg} kg`}
                  secondary={
                    <>
                      <span>{w.date}</span>
                      {w.notes && <span> — {w.notes}</span>}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => deleteWeightMutation.mutate(w.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
      </List>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" align="center">
            Add Weight Log
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={form.date}
              onChange={handleDateChange}
              disablePast={false}
              shouldDisableDate={(date) =>
                usedDates.includes(date.toISOString().slice(0, 10))
              }
              slotProps={{ textField: { required: true, fullWidth: true } }}
            />
          </LocalizationProvider>
          <TextField
            label="Weight (kg)"
            name="weightKg"
            type="number"
            value={form.weightKg}
            onChange={handleFormChange}
            required
            fullWidth
            slotProps={{ htmlInput: { step: "0.1", min: "0" } }}
          />
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleFormChange}
            fullWidth
            multiline
            minRows={2}
          />
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
