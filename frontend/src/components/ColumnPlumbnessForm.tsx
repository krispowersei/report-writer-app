import { FormEvent, useState } from 'react';
import { apiPost } from '../hooks/useApi';
import type { ColumnPlumbnessCheck, UUID } from '../types';

interface ColumnPlumbnessFormProps {
  tankId: UUID;
  onCreated: (record: ColumnPlumbnessCheck) => void;
}

export function ColumnPlumbnessForm({ tankId, onCreated }: ColumnPlumbnessFormProps) {
  const [columnId, setColumnId] = useState('center');
  const [plumbness, setPlumbness] = useState(0);
  const [direction, setDirection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        tank: tankId,
        column_id: columnId,
        plumbness_in_per_ft: Number(plumbness),
        direction: direction || null
      };
      const created = await apiPost<typeof payload, ColumnPlumbnessCheck>('/api/column-plumbness-checks/', payload);
      onCreated(created);
      setDirection('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col text-sm">
          Column
          <input
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={columnId}
            onChange={event => setColumnId(event.target.value)}
            placeholder="center"
            required
          />
        </label>
        <label className="flex flex-col text-sm">
          Plumbness (in./ft)
          <input
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            type="number"
            step="0.001"
            value={plumbness}
            onChange={event => setPlumbness(Number(event.target.value))}
            required
          />
        </label>
        <label className="flex flex-col text-sm">
          Direction
          <input
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={direction}
            onChange={event => setDirection(event.target.value)}
            placeholder="e.g. NE"
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Save plumbness reading'}
      </button>
    </form>
  );
}
