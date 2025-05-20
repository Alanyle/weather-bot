import { Bot, session, Keyboard } from "../../deps.ts";
import { MyContext } from "../types.ts";
import { startCommand } from "./handlers/commands/start.ts";
import { helpCommand } from "./handlers/commands/help.ts";
import { locationCommand, handleLocationInput } from "./handlers/commands/location.ts";
import { settingsCommand, handleSettingsToggle } from "./handlers/commands/settings.ts";
import { weatherCommand } from "./handlers/commands/weather.ts";

interface SessionData {
  settings?: {
    showTemp: boolean;
    showWind: boolean;
    showClouds: boolean;
    showHumidity: boolean;
  };
}

export type MyContext = Context & {
  session?: SessionData;
};

function initialSession(): SessionData {
  return {
    settings: {
      showTemp: true,
      showWind: true,
      showClouds: true,
      showHumidity: true,
    },
  };
}

export function createBot() {
  const bot = new Bot<MyContext>(Deno.env.get("TELEGRAM_BOT_TOKEN")!);
  
  bot.use(session({ initial: initialSession }));
  
  // Commands
  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("location", locationCommand);
  bot.command("settings", settingsCommand);
  bot.command("weather", weatherCommand);
  
  // Text handlers
  bot.on("message:text", async (ctx) => {
    if (ctx.message.text === "🌤️ Weather") {
      await weatherCommand(ctx);
    } else if (ctx.message.text === "⚙️ Settings") {
      await settingsCommand(ctx);
    } else if (ctx.message.text === "📍 Location") {
      await locationCommand(ctx);
    } else if (ctx.message.text === "ℹ️ Help") {
      await helpCommand(ctx);
    } else if (ctx.message.text !== "Cancel") {
      await handleLocationInput(ctx);
    }
  });
  
  // Location handler
  bot.on("message:location", handleLocationInput);
  
  // Callback queries (for settings toggles)
  bot.callbackQuery(/toggle_/, handleSettingsToggle);
  
  return bot;
}