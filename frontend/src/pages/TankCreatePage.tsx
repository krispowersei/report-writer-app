import { useNavigate } from 'react-router-dom';
import { TankForm } from '../components/TankForm';
import { apiPost } from '../hooks/useApi';
import type { Tank, TankPayload } from '../types';

export function TankCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload: TankPayload) => {
    const created = await apiPost<TankPayload, Tank>('/api/tanks/', payload);
    navigate(`/tanks/${created.tank_unique_id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-blue-800">Tank Master Data</h2>
        <p className="text-gray-500 text-sm">
          Workflow 1 — capture all metadata that seeds downstream survey and reporting workflows.
        </p>
      </div>
      <TankForm onSubmit={handleSubmit} submitLabel="Create Tank" />
    </div>
  );
}
