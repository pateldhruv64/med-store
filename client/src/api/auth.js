import api from './axios';

export const register = (username, password, role, securityKey) =>
  api.post('/auth/register', { username, password, role, securityKey });

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const getProfile = () =>
  api.get('/auth/profile'); 