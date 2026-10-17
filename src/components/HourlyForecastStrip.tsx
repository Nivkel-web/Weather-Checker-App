import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import { HourlyForecastPoint, WeatherSettings } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastStripProps {
  hourlyPoints: HourlyForecastPoint[];
  settings: WeatherSettings;
  dayTitle?: string;
}

export const HourlyForecastStrip: React.FC<HourlyForecastStripProps> = ({
  hourlyPoints,
  settings,
  dayTitle = 'Hourly Meteorological Progression',
}) => {
  const currentHour = new Date().getHours();
  const tempUnitSym = settings.temperatureUnit === 'celsius' ? '°' : '°';

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-tight">{dayTitle}</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Scroll horizontally for 24-hr sequence
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-3 pt-1">
        {hourlyPoints.slice(0, 24).map((pt, idx) => {
          const isCurrent = idx === 0 || pt.hour === currentHour;
          const isNight = pt.hour < 6 || pt.hour >= 20;

          return (
            <div
              key={`hour-${pt.isoTime || idx}`}
              className={`flex flex-col items-center justify-between p-3 rounded-xl border min-w-[5.25rem] shrink-0 text-center transition-all ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Time */}
              <span
                className={`text-xs font-mono font-medium ${
                  isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {isCurrent && idx === 0 ? 'Now' : `${pt.hour.toString().padStart(2, '0')}:00`}
              </span>

              {/* Icon */}
              <div className="my-2.5">
                <WeatherIcon code={pt.weatherCode} isDay={!isNight} className="w-6 h-6" />
              </div>

              {/* Temperature */}
              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {Math.round(pt.temp)}{tempUnitSym}
              </span>

              {/* Precipitation Chance */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 w-full flex flex-col items-center gap-1 text-[11px] font-mono">
                <div
                  className={`flex items-center gap-0.5 ${
                    pt.rainProb > 25 ? 'text-blue-400 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{pt.rainProb}%</span>
                </div>
                <div className="text-slate-400 text-[10px] flex items-center gap-0.5">
                  <Wind className="w-2.5 h-2.5 text-slate-400" />
                  <span>{Math.round(pt.windSpeed)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
