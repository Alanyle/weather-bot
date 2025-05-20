import { CommandContext } from "../../types.ts";
import { getWeather, saveWeatherHistory } from "../../services/weatherService.ts";
import { getUserSettings } from "../../services/userSettingsService.ts";

export async function weatherCommand(ctx: CommandContext) {
  const user = await getUserSettings(ctx.from.id);
  
  if (!user.location) {
    await ctx.reply(
      "Location not set. Please use /location command to set your location first.",
    );
    return;
  }
  
  try {
    const weather = await getWeather(user.location);
    await saveWeatherHistory(user.id, weather);
    
    const settings = user.settings!;
    let weatherInfo = `🌤️ Weather in ${weather.location}:\n\n`;
    
    if (settings.showTemp) {
      weatherInfo += `🌡️ Temperature: ${weather.temp}°C\n`;
    }
    if (settings.showWind) {
      weatherInfo += `💨 Wind speed: ${weather.windSpeed} m/s\n`;
    }
    if (settings.showClouds) {
      weatherInfo += `☁️ Clouds: ${weather.clouds}%\n`;
    }
    if (settings.showHumidity) {
      weatherInfo += `💧 Humidity: ${weather.humidity}%\n`;
    }
    
    weatherInfo += `\n${weather.description}`;
    
    await ctx.reply(weatherInfo);
  } catch (error) {
    await ctx.reply(
      `Failed to get weather data. Please check your location or try again later.\nError: ${error.message}`,
    );
  }
}