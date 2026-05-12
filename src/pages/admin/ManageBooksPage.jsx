import { useState, useEffect } from 'react';
import { bookService } from '../../services/apiService';
import { Book, Edit, Trash2, Plus } from 'lucide-react';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios'; // direct api for delete

export default function ManageBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/api/book/${id}`);
      toast.success('Book deleted successfully');
      setBooks(books.filter(b => b.id !== id));
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Failed to delete book');
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Loading books...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Books</h1>
        <Link to="/admin/add-book">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Book
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Book</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Category</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Type</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase">Copies</th>
              <th className="py-3 px-4 font-bold text-slate-500 text-sm tracking-wider uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={book.imgUrl || book.imageUrl} alt={book.title} className="w-10 h-14 object-cover rounded opacity-80" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{book.title}</p>
                      <p className="text-xs text-slate-500">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">{book.category}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{book.bookType || book.type}</td>
                <td className="py-3 px-4 text-sm text-slate-600 font-medium">
                  {book.availableCopies} / {book.totalCopies}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/edit-book/${book.id}`} className="p-1.5 text-slate-400 hover:text-primary transition-colors disabled:opacity-50" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(book.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {books.length === 0 && (
          <div className="text-center py-12 text-slate-500">No books found.</div>
        )}
      </div>
    </div>
  );
}
