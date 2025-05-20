import { config } from "./deps.ts";
import { createBot } from "./src/bot.ts";

// Load environment variables
await config({ export: true });

// Create and start the bot
const bot = createBot();

bot.catch((err) => {
  console.error("Bot error:", err);
});

console.log("Bot is running...");
await bot.start();