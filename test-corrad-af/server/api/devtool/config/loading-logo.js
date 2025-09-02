import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  try {
    if (method === "GET") {
      // Get only the loading logo and site name for faster loading
      const settings = await prisma.site_settings.findFirst({
        select: {
          siteLoadingLogo: true,
          siteName: true,
        },
        orderBy: { settingID: "desc" },
      });

      return {
        statusCode: 200,
        message: "Success",
        data: {
          siteLoadingLogo: settings?.siteLoadingLogo || '',
          siteName: settings?.siteName || 'corradAF',
        },
      };
    }

    return {
      statusCode: 405,
      message: "Method not allowed",
    };
  } catch (error) {
    console.error("Loading logo API error:", error);
    
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
}); 