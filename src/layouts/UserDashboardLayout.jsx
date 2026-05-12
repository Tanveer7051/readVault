import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store';
import { Book, User, Settings, LogOut } from 'lucide-react';
import Button from '../components/Button';

export default function UserDashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Profile', path: '/dashboard', icon: User },
    { name: 'My Borrows', path: '/dashboard/borrows', icon: Book },
    { name: 'Reservations', path: '/dashboard/reservations', icon: Book },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
          <div className="p-6 border-b border-slate-100 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 mb-4 overflow-hidden shadow-inner">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.username} className="h-full w-full object-cover" crossOrigin="anonymous" />
              ) : (
                <User className="h-10 w-10 text-slate-400 m-auto mt-5" />
              )}
            </div>
            <h2 className="font-bold text-slate-800 text-lg">{user?.firstname} {user?.lastname}</h2>
            <p className="text-sm text-slate-500 break-all text-center">{user?.email}</p>
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
                    isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
             <button
               onClick={handleLogout}
               className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all w-full text-center"
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
