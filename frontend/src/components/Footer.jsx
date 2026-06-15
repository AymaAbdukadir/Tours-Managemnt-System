import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                {/* Brand Column */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-900/40">
                            <Map size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            DAL<span className="text-primary-600">XIIS</span>
                        </span>
                    </Link>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        Somalia's leading premium tour management system. We create unforgettable memories, one journey at a time.
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon icon={<Facebook size={20} />} href="#" />
                        <SocialIcon icon={<Twitter size={20} />} href="#" />
                        <SocialIcon icon={<Instagram size={20} />} href="#" />
                        <SocialIcon icon={<Linkedin size={20} />} href="#" />
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Explore</h3>
                    <ul className="space-y-4">
                        <FooterLink to="/" text="Home" />
                        <FooterLink to="/tours" text="All Tours" />
                        <FooterLink to="/about" text="About Us" />
                        <FooterLink to="/stories" text="Travel Stories" />
                        <FooterLink to="/careers" text="Careers" />
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                    <ul className="space-y-4">
                        <FooterLink to="/help" text="Help Center" />
                        <FooterLink to="/terms" text="Terms of Service" />
                        <FooterLink to="/privacy" text="Privacy Policy" />
                        <FooterLink to="/faq" text="FAQs" />
                        <FooterLink to="/contact" text="Contact Support" />
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Stay Updated</h3>
                    <p className="text-gray-400 mb-6">Subscribe to our newsletter for the latest travel tips and exclusive offers.</p>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500 transition outline-none"
                            />
                        </div>
                        <button className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2">
                            Subscribe <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Dalxiis Inc. All rights reserved.</p>
                <div className="flex gap-8">
                    <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
                    <Link to="/terms" className="hover:text-white transition">Terms</Link>
                    <Link to="/sitemap" className="hover:text-white transition">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon, href }) => (
    <a
        href={href}
        className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300 pointer-cursor"
    >
        {icon}
    </a>
);

const FooterLink = ({ to, text }) => (
    <li>
        <Link to={to} className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
            <span className="h-1.5 w-1.5 bg-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            {text}
        </Link>
    </li>
);

export default Footer;
