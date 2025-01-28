import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import yaml from 'js-yaml';
import { DockerApp } from '../types';

interface ComposeEditorProps {
  app: DockerApp;
}

interface ServiceConfig {
  image?: string;
  environment?: Record<string, string>;
  volumes?: string[];
  ports?: string[];
  restart?: string;
}

interface ComposeConfig {
  version: string;
  services: Record<string, ServiceConfig>;
}

const API_BASE_URL = 'https://docksnappy.codingkitten.hackclub.app';

export function ComposeEditor({ app }: ComposeEditorProps) {
  const [composeConfig, setComposeConfig] = useState<ComposeConfig | null>(null);
  const [composeText, setComposeText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchComposeUrl = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/apps/${app.ID}/compose`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const composeResponse = await fetch(data.url);
        if (!composeResponse.ok) {
          throw new Error(`HTTP error! status: ${composeResponse.status}`);
        }
        const text = await composeResponse.text();
        
        try {
          const parsed = yaml.load(text, { json: true }) as ComposeConfig;
          setComposeConfig(parsed);
          setComposeText(yaml.dump(parsed, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
          }));
        } catch (yamlError) {
          console.error('Error parsing YAML:', yamlError);
          setError('Invalid docker-compose configuration format.');
          return;
        }
      } catch (err) {
        console.error('Error loading compose file:', err);
        setError('Failed to load configuration. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComposeUrl();
  }, [app.ID]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(composeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700 sticky top-28 bg-gray-800 rounded-t-lg z-10 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Docker Compose Configuration</h3>
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-3 py-1 ${
            copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
          } rounded-md transition-colors duration-200`}
          title="Copy to clipboard"
        >
          <Copy size={16} />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4">
        <textarea
          value={composeText}
          onChange={(e) => setComposeText(e.target.value)}
          className="w-full bg-gray-900 text-gray-300 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          style={{ minHeight: '200px', height: 'auto' }}
          rows={composeText.split('\n').length}
          spellCheck="false"
        />
      </div>
    </div>
  );
}