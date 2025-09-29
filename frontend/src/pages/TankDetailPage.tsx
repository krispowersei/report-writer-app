import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiDelete, apiGet } from '../hooks/useApi';
import type { TagColor, TankDetail } from '../types';

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

export function TankDetailPage() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const [tank, setTank] = useState<TankDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!tankId) return;
      setLoading(true);
      try {
        const data = await apiGet<TankDetail>(`/api/tanks/${tankId}/`);
        setTank(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [tankId]);

  const handleDelete = async () => {
    if (!tankId) return;
    if (!confirm('Delete this tank and its records?')) return;
    try {
      await apiDelete(`/api/tanks/${tankId}/`);
      navigate('/tanks');
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const downloadJson = () => {
    if (!tank) return;
    const blob = new Blob([JSON.stringify(tank, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tank.tank_name}-record.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    if (!tank) return;
    const rows: string[][] = [
      ['Section', 'Field', 'Value', 'Tag', 'VE', 'UT', 'Comment']
    ];

    rows.push(
      ['Cover', 'Tank name', tank.tank_name, '', '', '', ''],
      ['Cover', 'Inspection type', formatValue(tank.inspection_type), '', '', '', ''],
      ['Cover', 'Client name', formatValue(tank.client_name || tank.owner), '', '', '', ''],
      ['Cover', 'City', formatValue(tank.city), '', '', '', ''],
      ['Cover', 'State', formatValue(tank.state), '', '', '', ''],
      ['Cover', 'Exact address', formatValue(tank.exact_address), '', '', '', ''],
      ['Cover', 'PO number', formatValue(tank.po_number), '', '', '', ''],
      ['Cover', 'Inspection date', formatDate(tank.inspection_date), '', '', '', ''],
      ['Cover', 'Construction date', formatDate(tank.construction_date), '', '', '', ''],
      ['Cover', 'External inspection date', formatDate(tank.external_inspection_date), '', '', '', ''],
      ['Cover', 'Internal inspection date', formatDate(tank.internal_inspection_date), '', '', '', ''],
      ['Cover', 'UT inspection date', formatDate(tank.ut_inspection_date), '', '', '', ''],
      ['Cover', 'Next inspection due date', formatDate(tank.next_inspection_due_date), '', '', '', ''],
      ['Summary', 'Manufacturer', formatValue(tank.manufacturer), '', '', '', ''],
      ['Summary', 'Diameter (ft)', formatValue(tank.diameter_ft), '', '', '', ''],
      ['Summary', 'Height (ft)', formatValue(tank.height_ft), '', '', '', ''],
      ['Summary', 'Product stored', formatValue(tank.product_stored), '', '', '', '']
    );

    constructionFieldMeta.forEach(({ key, label }) => {
      const value = formatValue(tank[key]);
      const note = tank.construction_annotations.standard[key as string];
      rows.push([
        'Construction',
        label,
        value,
        note?.color ? colorLabel[note.color as TagColor] : '',
        note?.ve ? 'Yes' : '',
        note?.ut ? 'Yes' : '',
        note?.comment ?? ''
      ]);
    });

    tank.construction_annotations.additional.forEach(item => {
      rows.push([
        'Construction - custom',
        item.label,
        item.value,
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
    link.download = `${tank.tank_name}-workflow3.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p>Loading tank…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!tank) {
    return <p>Tank not found.</p>;
  }

  const taggedItems = useMemo(() => {
    const base = constructionFieldMeta
      .map(({ key, label }) => {
        const annotation = tank.construction_annotations.standard[key as string];
        return annotation?.color
          ? {
              color: annotation.color as TagColor,
              label,
              value: formatValue(tank[key])
            }
          : null;
      })
      .filter(Boolean) as Array<{ color: TagColor; label: string; value: string }>;

    const additional = tank.construction_annotations.additional
      .filter(item => item.color)
      .map(item => ({
        color: item.color as TagColor,
        label: item.label,
        value: item.value
      }));

    return [...base, ...additional];
  }, [tank]);

  const colorBuckets = taggedItems.reduce<Record<TagColor, Array<{ label: string; value: string }>>>((acc, item) => {
    if (!acc[item.color]) {
      acc[item.color] = [];
    }
    acc[item.color].push({ label: item.label, value: item.value });
    return acc;
  }, { red: [], blue: [], yellow: [], green: [] });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-blue-800">{tank.tank_name}</h2>
          <p className="text-sm text-gray-500">
            {formatValue(tank.inspection_type) || 'Inspection'} — {formatValue(tank.client_name || tank.owner)}
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
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700"
          >
            Print/PDF
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-red-600"
          >
            Delete tank
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Location</h3>
          <p className="text-sm text-gray-600">{tank.city}, {tank.state}</p>
          <p className="text-xs text-gray-400">Exact address: {formatValue(tank.exact_address)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Design</h3>
          <p className="text-sm text-gray-600">Standard: {tank.design_standard}</p>
          <p className="text-xs text-gray-400">Manufacturer: {formatValue(tank.manufacturer)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase">Geometry</h3>
          <p className="text-sm text-gray-600">Diameter: {formatValue(tank.diameter_ft)} ft</p>
          <p className="text-sm text-gray-600">Height: {formatValue(tank.height_ft)} ft</p>
          <p className="text-xs text-gray-400">Product: {tank.product_stored}</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <header>
          <h3 className="text-lg font-semibold text-blue-800">Inspection timeline</h3>
          <p className="text-sm text-gray-500">Key dates that populate the workflow 3 cover page.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {timelineFields.map(({ key, label }) => (
            <div key={key as string} className="rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
              <p className="text-xs uppercase text-gray-400">{label}</p>
              <p>{formatDate(tank[key] as string | null)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <header className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Construction overview</h3>
            <p className="text-sm text-gray-500">Workflow 1 results with VE/UT flags, color tags, and inspector comments.</p>
          </div>
          <span className="text-xs text-gray-400">{constructionFieldMeta.length} tracked items</span>
        </header>
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
                const annotation = tank.construction_annotations.standard[key as string];
                const tag = annotation?.color ? (annotation.color as TagColor) : null;
                return (
                  <tr key={key as string}>
                    <td className="px-4 py-2 font-medium text-gray-700">{label}</td>
                    <td className="px-4 py-2 text-gray-600">{formatValue(tank[key])}</td>
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
              {tank.construction_annotations.additional.length > 0 && (
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <td className="px-4 py-2" colSpan={6}>Additional inspector items</td>
                </tr>
              )}
              {tank.construction_annotations.additional.map((item, index) => (
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
        <section className="bg-white rounded-xl shadow p-6 space-y-4">
          <header>
            <h3 className="text-lg font-semibold text-blue-800">Color tag summary</h3>
            <p className="text-sm text-gray-500">Quick view of components flagged for follow-up.</p>
          </header>
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

      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <header>
          <h3 className="text-lg font-semibold text-blue-800">Containment</h3>
        </header>
        <p className="text-sm text-gray-600">Secondary containment type: {tank.secondary_containment_type}</p>
      </section>
    </div>
  );
}
