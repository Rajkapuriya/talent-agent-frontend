import { create } from 'zustand';

export const useJobStore = create((set, get) => ({
    jobs: [],
    loading: false,
    error: null,

    setJobs: (jobs) => set({ jobs }),
    setLoading: (v) => set({ loading: v }),
    setError: (e) => set({ error: e }),

    upsertJob: (job) => {
        const jobs = get().jobs;
        const idx = jobs.findIndex(j => j._id === job._id);
        if (idx >= 0) {
            const updated = [...jobs];
            updated[idx] = job;
            set({ jobs: updated });
        } else {
            set({ jobs: [job, ...jobs] });
        }
    },

    removeJob: (id) => {
        set({ jobs: get().jobs.filter(j => j._id !== id) });
    },
}));