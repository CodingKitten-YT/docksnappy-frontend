import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { DockerApp } from '../types';
import { ComposeEditor } from './ComposeEditor';

interface ConfigPageProps {
  app: DockerApp;
  onClose: () => void;
}

export function ConfigPage({ app, onClose }: ConfigPageProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={24} className="text-gray-400" />
            </button>
            <h1 className="text-3xl font-bold text-white">{app.Name}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-28">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={app.icon_url}
                  alt={`${app.Name} logo`}
                  className="w-16 h-16 rounded-lg object-contain bg-gray-700/50 p-2"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">{app.Name}</h2>
                  <p className="text-gray-400">{app.Tag ? app.Tag.trim() : 'No tag available'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                  <p className="text-gray-300">{app.Description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">License</h3>
                  <p className="text-gray-300">{app.License}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Source Code</h3>
                  <a
                    href={app["Source Code"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
                  >
                    <span>View Repository</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <ComposeEditor app={app} />
        </div>
      </div>
    </div>
  );
}