import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useBatches } from '../../hooks/useBatches';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { batches, loading } = useBatches();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        batches={batches}
        loading={loading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          batches={batches}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            <Outlet context={{ batches, loading }} />
          </div>
        </main>
      </div>
    </div>
  );
}
