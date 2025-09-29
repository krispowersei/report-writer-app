import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useMetadata } from '../hooks/useMetadata';
const numericNullableKeys = [
    'year_built',
    'diameter_ft',
    'height_ft',
    'capacity_bbl',
    'operating_height_ft',
    'shell_number_of_courses',
    'inlet_size_in',
    'outlet_size_in',
    'flow_rate_in_bph',
    'flow_rate_out_bph'
];
const stringNullableKeys = [
    'manufacturer',
    'insulation',
    'drain',
    'level_gauge_type',
    'bottom_weld',
    'annular_plate',
    'fixed_roof_type',
    'floating_roof_type',
    'primary_seal',
    'secondary_seal',
    'anti_rotation_device',
    'vent_type_and_number',
    'emergency_venting_type',
    'roof_manway_or_hatch',
    'pressure',
    'temperature',
    'inspection_date',
    'construction_date',
    'external_inspection_date',
    'internal_inspection_date',
    'ut_inspection_date',
    'next_inspection_due_date'
];
const nullableKeys = [...numericNullableKeys, ...stringNullableKeys];
const defaultState = {
    tank_name: '',
    owner: '',
    facility_type: '',
    city: '',
    state: '',
    year_built: null,
    design_standard: '',
    manufacturer: null,
    product_stored: '',
    inspection_type: '',
    client_name: '',
    exact_address: '',
    po_number: '',
    inspection_date: null,
    construction_date: null,
    external_inspection_date: null,
    internal_inspection_date: null,
    ut_inspection_date: null,
    next_inspection_due_date: null,
    nameplate_present: true,
    diameter_ft: null,
    height_ft: null,
    capacity_bbl: null,
    operating_height_ft: null,
    foundation: '',
    anchors: '',
    shell_weld_type: '',
    shell_number_of_courses: null,
    insulation: null,
    shell_manway: '',
    drain: null,
    level_gauge_type: null,
    access_structure: '',
    bottom_type: '',
    bottom_weld: null,
    annular_plate: null,
    fixed_roof_type: null,
    floating_roof_type: null,
    primary_seal: null,
    secondary_seal: null,
    anti_rotation_device: null,
    vent_type_and_number: null,
    emergency_venting_type: null,
    roof_manway_or_hatch: null,
    inlet_size_in: null,
    outlet_size_in: null,
    flow_rate_in_bph: null,
    flow_rate_out_bph: null,
    pressure: null,
    temperature: null,
    secondary_containment_type: '',
    construction_annotations: { standard: {}, additional: [] }
};
function parseNumber(value) {
    if (value.trim() === '')
        return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}
