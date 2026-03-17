import api from './axios';

export const getAll = (search) =>
  api.get('/medicines', { params: search ? { search } : {} });
export const getOne = (id) =>
  api.get(`/medicines/${id}`);
export const create = (data) =>
  api.post('/medicines', data);
export const update = (id, data) =>
  api.put(`/medicines/${id}`, data);
export const remove = (id) =>
  api.delete(`/medicines/${id}`);
export const addStock = (id, quantity) =>
  api.post(`/medicines/${id}/add-stock`, { quantity });
export const expiryAlerts = () =>
  api.get('/medicines/expiry-alerts');
export const lowStockAlerts = () =>
  api.get('/medicines/low-stock-alerts'); 