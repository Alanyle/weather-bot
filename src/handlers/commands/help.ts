import { CommandContext } from "../../types.ts";

export async function helpCommand(ctx: CommandContext) {
  await ctx.reply(
    `ℹ️ *Help*\n\n` +
      `This bot provides weather information for your location.\n\n` +
      `*Available commands:*\n` +
      `/start - Show welcome message\n` +
      `/help - Show this help message\n` +
      `/settings - Configure weather display options\n` +
      `/location - Set your location\n` +
      `/weather - Get current weather\n` +
      `/history - View weather history\n\n` +
      `You can also use the buttons in the menu to interact with the bot.`,
    { parse_mode: "Markdown" },
  );
}