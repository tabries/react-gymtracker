import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHistoryByDate } from "@/services/api";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

export default function History() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const formattedDate = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["history", formattedDate],
    queryFn: () => getHistoryByDate(formattedDate).then((res) => res.data),
    enabled: !!formattedDate,
  });

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        History by Day
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          className="h-98"
          value={selectedDate}
          onChange={setSelectedDate}
          disableFuture
          slotProps={{ actionBar: { actions: [] } }}
        />
      </LocalizationProvider>
      <Box mt={3}>
        {isLoading && <CircularProgress />}
        {error && <Typography color="error">Error loading history.</Typography>}
        {data && data.length === 0 && (
          <Typography>No history for this day.</Typography>
        )}
        {data && data.length > 0 && (
          <List>
            {data.map((entry) => (
              <ListItem key={entry.id}>
                <ListItemText
                  primary={entry.exercise_name}
                  secondary={
                    <>
                      {entry.sets ? `Sets: ${entry.sets}, ` : ""}
                      {entry.reps ? `Reps: ${entry.reps}, ` : ""}
                      {entry.weightKg ? `Weight: ${entry.weightKg}kg, ` : ""}
                      {entry.durationMin !== null ? `Duration: ${entry.durationMin}min, ` : ""}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
