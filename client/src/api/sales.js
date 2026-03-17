import api from './axios';

export const getAll = (params) =>
  api.get('/sales', { params });
export const getOne = (id) =>
  api.get(`/sales/${id}`);
export const create = (data) =>
  api.post('/sales', data);
export const report = () =>
  api.get('/sales/report');
export const myStats = () =>
  api.get('/sales/mystats'); 