import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-800">Get Started</h2>
        <p className="text-gray-600 mt-2">
          Capture tank master data with detailed construction annotations, then assemble a one-page workflow 3 report for delivery.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Link
            to="/tanks/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add a Tank
          </Link>
          <Link
            to="/executive-summary"
            className="inline-flex items-center justify-center rounded-lg border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50"
          >
            View Workflow 3 Summary
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800">Workflow 1</h3>
          <p className="text-gray-600 mt-1">
            Capture and maintain tank master data, inspection logistics, and construction details with VE/UT checkboxes, color tags, and comments per item.
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800">Workflow 3</h3>
          <p className="text-gray-600 mt-1">
            Generate a one-page cover + executive summary using workflow 1 data, including tag highlights and custom construction items.
          </p>
        </div>
      </section>
    </div>
  );
}
