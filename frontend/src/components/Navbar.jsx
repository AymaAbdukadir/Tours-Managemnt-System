import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LogOut, User, Map, LayoutDashboard } from 'lucide-react';


const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 h-20 flex items-center px-4 md:px-12 justify-between transition-all duration-300">
            <div
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group cursor-pointer"
            >
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 group-hover:rotate-12 transition-transform duration-300">
                    <Map size={24} />
                </div>
                <div className="flex flex-col -space-y-1">
                    <span className="text-2xl font-black tracking-tighter text-gray-900">
                        DAL<span className="text-primary-600">XIIS</span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Premium Tours</span>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {user ? (
                    <>
                        <div className="hidden lg:flex items-center space-x-10">
                            <NavLink to="/" label="Home" />
                            <NavLink to="/tours" label="Tours" />
                            {['admin', 'lead-guide'].includes(user.role) && (
                                <NavLink to="/manage-tours" label="Manage Tours" />
                            )}
                            <NavLink to="/dashboard" label="Dashboard" />
                            <a href="/#contact" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors relative group py-2">
                                Contact
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full" />
                            </a>
                        </div>

                        <div className="h-8 w-[1px] bg-gray-100 hidden lg:block" />

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{user.role}</p>
                            </div>
                            <div className="relative group">
                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-black border-2 border-white shadow-md cursor-pointer group-hover:shadow-primary-100 transition-all duration-300 overflow-hidden">
                                    {user.photo && user.photo !== 'default.jpg' ? (
                                        <img src={getImageUrl(user.photo, 'users')} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>
                                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 p-2 z-[60]">
                                    <DropdownItem
                                        onClick={() => navigate('/dashboard')}
                                        icon={<LayoutDashboard size={18} />}
                                        label="Dashboard"
                                    />
                                    <DropdownItem
                                        onClick={() => navigate('/profile')}
                                        icon={<User size={18} />}
                                        label="Profile"
                                    />
                                    <div className="my-1 border-t border-gray-50" />
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <a href="/#contact" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors relative group py-2">
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full" />
                        </a>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-all duration-300 shadow-xl shadow-gray-200"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

const NavLink = ({ to, label }) => (
    <Link
        to={to}
        className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors relative group py-2"
    >
        {label}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full" />
    </Link>
);

const DropdownItem = ({ onClick, icon, label }) => (
    <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 text-sm text-gray-700 font-bold hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-colors"
    >
        {icon} {label}
    </button>
);

export default Navbar;
