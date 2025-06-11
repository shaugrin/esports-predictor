import API from './api';

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = async () => {
  await API.post('/auth/logout');
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/users/profile');
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch user data');
  }
};