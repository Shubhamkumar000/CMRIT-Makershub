const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const uploadRequest = async (endpoint: string, file: File) => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const validationMessage = Array.isArray(errorData.errors) && errorData.errors.length > 0
        ? errorData.errors[0]?.msg
        : null;
      throw new Error(validationMessage || errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: any) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials: any) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  adminLogin: (credentials: any) => apiRequest('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData: any) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  
  getMyBookings: () => apiRequest('/bookings/my-bookings'),
  
  getAll: () => apiRequest('/bookings'),
  
  updateStatus: (id: string, status: any) => apiRequest(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(status),
  }),
};

// Events API
export const eventsAPI = {
  getAll: () => apiRequest('/events'),
  
  create: (eventData: any) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  
  update: (id: string, eventData: any) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  
  delete: (id: string) => apiRequest(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// Inventory API
export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  
  getByCategory: (category: string) => apiRequest(`/inventory/category/${category}`),
  
  add: (itemData: any) => apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  
  update: (id: string, itemData: any) => apiRequest(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  
  delete: (id: string) => apiRequest(`/inventory/${id}`, {
    method: 'DELETE',
  }),
  
  book: (id: string) => apiRequest(`/inventory/${id}/book`, {
    method: 'POST',
  }),
};

// Tickets API
export const ticketsAPI = {
  create: (ticketData: any) => apiRequest('/tickets', {
    method: 'POST',
    body: JSON.stringify(ticketData),
  }),
  
  getMyTickets: () => apiRequest('/tickets/my-tickets'),
  
  getAll: () => apiRequest('/tickets'),
  
  updateStatus: (id: string, status: any) => apiRequest(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(status),
  }),
  
  delete: (id: string) => apiRequest(`/tickets/${id}`, {
    method: 'DELETE',
  }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => apiRequest('/notifications'),
  
  markRead: () => apiRequest('/notifications/mark-read', {
    method: 'PATCH',
  }),
  
  getUnreadCount: () => apiRequest('/notifications/unread-count'),
  
  delete: (id: string) => apiRequest(`/notifications/${id}`, {
    method: 'DELETE',
  }),
};

export const uploadsAPI = {
  uploadEventImage: (file: File) => uploadRequest('/uploads/event-image', file),
};

export default apiRequest;
