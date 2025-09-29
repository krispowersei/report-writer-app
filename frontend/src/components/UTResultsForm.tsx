import { FormEvent, useState } from 'react';
import { apiPost } from '../hooks/useApi';
import { useMetadata } from '../hooks/useMetadata';
import type { UTCategory, UTResult, UUID } from '../types';

interface UTResultsFormProps {
  tankId: UUID;
  shellCourses?: number | null;
  onCreated: (result: UTResult) => void;
}

const initialState = {
  category: 'bottom' as UTCategory,
  location: '',
  course: '' as string | number,
  thickness_in: 0.25,
  notes: ''
};

export function UTResultsForm({ tankId, shellCourses, onCreated }: UTResultsFormProps) {
  const { metadata } = useMetadata();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        tank: tankId,
        category: form.category,
        location: form.location,
        course: form.category === 'shell' ? Number(form.course) || null : null,
        thickness_in: Number(form.thickness_in),
        notes: form.notes || null
      };
      const created = await apiPost<typeof payload, UTResult>('/api/ut-results/', payload);
      onCreated(created);
      setForm(initialState);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm">
          Category
          <select
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={form.category}
            onChange={event => setForm(prev => ({ ...prev, category: event.target.value as UTCategory }))}
          >
            {metadata.choices.ut_categories.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        {form.category === 'shell' && (
          <label className="flex flex-col text-sm">
            Course
            <select
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
              value={form.course}
              onChange={event => setForm(prev => ({ ...prev, course: event.target.value }))}
            >
              <option value="">Select course</option>
              {Array.from({ length: shellCourses ?? 0 }).map((_, index) => (
                <option key={index + 1} value={index + 1}>Course {index + 1}</option>
              ))}
            </select>
          </label>
        )}
        <label className="flex flex-col text-sm">
          Location / Grid reference
          <input
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={form.location}
            onChange={event => setForm(prev => ({ ...prev, location: event.target.value }))}
            required
          />
        </label>
        <label className="flex flex-col text-sm">
          Thickness (in.)
          <input
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            type="number"
            step="0.001"
            value={form.thickness_in}
            onChange={event => setForm(prev => ({ ...prev, thickness_in: Number(event.target.value) }))}
            required
          />
        </label>
        <label className="flex flex-col text-sm md:col-span-2">
          Notes
          <textarea
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            rows={2}
            value={form.notes}
            onChange={event => setForm(prev => ({ ...prev, notes: event.target.value }))}
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Add UT result'}
      </button>
    </form>
  );
}
