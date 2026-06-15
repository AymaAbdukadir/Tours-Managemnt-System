import { Loader2 } from 'lucide-react';

const LoadingSkeleton = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-3xl overflow-hidden">
                <div className="h-56 bg-gray-200" />
                <div className="p-6 space-y-4">
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="h-6 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="flex justify-between items-center pt-4">
                        <div className="h-8 w-1/3 bg-gray-200 rounded" />
                        <div className="h-10 w-10 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
)

export default LoadingSkeleton;
