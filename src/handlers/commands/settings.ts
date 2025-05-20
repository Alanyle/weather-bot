import { InlineKeyboard } from "../../../deps.ts";
import { CommandContext } from "../../types.ts";
import { getUserSettings, updateUserSettings } from "../../services/userSettingsService.ts";

export async function settingsCommand(ctx: CommandContext) {
  const settings = await getUserSettings(ctx.from.id);
  
  const keyboard = new InlineKeyboard()
    .text(
      `Temperature: ${settings.settings?.showTemp ? "✅" : "❌"}`,
      "toggle_temp",
    )
    .text(
      `Wind: ${settings.settings?.showWind ? "✅" : "❌"}`,
      "toggle_wind",
    )
    .row()
    .text(
      `Clouds: ${settings.settings?.showClouds ? "✅" : "❌"}`,
      "toggle_clouds",
    )
    .text(
      `Humidity: ${settings.settings?.showHumidity ? "✅" : "❌"}`,
      "toggle_humidity",
    );

  await ctx.reply("⚙️ *Settings*\n\nToggle what information to display:", {
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });
}

export async function handleSettingsToggle(ctx: any) {
  const action = ctx.callbackQuery.data;
  const chatId = ctx.from.id;
  
  let setting: Record<string, boolean> = {};
  
  switch (action) {
    case "toggle_temp":
      setting = { showTemp: !ctx.session.settings?.showTemp };
      break;
    case "toggle_wind":
      setting = { showWind: !ctx.session.settings?.showWind };
      break;
    case "toggle_clouds":
      setting = { showClouds: !ctx.session.settings?.showClouds };
      break;
    case "toggle_humidity":
      setting = { showHumidity: !ctx.session.settings?.showHumidity };
      break;
  }
  
  await updateUserSettings(chatId, setting);
  await settingsCommand(ctx);
  await ctx.answerCallbackQuery();
}