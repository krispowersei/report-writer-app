import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiPost } from '../hooks/useApi';
export function ColumnPlumbnessForm({ tankId, onCreated }) {
    const [columnId, setColumnId] = useState('center');
    const [plumbness, setPlumbness] = useState(0);
    const [direction, setDirection] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
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
            const created = await apiPost('/api/column-plumbness-checks/', payload);
            onCreated(created);
            setDirection('');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("label", { className: "flex flex-col text-sm", children: ["Column", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: columnId, onChange: event => setColumnId(event.target.value), placeholder: "center", required: true })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Plumbness (in./ft)", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", type: "number", step: "0.001", value: plumbness, onChange: event => setPlumbness(Number(event.target.value)), required: true })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Direction", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: direction, onChange: event => setDirection(event.target.value), placeholder: "e.g. NE" })] })] }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : 'Save plumbness reading' })] }));
}
