import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import UserDashboardLayout from './layouts/UserDashboardLayout.jsx';
import AdminDashboardLayout from './layouts/AdminDashboardLayout.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import BrowseBooksPage from './pages/BrowseBooksPage.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';

import ProfilePage from './pages/user/ProfilePage.jsx';
import MyBorrowsPage from './pages/user/MyBorrowsPage.jsx';
import MyReservationsPage from './pages/user/MyReservationsPage.jsx';

import AdminDashboardHome from './pages/admin/AdminDashboardHome.jsx';
import ManageBooksPage from './pages/admin/ManageBooksPage.jsx';
import EditBookPage from './pages/admin/EditBookPage.jsx';
import AddBookPage from './pages/admin/AddBookPage.jsx';
import ManageBorrowsPage from './pages/admin/ManageBorrowsPage.jsx';
import ManageReservationsPage from './pages/admin/ManageReservationsPage.jsx';
import ManageUsersPage from './pages/admin/ManageUsersPage.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BrowseBooksPage />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboardLayout /></ProtectedRoute>}>
            <Route index element={<ProfilePage />} />
            <Route path="borrows" element={<MyBorrowsPage />} />
            <Route path="reservations" element={<MyReservationsPage />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="books" element={<ManageBooksPage />} />
            <Route path="edit-book/:id" element={<EditBookPage />} />
            <Route path="add-book" element={<AddBookPage />} />
            <Route path="borrows" element={<ManageBorrowsPage />} />
            <Route path="reservations" element={<ManageReservationsPage />} />
            <Route path="users" element={<ManageUsersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

