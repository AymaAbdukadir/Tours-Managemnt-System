import { useState, useEffect } from 'react';
import api, { getImageUrl } from '../services/api';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash, Loader2, MapPin, Calendar, DollarSign, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const initialTourState = {
        title: '',
        duration: '',
        maxGroupSize: '',
        difficulty: 'easy',
        price: '',
        summary: '',
        description: '',
        location: '',
        availableSeats: '',
        imageCover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80'
    };

    const [tourForm, setTourForm] = useState(initialTourState);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/tours?page=${page}&limit=${limit}`);
            setTours(res.data.data.tours);
            setHasMore(res.data.results === limit);
        } catch (err) {
            toast.error('Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, [page]);

    const resetForm = () => {
        setTourForm(initialTourState);
        setIsAdding(false);
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (tour) => {
        setTourForm({
            title: tour.title,
            duration: tour.duration,
            maxGroupSize: tour.maxGroupSize,
            difficulty: tour.difficulty || 'easy',
            price: tour.price,
            summary: tour.summary,
            description: tour.description,
            location: tour.location,
            availableSeats: tour.availableSeats,
            imageCover: tour.imageCover
        });
        setEditId(tour._id || tour.id);
        setIsEditing(true);
        setIsAdding(true); // Re-use the adding form view
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(tourForm).forEach(key => {
                if (key === 'imageCover' && typeof tourForm[key] !== 'object') {
                    // If it's a string (existing URL), we might not need to send it if backend handles it,
                    // but sending it is fine if backend ignores string for image field
                    formData.append(key, tourForm[key]);
                } else {
                    formData.append(key, tourForm[key]);
                }
            });

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (isEditing) {
                await api.patch(`/tours/${editId}`, formData, config);
                toast.success('Tour updated successfully!');
            } else {
                await api.post('/tours', formData, config);
                toast.success('Tour created successfully!');
            }
            resetForm();
            fetchTours();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tour?')) return;
        try {
            await api.delete(`/tours/${id}`);
            toast.success('Tour deleted');
            fetchTours();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Manage Tours</h1>
                    <p className="text-gray-500">Create, edit, or remove tours from the system.</p>
                </div>
                <button
                    onClick={() => {
                        if (isAdding) resetForm();
                        else setIsAdding(true);
                    }}
                    className={`px-6 py-3 font-bold rounded-xl flex items-center gap-2 transition shadow-lg ${isAdding
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
                        }`}
                >
                    <Plus size={20} className={isAdding ? 'rotate-45' : ''} /> {isAdding ? 'Cancel' : 'Add New Tour'}
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl mb-12"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Tour' : 'Create New Tour'}</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tour Title</label>
                                <input type="text" value={tourForm.title} onChange={e => setTourForm({ ...tourForm, title: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" placeholder="e.g. The Forest Hiker" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Days)</label>
                                    <input type="number" value={tourForm.duration} onChange={e => setTourForm({ ...tourForm, duration: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                                    <input type="number" value={tourForm.price} onChange={e => setTourForm({ ...tourForm, price: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                    <input type="text" value={tourForm.location} onChange={e => setTourForm({ ...tourForm, location: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" placeholder="e.g. Banff, Canada" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                                    <select value={tourForm.difficulty} onChange={e => setTourForm({ ...tourForm, difficulty: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition">
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="difficult">Difficult</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Summary</label>
                                <input type="text" value={tourForm.summary} onChange={e => setTourForm({ ...tourForm, summary: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea rows="3" value={tourForm.description} onChange={e => setTourForm({ ...tourForm, description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Group</label>
                                    <input type="number" value={tourForm.maxGroupSize} onChange={e => setTourForm({ ...tourForm, maxGroupSize: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Seats Available</label>
                                    <input type="number" value={tourForm.availableSeats} onChange={e => setTourForm({ ...tourForm, availableSeats: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={typeof tourForm.imageCover === 'string' ? getImageUrl(tourForm.imageCover) : URL.createObjectURL(tourForm.imageCover)}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setTourForm({ ...tourForm, imageCover: e.target.files[0] })}
                                        className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 pt-6 flex gap-4">
                            <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg shadow-gray-200">
                                {isEditing ? 'Update Tour' : 'Create Tour'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={resetForm} className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={48} /></div>
            ) : (
                <>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:table-cell">Image</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tour</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:table-cell">Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:table-cell">Seats</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tours.map(tour => (
                                    <tr key={tour.id || tour._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <img src={getImageUrl(tour.imageCover)} alt={tour.title} className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{tour.title}</td>
                                        <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{tour.location}</td>
                                        <td className="px-6 py-4 font-bold text-primary-600">${tour.price}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${tour.availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {tour.availableSeats} Left
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <button onClick={() => handleEdit(tour)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Tour">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(tour.id || tour._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Tour">
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded-lg bg-gray-100 font-bold disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="font-bold text-gray-700">Page {page}</span>
                        <button
                            disabled={!hasMore}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded-lg bg-gray-100 font-bold disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageTours;
