import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userService } from '../../services/apiService';
import { User, Shield, Trash2, Mail, Hash } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../lib/utils';

export default function ManageUsersPage() {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error(getErrorMessage(error, 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.delete(id);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Delete failed', error);
      toast.error(getErrorMessage(error, 'Failed to delete user'));
    }
  };

  const detectRole = (u) => {
    // Check multiple potential role fields
    const r = u?.role || u?.roles || u?.authorities;
    if (!r) return 'USER';
    
    let str = '';
    if (Array.isArray(r)) {
      str = r.map(item => {
        if (typeof item === 'string') return item;
        return item?.name || item?.authority || item?.role || '';
      }).join(' ');
    } else if (typeof r === 'object') {
      str = r.name || r.role || r.authority || '';
    } else {
      str = String(r);
    }
    
    return str.toUpperCase().includes('ADMIN') ? 'ADMIN' : 'USER';
  };

  const handleUpdateRole = async (targetUser) => {
    const isSelf = user?.id === targetUser.id;
    const currentRole = detectRole(targetUser);

    if (currentRole === 'ADMIN') {
      toast.error('User is already an Admin.');
      return;
    }

    if (!window.confirm(`Are you sure you want to upgrade ${targetUser.firstname} to Admin?`)) return;
    
    try {
      await userService.toggleRole(targetUser.id);
      toast.success(`${targetUser.firstname} upgraded to Admin successfully`);
      
      if (isSelf) {
        window.location.reload();
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error('Update role failed', error);
      toast.error(getErrorMessage(error, 'Failed to update role'));
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Loading users...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
        <p className="text-sm font-medium text-slate-500">Total Users: {users.length}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-8 font-bold text-slate-500 text-xs tracking-wider uppercase">User</th>
              <th className="py-4 px-8 font-bold text-slate-500 text-xs tracking-wider uppercase">Contact</th>
              <th className="py-4 px-8 font-bold text-slate-500 text-xs tracking-wider uppercase">Details</th>
              <th className="py-4 px-8 font-bold text-slate-500 text-xs tracking-wider uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => {
              const userRole = detectRole(u);
              const isAdmin = userRole === 'ADMIN';

              return (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-inner flex-shrink-0">
                        {u.profileImage ? (
                          <img src={u.profileImage} alt={u.username} className="h-full w-full object-cover" crossOrigin="anonymous" />
                        ) : (
                          <User className="h-6 w-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.firstname} {u.lastname}</p>
                        <p className="text-xs font-medium text-slate-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="break-all">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                     <div className="flex flex-col gap-1.5">
                       <span className="flex items-center gap-2 text-xs font-bold text-slate-500 tabular-nums">
                         <Hash className="h-3 w-3" /> ID: {u.id}
                       </span>
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit ${
                         isAdmin ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                       }`}>
                         <Shield className="h-3 w-3" /> {userRole}
                       </span>
                     </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!isAdmin ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleUpdateRole(u)}
                          className="px-4 py-2 h-auto text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          Upgrade To Admin
                        </Button>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Shield className="h-3 w-3" /> Admin
                        </span>
                      )}
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No users found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
