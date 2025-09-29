import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useMetadata } from '../hooks/useMetadata';
import { apiPost } from '../hooks/useApi';
export function VisualFindingForm({ tankId, onCreated }) {
    const { metadata } = useMetadata();
    const [area, setArea] = useState(metadata.choices.visual_areas[0]?.[0] ?? 'shell');
    const [finding, setFinding] = useState('');
    const [commentType, setCommentType] = useState(metadata.choices.comment_types[0]?.[0] ?? 'perform');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (metadata.choices.visual_areas.length && !metadata.choices.visual_areas.some(([value]) => value === area)) {
            setArea(metadata.choices.visual_areas[0][0]);
        }
        if (metadata.choices.comment_types.length && !metadata.choices.comment_types.some(([value]) => value === commentType)) {
            setCommentType(metadata.choices.comment_types[0][0]);
        }
    }, [metadata, area, commentType]);
    const handleSubmit = async (event) => {
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
            const created = await apiPost('/api/visual-findings/', payload);
            onCreated(created);
            setFinding('');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col text-sm", children: ["Area", _jsx("select", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: area, onChange: event => setArea(event.target.value), children: metadata.choices.visual_areas.map(([value, label]) => (_jsx("option", { value: value, children: label }, value))) })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Comment type", _jsx("select", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: commentType, onChange: event => setCommentType(event.target.value), children: metadata.choices.comment_types.map(([value, label]) => (_jsx("option", { value: value, children: label }, value))) })] })] }), _jsx("textarea", { className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm", rows: 3, value: finding, onChange: event => setFinding(event.target.value), placeholder: "Summarize the finding with action-oriented phrasing.", required: true }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : 'Add finding' })] }));
}
