import { Fragment, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '../hooks/useApi';
import { useMetadata } from '../hooks/useMetadata';
import type {
  GoalKey,
  GoalQuestionTemplate,
  GoalResult,
  MetadataResponse,
  UUID
} from '../types';

interface GoalResultSectionProps {
  tankId: UUID;
  initialResults: GoalResult[];
  onResultsChange?: (results: GoalResult[]) => void;
}

interface GoalFormState {
  methods: string[];
  standard: Record<string, unknown>;
  customResponses: Array<{ prompt: string; answer: string; template_id?: number }>;
}

const GOAL_HELPERS: Record<GoalKey, { standardFields: Array<{ key: string; label: string; type: 'boolean' | 'text'; helper?: string; conditionalKey?: string; conditionalValue?: boolean }>; }> = {
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

function buildFormState(goal: GoalKey, result?: GoalResult): GoalFormState {
  return {
    methods: result?.methods ?? [],
    standard: result?.standard_responses ?? {},
    customResponses: result?.custom_responses ?? []
  };
}

export function GoalResultSection({ tankId, initialResults, onResultsChange }: GoalResultSectionProps) {
  const { metadata } = useMetadata();
  const [results, setResults] = useState<GoalResult[]>(initialResults);
  const [templates, setTemplates] = useState<GoalQuestionTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setResults(initialResults);
  }, [initialResults]);

  useEffect(() => {
    const load = async () => {
      setLoadingTemplates(true);
      try {
        const data = await apiGet<GoalQuestionTemplate[]>('/api/goal-question-templates/');
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingTemplates(false);
      }
    };
    void load();
  }, []);

  const groupedTemplates = useMemo(() => {
    return templates.reduce<Record<GoalKey, GoalQuestionTemplate[]>>((acc, template) => {
      if (!acc[template.goal_key as GoalKey]) {
        acc[template.goal_key as GoalKey] = [];
      }
      acc[template.goal_key as GoalKey].push(template);
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

  const handleUpsert = async (goal: GoalKey, formState: GoalFormState, existing?: GoalResult) => {
    const payload = {
      tank: tankId,
      goal_key: goal,
      methods: formState.methods,
      standard_responses: formState.standard,
      custom_responses: formState.customResponses
    };
    const endpoint = existing ? `/api/goal-results/${existing.id}/` : '/api/goal-results/';
    const method = existing ? apiPatch<typeof payload, GoalResult> : apiPost<typeof payload, GoalResult>;
    const saved = await method(endpoint, payload);
    setResults(prev => {
      const next = prev.filter(item => item.goal_key !== goal).concat(saved);
      onResultsChange?.(next);
      return next;
    });
  };

  const handleTemplateCreate = async (goal: GoalKey, prompt: string) => {
    const payload = { goal_key: goal, prompt, is_default: false };
    const created = await apiPost<typeof payload, GoalQuestionTemplate>('/api/goal-question-templates/', payload);
    setTemplates(prev => prev.concat(created));
    return created;
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-blue-800">Workflow 3 — Executive Summary Inputs</h2>
        <p className="text-sm text-gray-500">Answer the standard prompts, pick methods, and add optional custom Q&A per goal.</p>
      </header>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {metadata.goals.map(goal => (
        <GoalCard
          key={goal.key}
          goal={goal}
          loadingTemplates={loadingTemplates}
          templates={groupedTemplates[goal.key] ?? []}
          methods={metadata.methods}
          result={results.find(item => item.goal_key === goal.key)}
          onSave={handleUpsert}
          onCreateTemplate={handleTemplateCreate}
        />
      ))}
    </section>
  );
}

interface GoalCardProps {
  goal: MetadataResponse['goals'][number];
  methods: string[];
  templates: GoalQuestionTemplate[];
  result?: GoalResult;
  loadingTemplates: boolean;
  onSave: (goal: GoalKey, state: GoalFormState, existing?: GoalResult) => Promise<void>;
  onCreateTemplate: (goal: GoalKey, prompt: string) => Promise<GoalQuestionTemplate>;
}

function GoalCard({ goal, methods, templates, result, loadingTemplates, onSave, onCreateTemplate }: GoalCardProps) {
  const [formState, setFormState] = useState<GoalFormState>(() => buildFormState(goal.key, result));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    setFormState(buildFormState(goal.key, result));
  }, [goal.key, result]);

  const helper = GOAL_HELPERS[goal.key];

  const toggleMethod = (method: string) => {
    setFormState(prev => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter(item => item !== method)
        : prev.methods.concat(method)
    }));
  };

  const updateStandard = (key: string, value: unknown) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <article className="bg-white shadow rounded-xl p-6 space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-800">{goal.label}</h3>
          <p className="text-sm text-gray-500">Methods employed + results snapshot.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : result ? 'Update goal' : 'Create goal'}
        </button>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Methods employed</h4>
        <div className="grid gap-2 md:grid-cols-2">
          {methods.map(method => (
            <label key={method} className="flex items-start gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:border-blue-300">
              <input
                type="checkbox"
                checked={formState.methods.includes(method)}
                onChange={() => toggleMethod(method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Results</h4>
        <div className="grid gap-3">
          {helper.standardFields.map(field => {
            const currentValue = formState.standard[field.key];
            const shouldShow = field.conditionalKey
              ? formState.standard[field.conditionalKey] === field.conditionalValue
              : true;
            if (!shouldShow) {
              return null;
            }
            if (field.type === 'boolean') {
              return (
                <label key={field.key} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <span>{field.label}</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateStandard(field.key, true)}
                      className={`rounded-md px-3 py-1 border ${currentValue === true ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStandard(field.key, false)}
                      className={`rounded-md px-3 py-1 border ${currentValue === false ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`}
                    >
                      No
                    </button>
                  </div>
                </label>
              );
            }
            return (
              <label key={field.key} className="flex flex-col text-sm">
                {field.label}
                <textarea
                  className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
                  rows={2}
                  value={(currentValue as string) ?? ''}
                  onChange={event => updateStandard(field.key, event.target.value)}
                />
              </label>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">Custom Q&A</h4>
          <button
            type="button"
            onClick={() => setShowCustomForm(show => !show)}
            className="text-sm text-blue-600"
          >
            {showCustomForm ? 'Cancel' : 'Add custom Q&A'}
          </button>
        </div>
        <div className="space-y-2">
          {(templates ?? []).map(template => (
            <Fragment key={template.id}>
              {formState.customResponses.find(
                response => response.template_id === template.id || response.prompt === template.prompt
              ) ? null : (
                <button
                  type="button"
                  className="text-xs text-blue-600"
                  onClick={() =>
                    setFormState(prev => ({
                      ...prev,
                      customResponses: prev.customResponses.concat([
                        { prompt: template.prompt, answer: '', template_id: template.id }
                      ])
                    }))
                  }
                  disabled={loadingTemplates}
                >
                  Prefill: {template.prompt}
                </button>
              )}
            </Fragment>
          ))}
        </div>
        <div className="space-y-2">
          {formState.customResponses.map((item, index) => (
            <div key={`${item.prompt}-${index}`} className="rounded-lg border border-gray-200 p-3 space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
                <span>{item.prompt}</span>
                <button
                  type="button"
                  className="text-xs text-red-500"
                  onClick={() =>
                    setFormState(prev => ({
                      ...prev,
                      customResponses: prev.customResponses.filter((_, i) => i !== index)
                    }))
                  }
                >
                  Remove
                </button>
              </div>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                rows={2}
                value={item.answer}
                onChange={event =>
                  setFormState(prev => ({
                    ...prev,
                    customResponses: prev.customResponses.map((response, i) => (i === index ? { ...response, answer: event.target.value } : response))
                  }))
                }
              />
            </div>
          ))}
        </div>
        {showCustomForm && (
          <div className="rounded-lg border border-dashed border-blue-300 p-4 space-y-2">
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Question prompt"
              value={newPrompt}
              onChange={event => setNewPrompt(event.target.value)}
            />
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={2}
              placeholder="Answer"
              value={newAnswer}
              onChange={event => setNewAnswer(event.target.value)}
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="rounded-lg bg-blue-600 px-3 py-2 text-white"
            >
              Save custom question
            </button>
          </div>
        )}
      </section>
    </article>
  );
}
