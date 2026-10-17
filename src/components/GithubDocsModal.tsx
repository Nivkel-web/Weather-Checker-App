import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Copy,
  Check,
  Terminal,
  Code,
  Image as ImageIcon,
} from 'lucide-react';

interface GithubDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubDocsModal: React.FC<GithubDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'readme' | 'screenshots' | 'installation' | 'api'>('readme');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const installCode = `# 1. Clone repository
git clone https://github.com/your-username/weather-checker-app.git

# 2. Enter project directory
cd weather-checker-app

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                GitHub Project Documentation & Instructions
              </h2>
              <p className="text-xs text-slate-400">
                Weather Checker App · Open-Meteo REST API · TypeScript & React
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-800 bg-slate-900/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'readme'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            README.md Preview
          </button>
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'screenshots'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>UI Screenshots Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('installation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'installation'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Installation & Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Open-Meteo REST API</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* TAB 1: README Preview */}
          {activeTab === 'readme' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400">README.md · Raw Markdown Preview</span>
                <button
                  onClick={() => handleCopy(document.getElementById('readme-content')?.innerText || '', 'readme')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                >
                  {copiedSection === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'readme' ? 'Copied' : 'Copy README'}</span>
                </button>
              </div>

              <div id="readme-content" className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    🌤️ Weather Checker App
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Global meteorological forecast application querying the <strong>Open-Meteo REST API</strong> with 5-day temperature predictions, high-resolution continuous hourly curves, and atmospheric telemetry.
                  </p>
                </div>

                <h3 className="text-base font-bold text-white mt-4">✨ Key Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                  <li><strong>Live Open-Meteo REST API Integration:</strong> Direct queries to Open-Meteo Forecast & Geocoding endpoints with zero API keys required.</li>
                  <li><strong>5-Day Temperature Predictions:</strong> Daily high/low bounds, diurnal temperature ranges, precipitation probability, and wind envelopes.</li>
                  <li><strong>Interactive SVG Trend Visualizer:</strong> High-precision vector chart supporting 5-day thermal envelopes and 120-hour continuous trace with hover crosshairs.</li>
                  <li><strong>WMO Weather Code Translation:</strong> Full World Meteorological Organization code translation with tailored atmospheric descriptions.</li>
                  <li><strong>Global Meteorological Station Search:</strong> Instant debounced autocomplete search with country flag identifiers and coordinates.</li>
                  <li><strong>Browser Geolocation:</strong> One-tap device geolocation lookup.</li>
                  <li><strong>Atmospheric Telemetry Matrix:</strong> Barometric pressure, relative humidity, dew point, UV index rating, Beaufort wind scale, and solar ephemeris.</li>
                  <li><strong>Unit Customization:</strong> Instant toggling between Celsius (°C) and Fahrenheit (°F), plus metric/imperial wind and pressure units.</li>
                  <li><strong>Data Export:</strong> 1-click export of forecast data in JSON and CSV formats.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Screenshots Gallery */}
          {activeTab === 'screenshots' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Generated UI Screenshots for GitHub Repository
                </h3>
                <p className="text-xs text-slate-400">
                  High-resolution preview assets demonstrating desktop and mobile interfaces to accompany README.md.
                </p>
              </div>

              <div className="space-y-6">
                {/* Desktop Screenshot */}
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Desktop Preview (16:9 Landscape)</span>
                    <span>1920 × 1080</span>
                  </div>
                  <div className="p-3">
                    <img
                      src="/src/assets/images/weather_app_desktop_preview_1792243654424.jpg"
                      alt="Weather Checker App Desktop Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto rounded-lg shadow-md border border-slate-800"
                    />
                  </div>
                </div>

                {/* Mobile Screenshot */}
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Mobile Interface Preview (9:16 Portrait)</span>
                    <span>1080 × 1920</span>
                  </div>
                  <div className="p-3 flex justify-center">
                    <div className="max-w-xs">
                      <img
                        src="/src/assets/images/weather_app_mobile_preview_1792243654605.jpg"
                        alt="Weather Checker App Mobile Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto rounded-lg shadow-md border border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Installation & Setup */}
          {activeTab === 'installation' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Installation & Local Execution Steps
                </h3>
                <p className="text-xs text-slate-400">
                  Follow these step-by-step commands to clone, install, and run the Weather Checker App locally.
                </p>
              </div>

              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-300">
                <button
                  onClick={() => handleCopy(installCode, 'install-code')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                >
                  {copiedSection === 'install-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'install-code' ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="overflow-x-auto">{installCode}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Prerequisites</div>
                  <div className="text-white font-bold mt-1">Node.js $\ge$ 18.0</div>
                  <div className="text-slate-400 mt-0.5">npm or pnpm / yarn</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Dev Server Port</div>
                  <div className="text-white font-bold mt-1">http://localhost:3000</div>
                  <div className="text-slate-400 mt-0.5">Vite High-Speed HMR</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400">API Key Requirement</div>
                  <div className="text-emerald-400 font-bold mt-1">None (Free Open API)</div>
                  <div className="text-slate-400 mt-0.5">Open-Meteo Public Tier</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Open-Meteo API Reference */}
          {activeTab === 'api' && (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 font-sans">
                  Open-Meteo REST API Architecture
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  The application communicates with two primary Open-Meteo endpoints using standard HTTP GET requests:
                </p>
              </div>

              {/* Endpoint 1 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">1. Forecast Endpoint</span>
                  <span className="text-[11px] text-slate-400">GET api.open-meteo.com/v1/forecast</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-300 break-all text-[11px]">
                  https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&forecast_days=7&timezone=auto
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">2. Geocoding Search Endpoint</span>
                  <span className="text-[11px] text-slate-400">GET geocoding-api.open-meteo.com/v1/search</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-300 break-all text-[11px]">
                  https://geocoding-api.open-meteo.com/v1/search?name=London&count=10&language=en&format=json
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Full README.md saved in workspace root
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-900 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
