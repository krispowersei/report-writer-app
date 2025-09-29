import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { TankForm } from '../components/TankForm';
import { apiPost } from '../hooks/useApi';
export function TankCreatePage() {
    const navigate = useNavigate();
    const handleSubmit = async (payload) => {
        const created = await apiPost('/api/tanks/', payload);
        navigate(`/tanks/${created.tank_unique_id}`);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-blue-800", children: "Tank Master Data" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Workflow 1 \u2014 capture all metadata that seeds downstream survey and reporting workflows." })] }), _jsx(TankForm, { onSubmit: handleSubmit, submitLabel: "Create Tank" })] }));
}
