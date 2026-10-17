import { WMOWeatherInfo } from '../types/weather';

export const WMO_CODE_TABLE: Record<number, WMOWeatherInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Cloudless atmosphere with optimal visibility and maximum solar irradiance.',
    iconName: 'Sun',
    category: 'clear',
    gradientClass: 'from-amber-500/20 via-sky-500/10 to-transparent',
    accentColor: '#f59e0b',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Scattered high-altitude cirrus or minor fair-weather cumulus clouds.',
    iconName: 'SunDim',
    category: 'clear',
    gradientClass: 'from-amber-400/20 via-sky-400/10 to-transparent',
    accentColor: '#fbbf24',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Variable cloudiness with interspersed periods of direct sunlight.',
    iconName: 'CloudSun',
    category: 'partly_cloudy',
    gradientClass: 'from-sky-500/20 via-slate-500/10 to-transparent',
    accentColor: '#38bdf8',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Continuous stratocumulus or altostratus sheet covering the celestial dome.',
    iconName: 'Cloud',
    category: 'cloudy',
    gradientClass: 'from-slate-500/20 via-slate-700/10 to-transparent',
    accentColor: '#94a3b8',
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Surface-layer temperature inversion causing micro-droplet suspension and reduced visibility.',
    iconName: 'CloudFog',
    category: 'fog',
    gradientClass: 'from-slate-400/20 via-indigo-950/20 to-transparent',
    accentColor: '#a1a1aa',
  },
  48: {
    code: 48,
    label: 'Rime Fog',
    description: 'Supercooled fog droplets freezing immediately upon contact with sub-zero surfaces.',
    iconName: 'CloudFog',
    category: 'fog',
    gradientClass: 'from-cyan-400/20 via-slate-800/20 to-transparent',
    accentColor: '#a5f3fc',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Fine uniform precipitation of minute water droplets (<0.5mm diameter).',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    gradientClass: 'from-cyan-500/20 via-blue-900/20 to-transparent',
    accentColor: '#22d3ee',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Persistent fine droplets accumulating measurable surface dampness.',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    gradientClass: 'from-cyan-600/20 via-blue-900/20 to-transparent',
    accentColor: '#06b6d4',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy drizzle with droplet coalescence and restricted visual range.',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    gradientClass: 'from-teal-600/20 via-blue-950/20 to-transparent',
    accentColor: '#14b8a6',
  },
  56: {
    code: 56,
    label: 'Freezing Drizzle (Light)',
    description: 'Supercooled drizzle droplets creating glazes of clear ice on exposed surfaces.',
    iconName: 'CloudHail',
    category: 'drizzle',
    gradientClass: 'from-cyan-300/25 via-blue-950/20 to-transparent',
    accentColor: '#67e8f9',
  },
  57: {
    code: 57,
    label: 'Freezing Drizzle (Dense)',
    description: 'Dense freezing precipitation with rapid structural rime accumulation.',
    iconName: 'CloudHail',
    category: 'drizzle',
    gradientClass: 'from-cyan-400/30 via-slate-900/30 to-transparent',
    accentColor: '#22d3ee',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Gentle frontal rainfall with low precipitation rate (<2.5mm/h).',
    iconName: 'CloudRain',
    category: 'rain',
    gradientClass: 'from-blue-500/20 via-slate-900/20 to-transparent',
    accentColor: '#60a5fa',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady synoptic rainfall with moderate accumulation rates (2.5 to 7.6mm/h).',
    iconName: 'CloudRain',
    category: 'rain',
    gradientClass: 'from-blue-600/25 via-slate-900/25 to-transparent',
    accentColor: '#3b82f6',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'High-intensity convective or atmospheric river deluge (>7.6mm/h).',
    iconName: 'CloudRainWind',
    category: 'rain',
    gradientClass: 'from-blue-700/30 via-indigo-950/30 to-transparent',
    accentColor: '#2563eb',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Liquid raindrops freezing into hazardous transparent glaze upon sub-freezing terrain.',
    iconName: 'CloudHail',
    category: 'rain',
    gradientClass: 'from-sky-300/30 via-blue-950/30 to-transparent',
    accentColor: '#38bdf8',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing precipitation causing catastrophic ice accretion on powerlines.',
    iconName: 'CloudHail',
    category: 'rain',
    gradientClass: 'from-teal-300/35 via-slate-950/40 to-transparent',
    accentColor: '#2dd4bf',
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    description: 'Dry branched stellar crystals flurrying with minimal accumulation (<1cm/h).',
    iconName: 'CloudSnow',
    category: 'snow',
    gradientClass: 'from-indigo-300/20 via-slate-900/20 to-transparent',
    accentColor: '#cbd5e1',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    description: 'Continuous crystalline snowfall accumulating steady snowpacks.',
    iconName: 'CloudSnow',
    category: 'snow',
    gradientClass: 'from-sky-200/25 via-slate-900/30 to-transparent',
    accentColor: '#e2e8f0',
  },
  75: {
    code: 75,
    label: 'Heavy Snow',
    description: 'Dense blinding snowfall severely dampening acoustic and visual ranges.',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-indigo-200/30 via-slate-900/35 to-transparent',
    accentColor: '#f8fafc',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Very small opaque white grains of ice falling from low stratus decks.',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-sky-200/20 via-slate-900/20 to-transparent',
    accentColor: '#e2e8f0',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Brief intermittent convective rain bursts with clear breaks.',
    iconName: 'CloudSunRain',
    category: 'rain',
    gradientClass: 'from-sky-500/20 via-blue-900/20 to-transparent',
    accentColor: '#38bdf8',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Sudden strong convective showers with rapid precipitation transitions.',
    iconName: 'CloudSunRain',
    category: 'rain',
    gradientClass: 'from-blue-500/25 via-blue-950/25 to-transparent',
    accentColor: '#60a5fa',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Torrential downpours from towering cumulonimbus clouds.',
    iconName: 'CloudRainWind',
    category: 'rain',
    gradientClass: 'from-blue-600/35 via-purple-950/30 to-transparent',
    accentColor: '#3b82f6',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Convective snow flurries with varying intensity and gusty wind.',
    iconName: 'CloudSnow',
    category: 'snow',
    gradientClass: 'from-slate-200/25 via-indigo-950/25 to-transparent',
    accentColor: '#e2e8f0',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Intense snow squalls with sudden whiteout conditions.',
    iconName: 'Snowflake',
    category: 'snow',
    gradientClass: 'from-cyan-100/30 via-slate-950/40 to-transparent',
    accentColor: '#ffffff',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Deep convective storm cell with energetic intra-cloud and cloud-to-ground lightning.',
    iconName: 'CloudLightning',
    category: 'storm',
    gradientClass: 'from-amber-500/25 via-purple-950/35 to-transparent',
    accentColor: '#f59e0b',
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Slight Hail',
    description: 'Severe electrical storm with updraft-suspended frozen pellets (hail <10mm).',
    iconName: 'CloudLightning',
    category: 'storm',
    gradientClass: 'from-yellow-500/30 via-indigo-950/40 to-transparent',
    accentColor: '#eab308',
  },
  99: {
    code: 99,
    label: 'Thunderstorm with Heavy Hail',
    description: 'Violent supercell storm producing damaging hailstones and microbursts.',
    iconName: 'CloudLightning',
    category: 'storm',
    gradientClass: 'from-red-500/30 via-purple-950/40 to-transparent',
    accentColor: '#ef4444',
  },
};

