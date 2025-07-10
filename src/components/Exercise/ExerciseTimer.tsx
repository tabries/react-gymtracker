import { useStopwatch } from "react-timer-hook";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { createHistoryEntry } from "@/services/api";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";

const Timer = ({
  exerciseId,
  handleClose,
}: {
  exerciseId: number;
  handleClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({
    autoStart: true,
    interval: 20,
  });

  const handleExerciseHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const durationMin = hours * 60 + minutes + Math.floor(seconds / 60);
      await createHistoryEntry({
        exercise: exerciseId,
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        sets: sets ? Number(sets) : null,
        reps: reps ? Number(reps) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        durationMin,
      });
      handleClose();
    } catch (err) {
      setError(`Error creating exercise history ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="text-[4rem]">
        <span>{String(hours).padStart(2, "0")}</span>:
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
      <p>{isRunning ? "Set in progress" : "Set paused"}</p>
      <div className="flex flex-col mt-5 gap-8">
        <div className="flex gap-4 justify-center">
          <button onClick={start} className="bg-[#7fbfff] rounded-xl w-20">
            Start
          </button>
          <button onClick={pause} className="bg-[#7fbfff] rounded-xl w-20">
            Pause
          </button>
          <button
            className="bg-[#7fbfff] rounded-xl w-20"
            onClick={() => {
              const time = new Date();
              reset(time, false);
            }}
          >
            Restart
          </button>
        </div>
        <form
          onSubmit={handleExerciseHistory}
          className="flex flex-col gap-2 items-center mb-4"
        >
          <TextField
            label="Sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            size="small"
          />
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            size="small"
          />
          <TextField
            label="Weight (kg)"
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            size="small"
          />
          {error && <Typography color="error">{error}</Typography>}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="bg-[#9dffad] rounded-xl w-24 h-8"
              disabled={loading}
            >
              <CheckCircleOutlineIcon /> Done
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-[#ffd4d4] rounded-xl w-24 h-8"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ExerciseTimer = ({
  exerciseId,
  exerciseName,
  handleClose,
}: {
  exerciseId: number;
  exerciseName: string;
  handleClose: () => void;
}) => {
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
      <h1 className="text-[20px] text-center">{exerciseName}</h1>
      <Timer handleClose={handleClose} exerciseId={exerciseId} />
    </div>
  );
};
