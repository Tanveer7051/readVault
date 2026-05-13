import { useState, useEffect } from 'react';
import { reservationService } from '../../services/apiService';
import { CheckCircle2, XCircle, Clock, Check } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { getErrorMessage } from '../../lib/utils';

export default function ManageReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations', error);
      toast.error(getErrorMessage(error, 'Failed to load reservations'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      if (status === 'APPROVED') {
        // try specific approve or query based
        try {
           await reservationService.updateStatus(id, status);
        } catch(e) {
           // fallback if query param fails
           await reservationService.updateStatusFallback?.(id, status);
        }
      } else {
        await reservationService.updateStatus(id, status);
      }
      toast.success(`Reservation marked as ${status}`);
      fetchReservations();
    } catch (error) {
      console.error('Status update failed', error);
      toast.error(getErrorMessage(error, `Failed to process ${status}`));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'APPROVED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'CANCELLED': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Loading reservations...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Reservations</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase rounded-tl-xl">Book</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">User ID</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Reservation Date</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Status</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-800 line-clamp-1">{record.bookTitle || record.book?.title || 'Unknown Book'}</p>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-slate-600">
                  {record.userId || record.user?.id}
                </td>
                <td className="py-4 px-4 text-sm text-slate-600">
                  {record.reservationDate ? format(new Date(record.reservationDate), 'MMM dd, yyyy') : 'N/A'}
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {record.status === 'PENDING' ? (
                    <div className="flex gap-2 justify-end">
                       <Button variant="outline" onClick={() => handleUpdateStatus(record.id, 'APPROVED')} className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50">
                         <Check className="h-3 w-3 mr-1.5" /> Approve
                       </Button>
                       <Button variant="outline" onClick={() => handleUpdateStatus(record.id, 'CANCELLED')} className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50">
                         <XCircle className="h-3 w-3 mr-1.5" /> Reject
                       </Button>
                    </div>
                  ) : record.status === 'APPROVED' ? (
                     <div className="flex gap-2 justify-end">
                       <Button variant="outline" onClick={() => handleUpdateStatus(record.id, 'COMPLETED')} className="px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50">
                         <CheckCircle2 className="h-3 w-3 mr-1.5" /> Complete
                       </Button>
                     </div>
                  ) : (
                    <span className="flex items-center justify-end text-slate-500 text-xs font-bold gap-1">
                       {record.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
                       {record.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && (
          <div className="text-center py-12 text-slate-500">No reservation records found.</div>
        )}
      </div>
    </div>
  );
}
