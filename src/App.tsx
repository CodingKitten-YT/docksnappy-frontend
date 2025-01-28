import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AppCard } from './components/AppCard';
import { ConfigPage } from './components/ConfigPage';
import { cacheService } from './services/cache';
import type { DockerApp } from './types';

const API_BASE_URL = 'https://docksnappy.codingkitten.hackclub.app';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<DockerApp | null>(null);
  const [apps, setApps] = useState<DockerApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const cachedApps = cacheService.getApps();
        if (cachedApps) {
          setApps(cachedApps);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/apps`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApps(data);
        cacheService.setApps(data);
      } catch (error) {
        console.error('Error fetching apps:', error);
        setError('Failed to load apps. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const handleSelectApp = async (app: DockerApp) => {
    setSelectedApp(app);
  };

  const filteredApps = apps.filter(app => 
    app.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedApp) {
    return <ConfigPage app={selectedApp} onClose={() => setSelectedApp(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Docksnappy
            </h1>
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-full focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-red-400 max-w-md text-center">
              <p className="text-lg font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(app => (
                <AppCard
                  key={app.ID}
                  app={app}
                  onSelect={handleSelectApp}
                  isGridView={false}
                />
              ))}
            </div>
            {filteredApps.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-xl font-medium text-gray-400 mb-4">No apps found</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;