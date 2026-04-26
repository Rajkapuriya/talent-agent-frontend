import api from './axiosInstance';

export const getJobs = () => api.get('/jobs');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.patch(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);