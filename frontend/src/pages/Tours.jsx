import { useState, useEffect } from 'react';
import { useTours } from '../hooks/useTours';
import TourCard from '../components/TourCard';
import { Search, SlidersHorizontal, ArrowRight, FilterX } from 'lucide-react';
import LoadingSkeleton from '../components/Loading';

const Tours = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [activeFilters, setActiveFilters] = useState({});

    // Debounce search query to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (difficulty) params.difficulty = difficulty;
            setActiveFilters(params);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, difficulty]);

    const { tours, loading, error } = useTours(activeFilters);

    const clearFilters = () => {
        setSearchQuery('');
        setDifficulty('');
    };

    return (
        <div className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -z-10 -translate-x-1/2" />

            {/* Header & Filter */}
            <div className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <span className="text-primary-600 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Our Collection</span>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1]">
                            CURATED <span className="text-primary-600">JOURNEYS</span>
                        </h1>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-80 pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-300 font-bold text-sm"
                            />
                        </div>

                        <div className="relative group">
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="appearance-none bg-white border border-gray-100 rounded-2xl pl-6 pr-12 py-4 shadow-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-300 font-bold text-sm cursor-pointer"
                            >
                                <option value="">All Difficulties</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="difficult">Difficult</option>
                            </select>
                            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>

                        {(searchQuery || difficulty) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors font-bold text-sm"
                            >
                                <FilterX size={18} /> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <LoadingSkeleton count={6} />
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-3xl">
                    <p className="text-red-500 font-bold text-xl mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="text-primary-600 font-bold hover:underline">
                        Try Again
                    </button>
                </div>
            ) : tours.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-400 mx-auto mb-6 shadow-sm">
                        <Search size={32} />
                    </div>
                    <p className="text-gray-900 text-2xl font-black mb-2">No adventures found</p>
                    <p className="text-gray-500 font-medium">Try adjusting your filters or search terms</p>
                    <button
                        onClick={clearFilters}
                        className="mt-8 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary-600 transition shadow-lg"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map(tour => (
                            <TourCard key={tour._id} tour={{ ...tour, id: tour._id }} />
                        ))}
                    </div>
                    <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Showing {tours.length} premium tour{tours.length !== 1 ? 's' : ''}
                    </div>
                </>
            )}
        </div>
    );
};

export default Tours;
