import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiPost } from '../hooks/useApi';
export function OtherNDEForm({ tankId, onCreated }) {
    const [ndeType, setNdeType] = useState('MFL');
    const [result, setResult] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                tank: tankId,
                nde_type: ndeType,
                result
            };
            const created = await apiPost('/api/other-nde/', payload);
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
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("label", { className: "flex flex-col text-sm", children: ["NDE type", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: ndeType, onChange: event => setNdeType(event.target.value), placeholder: "MFL", required: true })] }), _jsx("textarea", { className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm", rows: 3, value: result, onChange: event => setResult(event.target.value), placeholder: "Summarize findings and relevance.", required: true }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : 'Add record' })] }));
}
