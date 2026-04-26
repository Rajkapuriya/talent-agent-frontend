import { useState, useEffect } from 'react';
import { getShortlist, exportShortlist } from '../api/shortlist.api';

export function useShortlist(jobId) {
    const [shortlist, setShortlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!jobId) return;
        setLoading(true);
        getShortlist(jobId)
            .then(res => setShortlist(res.data))
            .catch(err => setError(err.response?.data?.error ?? 'Failed to load shortlist'))
            .finally(() => setLoading(false));
    }, [jobId]);

    const handleExport = async () => {
        try {
            const res = await exportShortlist(jobId);
            const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `shortlist-${jobId}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('[Export]', err);
        }
    };

    return { shortlist, loading, error, handleExport };
}