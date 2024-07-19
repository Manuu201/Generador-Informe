import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const createEntity = (data) => api.post('/entity', data);
export const getEntities = () => api.get('/entities');
export const createReport = (data) => api.post('/report', data);
export const getReports = () => api.get('/reports');

export default api;
