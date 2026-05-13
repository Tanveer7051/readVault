import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, BookOpen, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import BookCard from '../components/BookCard';
import { bookService } from '../services/apiService';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getAll();
        const booksArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : (data?.content && Array.isArray(data.content) ? data.content : []));
        setFeaturedBooks(booksArray.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-lg border border-rose-100">
              <Sparkles className="text-primary h-3.5 w-3.5" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Digital Library Vault</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-[1.1] tracking-tight">
              Unlock a World of <span className="text-primary relative inline-block">Knowledge</span>
            </h1>
            
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              Experience the future of libraries. Securely browse, borrow, and read thousands of digital and physical books in our premium vault.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link to="/books" className="w-full sm:w-auto">
                <Button className="w-full text-base">Explore Library</Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full text-base">Join Now</Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div>
                <p className="text-2xl font-bold text-slate-800">12,400+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Books</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-800">5,000+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Readers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block h-[500px]"
          >
            <div className="absolute inset-0 bg-slate-100 rounded-3xl transform rotate-3 scale-105 border border-slate-200"></div>
            <div className="relative z-10 bg-white rounded-3xl shadow-sm border border-slate-200 h-full overflow-hidden p-3">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop" 
                alt="Library" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Why Choose ReadVault?</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">Our platform combines the warmth of traditional libraries with the speed of digital technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-xl border border-indigo-100">
                <BookOpen className="text-indigo-600 h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Digital Access</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Read your favorite digital books anywhere, anytime with our premium cloud reader.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center rounded-xl border border-emerald-100">
                <Clock className="text-emerald-600 h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Quick Reservations</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Reserve physical copies instantly and track your queue status in real-time.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-rose-50 flex items-center justify-center rounded-xl border border-rose-100">
                <ShieldCheck className="text-rose-600 h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Secure & Robust</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Your reading activity and favorite collections are protected by high-grade encryption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">New Arrivals</h2>
            <p className="text-sm text-slate-500">Discover the latest additions to our catalog.</p>
          </div>
          <Link to="/books">
            <Button variant="ghost" className="hidden sm:flex text-sm">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1,2,3,4].map(i => <div key={i} className="animate-pulse bg-slate-200 rounded-2xl aspect-[3/4.5]" />)
          ) : featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <p className="text-slate-500 col-span-full">No books available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}
