import React, { useEffect, useState } from 'react';
// import { getUserProfile } from '../services/api';

const User = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchUserProfile = async () => {
    //         try {
    //             const response = await getUserProfile();
    //             setUser(response.data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchUserProfile();
    // }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            {user ? (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    {/* Add more user details as needed */}
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default User;