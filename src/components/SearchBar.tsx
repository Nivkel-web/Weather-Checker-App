import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, History, Loader2, X } from 'lucide-react';
import { GeoLocation } from '../types/weather';
import { searchLocations, POPULAR_LOCATIONS, getCountryFlag } from '../services/openMeteo';

interface SearchBarProps {
  currentLocation: GeoLocation;
  onSelectLocation: (loc: GeoLocation) => void;
  onLocateUser: () => void;
  isLocating: boolean;
}

const RECENT_KEY = 'weather_app_recent_locations';

export const SearchBar: React.FC<SearchBarProps> = ({
  currentLocation,
  onSelectLocation,
  onLocateUser,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentLocations, setRecentLocations] = useState<GeoLocation[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent locations from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        setRecentLocations(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      const searchRes = await searchLocations(query);
      setResults(searchRes);
      setIsLoading(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);

    // Save to recents
    try {
      const filtered = recentLocations.filter((item) => item.id !== loc.id);
      const updated = [loc, ...filtered].slice(0, 5);
      setRecentLocations(updated);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative">
        <div className="flex items-center gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Search className="w-4 h-4" />}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search global meteorological stations (e.g., Tokyo, London, Sydney)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Current Geolocation Button */}
          <button
            onClick={onLocateUser}
            disabled={isLocating}
            title="Detect My Location"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 active:bg-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors shrink-0 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Navigation className="w-4 h-4 text-cyan-400" />
            )}
            <span className="hidden sm:inline">Use Location</span>
          </button>
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-slate-800/80">
            {/* Direct Search Results */}
            {query.trim().length >= 2 && results.length > 0 && (
              <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1.5 text-xs font-mono tracking-wider text-slate-400 uppercase">
                  Open-Meteo Geocoding Matches ({results.length})
                </div>
                {results.map((loc) => (
                  <button
                    key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{getCountryFlag(loc.country_code)}</span>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono text-slate-400 shrink-0 tabular-nums">
                      {loc.latitude > 0 ? `${loc.latitude.toFixed(2)}°N` : `${Math.abs(loc.latitude).toFixed(2)}°S`}
                      {' · '}
                      {loc.longitude > 0 ? `${loc.longitude.toFixed(2)}°E` : `${Math.abs(loc.longitude).toFixed(2)}°W`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results Fallback */}
            {query.trim().length >= 2 && !isLoading && results.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-400">
                No matching meteorological station found for &ldquo;{query}&rdquo;.
              </div>
            )}

            {/* Recent Searches */}
            {(!query || query.trim().length < 2) && recentLocations.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-mono tracking-wider text-slate-400 uppercase">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3 h-3 text-cyan-400" />
                    Recent Stations
                  </span>
                  <button
                    onClick={() => {
                      setRecentLocations([]);
                      localStorage.removeItem(RECENT_KEY);
                    }}
                    className="text-slate-400 hover:text-slate-300 normal-case font-sans hover:underline"
                  >
                    Clear
                  </button>
                </div>
                {recentLocations.map((loc) => (
                  <button
                    key={`recent-${loc.id}`}
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{getCountryFlag(loc.country_code)}</span>
                      <span className="font-medium text-slate-200">{loc.name}</span>
                      <span className="text-slate-400 truncate">· {loc.country}</span>
                    </div>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Global Hubs */}
            {(!query || query.trim().length < 2) && (
              <div className="p-2.5 bg-slate-950/60">
                <div className="px-3 py-1 text-xs font-mono tracking-wider text-slate-400 uppercase mb-2">
                  Featured Meteorological Stations
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {POPULAR_LOCATIONS.slice(0, 6).map((preset) => (
                    <button
                      key={`quick-${preset.id}`}
                      onClick={() => handleSelect(preset)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-2 truncate"
                    >
                      <span className="shrink-0">{getCountryFlag(preset.country_code)}</span>
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Station Pills Bar below search */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" /> Quick Stations:
        </span>
        {POPULAR_LOCATIONS.slice(0, 7).map((loc) => {
          const isSelected = currentLocation.name.toLowerCase() === loc.name.toLowerCase();
          return (
            <button
              key={`pill-${loc.id}`}
              onClick={() => handleSelect(loc)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-semibold shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>{getCountryFlag(loc.country_code)}</span>
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
