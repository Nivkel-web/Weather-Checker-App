import React from 'react';
import {
  RotateCcw,
  Compass,
  ArrowUp,
  ArrowDown,
  CloudRain,
  Download,
  Share2,
} from 'lucide-react';
import {
  GeoLocation,
  OpenMeteoCurrent,
  ProcessedDayForecast,
  WeatherSettings,
} from '../types/weather';
import { getWMOWeatherInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { getCountryFlag } from '../services/openMeteo';

interface CurrentWeatherCardProps {
  location: GeoLocation;
  current: OpenMeteoCurrent;
  todayForecast?: ProcessedDayForecast;
  settings: WeatherSettings;
  lastUpdated: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExport: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  current,
  todayForecast,
  settings,
  lastUpdated,
  onRefresh,
  isRefreshing,
  onExport,
}) => {
  const wmo = getWMOWeatherInfo(current.weather_code);
  const tempUnitSym = settings.temperatureUnit === 'celsius' ? '°C' : '°F';
  const windUnitSym = settings.windSpeedUnit;
  const isDay = current.is_day === 1;

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      const summary = `Weather in ${location.name}, ${location.country}: ${Math.round(
        current.temperature_2m
      )}${tempUnitSym}, ${wmo.label}. High: ${todayForecast?.maxTemp ?? '-'}${tempUnitSym}, Low: ${
        todayForecast?.minTemp ?? '-'
      }${tempUnitSym}.`;
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-6 md:p-8 backdrop-blur-sm">
      {/* Dynamic atmospheric ambient glow */}
      <div
        className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 bg-gradient-to-br ${wmo.gradientClass}`}
      />

      {/* Top Header Row of the Card */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCountryFlag(location.country_code)}</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {location.name}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
            <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>
              {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
            </span>
            {location.elevation !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span>Elev: {location.elevation}m</span>
              </>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            title="Copy weather summary"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            onClick={onExport}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            title="Export forecast JSON/CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh current meteorological reading"
          >
            <RotateCcw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Meteorological Core Display */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-6">
        {/* Left: Temperature & Icon */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 shadow-inner flex items-center justify-center">
            <WeatherIcon code={current.weather_code} isDay={isDay} className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-bold tracking-tighter text-white font-mono tabular-nums">
                {Math.round(current.temperature_2m)}
              </span>
              <span className="text-3xl font-light text-cyan-400 font-mono">{tempUnitSym}</span>
            </div>

            <div className="mt-1">
              <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <span>{wmo.label}</span>
                <span className="text-xs font-mono text-slate-400">
                  (WMO {current.weather_code})
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md mt-0.5 leading-relaxed">
                {wmo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Key Fast-Telemetry Gauges */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Apparent Temp
            </div>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {Math.round(current.apparent_temperature)}
              <span className="text-xs font-normal text-slate-400 ml-1">{tempUnitSym}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {current.apparent_temperature < current.temperature_2m
                ? 'Feels cooler (wind chill)'
                : 'Feels warmer (humidity)'}
            </div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Today&apos;s Bounds
            </div>
            <div className="flex items-center gap-2 text-sm font-mono font-semibold text-slate-200 mt-1 tabular-nums">
              <span className="flex items-center text-amber-400">
                <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                {todayForecast?.maxTemp ?? '-'}{tempUnitSym}
              </span>
              <span className="flex items-center text-cyan-400">
                <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                {todayForecast?.minTemp ?? '-'}{tempUnitSym}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Spread: {todayForecast ? (todayForecast.maxTemp - todayForecast.minTemp).toFixed(1) : '-'}°
            </div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Surface Wind
            </div>
            <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5 flex items-center gap-1.5">
              <Compass
                className="w-4 h-4 text-cyan-400 transition-transform"
                style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
              />
              <span>{Math.round(current.wind_speed_10m)}</span>
              <span className="text-xs font-normal text-slate-400">{windUnitSym}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Gusts to {Math.round(current.wind_gusts_10m)} {windUnitSym}
            </div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Precipitation
            </div>
            <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span>{current.precipitation}</span>
              <span className="text-xs font-normal text-slate-400">mm</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {todayForecast?.rainProbMax ? `${todayForecast.rainProbMax}% chance today` : 'No rainfall expected'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="relative z-10 mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Station Source: Open-Meteo REST API</span>
          <span aria-hidden="true">·</span>
          <span>{isDay ? 'Day Observation' : 'Night Observation'}</span>
        </div>
        <div className="tabular-nums">
          Observed {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
