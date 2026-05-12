import { useState, useEffect } from 'react';
import { reservationService } from '../../services/apiService';
import { BookOpen, Calendar, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations', error);
      toast.error('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await reservationService.cancel(id);
      toast.success('Reservation cancelled');
      fetchReservations();
    } catch (error) {
      console.error('Failed to cancel', error);
      toast.error('Failed to cancel reservation');
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Loading reservations...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Reservations</h1>
      
      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No reservations</h3>
          <p className="text-slate-500 mt-2">Browse the library to make a reservation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={res.id} 
              className="border border-slate-100 rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg mb-2">{res.bookTitle}</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> Reserved: {res.reservationDate ? format(new Date(res.reservationDate), 'MMM dd, yyyy') : 'N/A'}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${res.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{res.status}</span>
                </div>
              </div>
              {res.status === 'PENDING' && (
                <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleCancel(res.id)}>
                   <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
