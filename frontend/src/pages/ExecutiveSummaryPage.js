import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../hooks/useApi';
const constructionFieldMeta = [
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
const timelineFields = [
    { key: 'inspection_date', label: 'Inspection date' },
    { key: 'construction_date', label: 'Construction date' },
    { key: 'external_inspection_date', label: 'External inspection date' },
    { key: 'internal_inspection_date', label: 'Internal inspection date' },
    { key: 'ut_inspection_date', label: 'UT inspection date' },
    { key: 'next_inspection_due_date', label: 'Next inspection due date' }
];
const colorLabel = {
    red: 'Red',
    blue: 'Blue',
    yellow: 'Yellow',
    green: 'Green'
};
const colorChipClass = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-400 text-gray-900',
    green: 'bg-green-500 text-white'
};
function formatValue(value) {
    if (value === null || value === undefined || value === '')
        return 'N/A';
    return String(value);
}
function formatDate(value) {
    if (!value)
        return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString();
}
function SummaryCard({ detail }) {
    const taggedItems = useMemo(() => {
        const base = constructionFieldMeta
            .map(({ key, label }) => {
            const annotation = detail.construction_annotations.standard[key];
            return annotation?.color
                ? {
                    color: annotation.color,
                    label,
                    value: formatValue(detail[key])
                }
                : null;
        })
            .filter(Boolean);
        const additional = detail.construction_annotations.additional
            .filter(item => item.color)
            .map(item => ({
            color: item.color,
            label: item.label,
            value: item.value
        }));
        return [...base, ...additional];
    }, [detail]);
    const colorBuckets = taggedItems.reduce((acc, item) => {
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
        const rows = [
            ['Section', 'Field', 'Value', 'Tag', 'VE', 'UT', 'Comment']
        ];
        rows.push(['Cover', 'Tank name', detail.tank_name, '', '', '', ''], ['Cover', 'Inspection type', formatValue(detail.inspection_type), '', '', '', ''], ['Cover', 'Client name', formatValue(detail.client_name || detail.owner), '', '', '', ''], ['Cover', 'City', formatValue(detail.city), '', '', '', ''], ['Cover', 'State', formatValue(detail.state), '', '', '', ''], ['Cover', 'Exact address', formatValue(detail.exact_address), '', '', '', ''], ['Cover', 'PO number', formatValue(detail.po_number), '', '', '', ''], ['Cover', 'Inspection date', formatDate(detail.inspection_date), '', '', '', ''], ['Cover', 'Construction date', formatDate(detail.construction_date), '', '', '', ''], ['Cover', 'External inspection date', formatDate(detail.external_inspection_date), '', '', '', ''], ['Cover', 'Internal inspection date', formatDate(detail.internal_inspection_date), '', '', '', ''], ['Cover', 'UT inspection date', formatDate(detail.ut_inspection_date), '', '', '', ''], ['Cover', 'Next inspection due date', formatDate(detail.next_inspection_due_date), '', '', '', ''], ['Summary', 'Manufacturer', formatValue(detail.manufacturer), '', '', '', ''], ['Summary', 'Diameter (ft)', formatValue(detail.diameter_ft), '', '', '', ''], ['Summary', 'Height (ft)', formatValue(detail.height_ft), '', '', '', ''], ['Summary', 'Shell weld type', formatValue(detail.shell_weld_type), '', '', '', ''], ['Summary', 'Bottom weld type', formatValue(detail.bottom_weld), '', '', '', ''], ['Summary', 'Bottom type', formatValue(detail.bottom_type), '', '', '', ''], ['Summary', 'Roof type', formatValue(detail.fixed_roof_type), '', '', '', ''], ['Summary', 'Floating roof type', formatValue(detail.floating_roof_type), '', '', '', ''], ['Summary', 'Product stored', formatValue(detail.product_stored), '', '', '', '']);
        constructionFieldMeta.forEach(({ key, label }) => {
            const annotation = detail.construction_annotations.standard[key];
            rows.push([
                'Construction',
                label,
                formatValue(detail[key]),
                annotation?.color ? colorLabel[annotation.color] : '',
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
                item.color ? colorLabel[item.color] : '',
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
    return (_jsxs("article", { className: "bg-white shadow rounded-xl p-6 space-y-6", children: [_jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-blue-800", children: detail.tank_name }), _jsxs("p", { className: "text-sm text-gray-500", children: [formatValue(detail.inspection_type), " \u2014 ", formatValue(detail.client_name || detail.owner)] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { type: "button", onClick: downloadCsv, className: "rounded-lg border border-blue-600 px-3 py-2 text-blue-700", children: "Download CSV" }), _jsx("button", { type: "button", onClick: downloadJson, className: "rounded-lg bg-blue-600 px-3 py-2 text-white", children: "Download JSON" })] })] }), _jsxs("section", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "rounded-lg border border-gray-200 p-4 space-y-2 text-sm text-gray-600", children: [_jsx("h4", { className: "text-xs uppercase text-gray-500", children: "Cover page" }), _jsxs("p", { children: ["Inspection type: ", formatValue(detail.inspection_type)] }), _jsxs("p", { children: ["Client name: ", formatValue(detail.client_name || detail.owner)] }), _jsxs("p", { children: ["Location: ", formatValue(detail.city), ", ", formatValue(detail.state)] }), _jsxs("p", { children: ["Address: ", formatValue(detail.exact_address)] }), _jsxs("p", { children: ["PO number: ", formatValue(detail.po_number)] })] }), _jsxs("div", { className: "rounded-lg border border-gray-200 p-4 space-y-2 text-sm text-gray-600", children: [_jsx("h4", { className: "text-xs uppercase text-gray-500", children: "Executive summary" }), _jsxs("p", { children: ["Manufacturer: ", formatValue(detail.manufacturer)] }), _jsxs("p", { children: ["Diameter: ", formatValue(detail.diameter_ft), " ft"] }), _jsxs("p", { children: ["Height: ", formatValue(detail.height_ft), " ft"] }), _jsxs("p", { children: ["Shell weld type: ", formatValue(detail.shell_weld_type)] }), _jsxs("p", { children: ["Bottom weld type: ", formatValue(detail.bottom_weld)] }), _jsxs("p", { children: ["Roof type: ", formatValue(detail.fixed_roof_type)] }), _jsxs("p", { children: ["Floating roof type: ", formatValue(detail.floating_roof_type)] }), _jsxs("p", { children: ["Product: ", formatValue(detail.product_stored)] })] })] }), _jsxs("section", { children: [_jsx("h4", { className: "text-sm font-semibold text-blue-800", children: "Inspection timeline" }), _jsx("div", { className: "mt-3 grid gap-3 md:grid-cols-3", children: timelineFields.map(({ key, label }) => (_jsxs("div", { className: "rounded-lg border border-gray-200 p-3 text-sm text-gray-600", children: [_jsx("p", { className: "text-xs uppercase text-gray-400", children: label }), _jsx("p", { children: formatDate(detail[key]) })] }, key))) })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-blue-800", children: "Construction overview" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-blue-50 text-blue-900", children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Component" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Value" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Tag" }), _jsx("th", { className: "px-4 py-2 text-left", children: "VE" }), _jsx("th", { className: "px-4 py-2 text-left", children: "UT" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Comment" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100", children: [constructionFieldMeta.map(({ key, label }) => {
                                            const annotation = detail.construction_annotations.standard[key];
                                            const tag = annotation?.color ? annotation.color : null;
                                            return (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-2 font-medium text-gray-700", children: label }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: formatValue(detail[key]) }), _jsx("td", { className: "px-4 py-2", children: tag ? (_jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorChipClass[tag]}`, children: colorLabel[tag] })) : (_jsx("span", { className: "text-xs text-gray-400", children: "None" })) }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: annotation?.ve ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: annotation?.ut ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: annotation?.comment || '—' })] }, key));
                                        }), detail.construction_annotations.additional.length > 0 && (_jsx("tr", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: _jsx("td", { className: "px-4 py-2", colSpan: 6, children: "Additional inspector items" }) })), detail.construction_annotations.additional.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-2 font-medium text-gray-700", children: item.label }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: formatValue(item.value) }), _jsx("td", { className: "px-4 py-2", children: item.color ? (_jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorChipClass[item.color]}`, children: colorLabel[item.color] })) : (_jsx("span", { className: "text-xs text-gray-400", children: "None" })) }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: item.ve ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: item.ut ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: item.comment || '—' })] }, `custom-${index}`)))] })] }) })] }), taggedItems.length > 0 && (_jsxs("section", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-blue-800", children: "Color tag summary" }), _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: Object.keys(colorBuckets).map(color => (_jsxs("div", { className: "rounded-lg border border-gray-200 p-4 space-y-2", children: [_jsx("div", { className: `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorChipClass[color]}`, children: colorLabel[color] }), colorBuckets[color].length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No items tagged." })) : (_jsx("ul", { className: "list-disc pl-5 text-sm text-gray-600 space-y-1", children: colorBuckets[color].map(entry => (_jsxs("li", { children: [entry.label, ": ", entry.value] }, `${color}-${entry.label}`))) }))] }, color))) })] }))] }));
}
export function ExecutiveSummaryPage() {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const tanks = await apiGet('/api/tanks/');
                const details = await Promise.all(tanks.map(tank => apiGet(`/api/tanks/${tank.tank_unique_id}/`)));
                setSummaries(details);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
            finally {
                setLoading(false);
            }
        };
        void load();
    }, []);
    if (loading) {
        return _jsx("p", { children: "Loading workflow 3 summary\u2026" });
    }
    if (error) {
        return _jsx("p", { className: "text-red-600", children: error });
    }
    if (summaries.length === 0) {
        return _jsx("p", { children: "No tanks available yet. Add a tank to generate the workflow 3 report." });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-2xl font-semibold text-blue-800", children: "Workflow 3 Summary" }), _jsx("p", { className: "text-sm text-gray-500", children: "One-page cover, executive summary, and construction annotations derived from workflow 1 entries." })] }), _jsx("div", { className: "space-y-6", children: summaries.map(summary => (_jsx(SummaryCard, { detail: summary }, summary.tank_unique_id))) })] }));
}
