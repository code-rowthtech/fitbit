import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/api/v1/auth/login', credentials);
  return response;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response;
};

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response;
};

export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response;
};

export const forgotPasswordConfirm = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response;
};