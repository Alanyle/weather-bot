import { CommandContext } from "../../types.ts";
import { updateUserLocation } from "../../services/userSettingsService.ts";

export async function locationCommand(ctx: CommandContext) {
  await ctx.reply(
    "Please share your location or send me the name of your city:",
    {
      reply_markup: {
        keyboard: [
          [{
            text: "📍 Share my location",
            request_location: true,
          }],
          [{ text: "Cancel" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    },
  );
}

export async function handleLocationInput(ctx: any) {
  if (ctx.message?.location) {
    const { latitude, longitude } = ctx.message.location;
    await updateUserLocation(
      ctx.from.id,
      `Lat: ${latitude}, Lon: ${longitude}`,
      latitude,
      longitude,
    );
    await ctx.reply("Location saved successfully!");
  } else if (ctx.message?.text) {
    const city = ctx.message.text;
    await updateUserLocation(ctx.from.id, city);
    await ctx.reply(`City "${city}" saved successfully!`);
  }
}