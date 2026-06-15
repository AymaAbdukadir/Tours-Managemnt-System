import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../services/api';
import { motion } from 'framer-motion';

const TourCard = ({ tour }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative h-72 overflow-hidden">
                <img
                    src={getImageUrl(tour.imageCover, 'tours')}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Badges */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {tour.difficulty}
                    </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                        {tour.title}
                    </h3>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6 flex-grow">
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 italic font-medium">
                    "{tour.summary}"
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={<Clock size={16} />} text={`${tour.duration} Days`} />
                    <InfoItem icon={<Users size={16} />} text={`${tour.maxGroupSize} People`} />
                    <InfoItem icon={<MapPin size={16} />} text={tour.location?.split(',')[0] || 'Global'} />
                    <InfoItem icon={<Calendar size={16} />} text={new Date(tour.startDates?.[0] || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} />
                </div>
            </div>

            {/* Footer Section */}
            <div className="px-8 pb-8 pt-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group-hover:bg-primary-50 transition-colors duration-500">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">${tour.price}</span>
                            <span className="text-xs font-bold text-gray-500">/pp</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/tours/${tour.id || tour._id}`)}
                        className="h-12 w-12 bg-gray-900 group-hover:bg-primary-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-gray-200 group-hover:shadow-primary-200 group-hover:-rotate-12"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="mt-4 flex items-center gap-2 px-2">
                    <div className="flex items-center text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-black ml-1 text-gray-900">{tour.ratingsAverage}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">({tour.ratingsQuantity} reviews)</span>
                </div>
            </div>
        </motion.div>
    );
};

const InfoItem = ({ icon, text }) => (
    <div className="flex items-center gap-2.5 text-gray-600">
        <div className="p-2 bg-gray-50 rounded-lg text-primary-600 font-bold group-hover:bg-white transition-colors">
            {icon}
        </div>
        <span className="text-xs font-bold text-gray-700">{text}</span>
    </div>
);

export default TourCard;
