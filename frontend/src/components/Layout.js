import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
const navClass = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-blue-900 hover:bg-blue-100'}`;
export function Layout({ children }) {
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx("header", { className: "bg-white border-b border-gray-200", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-blue-800", children: "Tank Inspection Console" }), _jsx("p", { className: "text-sm text-gray-500", children: "Workflow hub for API 653 field teams" })] }), _jsxs("nav", { className: "flex gap-2", children: [_jsx(NavLink, { to: "/", className: navClass, children: "Dashboard" }), _jsx(NavLink, { to: "/tanks", className: navClass, children: "Tanks" }), _jsx(NavLink, { to: "/executive-summary", className: navClass, children: "Executive Summary" })] })] }) }), _jsx("main", { className: "flex-1 max-w-6xl mx-auto w-full px-6 py-8", children: children })] }));
}
