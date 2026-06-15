import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, ChevronRight, Map } from 'lucide-react';

const BookingItem = ({ booking }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary-200 transition-all">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <Map size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900">{booking.tour?.title}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right">
                <p className="text-sm font-bold text-gray-900">${booking.price}</p>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {booking.status}
                </span>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
        </div>
    </div>
);

export default BookingItem;
