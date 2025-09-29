import { FormEvent, useState } from 'react';
import { apiPost } from '../hooks/useApi';
import type { OtherNDE, UUID } from '../types';

interface OtherNDEFormProps {
  tankId: UUID;
  onCreated: (record: OtherNDE) => void;
}

export function OtherNDEForm({ tankId, onCreated }: OtherNDEFormProps) {
  const [ndeType, setNdeType] = useState('MFL');
  const [result, setResult] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        tank: tankId,
        nde_type: ndeType,
        result
      };
      const created = await apiPost<typeof payload, OtherNDE>('/api/other-nde/', payload);
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
      <label className="flex flex-col text-sm">
        NDE type
        <input
          className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
          value={ndeType}
          onChange={event => setNdeType(event.target.value)}
          placeholder="MFL"
          required
        />
      </label>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        rows={3}
        value={result}
        onChange={event => setResult(event.target.value)}
        placeholder="Summarize findings and relevance."
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Add record'}
      </button>
    </form>
  );
}
