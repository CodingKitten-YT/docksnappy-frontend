import React, { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { DockerApp } from '../types';

interface AppCardProps {
  app: DockerApp;
  onSelect: (app: DockerApp) => void;
  isGridView: boolean;
}

const DEFAULT_COLOR = 'rgb(59, 130, 246)';

export function AppCard({ app, onSelect }: AppCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Use main_color from the app object or fallback to DEFAULT_COLOR
  const dominantColor = app.main_color || DEFAULT_COLOR;

  return (
    <div 
      className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-700/50 overflow-hidden"
      onClick={() => onSelect(app)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(45deg, ${dominantColor}, transparent)`,
        }}
      />
      
      <div className="relative p-6 flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="relative transform group-hover:scale-105 transition-transform duration-300">
            <div 
              className="absolute inset-0 blur-xl rounded-full opacity-20 transition-opacity duration-300 group-hover:opacity-30"
              style={{ backgroundColor: dominantColor }}
            />
            <img 
              src={app.icon_url}
              alt={`${app.Name} logo`} 
              className="relative z-10 rounded-xl object-contain bg-gray-700/50 backdrop-blur-sm p-3 w-16 h-16"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white truncate pr-4">{app.Name}</h3>
            <ChevronRight 
              className={`text-gray-400 flex-shrink-0 transform transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`} 
              size={20} 
            />
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-200">
            {app.Description}
          </p>

          <div className="flex justify-end mt-4">
            <a 
              href={app["Source Code"]}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <span>Source</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}