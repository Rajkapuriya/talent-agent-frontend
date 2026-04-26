import { useEffect, useRef } from 'react';
import { usePipelineStore } from '../store/usePipelineStore';

export function usePipelineSSE(runId) {
    const { updateStage, setShortlist, setError } = usePipelineStore();
    const esRef = useRef(null);

    useEffect(() => {
        if (!runId) return;

        let token = '';
        try {
            const raw = localStorage.getItem('talent_agent_auth');
            const state = raw ? JSON.parse(raw) : {};
            token = state?.state?.token ?? '';
        } catch (_) {
            token = '';
        }

        const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
        const base = apiBase.replace(/\/$/, '');
        const url = `${base}/pipeline/${runId}/progress?token=${encodeURIComponent(token)}`;
        esRef.current = new EventSource(url);

        esRef.current.onmessage = (e) => {
            const event = JSON.parse(e.data);

            switch (event.stage) {
                case 'parsing': updateStage('parsing', { status: 'loading' }); break;
                case 'parsed': updateStage('parsing', { status: 'done', data: event }); break;
                case 'discovered': updateStage('discovered', { status: 'done', data: event }); break;
                case 'scored': updateStage('scoring', { status: 'loading', progress: (prev => prev + 1) }); break;
                case 'engaged': updateStage('engaging', { status: 'loading', progress: (prev => prev + 1) }); break;
                case 'ranking': updateStage('ranking', { status: 'loading' }); break;
                case 'complete':
                    updateStage('complete', { status: 'done', data: event });
                    setShortlist(event.shortlistId);
                    esRef.current.close();
                    break;
                case 'error':
                    setError(event.message);
                    esRef.current.close();
                    break;
            }
        };

        esRef.current.onerror = () => {
            setError('Connection lost. Please refresh.');
            esRef.current.close();
        };

        return () => esRef.current?.close();
    }, [runId]);
}