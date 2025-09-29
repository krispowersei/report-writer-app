import { useCallback, useEffect, useState } from 'react';
async function request(input, init) {
    const response = await fetch(input, {
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {})
        },
        ...init
    });
    if (!response.ok) {
        const details = await response.text();
        throw new Error(details || response.statusText);
    }
    return response.json();
}
export function useApi(url, opts) {
    const [state, setState] = useState({ data: null, loading: Boolean(opts?.immediate ?? true), error: null });
    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await request(url);
            setState({ data, loading: false, error: null });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setState({ data: null, loading: false, error: message });
        }
    }, [url]);
    useEffect(() => {
        if (opts?.immediate ?? true) {
            void fetchData();
        }
    }, [fetchData, opts?.immediate]);
    return { ...state, refetch: fetchData };
}
export async function apiGet(url) {
    return request(url);
}
export async function apiPost(url, body) {
    return request(url, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}
export async function apiPatch(url, body) {
    return request(url, {
        method: 'PATCH',
        body: JSON.stringify(body)
    });
}
export async function apiDelete(url) {
    await request(url, { method: 'DELETE' });
}
