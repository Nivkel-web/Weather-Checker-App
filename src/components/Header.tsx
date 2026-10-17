import React from 'react';
import { CloudSun, BookOpen } from 'lucide-react';
import { WeatherSettings } from '../types/weather';

interface HeaderProps {
  settings: WeatherSettings;
  onUpdateSettings: (settings: Partial<WeatherSettings>) => void;
  onOpenDocs: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenDocs,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('overview');
          }}
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CloudSun className="w-4 h-4" />
          </div>
          <span>Weather Checker App</span>
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('overview')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'overview' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('predictions')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'predictions' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            5-Day Predictions
          </button>
          <button
            onClick={() => onNavigate('hourly')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'hourly' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Hourly Curve
          </button>
          <button
            onClick={() => onNavigate('telemetry')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'telemetry' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            Atmospheric Matrix
          </button>
          <button
            onClick={onOpenDocs}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-slate-200"
          >
            GitHub Docs
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onUpdateSettings({ temperatureUnit: 'celsius' })}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                settings.temperatureUnit === 'celsius'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onUpdateSettings({ temperatureUnit: 'fahrenheit' })}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                settings.temperatureUnit === 'fahrenheit'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-900/30"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Project README</span>
          </button>
        </div>
      </div>
    </header>
  );
};
