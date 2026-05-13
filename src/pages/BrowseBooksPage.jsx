import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { bookService } from '../services/apiService';
import BookCard from '../components/BookCard';
import Input from '../components/Input';
import Button from '../components/Button';

export default function BrowseBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All', 'COMIC', 'LITERATURE', 'KNOWLEDGE', 'SCIENCE', 'TECHNOLOGY', 'HISTORY',
    'BIOGRAPHY', 'FICTION', 'NON_FICTION', 'EDUCATION', 'SELF_HELP', 'BUSINESS',
    'PHILOSOPHY', 'RELIGION', 'HEALTH', 'TRAVEL', 'CHILDREN', 'FANTASY', 'ROMANCE', 'THRILLER'
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAll();
      const booksArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : (data?.content && Array.isArray(data.content) ? data.content : []));
      setBooks(booksArray);
    } catch (error) {
      console.error('Failed to fetch books', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    if (!book) return false;
    const title = book.title || '';
    const author = book.author || '';
    
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                          author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || book.category === category;
    const matchesType = type === 'All' || (book.bookType || book.type) === type;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Library Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Explore our collection.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, author..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-primary shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className={`px-3 py-2 h-auto rounded-lg shadow-sm ${showFilters ? 'bg-primary text-white border-primary hover:bg-primary-hover hover:text-white' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                        category === cat ? 'bg-rose-50 text-primary border-rose-200' : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                <div className="flex gap-2">
                  {['All', 'DIGITAL', 'PHYSICAL'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                        type === t ? 'bg-rose-50 text-primary border-rose-200' : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-slate-200 rounded-2xl aspect-[3/4.5]" />)}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500">No books found.</p>
        </div>
      )}
    </div>
  );
}
