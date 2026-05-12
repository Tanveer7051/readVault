import { useState } from 'react';
import { bookService } from '../../services/apiService';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../constants';

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'FICTION',
    bookType: 'PHYSICAL',
    totalCopies: 1,
    availableCopies: 1,
  });
  const [images, setImages] = useState({
    image: null,
    pdf: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['totalCopies', 'availableCopies'].includes(name) ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setImages(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        let value = formData[key];
        // If type is DIGITAL, do not send copies or set them to 0 as expected by backend
        if (formData.bookType === 'DIGITAL' && (key === 'totalCopies' || key === 'availableCopies')) {
          value = 0;
        }
        data.append(key, value);
      });
      if (images.image) data.append('imageFile', images.image);
      if (images.pdf && formData.bookType === 'DIGITAL') data.append('pdfFile', images.pdf);

      await bookService.create(data);
      toast.success('Book created successfully');
      navigate('/admin/books');
    } catch (error) {
      console.error('Failed to create book', error);
      toast.error('Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Author</label>
            <input required type="text" name="author" value={formData.author} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Type</label>
            <select name="bookType" value={formData.bookType} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
              <option value="PHYSICAL">Physical</option>
              <option value="DIGITAL">Digital</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Total Copies</label>
            <input disabled={formData.bookType === 'DIGITAL'} required type="number" min="0" name="totalCopies" value={formData.bookType === 'DIGITAL' ? 0 : formData.totalCopies} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Available Copies</label>
            <input disabled={formData.bookType === 'DIGITAL'} required type="number" min="0" name="availableCopies" value={formData.bookType === 'DIGITAL' ? 0 : formData.availableCopies} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Cover Image</label>
            <input type="file" accept="image/*" name="image" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          </div>
          {formData.bookType === 'DIGITAL' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">PDF File</label>
              <input type="file" accept="application/pdf" name="pdf" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
          )}
        </div>

        <div className="pt-6">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Book'}
          </Button>
        </div>
      </form>
    </div>
  );
}
