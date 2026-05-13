import { useState, useEffect } from 'react';
import { Star, Trash2, User as UserIcon, Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import { reviewService } from '../services/apiService';
import { toast } from 'react-hot-toast';
import Button from './Button';

export default function ReviewSection({ bookId }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getByBook(bookId);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.add(bookId, { rating, comment });
      toast.success('Review added successfully!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.delete(reviewId);
      toast.success('Review deleted');
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return (
    <div className="py-10 text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  );

  return (
    <div className="space-y-10 py-10 border-t border-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Community Reviews</h2>
          <p className="text-slate-500 text-sm">Read what others have to say about this book.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-5 w-5 ${s <= Math.round(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0) ? 'fill-current' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-slate-700 font-bold text-lg">
            {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0).toFixed(1)}
          </span>
          <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
        </div>
      </div>

      {isAuthenticated && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.username?.[0].toUpperCase() || <UserIcon className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700 mb-1">Rate this book</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <button
                      key={index}
                      type="button"
                      className="p-1 transition-transform active:scale-95"
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <Star
                        className={`h-6 w-6 ${(hover || rating) >= index ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none"
              />
              <div className="absolute bottom-3 right-3">
                <Button 
                  type="submit" 
                  size="sm" 
                  isLoading={submitting} 
                  disabled={!comment.trim()}
                  className="rounded-lg shadow-sm"
                >
                  <Send className="h-4 w-4 mr-2" /> Post Review
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="group relative flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm">
                  {review.userName?.[0].toUpperCase() || <UserIcon className="h-6 w-6" />}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800">{review.userName || 'Anonymous User'}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                
                {(user?.username === review.userName || user?.role === 'ADMIN') && (
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
