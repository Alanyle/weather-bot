import prisma from "../database/client.ts";

export async function getUserSettings(chatId: number) {
  return await prisma.user.upsert({
    where: { chatId },
    create: {
      chatId,
      settings: {
        create: {
          showTemp: true,
          showWind: true,
          showClouds: true,
          showHumidity: true,
        },
      },
    },
    update: {},
    include: { settings: true },
  });
}

export async function updateUserSettings(
  chatId: number,
  settings: {
    showTemp?: boolean;
    showWind?: boolean;
    showClouds?: boolean;
    showHumidity?: boolean;
  },
) {
  const user = await prisma.user.findUnique({
    where: { chatId },
    include: { settings: true },
  });

  if (!user || !user.settings) {
    throw new Error("User or settings not found");
  }

  return await prisma.settings.update({
    where: { id: user.settings.id },
    data: settings,
  });
}

export async function updateUserLocation(
  chatId: number,
  location: string,
  latitude?: number,
  longitude?: number,
) {
  return await prisma.user.update({
    where: { chatId },
    data: { location, latitude, longitude },
  });
}