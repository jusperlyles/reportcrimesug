import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth');  // Replace with your auth endpoint
                if (!response.ok) throw new Error('Error fetching user');
                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return { user, loading, error };
};
