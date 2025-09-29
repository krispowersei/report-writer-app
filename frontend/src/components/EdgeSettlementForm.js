import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiPost } from '../hooks/useApi';
export function EdgeSettlementForm({ tankId, onCreated }) {
    const [present, setPresent] = useState(false);
    const [result, setResult] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload = { tank: tankId, present, result: result || null };
            const created = await apiPost('/api/edge-settlement-checks/', payload);
            onCreated(created);
            setResult('');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { id: "edge-present", type: "checkbox", checked: present, onChange: event => setPresent(event.target.checked) }), _jsx("label", { htmlFor: "edge-present", className: "text-sm", children: "Edge settlement present" })] }), _jsx("textarea", { className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm", rows: 3, placeholder: "Summarize findings, instrumentation readings, or comments.", value: result, onChange: event => setResult(event.target.value) }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : 'Save edge settlement result' })] }));
}
