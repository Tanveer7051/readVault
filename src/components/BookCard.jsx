import { motion } from 'motion/react';
import { BookOpen, MapPin, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

import { formatPublisher } from '../lib/utils';

export default function BookCard({ book }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group overflow-hidden transition-all duration-300 cursor-pointer h-full"
    >
      <Link to={`/books/${book.id}`} className="flex flex-col h-full">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
          <img
            src={book.imgUrl || book.imageUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
          <div className="absolute top-3 right-3">
            <span className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold shadow-sm ${
              (book.bookType || book.type) === 'DIGITAL' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {(book.bookType || book.type) === 'DIGITAL' ? <Monitor className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
              {book.bookType || book.type}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{book.category}</p>
          <h3 className="line-clamp-1 text-base font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-slate-500 mb-2">by {book.author}</p>
          {(book.publishedBy || book.published_by || book.publisher) && (
            <p className="text-[10px] font-semibold text-slate-400 italic mb-4">
              Published by: {formatPublisher(book.publishedBy || book.published_by || book.publisher)}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
            {(book.bookType || book.type) !== 'DIGITAL' ? (
              <span className={`text-xs font-semibold ${book.availableCopies > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {book.availableCopies > 0 ? `${book.availableCopies} Copies` : 'Out of Stock'}
              </span>
            ) : (
              <span className="text-xs font-semibold text-blue-500">Digital Access</span>
            )}
            <Button variant="outline" className="px-3 py-1.5 text-xs font-bold rounded-lg border-slate-200 group-hover:border-primary group-hover:text-primary transition-all pointer-events-none">
              Details
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
