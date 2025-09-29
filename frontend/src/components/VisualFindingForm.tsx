import { FormEvent, useEffect, useState } from 'react';
import { useMetadata } from '../hooks/useMetadata';
import { apiPost } from '../hooks/useApi';
import type { UUID, VisualFinding } from '../types';

interface VisualFindingFormProps {
  tankId: UUID;
  onCreated: (record: VisualFinding) => void;
}

export function VisualFindingForm({ tankId, onCreated }: VisualFindingFormProps) {
  const { metadata } = useMetadata();
  const [area, setArea] = useState(metadata.choices.visual_areas[0]?.[0] ?? 'shell');
  const [finding, setFinding] = useState('');
  const [commentType, setCommentType] = useState(metadata.choices.comment_types[0]?.[0] ?? 'perform');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (metadata.choices.visual_areas.length && !metadata.choices.visual_areas.some(([value]) => value === area)) {
      setArea(metadata.choices.visual_areas[0][0]);
    }
    if (metadata.choices.comment_types.length && !metadata.choices.comment_types.some(([value]) => value === commentType)) {
      setCommentType(metadata.choices.comment_types[0][0]);
    }
  }, [metadata, area, commentType]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        tank: tankId,
        area,
        finding,
        comment_type: commentType
      };
      const created = await apiPost<typeof payload, VisualFinding>('/api/visual-findings/', payload);
      onCreated(created);
      setFinding('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm">
          Area
          <select
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={area}
            onChange={event => setArea(event.target.value)}
          >
            {metadata.choices.visual_areas.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Comment type
          <select
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={commentType}
            onChange={event => setCommentType(event.target.value)}
          >
            {metadata.choices.comment_types.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        rows={3}
        value={finding}
        onChange={event => setFinding(event.target.value)}
        placeholder="Summarize the finding with action-oriented phrasing."
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Add finding'}
      </button>
    </form>
  );
}
