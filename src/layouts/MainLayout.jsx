import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';
import { BookMarked, Search, User, LogOut, Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../components/Button';

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Books', path: '/books' },
    { name: 'About Us', path: '/about' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'bg-white shadow-sm py-4 border-slate-200' : 'bg-white/80 backdrop-blur-md py-4 border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <BookMarked className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">ReadVault</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <button onClick={handleLogout} className="text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors">
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="font-semibold text-slate-600 hover:text-slate-900">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-24 px-6 border-b border-slate-200"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className="text-lg font-bold text-slate-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-100" />
              {isAuthenticated ? (
                <>
                  <Link 
                    to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    className="text-lg font-bold text-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-lg font-bold text-primary text-left">
                    Log Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 pt-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-24 pb-12">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <BookMarked className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-800">ReadVault</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              ReadVault is a modern digital library platform designed to provide secure, fast, and accessible book management.
            </p>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="text-slate-500 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/books" className="text-slate-500 hover:text-primary transition-colors">Browse Books</Link></li>
              <li><Link to="/about" className="text-slate-500 hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/terms" className="text-slate-500 hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-4">Developer</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <p>Designed and Built by <strong>Tanveer Ahmed</strong></p>
              <div className="flex items-center gap-3 mt-2 text-slate-400">
                <a href="https://github.com/Tanveer7051" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="http://www.linkedin.com/in/tanveer-ahmed-tech" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="mailto:tanveerahmed.dev@example.com" className="hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2026 ReadVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
