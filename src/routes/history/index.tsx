import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHistoryByMonth } from "@/services/api";
import {
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Badge,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import {
  PickersDay,
  type PickersDayProps,
} from "@mui/x-date-pickers/PickersDay";

interface History {
  id: number;
  exercise_name: string;
  date: string;
  sets: number;
  reps: number;
  weightKg: number;
  durationMin: number;
}

export default function History() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());
  const formattedDate = selectedMonth
    ? selectedMonth.toISOString().slice(0, 10)
    : "";

  const {
    data: historyByMonth,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history", formattedDate],
    queryFn: () => getHistoryByMonth(formattedDate).then((res) => res.data),
    enabled: !!formattedDate,
  });

  const highlightedDays: number[] = historyByMonth?.map((history: History) => {
    return new Date(history.date).getUTCDate();
  });

  const historySelectedDay = historyByMonth?.filter(
    (history: History) =>
      new Date(history.date).getDate() === selectedDate?.getDate()
  );

  function ServerDay(props: PickersDayProps & { highlightedDays?: number[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.getDate()) >= 0;

    // console.log('0001 highlightedDays', highlightedDays)

    return (
      <>
        <Badge
          key={props.day.toString()}
          overlap="circular"
          badgeContent={isSelected ? "🔵" : undefined}
          classes={{ badge: "pointer-events-none w-0 !h-0" }}
        >
          <PickersDay
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
          />
        </Badge>
      </>
    );
  }

  return (
    <div className="max-w-xl mt-8">
      <Typography variant="h5" align="center" gutterBottom>
        History by Day
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          className="h-98"
          onMonthChange={setSelectedMonth}
          value={selectedDate}
          onChange={setSelectedDate}
          disableFuture
          slotProps={{
            actionBar: { actions: [] },
            day: {
              highlightedDays,
            } as { highlightedDays: number[] },
          }}
          slots={{
            day: ServerDay,
          }}
        />
      </LocalizationProvider>
      <div className="justify-items-center mt-8">
        {isLoading && <CircularProgress />}
        {error && <span>Error loading history.</span>}
        {historySelectedDay && historySelectedDay.length === 0 && (
          <Typography>No history for this day.</Typography>
        )}
        {historySelectedDay && historySelectedDay.length > 0 && (
          <div className="justify-self-start pl-4">
            <List>
              {historySelectedDay.map((entry: History) => (
                <ListItem key={entry.id}>
                  <ListItemText
                    primary={entry.exercise_name}
                    secondary={
                      <>
                        {entry.sets ? `Sets: ${entry.sets}, ` : ""}
                        {entry.reps ? `Reps: ${entry.reps}, ` : ""}
                        {entry.weightKg ? `Weight: ${entry.weightKg}kg, ` : ""}
                        {entry.durationMin !== null
                          ? `Duration: ${entry.durationMin}min, `
                          : ""}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
    </div>
  );
}
