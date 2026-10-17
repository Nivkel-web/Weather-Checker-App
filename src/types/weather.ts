export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';
export type PressureUnit = 'hPa' | 'inHg';

export interface WeatherSettings {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
}

export interface OpenMeteoCurrentUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  precipitation: string;
  weather_code: string;
  cloud_cover: string;
  pressure_msl: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  wind_gusts_10m: string;
  uv_index?: string;
}

export interface OpenMeteoCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index: number;
}

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  wind_speed_10m: number[];
  uv_index: number[];
  visibility?: number[];
}

export interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current: OpenMeteoCurrent;
  current_units: OpenMeteoCurrentUnits;
  hourly: OpenMeteoHourly;
  hourly_units: Record<string, string>;
  daily: OpenMeteoDaily;
  daily_units: Record<string, string>;
}

export interface HourlyForecastPoint {
  time: string;
  isoTime: string;
  hour: number;
  temp: number;
  apparent: number;
  rainProb: number;
  rainAmount: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  visibilityKm: number;
}

export interface ProcessedDayForecast {
  date: string;
  dayOfWeek: string;
  dayShort: string;
  isToday: boolean;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  apparentMax: number;
  apparentMin: number;
  sunrise: string;
  sunset: string;
  uvMax: number;
  rainSum: number;
  rainProbMax: number;
  maxWind: number;
  hourly: HourlyForecastPoint[];
}

export interface WMOWeatherInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'partly_cloudy' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
  gradientClass: string;
  accentColor: string;
}
