import { Star } from 'lucide-react';
import { getImageUrl } from '../services/api';

const ReviewCard = ({ review }) => {
    return (
        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
            <div className="h-16 w-16 rounded-full overflow-hidden mb-4 border-2 border-white shadow-md bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                {review.user?.photo === 'default.jpg' ? (
                    <span className="text-xl uppercase">{review.user.name.charAt(0)}</span>
                ) : (
                    <img
                        src={getImageUrl(review.user?.photo, 'users')}
                        alt={review.user?.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <h6 className="font-bold text-gray-900 uppercase text-sm mb-4">{review.user.name}</h6>
            <p className="text-gray-500 italic mb-6">
                "{review.review}"
            </p>
            <div className="flex items-center gap-1 mt-auto">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewCard;
