import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/views/Dashboard';
import Inventory from './components/views/Inventory';
import MenuEngineering from './components/views/MenuEngineering';
import Reports from './components/views/Reports';
import Team from './components/views/Team';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'menu':
        return <MenuEngineering />;
      case 'reports':
        return <Reports />;
      case 'team':
        return <Team />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar - Fixed to Right */}
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      {/* Main Content - Margin Right to account for Sidebar */}
      <main className="flex-1 mr-64 p-8 h-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header / Top Bar could go here if separate from views */}
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;