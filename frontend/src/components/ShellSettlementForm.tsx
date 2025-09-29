import { FormEvent, useEffect, useState } from 'react';
import { apiPost } from '../hooks/useApi';
import type { ShellSettlementReading, ShellSettlementSurvey, UUID } from '../types';

interface ShellSettlementFormProps {
  tankId: UUID;
  onCreated: (survey: ShellSettlementSurvey) => void;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function ShellSettlementForm({ tankId, onCreated }: ShellSettlementFormProps) {
  const [stationCount, setStationCount] = useState(4);
  const [readings, setReadings] = useState<ShellSettlementReading[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const items: ShellSettlementReading[] = Array.from({ length: stationCount }, (_, index) => ({
      station_label: alphabet[index] ?? `S${index + 1}`,
      measurement_in: 0
    }));
    setReadings(items);
  }, [stationCount]);

  const handleMeasurementChange = (idx: number, value: number) => {
    setReadings(prev => prev.map((reading, i) => (i === idx ? { ...reading, measurement_in: value } : reading)));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { tank: tankId, station_count: stationCount, readings };
      const created = await apiPost<typeof payload, ShellSettlementSurvey>('/api/shell-settlement-surveys/', payload);
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-end gap-3">
        <label className="text-sm flex flex-col">
          Station count
          <input
            type="number"
            min={1}
            max={52}
            className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
            value={stationCount}
            onChange={event => setStationCount(Number(event.target.value) || 0)}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save survey'}
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Station</th>
              <th className="px-3 py-2 text-left">Measurement (in.)</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading, idx) => (
              <tr key={reading.station_label} className="border-t border-gray-100">
                <td className="px-3 py-2 font-medium text-gray-700">{reading.station_label}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    value={reading.measurement_in}
                    onChange={event => handleMeasurementChange(idx, Number(event.target.value) || 0)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
