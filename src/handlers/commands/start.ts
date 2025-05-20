import { Keyboard } from "../../../deps.ts";
import { CommandContext } from "../../types.ts";

export async function startCommand(ctx: CommandContext) {
  const keyboard = new Keyboard()
    .text("🌤️ Weather").text("⚙️ Settings").row()
    .text("📍 Location").text("ℹ️ Help");

  await ctx.reply(
    `Welcome to Weather Bot! 🌦️\n\n` +
      `I can provide you with current weather information for any location.\n\n` +
      `Use the buttons below or commands to interact with me.`,
    { reply_markup: keyboard },
  );
}