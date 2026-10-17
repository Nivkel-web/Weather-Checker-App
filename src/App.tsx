/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  GeoLocation,
  OpenMeteoForecastResponse,
  ProcessedDayForecast,
  WeatherSettings,
} from './types/weather';
import {
  POPULAR_LOCATIONS,
  fetchForecast,
  processForecastDays,
} from './services/openMeteo';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { FiveDayForecast } from './components/FiveDayForecast';
import { TemperatureChart } from './components/TemperatureChart';
import { HourlyForecastStrip } from './components/HourlyForecastStrip';
import { AtmosphericGrid } from './components/AtmosphericGrid';
import { DayDetailModal } from './components/DayDetailModal';
import { GithubDocsModal } from './components/GithubDocsModal';
import {
  AlertCircle,
  CloudSun,
  BookOpen,
} from 'lucide-react';

const DEFAULT_LOCATION: GeoLocation = POPULAR_LOCATIONS[0]; // London

export default function App() {
  const [settings, setSettings] = useState<WeatherSettings>({
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    pressureUnit: 'hPa',
  });

  const [currentLocation, setCurrentLocation] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem('weather_app_current_location');
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [forecastData, setForecastData] = useState<OpenMeteoForecastResponse | null>(null);
  const [processedDays, setProcessedDays] = useState<ProcessedDayForecast[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [inspectedDay, setInspectedDay] = useState<ProcessedDayForecast | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Load weather data
  const loadWeatherData = useCallback(
    async (loc: GeoLocation, showRefreshAnimation = false) => {
      if (showRefreshAnimation) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const rawData = await fetchForecast(loc.latitude, loc.longitude, settings);
        const days = processForecastDays(rawData);

        setForecastData(rawData);
        setProcessedDays(days);
        if (days.length > 0) {
          // Keep current selectedDate if valid, otherwise pick first day
          setSelectedDate((prev) => (days.some((d) => d.date === prev) ? prev : days[0].date));
        }
        setLastUpdated(new Date());

        // Cache current location
        try {
          localStorage.setItem('weather_app_current_location', JSON.stringify(loc));
        } catch {
          // ignore
        }
      } catch (err: any) {
        console.error('Error fetching weather data:', err);
        setErrorMessage(
          err.message || 'Failed to retrieve meteorological data from Open-Meteo REST API. Please verify network connectivity.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [settings]
  );

  // Initial fetch and reload on location or unit settings change
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, settings.temperatureUnit, settings.windSpeedUnit]);

  // Handle location selection
  const handleSelectLocation = (loc: GeoLocation) => {
    setCurrentLocation(loc);
  };

  // Browser Geolocation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc: GeoLocation = {
          id: Date.now(),
          name: 'My Position',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: 'Local Coordinate',
          country_code: '',
          admin1: `${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°`,
        };
        setCurrentLocation(userLoc);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        // Fallback to London gracefully
        alert('Could not acquire GPS position. Defaulting to standard meteorological station.');
      },
      { timeout: 8000 }
    );
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<WeatherSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Export Forecast Data
  const handleExportData = () => {
    if (!forecastData || !processedDays.length) return;

    const exportPayload = {
      app: 'Weather Checker App',
      source: 'Open-Meteo REST API',
      exportedAt: new Date().toISOString(),
      station: currentLocation,
      units: settings,
      currentObservation: forecastData.current,
      fiveDayPredictions: processedDays.map((d) => ({
        date: d.date,
        dayOfWeek: d.dayOfWeek,
        weatherCode: d.weatherCode,
        maxTemp: d.maxTemp,
        minTemp: d.minTemp,
        apparentMax: d.apparentMax,
        apparentMin: d.apparentMin,
        sunrise: d.sunrise,
        sunset: d.sunset,
        uvMax: d.uvMax,
        rainProbabilityMax: d.rainProbMax,
        rainSumMm: d.rainSum,
        maxWindSpeed: d.maxWind,
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `weather_forecast_${currentLocation.name.toLowerCase().replace(/\s+/g, '_')}_${new Date()
        .toISOString()
        .slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Smooth scroll navigate to sections
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedDayObject = processedDays.find((d) => d.date === selectedDate) || processedDays[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenDocs={() => setIsDocsOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search & Location Bar */}
        <section className="w-full">
          <SearchBar
            currentLocation={currentLocation}
            onSelectLocation={handleSelectLocation}
            onLocateUser={handleLocateUser}
            isLocating={isLocating}
          />
        </section>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadWeatherData(currentLocation)}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-200 transition-colors shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Initial Loading State */}
        {isLoading && !forecastData ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
              <CloudSun className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Establishing Telemetry Link...
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Connecting to Open-Meteo REST API for {currentLocation.name}
            </p>
          </div>
        ) : forecastData ? (
          <>
            {/* Section 1: Overview & Current Meteorological State */}
            <section id="overview" className="scroll-mt-20">
              <CurrentWeatherCard
                location={currentLocation}
                current={forecastData.current}
                todayForecast={processedDays[0]}
                settings={settings}
                lastUpdated={lastUpdated}
                onRefresh={() => loadWeatherData(currentLocation, true)}
                isRefreshing={isRefreshing}
                onExport={handleExportData}
              />
            </section>

            {/* Section 2: 5-Day Temperature Predictions */}
            <section id="predictions" className="scroll-mt-20">
              <FiveDayForecast
                days={processedDays}
                selectedDate={selectedDate}
                onSelectDay={(date) => setSelectedDate(date)}
                settings={settings}
                onOpenDayDetails={(day) => setInspectedDay(day)}
              />
            </section>

            {/* Section 3: Predictive Temperature Trend Visualizer (SVG Chart) */}
            <section className="scroll-mt-20">
              <TemperatureChart
                days={processedDays}
                selectedDate={selectedDate}
                settings={settings}
              />
            </section>

            {/* Section 4: Hourly Curve Strip */}
            <section id="hourly" className="scroll-mt-20">
              <HourlyForecastStrip
                hourlyPoints={selectedDayObject ? selectedDayObject.hourly : []}
                settings={settings}
                dayTitle={`${selectedDayObject ? selectedDayObject.dayOfWeek : 'Today'} 24-Hour Forecast Sequence`}
              />
            </section>

            {/* Section 5: Atmospheric Matrix & Precision Telemetry */}
            <section id="telemetry" className="scroll-mt-20">
              <AtmosphericGrid
                current={forecastData.current}
                todayForecast={processedDays[0]}
                settings={settings}
              />
            </section>

            {/* GitHub Instructions & Quick Docs Banner */}
            <section className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Project Documentation & GitHub Installation Assets
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Inspect the complete GitHub README.md, review high-resolution desktop and mobile preview screenshots, or copy terminal commands for local execution.
                </p>
              </div>
              <button
                onClick={() => setIsDocsOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
              >
                <span>View GitHub Instructions</span>
              </button>
            </section>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Weather Checker App</span>
            <span aria-hidden="true">·</span>
            <span>Open-Meteo REST API</span>
            <span aria-hidden="true">·</span>
            <span>5-Day Temperature Predictions</span>
          </div>
          <div>
            Meteorological models licensed under CC BY 4.0
          </div>
        </div>
      </footer>

      {/* Drilldown Day Inspection Modal */}
      <DayDetailModal
        day={inspectedDay}
        onClose={() => setInspectedDay(null)}
        settings={settings}
      />

      {/* GitHub Docs & Screenshots Modal */}
      <GithubDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
