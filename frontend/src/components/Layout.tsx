import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-blue-900 hover:bg-blue-100'}`;

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-blue-800">Tank Inspection Console</h1>
            <p className="text-sm text-gray-500">Workflow hub for API 653 field teams</p>
          </div>
          <nav className="flex gap-2">
            <NavLink to="/" className={navClass}>Dashboard</NavLink>
            <NavLink to="/tanks" className={navClass}>Tanks</NavLink>
            <NavLink to="/executive-summary" className={navClass}>Executive Summary</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
