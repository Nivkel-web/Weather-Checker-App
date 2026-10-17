import React from 'react';
import { Calendar, Droplets, ChevronRight } from 'lucide-react';
import { ProcessedDayForecast, WeatherSettings } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { getWMOWeatherInfo } from '../utils/weatherCodes';

interface FiveDayForecastProps {
  days: ProcessedDayForecast[];
  selectedDate: string;
  onSelectDay: (date: string) => void;
  settings: WeatherSettings;
  onOpenDayDetails: (day: ProcessedDayForecast) => void;
}

export const FiveDayForecast: React.FC<FiveDayForecastProps> = ({
  days,
  selectedDate,
  onSelectDay,
  settings,
  onOpenDayDetails,
}) => {
  const tempUnitSym = settings.temperatureUnit === 'celsius' ? '°' : '°';

  // Calculate overall global min and max across all 5 days for the relative temperature bar
  const globalMax = Math.max(...days.map((d) => d.maxTemp), 30);
  const globalMin = Math.min(...days.map((d) => d.minTemp), 0);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            5-Day Temperature Predictions
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Click any day to inspect 24-hr hourly trend
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          const wmo = getWMOWeatherInfo(day.weatherCode);

          // Bar offset and width percentages
          const leftPercent = Math.max(0, Math.min(100, ((day.minTemp - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((day.maxTemp - globalMin) / tempRange) * 100));
          const barWidthPercent = Math.max(8, rightPercent - leftPercent);

          return (
            <div
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              className={`relative rounded-xl p-4 transition-all cursor-pointer border text-left flex flex-col justify-between group ${
                isSelected
                  ? 'bg-slate-800/95 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Day Name & Date */}
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold tracking-tight ${
                      day.isToday ? 'text-cyan-400' : 'text-slate-200'
                    }`}
                  >
                    {day.dayOfWeek}
                  </span>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {day.date.slice(5).replace('-', '/')}
                  </span>
                </div>

                {/* Weather Icon and Condition Label */}
                <div className="my-3 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/90 shrink-0">
                    <WeatherIcon code={day.weatherCode} className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                      {wmo.label}
                    </div>
                    <div className="text-xs font-mono text-slate-400 truncate">
                      UV {day.uvMax} · Wind {Math.round(day.maxWind)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Temperatures & Relative Temperature Spectrum Bar */}
              <div className="mt-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5 tabular-nums">
                  <span className="text-slate-400">
                    Min {day.minTemp}{tempUnitSym}
                  </span>
                  <span className="text-slate-100 font-semibold">
                    Max {day.maxTemp}{tempUnitSym}
                  </span>
                </div>

                {/* Range Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  />
                </div>

                {/* Precipitation and Details Action */}
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>{day.rainProbMax}%</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDayDetails(day);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center font-sans hover:underline"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
