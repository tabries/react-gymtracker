import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// User authentication
export const registerUser = (userData) => api.post('auth/register/', userData);
export const loginUser = (credentials) => api.post('auth/login/', credentials);
export const logoutUser = () => api.post('auth/logout/');

// Routines
export const getRoutines = () => api.get('routines/');
export const createRoutine = (routineData) => api.post('routines/', routineData);
export const updateRoutine = (id, routineData) => api.put(`routines/${id}/`, routineData);
export const deleteRoutine = (id) => api.delete(`routines/${id}/`);

// Exercises
export const getExercises = () => api.get('exercises/');
export const createExercise = (exerciseData) => api.post('exercises/', exerciseData);
export const updateExercise = (id, exerciseData) => api.put(`exercises/${id}/`, exerciseData);
export const deleteExercise = (id) => api.delete(`exercises/${id}/`);

// History
export const getHistory = () => api.get('history/');
export const createHistoryEntry = (historyData) => api.post('history/', historyData);
export const updateHistoryEntry = (id, historyData) => api.put(`history/${id}/`, historyData);
export const deleteHistoryEntry = (id) => api.delete(`history/${id}/`);
export const getHistoryByDate = (date: string) => api.get(`history/by_date/?date=${date}`);

export default api;