import { json } from "@remix-run/node";
import { prisma } from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    return json({ error: "Shop parameter required" }, { status: 400 });
  }

  try {
    const settingsRecord = await prisma.cartDrawerSettings.findUnique({
      where: { shop },
    });

    if (!settingsRecord) {
      return json({ settings: null });
    }

    const settings = JSON.parse(settingsRecord.settings);
    return json({ settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return json({ error: "Failed to fetch settings" }, { status: 500 });
  }
};
