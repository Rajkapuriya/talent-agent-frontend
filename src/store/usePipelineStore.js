import { create } from 'zustand';

export const usePipelineStore = create((set) => ({
    stages: {
        parsing: { status: 'idle', data: null },
        discovered: { status: 'idle', data: null },
        scoring: { status: 'idle', data: null, progress: 0, total: 0 },
        engaging: { status: 'idle', data: null, progress: 0, total: 0 },
        ranking: { status: 'idle', data: null },
        complete: { status: 'idle', data: null },
    },
    activeRunId: null,
    shortlistId: null,
    error: null,

    setRunId: (runId) => set({ activeRunId: runId }),
    updateStage: (stage, update) =>
        set(s => ({ stages: { ...s.stages, [stage]: { ...s.stages[stage], ...update } } })),
    setShortlist: (id) => set({ shortlistId: id }),
    setError: (error) => set({ error }),
    resetPipeline: () => set({ stages: { /* reset to idle */ }, activeRunId: null, shortlistId: null, error: null }),
}));