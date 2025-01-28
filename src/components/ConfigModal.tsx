import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DockerApp, AppConfig } from '../types';

interface ConfigModalProps {
  app: DockerApp;
  onClose: () => void;
  onDeploy: (config: AppConfig) => void;
}

export function ConfigModal({ app, onClose, onDeploy }: ConfigModalProps) {
  const [config, setConfig] = useState<AppConfig>(() => {
    const initial: AppConfig = {};
    app.configOptions.forEach(option => {
      if (option.default !== undefined) {
        initial[option.key] = option.default;
      }
    });
    return initial;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeploy(config);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Configure {app.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {app.configOptions.map(option => (
                <div key={option.key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {option.name}
                    {option.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="mt-1">
                    {option.type === 'boolean' ? (
                      <input
                        type="checkbox"
                        checked={Boolean(config[option.key])}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          [option.key]: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type={option.type === 'number' ? 'number' : 'text'}
                        value={config[option.key] || ''}
                        onChange={e => setConfig(prev => ({
                          ...prev,
                          [option.key]: option.type === 'number' ? Number(e.target.value) : e.target.value
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required={option.required}
                      />
                    )}
                    <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Deploy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}