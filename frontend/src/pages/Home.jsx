import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import TourCard from '../components/TourCard';
import LoadingSkeleton from '../components/Loading';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Compass, Shield, Award, MapPin as MapPinIcon, ArrowRight, Star, Calendar, Users } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ tours: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching tours...');
                const toursRes = await api.get('/tours?limit=6');
                console.log('Tours response:', toursRes.data);

                const toursData = toursRes.data.data.tours || [];
                console.log('Tours data:', toursData);

                setTours(toursData);
                setStats({
                    tours: toursRes.data.results || 0
                });
            } catch (err) {
                console.error('Failed to fetch data:', err);
                console.error('Error response:', err.response);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="pt-16">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Hero"
                />
                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 bg-primary-600/20 backdrop-blur-md border border-primary-500/30 rounded-full text-primary-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
                    >
                        Dalxiis Premium Tours
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter"
                    >
                        DISCOVER YOUR NEXT <br />
                        <span className="text-primary-400">EPIC ADVENTURE</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium"
                    >
                        Explore breathtaking destinations with expert guides. Unforgettable experiences await with Dalxiis.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => navigate('/tours')}
                            className="px-10 py-5 bg-primary-600 text-white font-bold text-lg rounded-2xl hover:bg-primary-700 transition-all flex items-center gap-2 justify-center shadow-2xl shadow-primary-600/50"
                        >
                            Explore Tours <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all border-2 border-white/30"
                        >
                            Join Now
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl font-black text-gray-900">Experience the Difference</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<Compass className="text-primary-600" size={40} />}
                            title="Expert Local Guides"
                            description="Our guides are locals with deep love and knowledge for their cities, ensuring you see the authentic side of every destination."
                        />
                        <FeatureCard
                            icon={<Shield className="text-primary-600" size={40} />}
                            title="100% Secure Booking"
                            description="Travel with peace of mind. Our secure booking platform and 24/7 support means we've always got your back."
                        />
                        <FeatureCard
                            icon={<Award className="text-primary-600" size={40} />}
                            title="Best Price Guarantee"
                            description="We partner directly with providers to give you the best rates. Find a lower price? We'll match it and give you credit."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works - New Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary-100 rounded-3xl transform -rotate-3" />
                            <img
                                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
                                alt="Travel Planning"
                                className="relative rounded-2xl shadow-2xl w-full object-cover h-[500px]"
                            />
                        </div>
                        <div>
                            <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Easy Booking</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-8">Your Journey Starts Here</h2>
                            <div className="space-y-8">
                                <StepItem
                                    number="01"
                                    title="Choose Destination"
                                    text="Browse our curated collection of over 500+ premium tours across the globe."
                                />
                                <StepItem
                                    number="02"
                                    title="Book Securely"
                                    text="Reserve your spot with our secure payment system. Instant confirmation guaranteed."
                                />
                                <StepItem
                                    number="03"
                                    title="Start Exploring"
                                    text="Meet your guide and create unforgettable memories. Adventure awaits!"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tours */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Popular Adventures</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Hand-picked tours from our collection. Real experiences from your database.
                    </p>
                </div>

                {loading ? (
                    <LoadingSkeleton count={6} />
                ) : tours.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl">
                        <p className="text-gray-500 text-lg mb-4">No tours available yet</p>
                        <button
                            onClick={() => navigate('/manage-tours')}
                            className="text-primary-600 font-bold hover:underline"
                        >
                            Add your first tour
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.slice(0, 6).map((tour) => (
                            <TourCard key={tour._id} tour={{ ...tour, id: tour._id }} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/tours')}
                        className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all inline-flex items-center gap-2"
                    >
                        View All {stats.tours} Tours <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatItem value={`${stats.tours}+`} label="Tour Destinations" />
                        <StatItem value="4.9/5" label="Average Rating" />
                        <StatItem value="24/7" label="Customer Support" />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 bg-white relative overflow-hidden" id="contact">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Reach Out</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900">Contact Us</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <ContactInfo icon={<Mail size={24} />} title="Email Us" text="hello@dalxiis.com" />
                                    <ContactInfo icon={<Phone size={24} />} title="Call Us" text="+252 61 XXX XXXX" />
                                    <ContactInfo icon={<MapPinIcon size={24} />} title="Visit Us" text="Mogadishu, Somalia" />
                                </div>
                            </div>
                            <div className="p-8 bg-primary-50 rounded-[2.5rem] border border-primary-100">
                                <h4 className="font-bold text-primary-900 mb-2">Office Hours</h4>
                                <p className="text-primary-700 text-sm">Saturday - Thursday: 8:00 AM - 5:00 PM</p>
                                <p className="text-primary-700 text-sm">Friday: Closed</p>
                            </div>
                        </div>
                        <div>
                            <form
                                className="space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary-900/5 border border-gray-100"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    toast.success('Thanks! Message sent successfully. 🚀');
                                    e.target.reset();
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-bold" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Message</label>
                                    <textarea rows="4" placeholder="How can we help you?" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-100 transition-all font-bold resize-none" required></textarea>
                                </div>
                                <button type="submit" className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-primary-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200">
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-primary-100 text-xl mb-10">
                        Join thousands of travelers exploring the world with us
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-12 py-5 bg-white text-primary-600 font-black text-lg rounded-2xl hover:bg-gray-100 transition-all shadow-2xl"
                    >
                        Get Started Today
                    </button>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all"
    >
        <div className="inline-flex p-4 bg-primary-50 rounded-2xl mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">{description}</p>
    </motion.div>
);

const StatItem = ({ value, label }) => (
    <div className="text-center">
        <p className="text-5xl font-black text-white mb-2">{value}</p>
        <p className="text-gray-400 font-medium">{label}</p>
    </div>
);

const StepItem = ({ number, title, text }) => (
    <div className="flex gap-6">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{text}</p>
        </div>
    </div>
);

const ContactInfo = ({ icon, title, text }) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary-600">
            {icon}
        </div>
        <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <p className="text-lg font-bold text-gray-900">{text}</p>
        </div>
    </div>
);

export default Home;
