import { useCallback, useEffect, useState } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
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

  return response.json() as Promise<T>;
}

export function useApi<T = unknown>(url: string, opts?: { immediate?: boolean }) {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: Boolean(opts?.immediate ?? true), error: null });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await request<T>(url);
      setState({ data, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setState({ data: null, loading: false, error: message });
    }
  }, [url]);

  useEffect(() => {
    if (opts?.immediate ?? true) {
      void fetchData();
    }
  }, [fetchData, opts?.immediate]);

  return { ...state, refetch: fetchData } as const;
}

export async function apiGet<T>(url: string): Promise<T> {
  return request<T>(url);
}

export async function apiPost<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
  return request<TResponse>(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function apiPatch<TRequest, TResponse>(url: string, body: Partial<TRequest>): Promise<TResponse> {
  return request<TResponse>(url, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

export async function apiDelete(url: string): Promise<void> {
  await request(url, { method: 'DELETE' });
}
