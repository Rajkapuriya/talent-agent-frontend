import api from './axiosInstance';

export const startPipeline = (data) => api.post('/pipeline/run', data);
// Note: SSE progress is handled by usePipelineSSE hook directly via EventSource