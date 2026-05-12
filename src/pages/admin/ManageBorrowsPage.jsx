import { useState, useEffect } from 'react';
import { borrowService } from '../../services/apiService';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function ManageBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const data = await borrowService.getAll();
      setBorrows(data);
    } catch (error) {
      console.error('Failed to fetch borrows', error);
      toast.error('Failed to load borrows');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await borrowService.return(id);
      toast.success('Book marked as returned');
      fetchBorrows();
    } catch (error) {
      console.error('Return failed', error);
      toast.error('Failed to process return');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'OVERDUE': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Loading borrows...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Borrows & Returns</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase rounded-tl-xl">Book</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">User ID</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Issue Date</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Status</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase text-right rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-4 px-4">
                  <p className="font-bold text-slate-800 line-clamp-1">{record.bookTitle}</p>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-slate-600">
                  {record.userId}
                </td>
                <td className="py-4 px-4 text-sm text-slate-600">
                  {record.issueDate ? format(new Date(record.issueDate), 'MMM dd, yyyy') : 'N/A'}
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {record.status === 'ACTIVE' || record.status === 'OVERDUE' ? (
                    <Button variant="outline" onClick={() => handleReturn(record.id)} className="px-3 py-1.5 text-xs">
                      <RefreshCw className="h-3 w-3 mr-1.5" /> Return
                    </Button>
                  ) : (
                    <span className="flex items-center justify-end text-emerald-600 text-xs font-bold gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Returned
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {borrows.length === 0 && (
          <div className="text-center py-12 text-slate-500">No borrow records found.</div>
        )}
      </div>
    </div>
  );
}
