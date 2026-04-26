import api from './axiosInstance';

export const getShortlist = (jobId) => api.get(`/shortlists/${jobId}`);
export const exportShortlist = (jobId) =>
    api.get(`/shortlists/${jobId}/export`, { responseType: 'blob' });