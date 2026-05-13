import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../services/apiService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Upload, FileText } from 'lucide-react';
import { CATEGORIES } from '../../constants';

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [book, setBook] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    bookType: 'PHYSICAL',
    totalCopies: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const data = await bookService.getById(id);
      setBook(data);
      setFormData({
        title: data.title || '',
        author: data.author || '',
        category: data.category || '',
        description: data.description || '',
        bookType: data.bookType || 'PHYSICAL',
        totalCopies: data.totalCopies || 0
      });
      setImagePreview(data.imgUrl);
    } catch (error) {
      console.error('Failed to fetch book', error);
      toast.error('Failed to load book details');
      navigate('/admin/books');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCopies' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) setPdfFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      
      // Append all formData keys
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (imageFile) data.append('imgUrl', imageFile);
      if (pdfFile) data.append('pdfFile', pdfFile);

      await bookService.update(id, data);
      toast.success('Book updated successfully');
      navigate('/admin/books');
    } catch (error) {
      console.error('Update failed', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update book';
      toast.error(errorMsg, { duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 animate-pulse">Loading book details...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/admin/books')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Edit Book: {book?.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Media */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Book Cover Image</label>
              <div className="relative group aspect-[3/4] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary transition-colors bg-slate-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs">Upload Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            {formData.bookType === 'DIGITAL' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Book PDF File (Optional if not changing)</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-primary transition-colors bg-slate-50">
                  <div className="flex items-center gap-3 text-slate-500">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm truncate">{pdfFile ? pdfFile.name : 'Update PDF File'}</span>
                  </div>
                  <input type="file" accept="application/pdf" onChange={handlePdfChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="space-y-4">
            <Input label="Book Title" name="title" value={formData.title} onChange={handleInputChange} required />
            <Input label="Author" name="author" value={formData.author} onChange={handleInputChange} required />
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-primary transition-all" required>
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-primary transition-all min-h-[120px]" required />
            </div>

            {formData.bookType === 'PHYSICAL' && (
              <Input label="Total Copies" type="number" name="totalCopies" value={formData.totalCopies} onChange={handleInputChange} min="1" required />
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/books')} disabled={submitting}>Cancel</Button>
          <Button type="submit" className="flex items-center gap-2" disabled={submitting}>
            <Save className="h-4 w-4" /> {submitting ? 'Updating...' : 'Update Book'}
          </Button>
        </div>
      </form>
    </div>
  );
}
