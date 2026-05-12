import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data;
    
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    
    const decoded = jwtDecode(accessToken);
    const userId = decoded.sub;
    
    const userResponse = await api.get(`/api/user/${userId}`);
    const user = userResponse.data;

    // Verify admin role via permissions check
    try {
      await api.get('/api/user/all');
      user.role = 'ADMIN';
    } catch {
      user.role = user.role || 'USER';
    }
    
    return {
      accessToken,
      refreshToken,
      user
    };
  },
  
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    await api.post('/api/user/logout'); // Update me later if endpoint is wrong
    localStorage.removeItem('accessToken');
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No token found');
    const decoded = jwtDecode(token);
    const userId = decoded.sub;
    const response = await api.get(`/api/user/${userId}`);
    const user = response.data;
    
    // Verify admin role via permissions check
    try {
      await api.get('/api/user/all');
      user.role = 'ADMIN';
    } catch {
      user.role = user.role || 'USER';
    }
    
    return user;
  },
  
  updateProfile: async (formData) => {
    const response = await api.put('/api/user/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.user || response.data;
  },
};

export const bookService = {
  getAll: async (params) => {
    const response = await api.get('/api/book/all', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/book/${id}`);
    return response.data;
  },
  
  create: async (formData) => {
    const response = await api.post('/api/book/addbook', formData);
    return response.data;
  },
  
  update: async (id, formData) => {
    const response = await api.put(`/api/book/${id}`, formData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/book/${id}`);
    return response.data;
  },
};

export const borrowService = {
  borrow: async (bookId) => {
    const response = await api.post(`/api/borrow/take/${bookId}`);
    return response.data;
  },
  
  digitalAccess: async (bookId) => {
    const response = await api.post(`/api/borrow/digital/${bookId}`);
    return response.data;
  },
  
  return: async (recordId) => {
    const response = await api.put(`/api/borrow/return/${recordId}`);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/api/borrow');
    return response.data;
  },
  
  getMyBorrows: async () => {
    const response = await api.get('/api/borrow/my'); 
    return response.data;
  },
};

export const reservationService = {
  reserve: async (bookId) => {
    const response = await api.post(`/api/reservations/${bookId}`);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await api.put(`/api/reservations/${id}/cancel`);
    return response.data;
  },
  
  getMyReservations: async () => {
    const response = await api.get('/api/reservations/my');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/api/reservations');
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    // We will try updating status via query or body. Assuming it's a specific endpoint or PUT.
    // In spring boot standard, it might be /api/reservations/{id}/status?status=APPROVED
    // Or maybe just /api/reservations/{id}/approve ? The user said there is APPROVED and REJECT, wait -> they said "complete it reject do something"
    // Also "ReservationStatus { PENDING, COMPLETED, CANCELLED, APPROVED }"
    const response = await api.put(`/api/reservations/${id}/status`, null, { params: { status } });
    return response.data;
  }
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/api/user/all');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/api/user/${id}`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/user/${id}`);
    return response.data;
  },
  
  toggleRole: async (id) => {
    const response = await api.put(`/api/user/${id}/toggle-role`);
    return response.data;
  }
};
