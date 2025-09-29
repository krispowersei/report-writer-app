import { FormEvent, useState } from 'react';
import { apiPost } from '../hooks/useApi';
import type { EdgeSettlementCheck, UUID } from '../types';

interface EdgeSettlementFormProps {
  tankId: UUID;
  onCreated: (record: EdgeSettlementCheck) => void;
}

export function EdgeSettlementForm({ tankId, onCreated }: EdgeSettlementFormProps) {
  const [present, setPresent] = useState(false);
  const [result, setResult] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { tank: tankId, present, result: result || null };
      const created = await apiPost<typeof payload, EdgeSettlementCheck>('/api/edge-settlement-checks/', payload);
      onCreated(created);
      setResult('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2">
        <input id="edge-present" type="checkbox" checked={present} onChange={event => setPresent(event.target.checked)} />
        <label htmlFor="edge-present" className="text-sm">Edge settlement present</label>
      </div>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        rows={3}
        placeholder="Summarize findings, instrumentation readings, or comments."
        value={result}
        onChange={event => setResult(event.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Save edge settlement result'}
      </button>
    </form>
  );
}
