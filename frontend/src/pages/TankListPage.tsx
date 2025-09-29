import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiDelete, apiGet } from '../hooks/useApi';
import type { Tank } from '../types';

export function TankListPage() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Tank[]>('/api/tanks/');
      setTanks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (tankId: string) => {
    if (!confirm('Delete this tank and all associated records?')) return;
    try {
      await apiDelete(`/api/tanks/${tankId}/`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-blue-800">Tank Registry</h2>
          <p className="text-gray-500 text-sm">Master data stored in the local database.</p>
        </div>
        <Link
          to="/tanks/new"
          className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
        >
          Add Tank
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-blue-50 text-blue-900 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Tank</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Facility</th>
              <th className="px-4 py-3">City / State</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Loading tanks...
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && tanks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No tanks recorded yet. Start by adding a master record.
                </td>
              </tr>
            )}
            {tanks.map(tank => (
              <tr key={tank.tank_unique_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{tank.tank_name}</td>
                <td className="px-4 py-3">{tank.owner}</td>
                <td className="px-4 py-3">{tank.facility_type}</td>
                <td className="px-4 py-3">{tank.city}, {tank.state}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/tanks/${tank.tank_unique_id}`}
                      className="rounded-md border border-blue-600 px-3 py-1 text-blue-700 hover:bg-blue-50"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(tank.tank_unique_id)}
                      className="rounded-md border border-red-200 px-3 py-1 text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
