import api from './axios';

export const getAll = () => api.get('/notifications');
export const create = (message) => api.post('/notifications', { message }); 