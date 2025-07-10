import React, { useState, useEffect } from "react";
import axios from "axios";

export interface Exercise {
  id: number;
  name: string;
  description: string;
}


const Exercise = () => {
  const [exercises, setExercises] = useState<Array<Exercise>>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("/api/exercises/");
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/exercises/", {
        name,
        description,
      });
      setExercises([...exercises, response.data]);
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <div>
      <h2>Exercises</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exercise Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Exercise</button>
      </form>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {exercise.name}: {exercise.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise;
