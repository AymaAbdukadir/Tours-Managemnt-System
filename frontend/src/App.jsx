import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './store/AuthContext';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ManageTours from './pages/ManageTours';
import { ProtectedRoute } from './components/ProtectedRoute';

import Footer from './components/Footer';

function App() {
    const { loading } = useAuth();
    const location = useLocation();

    // Hide navbar/footer on auth pages
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {!isAuthPage && <Navbar />}
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/tours" element={<Tours />} />
                    <Route path="/tours/:id" element={<TourDetail />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manage-tours"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'lead-guide']}>
                                <ManageTours />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
            {!isAuthPage && <Footer />}
        </div>
    )
}

export default App
