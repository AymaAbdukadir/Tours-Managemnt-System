import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save, Loader2, Calendar, MapPin, Clock } from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';

const Profile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my-bookings');
                setBookings(res.data.data.bookings);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load bookings');
            } finally {
                setLoadingBookings(false);
            }
        };
        if (user) fetchBookings();
    }, [user]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.delete(`/bookings/${bookingId}`);
            setBookings(bookings.filter(b => b._id !== bookingId && b.id !== bookingId));
            toast.success('Booking cancelled successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await api.patch('/users/updateMe', { name, email });
            toast.success('Profile updated successfully!');
            // Ideally we'd refresh the user context here
            window.location.reload();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePaymentClick = (booking) => {
        setSelectedBooking(booking);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        window.location.reload();
    };

    return (
        <div className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Your Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                        <div className="relative inline-block mb-6">
                            <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-white shadow-lg mx-auto overflow-hidden">
                                {user.photo === 'default.jpg' ? user.name.charAt(0) : <img src={getImageUrl(user.photo, 'users')} className="w-full h-full object-cover" />}
                            </div>
                            <button className="absolute bottom-0 right-0 h-8 w-8 bg-gray-900 text-white rounded-full flex items-center justify-center border-2 border-white hover:scale-110 transition shadow-md">
                                <Camera size={14} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4">{user.email}</p>
                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-full text-[10px] uppercase tracking-widest">
                            {user.role} Account
                        </span>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <User size={20} className="text-primary-600" /> General Settings
                        </h4>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50">
                                <button
                                    className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary-700 transition shadow-lg shadow-primary-100 disabled:opacity-50"
                                    disabled={isUpdating}
                                    type="submit"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 bg-black/5 rounded-3xl p-8 border border-dashed border-gray-200">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-gray-600" /> Security
                        </h4>
                        <p className="text-gray-500 text-sm mb-6">Keep your account secure by using a strong password. We recommend updating it every 3 months.</p>
                        <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-white transition">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* My Bookings Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                {loadingBookings ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-600" /></div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                        <p className="text-gray-500">You haven't booked any tours yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {bookings.map((booking) => (
                            <div key={booking._id || booking.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={getImageUrl(booking.tour.imageCover)}
                                        alt={booking.tour.title}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-gray-800 shadow-sm">
                                        {booking.status || 'Confirmed'}
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <h3 className="text-2xl font-black text-white leading-tight">{booking.tour.title}</h3>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-6 font-medium">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <MapPin size={18} className="text-primary-600" />
                                            {booking.tour.location || 'Unknown Location'}
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                            <Calendar size={18} className="text-primary-600" />
                                            {new Date(booking.bookingDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Price</span>
                                            <span className="text-2xl font-black text-primary-600">${booking.price}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            {(!booking.paymentStatus || booking.paymentStatus === 'unpaid') && (
                                                <button
                                                    onClick={() => handlePaymentClick(booking)}
                                                    className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-sm hover:bg-primary-700 transition shadow-lg shadow-primary-200"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleCancelBooking(booking._id || booking.id)}
                                                className="px-6 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-100 hover:text-red-500 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                booking={selectedBooking}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default Profile;
