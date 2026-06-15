import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, booking }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            toast.success('Payment Successful!');
            setTimeout(() => {
                onClose(true); // Close with success status
            }, 2000);
        }, 2500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isProcessing && onClose()}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {!isSuccess ? (
                            <div className="p-8">
                                <button
                                    onClick={onClose}
                                    disabled={isProcessing}
                                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-0"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>

                                <div className="mb-8">
                                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                                        <CreditCard size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">Secure Payment</h2>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Complete your booking for <span className="font-bold text-gray-900">{booking?.tour?.title}</span>
                                    </p>
                                </div>

                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            <span>Total Amount</span>
                                            <ShieldCheck size={16} className="text-emerald-500" />
                                        </div>
                                        <div className="text-3xl font-black text-gray-900">${booking?.price}</div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                required
                                                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none transition-all font-mono"
                                            />
                                            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                required
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">CVV</label>
                                            <input
                                                type="password"
                                                placeholder="***"
                                                maxLength="3"
                                                required
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="JON DOE"
                                            required
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none transition-all uppercase font-medium"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-200 hover:bg-primary-600 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing Securely...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={18} />
                                                Pay ${booking?.price} Securely
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-lg shadow-emerald-50"
                                >
                                    <CheckCircle2 size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Received!</h3>
                                <p className="text-gray-500 font-medium">Your adventure is now officially confirmed. Check your email for details.</p>
                                <div className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 animate-pulse">
                                    Redirecting to Dashboard
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
