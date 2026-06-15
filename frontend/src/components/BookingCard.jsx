import { ShieldCheck, Check } from 'lucide-react';

const BookingCard = ({ price, onBook, loading }) => (
    <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-8">
        <div className="flex justify-between items-end mb-8">
            <div>
                <p className="text-sm font-bold text-gray-400">Total Price</p>
                <p className="text-4xl font-black text-gray-900">${price}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Save 10% Today</p>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={14} />
                </div>
                Free cancellation 24h before
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={14} />
                </div>
                Expert local tour guides
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={14} />
                </div>
                Hand-picked premium hotels
            </div>
        </div>

        <button
            onClick={onBook}
            disabled={loading}
            className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 hover:shadow-primary-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {loading ? 'Processing...' : 'Book This Adventure'}
        </button>

        <p className="text-center text-gray-400 text-xs mt-6 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck size={14} /> Secure Checkout Guarantee
        </p>
    </div>
);

export default BookingCard;
