import api from './axios';

export const stock = () => api.get('/reports/stock');
export const sales = (params) => api.get('/reports/sales', { params });
export const expiry = () => api.get('/reports/expiry');
export const lowStock = () => api.get('/reports/low-stock'); 