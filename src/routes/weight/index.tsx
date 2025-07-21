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
  CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { LineChart } from "@mui/x-charts/LineChart";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeights, createWeight, deleteWeight } from "@/services/api";

export interface Weight {
  id?: number;
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

  // Chart data for @mui/x-charts/LineChart
  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((w) => ({
        date: new Date(w.date),
        weightKg: w.weightKg,
      }));
  }, [data]);

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
    <div className="min-w-[24rem] max-w-xl mt-8 font-roboto">
      <h2 className="text-center pb-6 font-oswald text-3xl font-bold">
        Weight Evolution
      </h2>
      <div>
        {isLoading ? (
          <CircularProgress />
        ) : chartData.length > 0 ? (
          <LineChart
            xAxis={[
              {
                dataKey: "date",
                label: "Date",
                scaleType: "time",
                valueFormatter: (date) => date.toISOString().slice(0, 10),
              },
            ]}
            series={[
              { dataKey: "weightKg", label: "Weight (kg)", color: "#1976d2" },
            ]}
            dataset={chartData}
          />
        ) : (
          <Typography>No data yet.</Typography>
        )}
      </div>
      <div className="flex justify-center p-2 mb-4">
        <button
          className="cursor-pointer gap-1 flex items-center"
          onClick={() => setOpen(true)}
        >
          <AddCircleOutlineIcon
            fontSize="large"
            className="transform rotate-90 "
          />
          Add measure
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="font-oswald text-3xl ml-3">Weight Logs</h3>{" "}
        {data?.length > 0 ? (
          <List>
            {[...data]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((w) => (
                <ListItem
                  key={w.id}
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => deleteWeightMutation.mutate(w.id!)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${w.weightKg} kg`}
                    secondary={
                      <>
                        <span>{w.date}</span>
                        {w.notes && <span> — {w.notes}</span>}
                      </>
                    }
                  />
                </ListItem>
              ))}
          </List>
        ) : (
          <span> No data yet. Add a measure.</span>
        )}
      </div>

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
              disableFuture
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
    </div>
  );
}
