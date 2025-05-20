import { config } from "../../deps.ts";
import prisma from "../database/client.ts";

const OPENWEATHER_API_KEY = config().OPENWEATHER_API_KEY;

interface WeatherData {
  temp: number;
  windSpeed: number;
  clouds: number;
  humidity: number;
  description: string;
  location: string;
}

export async function getWeather(location: string): Promise<WeatherData> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    temp: data.main.temp,
    windSpeed: data.wind.speed,
    clouds: data.clouds.all,
    humidity: data.main.humidity,
    description: data.weather[0].description,
    location: data.name,
  };
}

export async function saveWeatherHistory(
  userId: number,
  weatherData: WeatherData,
) {
  await prisma.weatherHistory.create({
    data: {
      userId,
      location: weatherData.location,
      temp: weatherData.temp,
      windSpeed: weatherData.windSpeed,
      clouds: weatherData.clouds,
      humidity: weatherData.humidity,
      description: weatherData.description,
    },
  });
}

export async function getWeatherHistory(userId: number) {
  return await prisma.weatherHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}