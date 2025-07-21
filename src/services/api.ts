import type { NewExercise } from '@/components/Exercise/CreateExercise';
import type { NewRoutine } from '@/components/Routine/CreateRoutine';
import type { NewHistory } from '@/routes/history';
import type { Weight } from '@/routes/weight';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Routines
export const getRoutines = () => api.get('routines/');
export const createRoutine = (routineData: NewRoutine) => api.post('routines/', routineData);
export const deleteRoutine = (id: number) => api.delete(`routines/${id}/`);

// Exercises
export const getExercises = () => api.get('exercises/');
export const createExercise = (exerciseData: NewExercise) => api.post('exercises/', exerciseData);
export const deleteExercise = (id: number) => api.delete(`exercises/${id}/`);

// History
export const getHistory = () => api.get('history/');
export const createHistoryEntry = (historyData: NewHistory) => api.post('history/', historyData);
export const deleteHistoryEntry = (id: number) => api.delete(`history/${id}/`);
export const getHistoryByDate = (date: string) => api.get(`history/by_date/?date=${date}`);
export const getHistoryByMonth = (date: string) => api.get(`history/by_month/?date=${date}`);

// Weight
export const getWeights = () => api.get('weight/');
export const createWeight = (data: Weight) => api.post('weight/', data);
export const deleteWeight = (id: number) => api.delete(`weight/${id}/`);

export default api;