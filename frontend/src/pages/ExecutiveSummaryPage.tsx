import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../hooks/useApi';
import type { TagColor, Tank, TankDetail } from '../types';

const constructionFieldMeta: Array<{ key: keyof TankDetail; label: string }> = [
  { key: 'foundation', label: 'Foundation' },
  { key: 'anchors', label: 'Anchors' },
  { key: 'shell_weld_type', label: 'Shell weld type' },
  { key: 'insulation', label: 'Insulation' },
  { key: 'shell_manway', label: 'Shell manway' },
  { key: 'drain', label: 'Drain' },
  { key: 'level_gauge_type', label: 'Level gauge type' },
  { key: 'access_structure', label: 'Access structure' },
  { key: 'bottom_type', label: 'Bottom type' },
  { key: 'bottom_weld', label: 'Bottom weld type' },
  { key: 'annular_plate', label: 'Annular plate' },
  { key: 'fixed_roof_type', label: 'Fixed roof type' },
  { key: 'floating_roof_type', label: 'Floating roof type' },
  { key: 'primary_seal', label: 'Primary seal' },
  { key: 'secondary_seal', label: 'Secondary seal' },
  { key: 'anti_rotation_device', label: 'Anti-rotation device' },
  { key: 'vent_type_and_number', label: 'Vent type & quantity' },
  { key: 'emergency_venting_type', label: 'Emergency venting' },
  { key: 'roof_manway_or_hatch', label: 'Roof manway / hatch' },
  { key: 'pressure', label: 'Pressure' },
  { key: 'temperature', label: 'Temperature' }
];

const timelineFields: Array<{ key: keyof TankDetail; label: string }> = [
  { key: 'inspection_date', label: 'Inspection date' },
  { key: 'construction_date', label: 'Construction date' },
  { key: 'external_inspection_date', label: 'External inspection date' },
  { key: 'internal_inspection_date', label: 'Internal inspection date' },
  { key: 'ut_inspection_date', label: 'UT inspection date' },
  { key: 'next_inspection_due_date', label: 'Next inspection due date' }
];

const colorLabel: Record<TagColor, string> = {
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
  green: 'Green'
};

const colorChipClass: Record<TagColor, string> = {
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  yellow: 'bg-yellow-400 text-gray-900',
  green: 'bg-green-500 text-white'
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
}

function formatDate(value: string | null): string {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString();
}

interface SummaryCardProps {
  detail: TankDetail;
}

