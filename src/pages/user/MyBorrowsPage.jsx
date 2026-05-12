import { useState, useEffect } from 'react';
import { borrowService } from '../../services/apiService';
import { BookOpen, Calendar, Clock, RotateCcw, Monitor, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    try {
      const data = await borrowService.getMyBorrows();
      setBorrows(data);
    } catch (error) {
      console.error('Failed to fetch borrows', error);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-sky-50 text-sky-700 border-sky-100 ring-sky-500/20';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20';
      case 'OVERDUE': return 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-white border border-slate-100 h-48 rounded-2xl shadow-sm" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">My Bookshelf</h1>
        <p className="text-slate-500">Track and manage your borrowed physical and digital books.</p>
      </div>

      {borrows.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Your bookshelf is empty</h3>
          <p className="text-slate-500 max-w-md mb-8">Ready for your next adventure? Browse our collection and find your next great read.</p>
          <Link to="/books">
            <Button className="px-8">Browse Library</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {borrows.map((record, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={record.id} 
              className="bg-white group rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm ring-1 ring-inset ${getStatusColor(record.status)} mb-3`}>
                      {record.status}
                    </span>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-primary transition-colors">{record.bookTitle}</h3>
                  </div>
                  
                  <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl shadow-sm ${record.type === 'DIGITAL' ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                    {record.type === 'DIGITAL' ? <Monitor className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                  </div>
                </div>
                
                <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-5 mt-6 border border-slate-100 relative overflow-hidden group-hover:bg-white transition-colors">
                  <div className="absolute top-0 right-0 h-20 w-20 bg-slate-200/20 rounded-full blur-2xl translate-x-10 -translate-y-10 group-hover:bg-primary/5 transition-colors"></div>
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Borrowed On</p>
                      <p className="text-sm font-bold text-slate-700">{record.issueDate ? format(new Date(record.issueDate), 'MMM dd, yyyy') : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        {record.type === 'PHYSICAL' ? <Clock className="h-3 w-3" /> : <RotateCcw className="h-3 w-3" />} 
                        {record.type === 'PHYSICAL' ? 'Return By' : 'Access Until'}
                      </p>
                      <p className={`text-sm font-bold ${record.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-800'}`}>
                        {record.type === 'PHYSICAL' 
                          ? (record.dueDate ? format(new Date(record.dueDate), 'MMM dd, yyyy') : 'N/A')
                          : (record.digitalExpiry ? format(new Date(record.digitalExpiry), 'MMM dd, yyyy') : 'N/A')
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Progress Bar Feel */}
                  <div className="mt-4 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: record.status === 'COMPLETED' ? '100%' : '60%' }}
                      className={`h-full ${
                        record.status === 'ACTIVE' ? 'bg-sky-500' : 
                        record.status === 'OVERDUE' ? 'bg-rose-500' : 
                        'bg-emerald-500'
                      }`}
                    />
                  </div>
                  
                  {record.type === 'DIGITAL' && record.status === 'ACTIVE' && (
                    <div className="mt-5">
                      <Link to={`/books/${record.bookId || record.book?.id}`} state={{ openReader: true }}>
                        <Button className="w-full py-2 text-sm bg-indigo-600 hover:bg-indigo-700">Read Online</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
