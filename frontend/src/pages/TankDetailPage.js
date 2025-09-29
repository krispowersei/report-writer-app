import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiDelete, apiGet } from '../hooks/useApi';
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
export function TankDetailPage() {
    const { tankId } = useParams();
    const navigate = useNavigate();
    const [tank, setTank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const load = async () => {
            if (!tankId)
                return;
            setLoading(true);
            try {
                const data = await apiGet(`/api/tanks/${tankId}/`);
                setTank(data);
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
    }, [tankId]);
    const handleDelete = async () => {
        if (!tankId)
            return;
        if (!confirm('Delete this tank and its records?'))
            return;
        try {
            await apiDelete(`/api/tanks/${tankId}/`);
            navigate('/tanks');
        }
        catch (err) {
            alert(err instanceof Error ? err.message : String(err));
        }
    };
    const downloadJson = () => {
        if (!tank)
            return;
        const blob = new Blob([JSON.stringify(tank, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${tank.tank_name}-record.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const downloadCsv = () => {
        if (!tank)
            return;
        const rows = [
            ['Section', 'Field', 'Value', 'Tag', 'VE', 'UT', 'Comment']
        ];
        rows.push(['Cover', 'Tank name', tank.tank_name, '', '', '', ''], ['Cover', 'Inspection type', formatValue(tank.inspection_type), '', '', '', ''], ['Cover', 'Client name', formatValue(tank.client_name || tank.owner), '', '', '', ''], ['Cover', 'City', formatValue(tank.city), '', '', '', ''], ['Cover', 'State', formatValue(tank.state), '', '', '', ''], ['Cover', 'Exact address', formatValue(tank.exact_address), '', '', '', ''], ['Cover', 'PO number', formatValue(tank.po_number), '', '', '', ''], ['Cover', 'Inspection date', formatDate(tank.inspection_date), '', '', '', ''], ['Cover', 'Construction date', formatDate(tank.construction_date), '', '', '', ''], ['Cover', 'External inspection date', formatDate(tank.external_inspection_date), '', '', '', ''], ['Cover', 'Internal inspection date', formatDate(tank.internal_inspection_date), '', '', '', ''], ['Cover', 'UT inspection date', formatDate(tank.ut_inspection_date), '', '', '', ''], ['Cover', 'Next inspection due date', formatDate(tank.next_inspection_due_date), '', '', '', ''], ['Summary', 'Manufacturer', formatValue(tank.manufacturer), '', '', '', ''], ['Summary', 'Diameter (ft)', formatValue(tank.diameter_ft), '', '', '', ''], ['Summary', 'Height (ft)', formatValue(tank.height_ft), '', '', '', ''], ['Summary', 'Product stored', formatValue(tank.product_stored), '', '', '', '']);
        constructionFieldMeta.forEach(({ key, label }) => {
            const value = formatValue(tank[key]);
            const note = tank.construction_annotations.standard[key];
            rows.push([
                'Construction',
                label,
                value,
                note?.color ? colorLabel[note.color] : '',
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
        link.download = `${tank.tank_name}-workflow3.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };
    if (loading) {
        return _jsx("p", { children: "Loading tank\u2026" });
    }
    if (error) {
        return _jsx("p", { className: "text-red-600", children: error });
    }
    if (!tank) {
        return _jsx("p", { children: "Tank not found." });
    }
    const taggedItems = useMemo(() => {
        const base = constructionFieldMeta
            .map(({ key, label }) => {
            const annotation = tank.construction_annotations.standard[key];
            return annotation?.color
                ? {
                    color: annotation.color,
                    label,
                    value: formatValue(tank[key])
                }
                : null;
        })
            .filter(Boolean);
        const additional = tank.construction_annotations.additional
            .filter(item => item.color)
            .map(item => ({
            color: item.color,
            label: item.label,
            value: item.value
        }));
        return [...base, ...additional];
    }, [tank]);
    const colorBuckets = taggedItems.reduce((acc, item) => {
        if (!acc[item.color]) {
            acc[item.color] = [];
        }
        acc[item.color].push({ label: item.label, value: item.value });
        return acc;
    }, { red: [], blue: [], yellow: [], green: [] });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold text-blue-800", children: tank.tank_name }), _jsxs("p", { className: "text-sm text-gray-500", children: [formatValue(tank.inspection_type) || 'Inspection', " \u2014 ", formatValue(tank.client_name || tank.owner)] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { type: "button", onClick: downloadCsv, className: "rounded-lg border border-blue-600 px-3 py-2 text-blue-700", children: "Download CSV" }), _jsx("button", { type: "button", onClick: downloadJson, className: "rounded-lg bg-blue-600 px-3 py-2 text-white", children: "Download JSON" }), _jsx("button", { type: "button", onClick: () => window.print(), className: "rounded-lg border border-gray-300 px-3 py-2 text-gray-700", children: "Print/PDF" }), _jsx("button", { type: "button", onClick: handleDelete, className: "rounded-lg border border-red-200 px-3 py-2 text-red-600", children: "Delete tank" })] })] }), _jsxs("section", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "bg-white rounded-xl shadow p-4 space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase", children: "Location" }), _jsxs("p", { className: "text-sm text-gray-600", children: [tank.city, ", ", tank.state] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Exact address: ", formatValue(tank.exact_address)] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow p-4 space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase", children: "Design" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Standard: ", tank.design_standard] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Manufacturer: ", formatValue(tank.manufacturer)] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow p-4 space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 uppercase", children: "Geometry" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Diameter: ", formatValue(tank.diameter_ft), " ft"] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Height: ", formatValue(tank.height_ft), " ft"] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Product: ", tank.product_stored] })] })] }), _jsxs("section", { className: "bg-white rounded-xl shadow p-6 space-y-4", children: [_jsxs("header", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-800", children: "Inspection timeline" }), _jsx("p", { className: "text-sm text-gray-500", children: "Key dates that populate the workflow 3 cover page." })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: timelineFields.map(({ key, label }) => (_jsxs("div", { className: "rounded-lg border border-gray-200 p-3 text-sm text-gray-600", children: [_jsx("p", { className: "text-xs uppercase text-gray-400", children: label }), _jsx("p", { children: formatDate(tank[key]) })] }, key))) })] }), _jsxs("section", { className: "bg-white rounded-xl shadow p-6 space-y-4", children: [_jsxs("header", { className: "flex flex-col gap-1 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-800", children: "Construction overview" }), _jsx("p", { className: "text-sm text-gray-500", children: "Workflow 1 results with VE/UT flags, color tags, and inspector comments." })] }), _jsxs("span", { className: "text-xs text-gray-400", children: [constructionFieldMeta.length, " tracked items"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-blue-50 text-blue-900", children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Component" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Value" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Tag" }), _jsx("th", { className: "px-4 py-2 text-left", children: "VE" }), _jsx("th", { className: "px-4 py-2 text-left", children: "UT" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Comment" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100", children: [constructionFieldMeta.map(({ key, label }) => {
                                            const annotation = tank.construction_annotations.standard[key];
                                            const tag = annotation?.color ? annotation.color : null;
                                            return (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-2 font-medium text-gray-700", children: label }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: formatValue(tank[key]) }), _jsx("td", { className: "px-4 py-2", children: tag ? (_jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorChipClass[tag]}`, children: colorLabel[tag] })) : (_jsx("span", { className: "text-xs text-gray-400", children: "None" })) }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: annotation?.ve ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: annotation?.ut ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: annotation?.comment || '—' })] }, key));
                                        }), tank.construction_annotations.additional.length > 0 && (_jsx("tr", { className: "bg-gray-50 text-xs uppercase text-gray-500", children: _jsx("td", { className: "px-4 py-2", colSpan: 6, children: "Additional inspector items" }) })), tank.construction_annotations.additional.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-2 font-medium text-gray-700", children: item.label }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: formatValue(item.value) }), _jsx("td", { className: "px-4 py-2", children: item.color ? (_jsx("span", { className: `inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colorChipClass[item.color]}`, children: colorLabel[item.color] })) : (_jsx("span", { className: "text-xs text-gray-400", children: "None" })) }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: item.ve ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: item.ut ? 'Yes' : 'No' }), _jsx("td", { className: "px-4 py-2 text-gray-600", children: item.comment || '—' })] }, `custom-${index}`)))] })] }) })] }), taggedItems.length > 0 && (_jsxs("section", { className: "bg-white rounded-xl shadow p-6 space-y-4", children: [_jsxs("header", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-800", children: "Color tag summary" }), _jsx("p", { className: "text-sm text-gray-500", children: "Quick view of components flagged for follow-up." })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: Object.keys(colorBuckets).map(color => (_jsxs("div", { className: "rounded-lg border border-gray-200 p-4 space-y-2", children: [_jsx("div", { className: `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorChipClass[color]}`, children: colorLabel[color] }), colorBuckets[color].length === 0 ? (_jsx("p", { className: "text-sm text-gray-500", children: "No items tagged." })) : (_jsx("ul", { className: "list-disc pl-5 text-sm text-gray-600 space-y-1", children: colorBuckets[color].map(entry => (_jsxs("li", { children: [entry.label, ": ", entry.value] }, `${color}-${entry.label}`))) }))] }, color))) })] })), _jsxs("section", { className: "bg-white rounded-xl shadow p-6 space-y-4", children: [_jsx("header", { children: _jsx("h3", { className: "text-lg font-semibold text-blue-800", children: "Containment" }) }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Secondary containment type: ", tank.secondary_containment_type] })] })] }));
}
