import { useState, useEffect } from 'react';
import api from '../services/api';

export const useBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/bookings/my-bookings');
            setBookings(res.data.data.bookings);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        try {
            await api.delete(`/bookings/${bookingId}`);
            // Remove from local state
            setBookings(bookings.filter(b => b._id !== bookingId));
            return true;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    return { bookings, loading, error, refetch: fetchBookings, cancelBooking };
};
