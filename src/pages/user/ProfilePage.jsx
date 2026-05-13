import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services/apiService';
import { setUser } from '../../store';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { User, Camera } from 'lucide-react';
import { getErrorMessage } from '../../lib/utils';

export default function ProfilePage() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);
  
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });
      if (profileImage) {
        data.append('image', profileImage);
        data.append('file', profileImage); // appending to both image and file to cover common Spring boot variables
        data.append('imageFile', profileImage); 
      }
      
      const updatedUser = await authService.updateProfile(data);
      dispatch(setUser({ ...user, ...updatedUser }));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="text-sm">
            Edit Profile
          </Button>
        )}
      </div>
      
      {!isEditing ? (
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-shrink-0">
            <div className="h-32 w-32 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner border border-slate-200">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.username} className="h-full w-full object-cover" crossOrigin="anonymous" />
              ) : (
                <User className="h-12 w-12 text-slate-400" />
              )}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">First Name</p>
              <p className="text-lg font-medium text-slate-800">{user?.firstname || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Last Name</p>
              <p className="text-lg font-medium text-slate-800">{user?.lastname || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Username</p>
              <p className="text-lg font-medium text-slate-800">{user?.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email</p>
              <p className="text-lg font-medium text-slate-800 break-all">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Role</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit ${
                String(user?.role?.name || user?.role || '').toUpperCase().includes('ADMIN') ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {typeof user?.role === 'object' ? (user?.role?.name || 'USER') : (user?.role || 'USER')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden shadow-inner border border-slate-200">
                {profileImage ? (
                  <img src={URL.createObjectURL(profileImage)} alt="Preview" className="h-full w-full object-cover" />
                ) : user?.profileImage ? (
                  <img src={user.profileImage} alt={user.username} className="h-full w-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-1">Profile Photo</p>
              <p className="text-xs text-slate-500">Click the image to change. Recommended 400x400px.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">First Name</label>
              <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Last Name</label>
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
