import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { apiPost } from '../hooks/useApi';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export function ShellSettlementForm({ tankId, onCreated }) {
    const [stationCount, setStationCount] = useState(4);
    const [readings, setReadings] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const items = Array.from({ length: stationCount }, (_, index) => ({
            station_label: alphabet[index] ?? `S${index + 1}`,
            measurement_in: 0
        }));
        setReadings(items);
    }, [stationCount]);
    const handleMeasurementChange = (idx, value) => {
        setReadings(prev => prev.map((reading, i) => (i === idx ? { ...reading, measurement_in: value } : reading)));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const payload = { tank: tankId, station_count: stationCount, readings };
            const created = await apiPost('/api/shell-settlement-surveys/', payload);
            onCreated(created);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "flex items-end gap-3", children: [_jsxs("label", { className: "text-sm flex flex-col", children: ["Station count", _jsx("input", { type: "number", min: 1, max: 52, className: "mt-1 rounded-lg border border-gray-300 px-3 py-2", value: stationCount, onChange: event => setStationCount(Number(event.target.value) || 0) })] }), _jsx("button", { type: "submit", disabled: submitting, className: "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60", children: submitting ? 'Saving…' : 'Save survey' })] }), _jsx("div", { className: "overflow-x-auto border border-gray-200 rounded-lg", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left", children: "Station" }), _jsx("th", { className: "px-3 py-2 text-left", children: "Measurement (in.)" })] }) }), _jsx("tbody", { children: readings.map((reading, idx) => (_jsxs("tr", { className: "border-t border-gray-100", children: [_jsx("td", { className: "px-3 py-2 font-medium text-gray-700", children: reading.station_label }), _jsx("td", { className: "px-3 py-2", children: _jsx("input", { type: "number", step: "0.01", className: "w-full rounded-md border border-gray-300 px-3 py-2", value: reading.measurement_in, onChange: event => handleMeasurementChange(idx, Number(event.target.value) || 0) }) })] }, reading.station_label))) })] }) }), error && _jsx("p", { className: "text-sm text-red-600", children: error })] }));
}
