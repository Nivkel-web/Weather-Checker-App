import {
  GeoLocation,
  OpenMeteoForecastResponse,
  ProcessedDayForecast,
  HourlyForecastPoint,
  WeatherSettings,
} from '../types/weather';

export const POPULAR_LOCATIONS: GeoLocation[] = [
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', country_code: 'GB', admin1: 'England' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', country_code: 'US', admin1: 'New York' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', country_code: 'FR', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia', country_code: 'AU', admin1: 'New South Wales' },
  { id: 360630, name: 'Cairo', latitude: 30.0626, longitude: 31.2497, country: 'Egypt', country_code: 'EG', admin1: 'Cairo' },
  { id: 3413829, name: 'Reykjavik', latitude: 64.1355, longitude: -21.8954, country: 'Iceland', country_code: 'IS', admin1: 'Höfuðborgarsvæði' },
  { id: 3448439, name: 'São Paulo', latitude: -23.5475, longitude: -46.6361, country: 'Brazil', country_code: 'BR', admin1: 'São Paulo' },
  { id: 1880252, name: 'Singapore', latitude: 1.2897, longitude: 103.8501, country: 'Singapore', country_code: 'SG', admin1: 'Central Singapore' },
  { id: 2950159, name: 'Berlin', latitude: 52.5244, longitude: 13.4105, country: 'Germany', country_code: 'DE', admin1: 'Land Berlin' },
  { id: 6167865, name: 'Toronto', latitude: 43.7001, longitude: -79.4163, country: 'Canada', country_code: 'CA', admin1: 'Ontario' },
  { id: 292223, name: 'Dubai', latitude: 25.0772, longitude: 55.3093, country: 'United Arab Emirates', country_code: 'AE', admin1: 'Dubai' },
];

const SEARCH_CACHE = new Map<string, GeoLocation[]>();

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  if (SEARCH_CACHE.has(cacheKey)) {
    return SEARCH_CACHE.get(cacheKey)!;
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const results: GeoLocation[] = (data.results || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country_code: item.country_code,
      country: item.country,
      admin1: item.admin1,
      admin2: item.admin2,
      timezone: item.timezone,
      population: item.population,
    }));

    SEARCH_CACHE.set(cacheKey, results);
    return results;
  } catch (err) {
    console.error('Error fetching geocoding results:', err);
    return [];
  }
}

export async function fetchForecast(
  lat: number,
  lon: number,
  settings: WeatherSettings
): Promise<OpenMeteoForecastResponse> {
  const tempUnit = settings.temperatureUnit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const windUnit = settings.windSpeedUnit === 'mph' ? 'mph' : settings.windSpeedUnit === 'ms' ? 'ms' : 'kmh';

  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'uv_index',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'wind_speed_10m',
    'uv_index',
    'visibility',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
  ].join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(
    4
  )}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&forecast_days=7&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo REST API error! HTTP status: ${response.status}`);
  }
  return await response.json();
}

export function processForecastDays(data: OpenMeteoForecastResponse): ProcessedDayForecast[] {
  if (!data?.daily?.time) return [];

  const days: ProcessedDayForecast[] = [];
  const times = data.daily.time;
  const todayStr = new Date().toISOString().split('T')[0];

  // Map each hourly point by date string (YYYY-MM-DD)
  const hourlyByDate: Record<string, HourlyForecastPoint[]> = {};
  if (data.hourly?.time) {
    for (let i = 0; i < data.hourly.time.length; i++) {
      const rawIso = data.hourly.time[i];
      const datePart = rawIso.split('T')[0];
      const hourPart = parseInt(rawIso.split('T')[1].split(':')[0], 10);

      if (!hourlyByDate[datePart]) {
        hourlyByDate[datePart] = [];
      }

      hourlyByDate[datePart].push({
        time: `${hourPart}:00`,
        isoTime: rawIso,
        hour: hourPart,
        temp: Math.round(data.hourly.temperature_2m[i] * 10) / 10,
        apparent: Math.round(data.hourly.apparent_temperature[i] * 10) / 10,
        rainProb: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[i] || 0 : 0,
        rainAmount: data.hourly.precipitation ? data.hourly.precipitation[i] || 0 : 0,
        weatherCode: data.hourly.weather_code[i] ?? 0,
        windSpeed: Math.round((data.hourly.wind_speed_10m[i] || 0) * 10) / 10,
        humidity: data.hourly.relative_humidity_2m[i] || 0,
        pressure: Math.round(data.hourly.pressure_msl[i] || 1013),
        uvIndex: data.hourly.uv_index ? Math.round((data.hourly.uv_index[i] || 0) * 10) / 10 : 0,
        visibilityKm: data.hourly.visibility ? Math.round((data.hourly.visibility[i] || 10000) / 1000) : 10,
      });
    }
  }

  // Pick up to 5 consecutive days starting from today (or day index 0)
  const daysToProcess = times.slice(0, 5);

  for (let i = 0; i < daysToProcess.length; i++) {
    const dateStr = times[i];
    const dateObj = new Date(`${dateStr}T12:00:00Z`);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    const dayShort = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const isToday = i === 0 || dateStr === todayStr;

    days.push({
      date: dateStr,
      dayOfWeek: isToday ? 'Today' : dayOfWeek,
      dayShort: isToday ? 'Today' : dayShort,
      isToday,
      weatherCode: data.daily.weather_code[i] ?? 0,
      maxTemp: Math.round(data.daily.temperature_2m_max[i] * 10) / 10,
      minTemp: Math.round(data.daily.temperature_2m_min[i] * 10) / 10,
      apparentMax: Math.round((data.daily.apparent_temperature_max?.[i] ?? data.daily.temperature_2m_max[i]) * 10) / 10,
      apparentMin: Math.round((data.daily.apparent_temperature_min?.[i] ?? data.daily.temperature_2m_min[i]) * 10) / 10,
      sunrise: data.daily.sunrise[i] ? data.daily.sunrise[i].split('T')[1].slice(0, 5) : '06:00',
      sunset: data.daily.sunset[i] ? data.daily.sunset[i].split('T')[1].slice(0, 5) : '18:00',
      uvMax: data.daily.uv_index_max ? Math.round(data.daily.uv_index_max[i] * 10) / 10 : 0,
      rainSum: data.daily.precipitation_sum ? Math.round(data.daily.precipitation_sum[i] * 10) / 10 : 0,
      rainProbMax: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] || 0 : 0,
      maxWind: Math.round(data.daily.wind_speed_10m_max[i] * 10) / 10,
      hourly: hourlyByDate[dateStr] || [],
    });
  }

  return days;
}

export function formatPressure(hPa: number, unit: 'hPa' | 'inHg'): string {
  if (unit === 'inHg') {
    return (hPa * 0.02953).toFixed(2);
  }
  return Math.round(hPa).toString();
}

export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
