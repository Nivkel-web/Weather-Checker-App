import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudSunRain,
  Moon,
  CloudMoon,
} from 'lucide-react';
import { getWMOWeatherInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean | number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = 1,
  className = 'w-6 h-6',
  size,
}) => {
  const info = getWMOWeatherInfo(code);
  const isNight = isDay === 0 || isDay === false;

  // Handle clear or partly cloudy night
  if (isNight && code === 0) {
    return <Moon className={`${className} text-indigo-300`} size={size} />;
  }
  if (isNight && (code === 1 || code === 2)) {
    return <CloudMoon className={`${className} text-indigo-200`} size={size} />;
  }

  switch (info.iconName) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400`} size={size} />;
    case 'SunDim':
      return <SunDim className={`${className} text-amber-300`} size={size} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-amber-300`} size={size} />;
    case 'CloudSunRain':
      return <CloudSunRain className={`${className} text-sky-400`} size={size} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-400`} size={size} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-slate-300`} size={size} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-cyan-400`} size={size} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-400`} size={size} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-blue-500`} size={size} />;
    case 'CloudHail':
      return <CloudHail className={`${className} text-cyan-300`} size={size} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-slate-200`} size={size} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-indigo-100`} size={size} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-amber-400`} size={size} />;
    default:
      return <Cloud className={`${className} text-slate-400`} size={size} />;
  }
};