export function getWMOWeatherInfo(code: number): WMOWeatherInfo {
  return (
    WMO_CODE_TABLE[code] || {
      code,
      label: 'Atmospheric Variance',
      description: 'Standard meteorological tropospheric observation.',
      iconName: 'Cloud',
      category: 'cloudy',
      gradientClass: 'from-slate-500/20 via-slate-800/10 to-transparent',
      accentColor: '#94a3b8',
    }
  );
}

export function getUVLevel(uvIndex: number): { label: string; color: string; desc: string } {
  if (uvIndex < 3) return { label: 'Low', color: 'text-emerald-400', desc: 'Minimal solar hazard' };
  if (uvIndex < 6) return { label: 'Moderate', color: 'text-yellow-400', desc: 'Protection recommended' };
  if (uvIndex < 8) return { label: 'High', color: 'text-amber-500', desc: 'Sun protection essential' };
  if (uvIndex < 11) return { label: 'Very High', color: 'text-rose-500', desc: 'Take extra precautions' };
  return { label: 'Extreme', color: 'text-purple-400', desc: 'Avoid midday direct sun' };
}

export function getBeaufortScale(windKmh: number): { scale: number; label: string; effect: string } {
  if (windKmh < 2) return { scale: 0, label: 'Calm', effect: 'Smoke rises vertically' };
  if (windKmh <= 5) return { scale: 1, label: 'Light Air', effect: 'Smoke drift indicates direction' };
  if (windKmh <= 11) return { scale: 2, label: 'Light Breeze', effect: 'Wind felt on face; leaves rustle' };
  if (windKmh <= 19) return { scale: 3, label: 'Gentle Breeze', effect: 'Leaves and twigs in constant motion' };
  if (windKmh <= 28) return { scale: 4, label: 'Moderate Breeze', effect: 'Raises dust and loose paper' };
  if (windKmh <= 38) return { scale: 5, label: 'Fresh Breeze', effect: 'Small trees in leaf begin to sway' };
  if (windKmh <= 49) return { scale: 6, label: 'Strong Breeze', effect: 'Large branches in motion; whistling' };
  if (windKmh <= 61) return { scale: 7, label: 'Near Gale', effect: 'Whole trees in motion; walking resistance' };
  if (windKmh <= 74) return { scale: 8, label: 'Gale', effect: 'Breaks twigs off trees; difficult progress' };
  return { scale: 9, label: 'Strong Gale / Storm', effect: 'Slight structural damage occurs' };
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}
