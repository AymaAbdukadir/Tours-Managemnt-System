import { useState, useEffect } from 'react';
import api from '../services/api';

export const useTours = (params = {}) => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tours', { params });
            setTours(res.data.data.tours);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, [JSON.stringify(params)]);

    return { tours, loading, error, refetch: fetchTours };
};

export const useTour = (id) => {
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/tours/${id}`);
                setTour(res.data.data.tour);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch tour');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTour();
    }, [id]);

    return { tour, loading, error };
};
