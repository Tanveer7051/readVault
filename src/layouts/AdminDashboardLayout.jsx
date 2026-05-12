import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store';
import { Book, Users, User, LogOut, LayoutDashboard, PlusCircle, Bookmark, Clock } from 'lucide-react';
import Button from '../components/Button';

export default function AdminDashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Manage Books', path: '/admin/books', icon: Book },
    { name: 'Add Book', path: '/admin/add-book', icon: PlusCircle },
    { name: 'Manage Borrows', path: '/admin/borrows', icon: Bookmark },
    { name: 'Manage Reservations', path: '/admin/reservations', icon: Clock },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-slate-900 text-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
          <div className="p-6 border-b border-slate-800 flex flex-col items-center">
            <h2 className="font-bold text-white text-lg">Admin View</h2>
            <p className="text-sm text-slate-400 break-all text-center px-2 mb-3">{user?.email}</p>
            <div className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest rounded-lg">
              {typeof user?.role === 'object' ? (user?.role?.name || 'ADMIN') : (user?.role || 'ADMIN')}
            </div>
          </div>
          <nav className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-800">
             <button
               onClick={handleLogout}
               className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 transition-all w-full text-center"
             >
               Log Out
             </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
