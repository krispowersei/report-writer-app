import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TankListPage } from './pages/TankListPage';
import { TankCreatePage } from './pages/TankCreatePage';
import { TankDetailPage } from './pages/TankDetailPage';
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage';
function App() {
    return (_jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/tanks", element: _jsx(TankListPage, {}) }), _jsx(Route, { path: "/tanks/new", element: _jsx(TankCreatePage, {}) }), _jsx(Route, { path: "/tanks/:tankId", element: _jsx(TankDetailPage, {}) }), _jsx(Route, { path: "/executive-summary", element: _jsx(ExecutiveSummaryPage, {}) })] }) }));
}
export default App;
