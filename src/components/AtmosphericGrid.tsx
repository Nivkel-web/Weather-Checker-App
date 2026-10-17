import React from 'react';
import {
  Gauge,
  Droplets,
  Sun,
  Cloudy,
  Sunrise,
  Sunset,
  Activity,
  Wind,
} from 'lucide-react';
import {
  OpenMeteoCurrent,
  ProcessedDayForecast,
  WeatherSettings,
} from '../types/weather';
import {
  getUVLevel,
  getBeaufortScale,
  getWindDirectionLabel,
} from '../utils/weatherCodes';
import { formatPressure } from '../services/openMeteo';

interface AtmosphericGridProps {
  current: OpenMeteoCurrent;
  todayForecast?: ProcessedDayForecast;
  settings: WeatherSettings;
}

export const AtmosphericGrid: React.FC<AtmosphericGridProps> = ({
  current,
  todayForecast,
  settings,
}) => {
  const uvInfo = getUVLevel(current.uv_index);
  const beaufort = getBeaufortScale(current.wind_speed_10m);
  const windDirLabel = getWindDirectionLabel(current.wind_direction_10m);
  const windUnit = settings.windSpeedUnit;
  const pressureVal = formatPressure(current.pressure_msl, settings.pressureUnit);

  // Approximate dew point using Magnus formula
  const a = 17.27;
  const b = 237.7;
  const alpha =
    (a * current.temperature_2m) / (b + current.temperature_2m) +
    Math.log(Math.max(current.relative_humidity_2m, 1) / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  const dewPointDisplay = settings.temperatureUnit === 'fahrenheit' ? (dewPoint * 9) / 5 + 32 : dewPoint;
  const tempUnitSym = settings.temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Atmospheric Matrix & Precision Telemetry
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Real-time sensor arrays · Ground Station Calibration
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Humidity & Dew Point */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Relative Humidity
              </span>
              <span className="text-slate-400">Moisture</span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {current.relative_humidity_2m}
              </span>
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">% RH</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70">
            {/* Progress gauge */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%` }}
              />
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Dew Point:</span>
              <span className="text-slate-200 font-semibold tabular-nums">
                {dewPointDisplay.toFixed(1)} {tempUnitSym}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Atmospheric Pressure */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Barometric Pressure
              </span>
              <span className="text-slate-400">MSL</span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {pressureVal}
              </span>
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">
                {settings.pressureUnit}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Barometric Regime:</span>
            <span
              className={`font-semibold ${
                current.pressure_msl > 1015
                  ? 'text-emerald-400'
                  : current.pressure_msl < 1005
                  ? 'text-amber-400'
                  : 'text-slate-200'
              }`}
            >
              {current.pressure_msl > 1020
                ? 'High Pressure Ridge'
                : current.pressure_msl < 1005
                ? 'Low Depressive Trough'
                : 'Standard Atmosphere'}
            </span>
          </div>
        </div>

        {/* 3. UV Index */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Ultraviolet (UV) Index
              </span>
              <span className={`text-xs font-semibold ${uvInfo.color}`}>{uvInfo.label}</span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {current.uv_index.toFixed(1)}
              </span>
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">
                / 12 Peak
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70">
            {/* Multi-step color UV indicator bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2 relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
                style={{ width: `${Math.min(100, (current.uv_index / 11) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 truncate">
              {uvInfo.desc} · Max today: {todayForecast?.uvMax ?? current.uv_index}
            </div>
          </div>
        </div>

        {/* 4. Wind Dynamics & Direction */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" /> Surface Wind Vectors
              </span>
              <span className="text-slate-400 font-mono">
                {windDirLabel} ({current.wind_direction_10m}°)
              </span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {Math.round(current.wind_speed_10m)}
              </span>
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">{windUnit}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Beaufort Scale:</span>
            <span className="text-slate-200 font-semibold">
              Force {beaufort.scale} · {beaufort.label}
            </span>
          </div>
        </div>

        {/* 5. Cloud Cover & Visibility */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cloudy className="w-3.5 h-3.5 text-slate-400" /> Cloud Cover & Opacity
              </span>
              <span className="text-slate-400">Coverage</span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {current.cloud_cover}
              </span>
              <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">%</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Sky Classification:</span>
            <span className="text-slate-200 font-semibold">
              {current.cloud_cover < 20
                ? 'Clear Skies'
                : current.cloud_cover < 60
                ? 'Scattered Clouds'
                : current.cloud_cover < 85
                ? 'Broken Overcast'
                : 'Dense Cloud Cover'}
            </span>
          </div>
        </div>

        {/* 6. Sunrise & Sunset Solar Ephemeris */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Solar Ephemeris
              </span>
              <span className="text-slate-400">Local Time</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Sunrise</div>
                  <div className="text-sm font-mono font-bold text-white tabular-nums">
                    {todayForecast?.sunrise || '06:00'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Sunset</div>
                  <div className="text-sm font-mono font-bold text-white tabular-nums">
                    {todayForecast?.sunset || '18:00'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Solar Status:</span>
            <span className="text-cyan-300 font-semibold">
              {current.is_day === 1 ? 'Diurnal (Day)' : 'Nocturnal (Night)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
