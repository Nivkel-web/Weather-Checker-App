import React, { useEffect } from 'react';
import { X, Droplets, Wind, Sun, Sunrise, Sunset } from 'lucide-react';
import { ProcessedDayForecast, WeatherSettings } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { getWMOWeatherInfo, getUVLevel } from '../utils/weatherCodes';

interface DayDetailModalProps {
  day: ProcessedDayForecast | null;
  onClose: () => void;
  settings: WeatherSettings;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  settings,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!day) return null;

  const wmo = getWMOWeatherInfo(day.weatherCode);
  const uvInfo = getUVLevel(day.uvMax);
  const tempUnitSym = settings.temperatureUnit === 'celsius' ? '°C' : '°F';

  // Extract diurnal segments (Morning: 6-11, Afternoon: 12-17, Evening: 18-21, Night: 22-5)
  const morning = day.hourly.filter((h) => h.hour >= 6 && h.hour < 12);
  const afternoon = day.hourly.filter((h) => h.hour >= 12 && h.hour < 18);
  const evening = day.hourly.filter((h) => h.hour >= 18 && h.hour < 22);
  const night = day.hourly.filter((h) => h.hour >= 22 || h.hour < 6);

  const getAvgTemp = (pts: typeof day.hourly) =>
    pts.length ? Math.round(pts.reduce((acc, p) => acc + p.temp, 0) / pts.length) : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <WeatherIcon code={day.weatherCode} className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {day.dayOfWeek} Forecast Analysis
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {day.date}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{wmo.label} · {wmo.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar pr-1 py-4 space-y-5">
          {/* Daily Thermal Range & Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Peak Temp</div>
              <div className="text-xl font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                {day.maxTemp}{tempUnitSym}
              </div>
              <div className="text-[10px] text-slate-400">Feels {day.apparentMax}°</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Nocturnal Low</div>
              <div className="text-xl font-mono font-bold text-cyan-400 mt-0.5 tabular-nums">
                {day.minTemp}{tempUnitSym}
              </div>
              <div className="text-[10px] text-slate-400">Feels {day.apparentMin}°</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Rain Prob Max</div>
              <div className="text-xl font-mono font-bold text-blue-400 mt-0.5 tabular-nums">
                {day.rainProbMax}%
              </div>
              <div className="text-[10px] text-slate-400">{day.rainSum} mm total</div>
            </div>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Max Wind Gust</div>
              <div className="text-xl font-mono font-bold text-slate-200 mt-0.5 tabular-nums">
                {Math.round(day.maxWind)}
              </div>
              <div className="text-[10px] text-slate-400">{settings.windSpeedUnit} max</div>
            </div>
          </div>

          {/* Diurnal Time of Day Matrix */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">
              Diurnal Cycle Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Morning</div>
                <div className="text-xs text-slate-400 font-mono">06:00 - 12:00</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {getAvgTemp(morning)}{tempUnitSym}
                </div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Afternoon</div>
                <div className="text-xs text-slate-400 font-mono">12:00 - 18:00</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {getAvgTemp(afternoon)}{tempUnitSym}
                </div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Evening</div>
                <div className="text-xs text-slate-400 font-mono">18:00 - 22:00</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {getAvgTemp(evening)}{tempUnitSym}
                </div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-medium">Overnight</div>
                <div className="text-xs text-slate-400 font-mono">22:00 - 06:00</div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {getAvgTemp(night)}{tempUnitSym}
                </div>
              </div>
            </div>
          </div>

          {/* Ephemeris & Environmental Indices */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400">Dawn: </span>
                <span className="text-white font-bold">{day.sunrise}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-400">Dusk: </span>
                <span className="text-white font-bold">{day.sunset}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400">UV Peak: </span>
                <span className={`font-bold ${uvInfo.color}`}>
                  {day.uvMax} ({uvInfo.label})
                </span>
              </div>
            </div>
          </div>

          {/* Full Hourly Breakdown List */}
          {day.hourly.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                24-Hour Time-Series Telemetry
              </h4>
              <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                {day.hourly.map((h) => (
                  <div
                    key={h.isoTime}
                    className="px-3.5 py-2 flex items-center justify-between text-xs hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 w-12">{h.time}</span>
                      <WeatherIcon code={h.weatherCode} className="w-4 h-4" />
                      <span className="text-slate-200">
                        {getWMOWeatherInfo(h.weatherCode).label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 font-mono tabular-nums">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" /> {h.rainProb}%
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Wind className="w-3 h-3 text-slate-400" /> {Math.round(h.windSpeed)}
                      </span>
                      <span className="font-bold text-white w-10 text-right">
                        {Math.round(h.temp)}{tempUnitSym}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  );
};
