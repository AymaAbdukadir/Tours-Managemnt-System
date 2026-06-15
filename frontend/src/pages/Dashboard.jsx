import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Map, Calendar, TrendingUp, Plus, X, CheckCircle2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import { LoadingSpinner } from '../components/Loading';
import { useBookings } from '../hooks/useBookings';
import toast from 'react-hot-toast';
import { BarChart, DonutChart } from '../components/StatsChart';
import PaymentModal from '../components/PaymentModal';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, tours: 0, bookings: 0 });
    const [tourStats, setTourStats] = useState([]);
    const [monthlyPlan, setMonthlyPlan] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const year = new Date().getFullYear();
            const [u, t, b, tStats, mPlan, rBookings] = await Promise.all([
                api.get('/users'),
                api.get('/tours'),
                api.get('/bookings'),
                api.get('/tours/tour-stats'),
                api.get(`/tours/monthly-plan/${year}`),
                api.get('/bookings?sort=-createdAt&limit=5')
            ]);

            setStats({
                users: u.data.results,
                tours: t.data.results,
                bookings: b.data.results
            });

            const difficultyStats = tStats.data.data.stats.map(stat => ({
                label: stat._id,
                value: stat.numTours,
                color: stat._id === 'EASY' ? '#10b981' : stat._id === 'MEDIUM' ? '#f59e0b' : '#ef4444'
            }));
            setTourStats(difficultyStats);

            const planData = mPlan.data.data.plan.map(item => ({
                label: new Date(0, item.month - 1).toLocaleString('default', { month: 'short' }),
                value: item.numTourStarts
            }));
            setMonthlyPlan(planData);
            setRecentActivity(rBookings.data.data.bookings);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            toast.error("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            toast.success(`Booking ${status} successfully!`);
            fetchStats();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Users className="text-blue-600" />} label="Total Users" value={stats.users} color="bg-blue-50" />
                <StatCard icon={<Map className="text-emerald-600" />} label="Active Tours" value={stats.tours} color="bg-emerald-50" />
                <StatCard icon={<Calendar className="text-amber-600" />} label="Total Bookings" value={stats.bookings} color="bg-amber-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tourStats.length > 0 && (
                    <DonutChart
                        title="Tours by Difficulty"
                        data={tourStats}
                    />
                )}
                {monthlyPlan.length > 0 && (
                    <BarChart
                        title={`Tour Schedule (${new Date().getFullYear()})`}
                        data={monthlyPlan}
                        color="bg-primary-500"
                    />
                )}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Recent System Activity</h3>
                    <TrendingUp className="text-gray-400" />
                </div>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <div key={activity._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                        <Plus size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {activity.user?.name || 'User'} booked <span className="text-primary-600">{activity.tour?.title || 'Tour'}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-900">${activity.price}</p>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${activity.status === 'confirmed' ? 'text-green-600' :
                                                activity.status === 'cancelled' ? 'text-red-600' : 'text-amber-600'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                    {activity.status === 'pending' && (
                                        <div className="flex gap-2 ml-4 border-l pl-4 border-gray-100">
                                            <button
                                                onClick={() => handleUpdateStatus(activity._id, 'confirmed')}
                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition shadow-sm"
                                                title="Confirm Booking"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(activity._id, 'cancelled')}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition shadow-sm"
                                                title="Cancel Booking"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                            No recent activity found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const { bookings, loading, cancelBooking } = useBookings();
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await cancelBooking(bookingId);
            toast.success('Booking cancelled successfully!');
        } catch (err) {
            toast.error(err.message);
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
        <div className="space-y-8">
            <SectionHeader title="Your Booked Adventures" />
            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No bookings yet. Ready for an adventure?</p>
                    <button onClick={() => navigate('/tours')} className="text-primary-600 font-bold hover:underline">Browse Tours</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900">{booking.tour?.title || 'Tour'}</h3>
                                <p className="text-gray-500 text-sm mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                                <p className="text-primary-600 font-bold mt-2">${booking.price}</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {(!booking.paymentStatus || booking.paymentStatus === 'unpaid') && (
                                    <button
                                        onClick={() => handlePaymentClick(booking)}
                                        className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl text-xs hover:bg-primary-700 transition shadow-lg shadow-primary-200"
                                    >
                                        Pay Now
                                    </button>
                                )}
                                <button
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    title="Cancel booking"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                booking={selectedBooking}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

const GuideDashboard = ({ user }) => (
    <div className="space-y-8">
        <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Guide Schedule</h3>
                <p className="text-primary-100 max-w-md">Vew your upcoming assigned tours and participant lists here.</p>
            </div>
            <Map className="absolute -bottom-4 -right-4 h-48 w-48 text-primary-500 opacity-20 rotate-12" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-6">Assigned Tours</h4>
                <div className="text-center py-10 text-gray-400">No tours assigned recently</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-6">Participants List</h4>
                <div className="text-center py-10 text-gray-400">Select a tour to view participants</div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">Hello, {user?.name}!</h1>
                    <p className="text-gray-500 capitalize">{user?.role} Control Center</p>
                </div>
                {['admin', 'lead-guide'].includes(user?.role) && (
                    <button
                        onClick={() => navigate('/manage-tours')}
                        className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-gray-800 transition"
                    >
                        <Plus size={20} /> Create New Tour
                    </button>
                )}
            </div>

            {user?.role === 'admin' && <AdminDashboard />}
            {['guide', 'lead-guide'].includes(user?.role) && <GuideDashboard user={user} />}
            {user?.role === 'user' && <UserDashboard />}
        </div>
    );
};

export default Dashboard;
