import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Routine {
  id: number;
  date: string;
  name: string;
}

const Routine = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown | null>(null);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await axios.get('/api/routines/');
                setRoutines(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching routines</div>;

    return (
        <div>
            <h1>Your Routines</h1>
            <ul>
                {routines.map(routine => (
                    <li key={routine.id}>{routine.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Routine;