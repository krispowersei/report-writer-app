import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { apiPost } from '../hooks/useApi';
import { useMetadata } from '../hooks/useMetadata';
const initialState = {
    category: 'bottom',
    location: '',
    course: '',
    thickness_in: 0.25,
    notes: ''
};
export function UTResultsForm({ tankId, shellCourses, onCreated }) {
    const { metadata } = useMetadata();
    const [form, setForm] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload = {
                tank: tankId,
                category: form.category,
                location: form.location,
                course: form.category === 'shell' ? Number(form.course) || null : null,
                thickness_in: Number(form.thickness_in),
                notes: form.notes || null
            };
            const created = await apiPost('/api/ut-results/', payload);
            onCreated(created);
            setForm(initialState);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col text-sm", children: ["Category", _jsx("select", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: form.category, onChange: event => setForm(prev => ({ ...prev, category: event.target.value })), children: metadata.choices.ut_categories.map(([value, label]) => (_jsx("option", { value: value, children: label }, value))) })] }), form.category === 'shell' && (_jsxs("label", { className: "flex flex-col text-sm", children: ["Course", _jsxs("select", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: form.course, onChange: event => setForm(prev => ({ ...prev, course: event.target.value })), children: [_jsx("option", { value: "", children: "Select course" }), Array.from({ length: shellCourses ?? 0 }).map((_, index) => (_jsxs("option", { value: index + 1, children: ["Course ", index + 1] }, index + 1)))] })] })), _jsxs("label", { className: "flex flex-col text-sm", children: ["Location / Grid reference", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: form.location, onChange: event => setForm(prev => ({ ...prev, location: event.target.value })), required: true })] }), _jsxs("label", { className: "flex flex-col text-sm", children: ["Thickness (in.)", _jsx("input", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", type: "number", step: "0.001", value: form.thickness_in, onChange: event => setForm(prev => ({ ...prev, thickness_in: Number(event.target.value) })), required: true })] }), _jsxs("label", { className: "flex flex-col text-sm md:col-span-2", children: ["Notes", _jsx("textarea", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", rows: 2, value: form.notes, onChange: event => setForm(prev => ({ ...prev, notes: event.target.value })) })] })] }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : 'Add UT result' })] }));
}