function SummaryCard({ detail }: SummaryCardProps) {
  const taggedItems = useMemo(() => {
    const base = constructionFieldMeta
      .map(({ key, label }) => {
        const annotation = detail.construction_annotations.standard[key as string];
        return annotation?.color
          ? {
              color: annotation.color as TagColor,
              label,
              value: formatValue(detail[key])
            }
          : null;
      })
      .filter(Boolean) as Array<{ color: TagColor; label: string; value: string }>;

    const additional = detail.construction_annotations.additional
      .filter(item => item.color)
      .map(item => ({
        color: item.color as TagColor,
        label: item.label,
        value: item.value
      }));

    return [...base, ...additional];
  }, [detail]);

  const colorBuckets = taggedItems.reduce<Record<TagColor, Array<{ label: string; value: string }>>>((acc, item) => {
    if (!acc[item.color]) {
      acc[item.color] = [];
    }
    acc[item.color].push({ label: item.label, value: item.value });
    return acc;
  }, { red: [], blue: [], yellow: [], green: [] });

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(detail, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${detail.tank_name}-workflow3.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    const rows: string[][] = [
      ['Section', 'Field', 'Value', 'Tag', 'VE', 'UT', 'Comment']
    ];

    rows.push(
      ['Cover', 'Tank name', detail.tank_name, '', '', '', ''],
      ['Cover', 'Inspection type', formatValue(detail.inspection_type), '', '', '', ''],
      ['Cover', 'Client name', formatValue(detail.client_name || detail.owner), '', '', '', ''],
      ['Cover', 'City', formatValue(detail.city), '', '', '', ''],
      ['Cover', 'State', formatValue(detail.state), '', '', '', ''],
      ['Cover', 'Exact address', formatValue(detail.exact_address), '', '', '', ''],
      ['Cover', 'PO number', formatValue(detail.po_number), '', '', '', ''],
      ['Cover', 'Inspection date', formatDate(detail.inspection_date), '', '', '', ''],
      ['Cover', 'Construction date', formatDate(detail.construction_date), '', '', '', ''],
      ['Cover', 'External inspection date', formatDate(detail.external_inspection_date), '', '', '', ''],
      ['Cover', 'Internal inspection date', formatDate(detail.internal_inspection_date), '', '', '', ''],
      ['Cover', 'UT inspection date', formatDate(detail.ut_inspection_date), '', '', '', ''],
      ['Cover', 'Next inspection due date', formatDate(detail.next_inspection_due_date), '', '', '', ''],
      ['Summary', 'Manufacturer', formatValue(detail.manufacturer), '', '', '', ''],
      ['Summary', 'Diameter (ft)', formatValue(detail.diameter_ft), '', '', '', ''],
      ['Summary', 'Height (ft)', formatValue(detail.height_ft), '', '', '', ''],
      ['Summary', 'Shell weld type', formatValue(detail.shell_weld_type), '', '', '', ''],
      ['Summary', 'Bottom weld type', formatValue(detail.bottom_weld), '', '', '', ''],
      ['Summary', 'Bottom type', formatValue(detail.bottom_type), '', '', '', ''],
      ['Summary', 'Roof type', formatValue(detail.fixed_roof_type), '', '', '', ''],
      ['Summary', 'Floating roof type', formatValue(detail.floating_roof_type), '', '', '', ''],
      ['Summary', 'Product stored', formatValue(detail.product_stored), '', '', '', '']
    );

    constructionFieldMeta.forEach(({ key, label }) => {
      const annotation = detail.construction_annotations.standard[key as string];
      rows.push([
        'Construction',
        label,
        formatValue(detail[key]),
        annotation?.color ? colorLabel[annotation.color as TagColor] : '',
        annotation?.ve ? 'Yes' : '',
        annotation?.ut ? 'Yes' : '',
        annotation?.comment ?? ''
      ]);
    });

    detail.construction_annotations.additional.forEach(item => {
      rows.push([
        'Construction - custom',
        item.label,
        formatValue(item.value),
        item.color ? colorLabel[item.color as TagColor] : '',
        item.ve ? 'Yes' : '',
        item.ut ? 'Yes' : '',
        item.comment
      ]);
    });

    const csv = rows
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${detail.tank_name}-workflow3.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <article className="bg-white shadow rounded-xl p-6 space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-blue-800">{detail.tank_name}</h3>
          <p className="text-sm text-gray-500">
            {formatValue(detail.inspection_type)} — {formatValue(detail.client_name || detail.owner)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadCsv}
            className="rounded-lg border border-blue-600 px-3 py-2 text-blue-700"
          >
            Download CSV
          </button>
          <button
            type="button"
            onClick={downloadJson}
            className="rounded-lg bg-blue-600 px-3 py-2 text-white"
          >
            Download JSON
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm text-gray-600">
          <h4 className="text-xs uppercase text-gray-500">Cover page</h4>
          <p>Inspection type: {formatValue(detail.inspection_type)}</p>
          <p>Client name: {formatValue(detail.client_name || detail.owner)}</p>
          <p>Location: {formatValue(detail.city)}, {formatValue(detail.state)}</p>
          <p>Address: {formatValue(detail.exact_address)}</p>
          <p>PO number: {formatValue(detail.po_number)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm text-gray-600">
          <h4 className="text-xs uppercase text-gray-500">Executive summary</h4>
          <p>Manufacturer: {formatValue(detail.manufacturer)}</p>
          <p>Diameter: {formatValue(detail.diameter_ft)} ft</p>
          <p>Height: {formatValue(detail.height_ft)} ft</p>
          <p>Shell weld type: {formatValue(detail.shell_weld_type)}</p>
          <p>Bottom weld type: {formatValue(detail.bottom_weld)}</p>
          <p>Roof type: {formatValue(detail.fixed_roof_type)}</p>
          <p>Floating roof type: {formatValue(detail.floating_roof_type)}</p>
          <p>Product: {formatValue(detail.product_stored)}</p>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-semibold text-blue-800">Inspection timeline</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {timelineFields.map(({ key, label }) => (
            <div key={key as string} className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
              <p className="text-xs uppercase text-gray-400">{label}</p>
              <p>{formatDate(detail[key] as string | null)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-blue-800">Construction overview</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-900">
                <th className="px-4 py-2 text-left">Component</th>
                <th className="px-4 py-2 text-left">Value</th>
                <th className="px-4 py-2 text-left">Tag</th>
                <th className="px-4 py-2 text-left">VE</th>
                <th className="px-4 py-2 text-left">UT</th>
                <th className="px-4 py-2 text-left">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {constructionFieldMeta.map(({ key, label }) => {
                const annotation = detail.construction_annotations.standard[key as string];
                const tag = annotation?.color ? (annotation.color as TagColor) : null;
                return (
                  <tr key={key as string}>
                    <td className="px-4 py-2 font-medium text-gray-700">{label}</td>
                    <td className="px-4 py-2 text-gray-600">{formatValue(detail[key])}</td>
                    <td className="px-4 py-2">
                      {tag ? (
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorChipClass[tag]}`}>
                          {colorLabel[tag]}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{annotation?.ve ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 text-gray-600">{annotation?.ut ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 text-gray-600">{annotation?.comment || '—'}</td>
                  </tr>
                );
              })}
              {detail.construction_annotations.additional.length > 0 && (
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <td className="px-4 py-2" colSpan={6}>Additional inspector items</td>
                </tr>
              )}
              {detail.construction_annotations.additional.map((item, index) => (
                <tr key={`custom-${index}`}>
                  <td className="px-4 py-2 font-medium text-gray-700">{item.label}</td>
                  <td className="px-4 py-2 text-gray-600">{formatValue(item.value)}</td>
                  <td className="px-4 py-2">
                    {item.color ? (
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorChipClass[item.color as TagColor]}`}>
                        {colorLabel[item.color as TagColor]}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{item.ve ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-gray-600">{item.ut ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-gray-600">{item.comment || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {taggedItems.length > 0 && (
        <section className="space-y-3">
          <h4 className="text-sm font-semibold text-blue-800">Color tag summary</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(colorBuckets) as TagColor[]).map(color => (
              <div key={color} className="rounded-lg border border-gray-200 p-4 space-y-2">
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorChipClass[color]}`}>
                  {colorLabel[color]}
                </div>
                {colorBuckets[color].length === 0 ? (
                  <p className="text-sm text-gray-500">No items tagged.</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {colorBuckets[color].map(entry => (
                      <li key={`${color}-${entry.label}`}>{entry.label}: {entry.value}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export function ExecutiveSummaryPage() {
  const [summaries, setSummaries] = useState<TankDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const tanks = await apiGet<Tank[]>('/api/tanks/');
        const details = await Promise.all(tanks.map(tank => apiGet<TankDetail>(`/api/tanks/${tank.tank_unique_id}/`)));
        setSummaries(details);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) {
    return <p>Loading workflow 3 summary…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (summaries.length === 0) {
    return <p>No tanks available yet. Add a tank to generate the workflow 3 report.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold text-blue-800">Workflow 3 Summary</h2>
        <p className="text-sm text-gray-500">
          One-page cover, executive summary, and construction annotations derived from workflow 1 entries.
        </p>
      </header>
      <div className="space-y-6">
        {summaries.map(summary => (
          <SummaryCard key={summary.tank_unique_id} detail={summary} />
        ))}
      </div>
    </div>
  );
}
