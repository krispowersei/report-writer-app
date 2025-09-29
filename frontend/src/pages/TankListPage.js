import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiDelete, apiGet } from '../hooks/useApi';
export function TankListPage() {
    const [tanks, setTanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const load = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/api/tanks/');
            setTanks(data);
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void load();
    }, []);
    const handleDelete = async (tankId) => {
        if (!confirm('Delete this tank and all associated records?'))
            return;
        try {
            await apiDelete(`/api/tanks/${tankId}/`);
            await load();
        }
        catch (err) {
            alert(err instanceof Error ? err.message : String(err));
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-blue-800", children: "Tank Registry" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Master data stored in the local database." })] }), _jsx(Link, { to: "/tanks/new", className: "rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700", children: "Add Tank" })] }), _jsx("div", { className: "bg-white shadow rounded-xl overflow-hidden", children: _jsxs("table", { className: "min-w-full text-left", children: [_jsx("thead", { className: "bg-blue-50 text-blue-900 text-sm uppercase", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "Tank" }), _jsx("th", { className: "px-4 py-3", children: "Owner" }), _jsx("th", { className: "px-4 py-3", children: "Facility" }), _jsx("th", { className: "px-4 py-3", children: "City / State" }), _jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100 text-sm", children: [loading && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-gray-500", children: "Loading tanks..." }) })), error && !loading && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-red-600", children: error }) })), !loading && !error && tanks.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-gray-500", children: "No tanks recorded yet. Start by adding a master record." }) })), tanks.map(tank => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 font-medium text-gray-900", children: tank.tank_name }), _jsx("td", { className: "px-4 py-3", children: tank.owner }), _jsx("td", { className: "px-4 py-3", children: tank.facility_type }), _jsxs("td", { className: "px-4 py-3", children: [tank.city, ", ", tank.state] }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/tanks/${tank.tank_unique_id}`, className: "rounded-md border border-blue-600 px-3 py-1 text-blue-700 hover:bg-blue-50", children: "Open" }), _jsx("button", { type: "button", onClick: () => handleDelete(tank.tank_unique_id), className: "rounded-md border border-red-200 px-3 py-1 text-red-500 hover:bg-red-50", children: "Delete" })] }) })] }, tank.tank_unique_id)))] })] }) })] }));
}
