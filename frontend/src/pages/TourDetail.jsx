import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTour } from '../hooks/useTours';
import { useAuth } from '../store/AuthContext';
import api, { getImageUrl } from '../services/api';
import {
    MapPin, Calendar, Clock, Users, Star,
    Map as MapIcon, Check, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import BookingCard from '../components/BookingCard';
import SectionHeader from '../components/SectionHeader';
import { LoadingSpinner } from '../components/Loading';
import ReviewCard from '../components/ReviewCard';
import TourMap from '../components/Map';

const TourDetail = () => {
    const { id } = useParams();
    const { tour, loading, error } = useTour(id);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookingLoading, setBookingLoading] = useState(false);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    const handleBookTour = async () => {
        if (!user) {
            toast.error('Please login to book this tour');
            return navigate('/login');
        }

        setBookingLoading(true);
        try {
            await api.post('/bookings', {
                tour: id,
                bookingDate: new Date(),
                price: tour.price
            });
            toast.success('Tour booked successfully! Check your dashboard.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to book tour');
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to review');
            return navigate('/login');
        }
        setSubmittingReview(true);
        try {
            await api.post(`/tours/${id}/reviews`, { review, rating });
            toast.success('Review submitted successfully');
            setReview('');
            window.location.reload();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error || !tour) return (
        <div className="h-screen flex flex-col items-center justify-center pt-20">
            <p className="text-red-500 font-bold text-2xl mb-4">Oops! {error || 'Tour not found'}</p>
            <button onClick={() => navigate('/tours')} className="flex items-center gap-2 text-primary-600 font-bold">
                <ArrowLeft size={18} /> Back to Tours
            </button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative h-[60vh] md:h-[70vh]">
                <img src={getImageUrl(tour.imageCover, 'tours')} className="w-full h-full object-cover" alt={tour.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                    onClick={() => navigate('/tours')}
                    className="absolute top-24 left-8 h-12 w-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="absolute bottom-12 left-8 md:left-20 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <span className="px-4 py-1.5 bg-primary-600 text-white font-bold rounded-full text-xs tracking-widest uppercase">
                            {tour.difficulty} Adventure
                        </span>
                        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur text-white font-bold rounded-full text-xs">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            {tour.ratingsAverage} ({tour.ratingsQuantity} reviews)
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white leading-tight"
                    >
                        {tour.title}
                    </motion.h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-3xl">
                        <QuickInfo icon={<Clock size={16} />} label="Duration" value={`${tour.duration} Days`} />
                        <QuickInfo icon={<Users size={16} />} label="Group Size" value={`${tour.maxGroupSize} People`} />
                        <QuickInfo icon={<MapPin size={16} />} label="Location" value={tour.location} />
                        <QuickInfo icon={<Calendar size={16} />} label="Available" value={`${tour.availableSeats} Seats`} />
                    </div>

                    <section>
                        <SectionHeader title="About this tour" />
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {tour.description}
                        </p>
                    </section>

                    <section>
                        <SectionHeader title="Tour Locations" />
                        <div className="h-[400px] w-full bg-gray-100 rounded-3xl overflow-hidden shadow-inner">
                            {tour.locations && <TourMap locations={tour.locations} />}
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Your tour guides" />
                        <div className="flex flex-wrap gap-8">
                            {tour.guidesAssigned?.map(guide => (
                                <div key={guide._id} className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 overflow-hidden">
                                        {guide.photo === 'default.jpg' ? guide.name.charAt(0) : <img src={getImageUrl(guide.photo, 'users')} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{guide.name}</h4>
                                        <p className="text-sm text-primary-600 font-semibold uppercase text-[10px] tracking-widest">{guide.role?.replace('-', ' ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Reviews" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {tour.reviews?.map((review) => (
                                <ReviewCard key={review.id || review._id} review={review} />
                            ))}
                            {(!tour.reviews || tour.reviews.length === 0) && (
                                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                            )}
                        </div>

                        {user && (
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                                <h4 className="font-bold text-xl mb-6">Write a Review</h4>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`transition ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                >
                                                    <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                                        <textarea
                                            rows="4"
                                            value={review}
                                            onChange={e => setReview(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition"
                                            placeholder="Share your experience..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </section>

                    <section>
                        <SectionHeader title="Capture the moments" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tour.images?.map((img, i) => (
                                <img key={i} src={getImageUrl(img, 'tours')} className="rounded-3xl w-full h-64 object-cover shadow-sm" alt={`Tour gallery ${i}`} />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar / Booking Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <BookingCard price={tour.price} onBook={handleBookTour} loading={bookingLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickInfo = ({ icon, label, value }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2 font-bold text-gray-900">
            <span className="text-primary-600">{icon}</span> {value}
        </div>
    </div>
)

export default TourDetail;
