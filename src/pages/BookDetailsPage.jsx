import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MapPin, Monitor, User as UserIcon } from 'lucide-react';
import { bookService, borrowService, reservationService } from '../services/apiService';
import Button from '../components/Button';
import ReviewSection from '../components/ReviewSection';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { getErrorMessage, formatPublisher } from '../lib/utils';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showReader, setShowReader] = useState(false);
  const [digitalLoading, setDigitalLoading] = useState(false);
  const [hasActiveDigital, setHasActiveDigital] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (book && isAuthenticated && (book.bookType || book.type) === 'DIGITAL') {
      borrowService.getMyBorrows().then(myBorrows => {
        const hasActive = myBorrows.some(
          record => (record.bookId === book.id || record.book?.id === book.id) && record.type === 'DIGITAL' && record.status === 'ACTIVE'
        );
        setHasActiveDigital(hasActive);
        
        if (location.state?.openReader && hasActive) {
          setShowReader(true);
          // clear state so it doesn't reopen if they close it and navigate around
          window.history.replaceState({}, document.title);
        }
      }).catch(err => console.error(err));
    }
  }, [book, isAuthenticated, location.state]);

  const fetchBook = async () => {
    try {
      const data = await bookService.getById(Number(id));
      setBook(data);
    } catch (error) {
      console.error('Failed to fetch book', error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn, successMsg) => {
    if (!isAuthenticated) return navigate('/login');
    setActionLoading(true);
    try {
      await actionFn(book.id);
      toast.success(successMsg);
      fetchBook();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Action failed.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDigitalAccess = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (hasActiveDigital) {
      // If already borrowed, they clicked 'Read Online' (though button will say Read Online now?)
      toast('You already have access to this digital book.', { icon: 'ℹ️' });
      return;
    }
    
    setDigitalLoading(true);
    try {
      await borrowService.digitalAccess(book.id);
      setHasActiveDigital(true);
      toast.success('Digital Book Borrowed! You can read it from your dashboard or click Read Online.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to borrow digital book.'));
    } finally {
      setDigitalLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><p className="text-sm font-bold text-slate-400">Loading...</p></div>;
  if (!book) return <div className="p-20 text-center">Book not found</div>;

  const isDigital = (book.bookType || book.type) === 'DIGITAL';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <Link to="/books" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-semibold">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm relative aspect-[3/4]">
          <img src={book.imgUrl || book.imageUrl} alt={book.title} className="w-full h-full object-cover rounded-xl" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{book.category}</p>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">{book.title}</h1>
            <p className="text-base text-slate-500">by {book.author}</p>
            {(book.publishedBy || book.published_by || book.publisher) && (
              <div className="flex items-center gap-2 mt-1">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold text-slate-400">Published by: <span className="text-slate-600">{formatPublisher(book.publishedBy || book.published_by || book.publisher)}</span></p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border rounded text-xs font-bold ${isDigital ? 'text-blue-600 border-blue-200' : 'text-amber-600 border-amber-200'}`}>
              {isDigital ? <Monitor className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              {book.bookType || book.type}
            </span>
            {!isDigital && (
              <span className={`inline-flex items-center px-3 py-1 bg-slate-50 border rounded text-xs font-bold ${book.availableCopies > 0 ? 'text-emerald-600 border-emerald-200' : 'text-slate-400 border-slate-200'}`}>
                {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-4">
            {book.description}
          </p>

          <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-5">
            {!isDigital && (
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500 font-semibold">Copies Available:</span>
                <span className="font-bold text-slate-800">{book.availableCopies} / {book.totalCopies}</span>
              </div>
            )}

            {isDigital ? (
              book.pdfurl ? (
                <>
                  {!hasActiveDigital ? (
                    <Button className="w-full" onClick={handleDigitalAccess} isLoading={actionLoading || digitalLoading}>Borrow Digital Book</Button>
                  ) : (
                    <Button className="w-full" onClick={() => setShowReader(true)} isLoading={actionLoading || digitalLoading}>Read Online</Button>
                  )}
                  
                  {showReader ? (
                    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col">
                      <div className="h-16 px-6 bg-slate-800 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setShowReader(false)} className="p-2 text-white/70 hover:text-white transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <h2 className="text-white font-bold truncate max-w-xs md:max-w-md">{book.title}</h2>
                        </div>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-widest hidden sm:block">PDF Reader</p>
                      </div>
                      <div className="flex-1 bg-slate-700 overflow-hidden relative">
                         <iframe 
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(book.pdfurl)}&embedded=true`} 
                            className="w-full h-full border-none bg-white"
                            title="PDF Reader"
                         />
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <Button className="w-full" disabled>PDF Not Available</Button>
              )
            ) : (
              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  disabled={book.availableCopies === 0}
                  onClick={() => handleAction(borrowService.borrow, 'Borrowed successfully!')}
                  isLoading={actionLoading}
                >Borrow</Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => handleAction(reservationService.reserve, 'Reserved successfully!')}
                  isLoading={actionLoading}
                >Reserve</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ReviewSection bookId={book.id} />
    </div>
  );
}
