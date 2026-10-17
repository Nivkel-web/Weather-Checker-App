import React, { useState, useMemo } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { ProcessedDayForecast, WeatherSettings, HourlyForecastPoint } from '../types/weather';
import { getWMOWeatherInfo } from '../utils/weatherCodes';

interface TemperatureChartProps {
  days: ProcessedDayForecast[];
  selectedDate: string;
  settings: WeatherSettings;
}

type ChartMode = 'daily_range' | 'continuous_hourly' | 'selected_day';

export const TemperatureChart: React.FC<TemperatureChartProps> = ({
  days,
  selectedDate,
  settings,
}) => {
  const [mode, setMode] = useState<ChartMode>('daily_range');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const tempUnitSym = settings.temperatureUnit === 'celsius' ? '°C' : '°F';

  // Selected day object
  const currentDay = days.find((d) => d.date === selectedDate) || days[0];

  // Continuous points across all 5 days
  const allHourlyPoints = useMemo(() => {
    return days.flatMap((day) =>
      day.hourly.map((pt) => ({
        ...pt,
        dayShort: day.dayShort,
        date: day.date,
      }))
    );
  }, [days]);

  // SVG Chart Dimensions
  const width = 800;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Render Daily Range Chart
  const renderDailyRange = () => {
    if (!days.length) return null;

    const maxTemps = days.map((d) => d.maxTemp);
    const minTemps = days.map((d) => d.minTemp);
    const allVals = [...maxTemps, ...minTemps];
    const minVal = Math.floor(Math.min(...allVals)) - 2;
    const maxVal = Math.ceil(Math.max(...allVals)) + 2;
    const range = Math.max(maxVal - minVal, 1);

    const getX = (i: number) => padding.left + (i / (days.length - 1)) * chartWidth;
    const getY = (temp: number) => padding.top + chartHeight - ((temp - minVal) / range) * chartHeight;

    const maxPoints = days.map((d, i) => ({ x: getX(i), y: getY(d.maxTemp), temp: d.maxTemp }));
    const minPoints = days.map((d, i) => ({ x: getX(i), y: getY(d.minTemp), temp: d.minTemp }));

    // Generate smooth SVG paths
    const maxPath = maxPoints.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');
    const minPath = minPoints.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');

    // Area polygon between max and min
    const areaPath = `${maxPath} L ${minPoints[minPoints.length - 1].x} ${minPoints[minPoints.length - 1].y} ${minPoints
      .slice()
      .reverse()
      .map((pt) => `L ${pt.x} ${pt.y}`)
      .join(' ')} Z`;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full select-none"
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grids and Axes */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Shaded Temp Envelope */}
        <path d={areaPath} fill="url(#tempGradientBand)" opacity="0.35" />

        {/* Max Line */}
        <path d={maxPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Min Line */}
        <path d={minPath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points & Labels */}
        {days.map((day, i) => {
          const x = getX(i);
          const yMax = getY(day.maxTemp);
          const yMin = getY(day.minTemp);
          const isHovered = hoverIndex === i;

          return (
            <g
              key={day.date}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            >
              {/* Vertical Guide Line */}
              <line
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartHeight}
                stroke={isHovered ? '#64748b' : '#1e293b'}
                strokeWidth={isHovered ? '1.5' : '1'}
                strokeDasharray={isHovered ? '3 3' : undefined}
              />

              {/* Day Label */}
              <text
                x={x}
                y={padding.top + chartHeight + 18}
                textAnchor="middle"
                className={`text-[11px] font-mono ${
                  day.date === selectedDate ? 'fill-cyan-400 font-bold' : 'fill-slate-400'
                }`}
              >
                {day.dayShort}
              </text>
              <text
                x={x}
                y={padding.top + chartHeight + 30}
                textAnchor="middle"
                className="text-[9px] font-mono fill-slate-400"
              >
                {day.date.slice(5)}
              </text>

              {/* Max Point & Value */}
              <circle
                cx={x}
                cy={yMax}
                r={isHovered ? 5.5 : 4}
                fill="#f59e0b"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={x}
                y={yMax - 10}
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-amber-400"
              >
                {day.maxTemp}°
              </text>

              {/* Min Point & Value */}
              <circle
                cx={x}
                cy={yMin}
                r={isHovered ? 5.5 : 4}
                fill="#06b6d4"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={x}
                y={yMin + 18}
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-cyan-400"
              >
                {day.minTemp}°
              </text>
            </g>
          );
        })}

        {/* Gradient Defs */}
        <defs>
          <linearGradient id="tempGradientBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Render Hourly (either continuous 5-day or selected 24-hour day)
  const renderHourly = (
    points: (HourlyForecastPoint & { dayShort?: string; date?: string })[],
    _titleSub: string
  ) => {
    if (!points.length) {
      return (
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-mono">
          Hourly forecast data unavailable for this selection.
        </div>
      );
    }

    const temps = points.map((p) => p.temp);
    const minTemp = Math.floor(Math.min(...temps)) - 2;
    const maxTemp = Math.ceil(Math.max(...temps)) + 2;
    const range = Math.max(maxTemp - minTemp, 1);

    const getX = (i: number) => padding.left + (i / (points.length - 1)) * chartWidth;
    const getY = (t: number) => padding.top + chartHeight - ((t - minTemp) / range) * chartHeight;

    const pathD = points.reduce((acc, pt, i) => (i === 0 ? `M ${getX(i)} ${getY(pt.temp)}` : `${acc} L ${getX(i)} ${getY(pt.temp)}`), '');
    const areaD = `${pathD} L ${getX(points.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

    const activePoint = hoverIndex !== null && hoverIndex < points.length ? points[hoverIndex] : null;

    return (
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            const boundedX = Math.max(padding.left, Math.min(width - padding.right, relX));
            const idx = Math.round(((boundedX - padding.left) / chartWidth) * (points.length - 1));
            setHoverIndex(idx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Baseline */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={width - padding.right}
            y2={padding.top + chartHeight}
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Area Gradient */}
          <path d={areaD} fill="url(#hourlyGradient)" opacity="0.25" />

          {/* Temp Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Day Separator Ticks for Continuous 5-day */}
          {mode === 'continuous_hourly' &&
            days.map((day, dIdx) => {
              const xPos = padding.left + (dIdx / days.length) * chartWidth;
              return (
                <g key={`sep-${day.date}`}>
                  <line
                    x1={xPos}
                    y1={padding.top}
                    x2={xPos}
                    y2={padding.top + chartHeight}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                  <text
                    x={xPos + 6}
                    y={padding.top + 14}
                    className="text-[10px] font-mono fill-slate-400 font-semibold"
                  >
                    {day.dayShort}
                  </text>
                </g>
              );
            })}

          {/* Interactive Crosshair */}
          {activePoint && hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.temp)}
                r="5"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Axis labels */}
          <text
            x={padding.left}
            y={getY(maxTemp) + 4}
            className="text-[9px] font-mono fill-slate-400"
          >
            {maxTemp}°
          </text>
          <text
            x={padding.left}
            y={getY(minTemp) - 4}
            className="text-[9px] font-mono fill-slate-400"
          >
            {minTemp}°
          </text>

          <defs>
            <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Monospace HUD Tooltip */}
        {activePoint && hoverIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none bg-slate-900/95 border border-cyan-500/40 rounded-lg p-2.5 shadow-xl text-xs font-mono text-slate-200 z-20 backdrop-blur-md"
            style={{
              left: `${Math.min(
                Math.max(10, ((hoverIndex / (points.length - 1)) * 100)),
                72
              )}%`,
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1 mb-1">
              <span className="font-bold text-cyan-400">
                {activePoint.dayShort ? `${activePoint.dayShort} ` : ''}
                {activePoint.time}
              </span>
              <span className="text-[10px] text-slate-400">
                {getWMOWeatherInfo(activePoint.weatherCode).label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] tabular-nums">
              <div>
                Temp: <strong className="text-white">{activePoint.temp}{tempUnitSym}</strong>
              </div>
              <div>
                Feels: <span className="text-slate-300">{activePoint.apparent}{tempUnitSym}</span>
              </div>
              <div>
                Rain Prob: <span className="text-blue-400">{activePoint.rainProb}%</span>
              </div>
              <div>
                Wind: <span className="text-slate-300">{activePoint.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-sm">
      {/* Header with Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Predictive Meteorological Trend Visualizer
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical thermal trajectory calculated by Open-Meteo numerical weather prediction models.
          </p>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => {
              setMode('daily_range');
              setHoverIndex(null);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              mode === 'daily_range'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5-Day High/Low Envelope
          </button>
          <button
            onClick={() => {
              setMode('continuous_hourly');
              setHoverIndex(null);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              mode === 'continuous_hourly'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Continuous (120h)
          </button>
          <button
            onClick={() => {
              setMode('selected_day');
              setHoverIndex(null);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              mode === 'selected_day'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {currentDay ? `${currentDay.dayShort} (24h)` : '24h Focus'}
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-72 w-full mt-2">
        {mode === 'daily_range' && renderDailyRange()}
        {mode === 'continuous_hourly' && renderHourly(allHourlyPoints, '120-Hour Continuous Horizon')}
        {mode === 'selected_day' && renderHourly(currentDay ? currentDay.hourly : [], `${currentDay?.dayOfWeek} 24h Horizon`)}
      </div>

      {/* Legend & Footnote */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3 mt-3">
        <div className="flex items-center gap-4">
          {mode === 'daily_range' ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Maximum Diurnal Temp (Daily Peak)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Minimum Nocturnal Temp (Night Low)</span>
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Hourly Surface Temperature (2m Ground Offset)</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Calculated via Open-Meteo High-Resolution Ensemble Models</span>
        </div>
      </div>
    </div>
  );
};
