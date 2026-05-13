import { useState, useEffect } from 'react';
import { bookService, borrowService } from '../../services/apiService';
import { Book, Users, Bookmark, FileText } from 'lucide-react';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    books: 0,
    borrows: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await bookService.getAll();
      const booksArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
      const borrows = await borrowService.getAll();
      const borrowsArray = Array.isArray(borrows) ? borrows : (borrows?.data && Array.isArray(borrows.data) ? borrows.data : []);
      setStats({
        books: booksArray.length,
        borrows: borrowsArray.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Book className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Total Books</p>
            <p className="text-2xl font-bold text-slate-800">{stats.books}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Bookmark className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase">Total Borrows</p>
            <p className="text-2xl font-bold text-slate-800">{stats.borrows}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
