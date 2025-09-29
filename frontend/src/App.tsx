import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TankListPage } from './pages/TankListPage';
import { TankCreatePage } from './pages/TankCreatePage';
import { TankDetailPage } from './pages/TankDetailPage';
import { ExecutiveSummaryPage } from './pages/ExecutiveSummaryPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tanks" element={<TankListPage />} />
        <Route path="/tanks/new" element={<TankCreatePage />} />
        <Route path="/tanks/:tankId" element={<TankDetailPage />} />
        <Route path="/executive-summary" element={<ExecutiveSummaryPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
