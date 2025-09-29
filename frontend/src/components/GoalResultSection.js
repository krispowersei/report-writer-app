import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '../hooks/useApi';
import { useMetadata } from '../hooks/useMetadata';
const GOAL_HELPERS = {
    goal_1: {
        standardFields: [
            { key: 'mfl_performed', label: 'Was MFL performed?', type: 'boolean' },
            { key: 'mfl_summary', label: 'MFL result summary', type: 'text', conditionalKey: 'mfl_performed', conditionalValue: true },
            { key: 'external_interval_typical', label: 'External inspection interval typical?', type: 'boolean' },
            { key: 'external_interval_notes', label: 'If not typical, why?', type: 'text', conditionalKey: 'external_interval_typical', conditionalValue: false },
            { key: 'internal_interval_typical', label: 'Internal inspection interval typical?', type: 'boolean' },
            { key: 'internal_interval_notes', label: 'If not typical, why?', type: 'text', conditionalKey: 'internal_interval_typical', conditionalValue: false },
            { key: 'ut_interval_typical', label: 'UT inspection interval typical?', type: 'boolean' },
            { key: 'ut_interval_notes', label: 'If not typical, why?', type: 'text', conditionalKey: 'ut_interval_typical', conditionalValue: false }
        ]
    },
    goal_2: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    },
    goal_3: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    },
    goal_4: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    },
    goal_5: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    },
    goal_6: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    },
    goal_7: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    },
    goal_8: {
        standardFields: [
            { key: 'shell_ut_nominal', label: 'Is shell UT nominal?', type: 'boolean' },
            { key: 'shell_ut_notes', label: 'If not, why?', type: 'text', conditionalKey: 'shell_ut_nominal', conditionalValue: false },
            { key: 'damaged_appurtenances', label: 'Any corroded/damaged appurtenances?', type: 'boolean' },
            { key: 'appurtenance_notes', label: 'Notes', type: 'text', conditionalKey: 'damaged_appurtenances', conditionalValue: true }
        ]
    }
};
function buildFormState(goal, result) {
    return {
        methods: result?.methods ?? [],
        standard: result?.standard_responses ?? {},
        customResponses: result?.custom_responses ?? []
    };
}
export function GoalResultSection({ tankId, initialResults, onResultsChange }) {
    const { metadata } = useMetadata();
    const [results, setResults] = useState(initialResults);
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        setResults(initialResults);
    }, [initialResults]);
    useEffect(() => {
        const load = async () => {
            setLoadingTemplates(true);
            try {
                const data = await apiGet('/api/goal-question-templates/');
                setTemplates(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
            finally {
                setLoadingTemplates(false);
            }
        };
        void load();
    }, []);
    const groupedTemplates = useMemo(() => {
        return templates.reduce((acc, template) => {
            if (!acc[template.goal_key]) {
                acc[template.goal_key] = [];
            }
            acc[template.goal_key].push(template);
            return acc;
        }, {
            goal_1: [],
            goal_2: [],
            goal_3: [],
            goal_4: [],
            goal_5: [],
            goal_6: [],
            goal_7: [],
            goal_8: []
        });
    }, [templates]);
    const handleUpsert = async (goal, formState, existing) => {
        const payload = {
            tank: tankId,
            goal_key: goal,
            methods: formState.methods,
            standard_responses: formState.standard,
            custom_responses: formState.customResponses
        };
        const endpoint = existing ? `/api/goal-results/${existing.id}/` : '/api/goal-results/';
        const method = existing ? apiPatch : apiPost;
        const saved = await method(endpoint, payload);
        setResults(prev => {
            const next = prev.filter(item => item.goal_key !== goal).concat(saved);
            onResultsChange?.(next);
            return next;
        });
    };
    const handleTemplateCreate = async (goal, prompt) => {
        const payload = { goal_key: goal, prompt, is_default: false };
        const created = await apiPost('/api/goal-question-templates/', payload);
        setTemplates(prev => prev.concat(created));
        return created;
    };
    return (_jsxs("section", { className: "space-y-6", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-xl font-semibold text-blue-800", children: "Workflow 3 \u2014 Executive Summary Inputs" }), _jsx("p", { className: "text-sm text-gray-500", children: "Answer the standard prompts, pick methods, and add optional custom Q&A per goal." })] }), error && _jsx("p", { className: "text-red-600 text-sm", children: error }), metadata.goals.map(goal => (_jsx(GoalCard, { goal: goal, loadingTemplates: loadingTemplates, templates: groupedTemplates[goal.key] ?? [], methods: metadata.methods, result: results.find(item => item.goal_key === goal.key), onSave: handleUpsert, onCreateTemplate: handleTemplateCreate }, goal.key)))] }));
}
function GoalCard({ goal, methods, templates, result, loadingTemplates, onSave, onCreateTemplate }) {
    const [formState, setFormState] = useState(() => buildFormState(goal.key, result));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [newPrompt, setNewPrompt] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    useEffect(() => {
        setFormState(buildFormState(goal.key, result));
    }, [goal.key, result]);
    const helper = GOAL_HELPERS[goal.key];
    const toggleMethod = (method) => {
        setFormState(prev => ({
            ...prev,
            methods: prev.methods.includes(method)
                ? prev.methods.filter(item => item !== method)
                : prev.methods.concat(method)
        }));
    };
    const updateStandard = (key, value) => {
        setFormState(prev => ({
            ...prev,
            standard: { ...prev.standard, [key]: value }
        }));
    };
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            await onSave(goal.key, formState, result);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSaving(false);
        }
    };
    const handleAddCustom = async () => {
        if (!newPrompt || !newAnswer) {
            setError('Provide both a question prompt and answer.');
            return;
        }
        try {
            const template = await onCreateTemplate(goal.key, newPrompt);
            setFormState(prev => ({
                ...prev,
                customResponses: prev.customResponses.concat([{ prompt: newPrompt, answer: newAnswer, template_id: template.id }])
            }));
            setNewPrompt('');
            setNewAnswer('');
            setShowCustomForm(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    };
    return (_jsxs("article", { className: "bg-white shadow rounded-xl p-6 space-y-4", children: [_jsxs("header", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-800", children: goal.label }), _jsx("p", { className: "text-sm text-gray-500", children: "Methods employed + results snapshot." })] }), _jsx("button", { type: "button", onClick: handleSave, disabled: saving, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: saving ? 'Saving…' : result ? 'Update goal' : 'Create goal' })] }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsxs("section", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700", children: "Methods employed" }), _jsx("div", { className: "grid gap-2 md:grid-cols-2", children: methods.map(method => (_jsxs("label", { className: "flex items-start gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-blue-300", children: [_jsx("input", { type: "checkbox", checked: formState.methods.includes(method), onChange: () => toggleMethod(method) }), _jsx("span", { children: method })] }, method))) })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700", children: "Results" }), _jsx("div", { className: "grid gap-3", children: helper.standardFields.map(field => {
                            const currentValue = formState.standard[field.key];
                            const shouldShow = field.conditionalKey
                                ? formState.standard[field.conditionalKey] === field.conditionalValue
                                : true;
                            if (!shouldShow) {
                                return null;
                            }
                            if (field.type === 'boolean') {
                                return (_jsxs("label", { className: "flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm", children: [_jsx("span", { children: field.label }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => updateStandard(field.key, true), className: `rounded-md px-3 py-1 border ${currentValue === true ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`, children: "Yes" }), _jsx("button", { type: "button", onClick: () => updateStandard(field.key, false), className: `rounded-md px-3 py-1 border ${currentValue === false ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`, children: "No" })] })] }, field.key));
                            }
                            return (_jsxs("label", { className: "flex flex-col text-sm", children: [field.label, _jsx("textarea", { className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", rows: 2, value: currentValue ?? '', onChange: event => updateStandard(field.key, event.target.value) })] }, field.key));
                        }) })] }), _jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-semibold text-gray-700", children: "Custom Q&A" }), _jsx("button", { type: "button", onClick: () => setShowCustomForm(show => !show), className: "text-sm text-blue-600", children: showCustomForm ? 'Cancel' : 'Add custom Q&A' })] }), _jsx("div", { className: "space-y-2", children: (templates ?? []).map(template => (_jsx(Fragment, { children: formState.customResponses.find(response => response.template_id === template.id || response.prompt === template.prompt) ? null : (_jsxs("button", { type: "button", className: "text-xs text-blue-600", onClick: () => setFormState(prev => ({
                                    ...prev,
                                    customResponses: prev.customResponses.concat([
                                        { prompt: template.prompt, answer: '', template_id: template.id }
                                    ])
                                })), disabled: loadingTemplates, children: ["Prefill: ", template.prompt] })) }, template.id))) }), _jsx("div", { className: "space-y-2", children: formState.customResponses.map((item, index) => (_jsxs("div", { className: "rounded-lg border border-gray-200 p-3 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm font-semibold text-gray-700", children: [_jsx("span", { children: item.prompt }), _jsx("button", { type: "button", className: "text-xs text-red-500", onClick: () => setFormState(prev => ({
                                                ...prev,
                                                customResponses: prev.customResponses.filter((_, i) => i !== index)
                                            })), children: "Remove" })] }), _jsx("textarea", { className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm", rows: 2, value: item.answer, onChange: event => setFormState(prev => ({
                                        ...prev,
                                        customResponses: prev.customResponses.map((response, i) => (i === index ? { ...response, answer: event.target.value } : response))
                                    })) })] }, `${item.prompt}-${index}`))) }), showCustomForm && (_jsxs("div", { className: "rounded-lg border border-dashed border-blue-300 p-4 space-y-2", children: [_jsx("input", { className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm", placeholder: "Question prompt", value: newPrompt, onChange: event => setNewPrompt(event.target.value) }), _jsx("textarea", { className: "w-full rounded-md border border-gray-300 px-3 py-2 text-sm", rows: 2, placeholder: "Answer", value: newAnswer, onChange: event => setNewAnswer(event.target.value) }), _jsx("button", { type: "button", onClick: handleAddCustom, className: "rounded-lg bg-blue-600 px-3 py-2 text-white", children: "Save custom question" })] }))] })] }));
}
