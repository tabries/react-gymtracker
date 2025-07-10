import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Exercise } from "@/components/Exercise";

interface History {
  id: number;
  date: string;
  exercise: Exercise;
  reps: number;
}

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("/api/history/");
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Workout History</h2>
      <ul>
        {history.map((item: History) => (
          <li key={item.id}>
            {item.date}: {item.exercise.name} - {item.reps} reps
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