const emptyAnnotation = { color: null, ve: false, ut: false, comment: '' };
const emptyCustomItem = { label: '', value: '', color: null, ve: false, ut: false, comment: '' };
const colorOptions = ['red', 'blue', 'yellow', 'green'];
const colorSelectedClass = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-400 text-gray-900',
    green: 'bg-green-500 text-white'
};
const colorIdleClass = {
    red: 'border border-red-300 text-red-600',
    blue: 'border border-blue-300 text-blue-600',
    yellow: 'border border-yellow-300 text-yellow-600',
    green: 'border border-green-300 text-green-600'
};
function normaliseAnnotations(source) {
    const standardEntries = Object.entries(source?.standard ?? {}).reduce((acc, [key, value]) => {
        if (typeof value !== 'object' || value === null)
            return acc;
        acc[key] = {
            color: (value.color ?? null),
            ve: Boolean(value.ve),
            ut: Boolean(value.ut),
            comment: typeof value.comment === 'string' ? value.comment : ''
        };
        return acc;
    }, {});
    const additionalItems = Array.isArray(source?.additional)
        ? source.additional.map(item => ({
            label: typeof item.label === 'string' ? item.label : '',
            value: typeof item.value === 'string' ? item.value : '',
            color: (item.color ?? null),
            ve: Boolean(item.ve),
            ut: Boolean(item.ut),
            comment: typeof item.comment === 'string' ? item.comment : ''
        }))
        : [];
    return { standard: standardEntries, additional: additionalItems };
}
export function TankForm({ initial, onSubmit, submitLabel = 'Save Tank' }) {
    const { metadata, loading: metadataLoading, error: metadataError } = useMetadata();
    const [values, setValues] = useState(() => ({
        ...defaultState,
        ...initial,
        construction_annotations: normaliseAnnotations(initial?.construction_annotations ?? null)
    }));
    const [naState, setNaState] = useState(() => {
        const base = {};
        nullableKeys.forEach(key => {
            if (initial && Object.prototype.hasOwnProperty.call(initial, key)) {
                base[key] = initial[key] === null;
            }
            else {
                base[key] = false;
            }
        });
        return base;
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const facilityChoices = metadata.choices.facility_type;
    const foundationChoices = metadata.choices.foundation;
    const accessStructureChoices = metadata.choices.access_structure;
    const constructionFields = [
        { key: 'foundation', label: 'Foundation', type: 'select', required: true, options: foundationChoices },
        { key: 'anchors', label: 'Anchors (include count if known)', type: 'text', required: true, placeholder: '24 anchor chairs' },
        { key: 'shell_weld_type', label: 'Shell weld type', type: 'text', required: true },
        { key: 'insulation', label: 'Insulation', type: 'text', allowNA: true, placeholder: 'e.g. Roof only' },
        { key: 'shell_manway', label: 'Shell manway', type: 'text', required: true },
        { key: 'drain', label: 'Drain', type: 'text', allowNA: true },
        { key: 'level_gauge_type', label: 'Level gauge type', type: 'text', allowNA: true },
        { key: 'access_structure', label: 'Access structure', type: 'select', required: true, options: accessStructureChoices },
        { key: 'bottom_type', label: 'Bottom type', type: 'text', required: true, placeholder: 'Cone up' },
        { key: 'bottom_weld', label: 'Bottom weld', type: 'text', allowNA: true },
        { key: 'annular_plate', label: 'Annular plate', type: 'text', allowNA: true },
        { key: 'fixed_roof_type', label: 'Fixed roof type', type: 'text', allowNA: true },
        { key: 'floating_roof_type', label: 'Floating roof type', type: 'text', allowNA: true },
        { key: 'primary_seal', label: 'Primary seal', type: 'text', allowNA: true },
        { key: 'secondary_seal', label: 'Secondary seal', type: 'text', allowNA: true },
        { key: 'anti_rotation_device', label: 'Anti-rotation device', type: 'text', allowNA: true },
        { key: 'vent_type_and_number', label: 'Vent type & quantity', type: 'text', allowNA: true },
        { key: 'emergency_venting_type', label: 'Emergency venting', type: 'text', allowNA: true },
        { key: 'roof_manway_or_hatch', label: 'Roof manway / hatch', type: 'text', allowNA: true },
        { key: 'pressure', label: 'Pressure', type: 'text', allowNA: true },
        { key: 'temperature', label: 'Temperature', type: 'text', allowNA: true }
    ];
    useEffect(() => {
        if (!metadata)
            return;
        setValues(prev => ({
            ...prev,
            facility_type: prev.facility_type || facilityChoices[0]?.[0] || '',
            foundation: prev.foundation || foundationChoices[0]?.[0] || '',
            access_structure: prev.access_structure || accessStructureChoices[0]?.[0] || ''
        }));
    }, [metadata, facilityChoices, foundationChoices, accessStructureChoices]);
    const naFlags = useMemo(() => {
        const flags = {};
        nullableKeys.forEach(key => {
            flags[key] = naState[key] ?? false;
        });
        return flags;
    }, [naState]);
    const handleChange = (key) => (event) => {
        const { value, type, checked } = event.target;
        setValues(prev => ({
            ...prev,
            [key]: type === 'checkbox' ? checked : value
        }));
        if (nullableKeys.includes(key)) {
            setNaState(prev => ({ ...prev, [key]: false }));
        }
    };
    const handleNumberChange = (key) => (event) => {
        const parsed = parseNumber(event.target.value);
        setValues(prev => ({ ...prev, [key]: parsed }));
        setNaState(prev => ({ ...prev, [key]: false }));
    };
    const toggleNA = (key) => () => {
        setNaState(prev => {
            const next = !(prev[key] ?? false);
            setValues(prevValues => ({
                ...prevValues,
                [key]: next
                    ? null
                    : stringNullableKeys.includes(key)
                        ? ''
                        : null
            }));
            return { ...prev, [key]: next };
        });
    };
    const getAnnotation = (field) => values.construction_annotations.standard[field] ?? emptyAnnotation;
    const updateAnnotation = (field, updates) => {
        setValues(prev => {
            const existing = prev.construction_annotations.standard[field] ?? emptyAnnotation;
            const nextAnnotation = {
                ...emptyAnnotation,
                ...existing,
                ...updates
            };
            return {
                ...prev,
                construction_annotations: {
                    ...prev.construction_annotations,
                    standard: {
                        ...prev.construction_annotations.standard,
                        [field]: nextAnnotation
                    }
                }
            };
        });
    };
    const addCustomItem = () => {
        setValues(prev => ({
            ...prev,
            construction_annotations: {
                ...prev.construction_annotations,
                additional: [
                    ...prev.construction_annotations.additional,
                    { ...emptyCustomItem }
                ]
            }
        }));
    };
    const updateCustomItem = (index, updates) => {
        setValues(prev => {
            const next = [...prev.construction_annotations.additional];
            const current = next[index] ?? { ...emptyCustomItem };
            next[index] = {
                ...emptyCustomItem,
                ...current,
                ...updates
            };
            return {
                ...prev,
                construction_annotations: {
                    ...prev.construction_annotations,
                    additional: next
                }
            };
        });
    };
    const removeCustomItem = (index) => {
        setValues(prev => ({
            ...prev,
            construction_annotations: {
                ...prev.construction_annotations,
                additional: prev.construction_annotations.additional.filter((_, idx) => idx !== index)
            }
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            const payload = { ...values };
            // Normalise empty strings for nullable fields back to null
            nullableKeys.forEach(key => {
                if (payload[key] === '' || (naFlags[key] ?? false)) {
                    payload[key] = null;
                }
            });
            const standardEntries = Object.entries(payload.construction_annotations.standard).filter(([, value]) => {
                if (!value)
                    return false;
                const comment = typeof value.comment === 'string' ? value.comment.trim() : '';
                return Boolean(value.color || value.ve || value.ut || comment);
            });
            payload.construction_annotations = {
                standard: Object.fromEntries(standardEntries),
                additional: payload.construction_annotations.additional.filter(item => {
                    const comment = typeof item.comment === 'string' ? item.comment.trim() : '';
                    const label = typeof item.label === 'string' ? item.label.trim() : '';
                    const value = typeof item.value === 'string' ? item.value.trim() : '';
                    return Boolean(item.color || item.ve || item.ut || comment || label || value);
                })
            };
            await onSubmit(payload);
            setSuccess('Tank saved successfully.');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    };
    if (metadataError) {
        return _jsxs("div", { className: "text-red-600", children: ["Failed to load metadata: ", metadataError] });
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("section", { className: "bg-white shadow rounded-xl p-6 space-y-4", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-lg font-semibold text-blue-800", children: "Tank Identity" }), _jsx("p", { className: "text-sm text-gray-500", children: "Fields marked N/A save as null values in the database." })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col text-sm", children: ["Tank name/number", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none", value: values.tank_name, onChange: handleChange('tank_name'), placeholder: "129" })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Owner", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.owner, onChange: handleChange('owner') })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Client name", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.client_name, onChange: handleChange('client_name'), placeholder: "Acme Refining" })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Inspection type", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.inspection_type, onChange: handleChange('inspection_type'), placeholder: "External API 653" })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Facility type", _jsx("select", { required: true, disabled: metadataLoading, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.facility_type, onChange: handleChange('facility_type'), children: facilityChoices.map(([value, label]) => (_jsx("option", { value: value, children: label }, value))) })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["City", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.city, onChange: handleChange('city') })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["State", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.state, onChange: handleChange('state') })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Exact address", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.exact_address, onChange: handleChange('exact_address'), placeholder: "123 Pipeline Rd." })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Year built", _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { className: "mt-1 flex-1 rounded-lg border border-gray-300 px-3 py-2", type: "number", value: values.year_built ?? '', onChange: handleNumberChange('year_built'), placeholder: "1989" }), _jsx("button", { type: "button", onClick: toggleNA('year_built'), className: "text-xs text-blue-600 mt-1", children: naFlags.year_built ? 'Clear' : 'Mark N/A' })] })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Design standard (e.g. API 650)", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.design_standard, onChange: handleChange('design_standard') })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Manufacturer", _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { className: "mt-1 flex-1 rounded-lg border border-gray-300 px-3 py-2", value: values.manufacturer ?? '', onChange: handleChange('manufacturer'), placeholder: "N/A" }), _jsx("button", { type: "button", onClick: toggleNA('manufacturer'), className: "text-xs text-blue-600 mt-1", children: naFlags.manufacturer ? 'Clear' : 'Mark N/A' })] })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Product stored", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.product_stored, onChange: handleChange('product_stored'), placeholder: "Diesel" })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["PO number", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.po_number, onChange: handleChange('po_number'), placeholder: "PO-12345" })] })] }), _jsxs("div", { className: "flex items-center gap-2 mt-5", children: [_jsx("input", { id: "nameplate_present", type: "checkbox", checked: values.nameplate_present, onChange: handleChange('nameplate_present') }), _jsx("label", { htmlFor: "nameplate_present", className: "text-sm", children: "Nameplate present" })] })] }), _jsxs("section", { className: "bg-white shadow rounded-xl p-6 space-y-4", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-lg font-semibold text-blue-800", children: "Geometry & Capacity" }), _jsx("p", { className: "text-sm text-gray-500", children: "Capture numeric details with quick N/A toggles." })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: [
                            ['diameter_ft', 'Diameter (ft)'],
                            ['height_ft', 'Shell height (ft)'],
                            ['capacity_bbl', 'Capacity (bbl)'],
                            ['operating_height_ft', 'Operating height (ft)'],
                            ['shell_number_of_courses', 'Shell courses'],
                            ['inlet_size_in', 'Inlet size (in)'],
                            ['outlet_size_in', 'Outlet size (in)'],
                            ['flow_rate_in_bph', 'Flow rate in (BPH)'],
                            ['flow_rate_out_bph', 'Flow rate out (BPH)']
                        ].map(([key, label]) => (_jsxs("label", { className: "flex flex-col text-sm", children: [label, _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { className: "mt-1 flex-1 rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100", type: "number", value: values[key] ?? '', onChange: handleNumberChange(key), disabled: naFlags[key] ?? false }), _jsx("button", { type: "button", onClick: toggleNA(key), className: "text-xs text-blue-600 mt-1", children: (naFlags[key] ?? false) ? 'Clear' : 'Mark N/A' })] })] }, key))) })] }), _jsxs("section", { className: "bg-white shadow rounded-xl p-6 space-y-4", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-lg font-semibold text-blue-800", children: "Inspection Timeline" }), _jsx("p", { className: "text-sm text-gray-500", children: "Record scheduling milestones for the current scope." })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: [
                            ['inspection_date', 'Inspection date'],
                            ['construction_date', 'Construction date'],
                            ['external_inspection_date', 'External inspection date'],
                            ['internal_inspection_date', 'Internal inspection date'],
                            ['ut_inspection_date', 'UT inspection date'],
                            ['next_inspection_due_date', 'Next inspection due date']
                        ].map(([key, label]) => {
                            const isNA = naFlags[key] ?? false;
                            return (_jsxs("label", { className: "flex flex-col text-sm", children: [label, _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { className: "mt-1 flex-1 rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100", type: "date", value: values[key] ?? '', onChange: handleChange(key), disabled: isNA }), _jsx("button", { type: "button", onClick: toggleNA(key), className: "text-xs text-blue-600 mt-1", children: isNA ? 'Clear' : 'Mark N/A' })] })] }, key));
                        }) })] }), _jsxs("section", { className: "bg-white shadow rounded-xl p-6 space-y-4", children: [_jsx("header", { children: _jsx("h2", { className: "text-lg font-semibold text-blue-800", children: "Construction" }) }), _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: constructionFields.map(field => {
                            const fieldKey = field.key;
                            const annotation = getAnnotation(fieldKey);
                            const isNA = field.allowNA ? (naFlags[fieldKey] ?? false) : false;
                            return (_jsxs("div", { className: "rounded-lg border border-gray-200 p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: field.label }), field.allowNA && (_jsx("button", { type: "button", onClick: toggleNA(fieldKey), className: "text-xs text-blue-600", children: isNA ? 'Clear' : 'Mark N/A' }))] }), field.type === 'select' ? (_jsx("select", { className: "w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100", value: values[fieldKey] ?? '', onChange: handleChange(fieldKey), disabled: isNA, required: field.required, children: field.options?.map(([value, label]) => (_jsx("option", { value: value, children: label }, value))) })) : (_jsx("input", { className: "w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100", value: values[fieldKey] ?? '', onChange: handleChange(fieldKey), placeholder: field.placeholder, disabled: isNA, required: field.required })), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [colorOptions.map(color => {
                                                const selected = annotation.color === color;
                                                return (_jsx("button", { type: "button", disabled: isNA, onClick: () => updateAnnotation(fieldKey, { color: selected ? null : color }), className: `${selected ? colorSelectedClass[color] : colorIdleClass[color]} rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-40`, children: color.toUpperCase() }, color));
                                            }), _jsx("button", { type: "button", className: "text-xs text-gray-500 disabled:opacity-40", disabled: isNA, onClick: () => updateAnnotation(fieldKey, { color: null }), children: "Clear tag" })] }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-600", children: [_jsxs("label", { className: "inline-flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: annotation.ve, onChange: event => updateAnnotation(fieldKey, { ve: event.target.checked }), disabled: isNA }), "VE"] }), _jsxs("label", { className: "inline-flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: annotation.ut, onChange: event => updateAnnotation(fieldKey, { ut: event.target.checked }), disabled: isNA }), "UT"] })] }), _jsxs("label", { className: "block text-xs text-gray-500", children: ["Comment", _jsx("textarea", { className: "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100", rows: 2, value: annotation.comment, onChange: event => updateAnnotation(fieldKey, { comment: event.target.value }), placeholder: "Notes for this item", disabled: isNA })] })] }, fieldKey));
                        }) }), values.construction_annotations.additional.length > 0 && (_jsx("div", { className: "space-y-4", children: values.construction_annotations.additional.map((item, index) => {
                            const selectedColor = item.color;
                            return (_jsxs("div", { className: "rounded-lg border border-dashed border-gray-300 p-4 space-y-3", children: [_jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col text-sm", children: ["Item label", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: item.label, onChange: event => updateCustomItem(index, { label: event.target.value }), placeholder: "Describe the component" })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Value", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: item.value, onChange: event => updateCustomItem(index, { value: event.target.value }), placeholder: "Enter details" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [colorOptions.map(color => {
                                                const selected = selectedColor === color;
                                                return (_jsx("button", { type: "button", onClick: () => updateCustomItem(index, { color: selected ? null : color }), className: `${selected ? colorSelectedClass[color] : colorIdleClass[color]} rounded-full px-3 py-1 text-xs font-medium transition`, children: color.toUpperCase() }, color));
                                            }), _jsx("button", { type: "button", className: "text-xs text-gray-500", onClick: () => updateCustomItem(index, { color: null }), children: "Clear tag" })] }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-600", children: [_jsxs("label", { className: "inline-flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: item.ve, onChange: event => updateCustomItem(index, { ve: event.target.checked }) }), "VE"] }), _jsxs("label", { className: "inline-flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: item.ut, onChange: event => updateCustomItem(index, { ut: event.target.checked }) }), "UT"] })] }), _jsxs("label", { className: "block text-xs text-gray-500", children: ["Comment", _jsx("textarea", { className: "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm", rows: 2, value: item.comment, onChange: event => updateCustomItem(index, { comment: event.target.value }), placeholder: "Notes for this custom item" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "button", onClick: () => removeCustomItem(index), className: "text-xs text-red-500", children: "Remove item" }) })] }, index));
                        }) })), _jsx("button", { type: "button", onClick: addCustomItem, className: "mt-2 inline-flex items-center rounded-lg border border-blue-500 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50", children: "Add custom item" })] }), _jsxs("section", { className: "bg-white shadow rounded-xl p-6 space-y-4", children: [_jsx("header", { children: _jsx("h2", { className: "text-lg font-semibold text-blue-800", children: "Containment" }) }), _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: _jsxs("label", { className: "flex flex-col text-sm", children: ["Secondary containment type", _jsx("input", { required: true, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: values.secondary_containment_type, onChange: handleChange('secondary_containment_type'), placeholder: "Concrete wall" })] }) })] }), error && _jsx("div", { className: "text-red-600", children: error }), success && _jsx("div", { className: "text-green-600", children: success }), _jsx("div", { className: "flex justify-end gap-3", children: _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : submitLabel }) })] }));
}
