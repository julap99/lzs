import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  try {
    if (method === "GET") {
      // Get site settings
      let settings = await prisma.site_settings.findFirst({
        orderBy: { settingID: "desc" },
      });

      // If no settings exist, create default ones
      if (!settings) {
        settings = await prisma.site_settings.create({
          data: {
            siteName: "corradAF",
            siteDescription: "corradAF Base Project",
            themeMode: "biasa",
            showSiteNameInHeader: true,
            seoRobots: "index, follow",
            seoTwitterCard: "summary_large_image",
            settingCreatedDate: new Date(),
            settingModifiedDate: new Date(),
          },
        });
      }

      // Transform data to match new structure
      const transformedSettings = {
        siteName: settings.siteName || "corradAF",
        siteNameFontSize: settings.siteNameFontSize || 18,
        siteDescription: settings.siteDescription || "corradAF Base Project",
        siteLogo: settings.siteLogo || "",
        siteLoadingLogo: settings.siteLoadingLogo || "",
        siteFavicon: settings.siteFavicon || "",
        siteLoginLogo: settings.siteLoginLogo || "",
        showSiteNameInHeader: settings.showSiteNameInHeader !== false,
        customCSS: settings.customCSS || "",
        selectedTheme: settings.themeMode || "biasa", // Use themeMode as selectedTheme
        customThemeFile: settings.customThemeFile || "",
        currentFont: settings.currentFont || "",
        fontSource: settings.fontSource || "",
        // SEO fields
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        seoKeywords: settings.seoKeywords || "",
        seoAuthor: settings.seoAuthor || "",
        seoOgImage: settings.seoOgImage || "",
        seoTwitterCard: settings.seoTwitterCard || "summary_large_image",
        seoCanonicalUrl: settings.seoCanonicalUrl || "",
        seoRobots: settings.seoRobots || "index, follow",
        seoGoogleAnalytics: settings.seoGoogleAnalytics || "",
        seoGoogleTagManager: settings.seoGoogleTagManager || "",
        seoFacebookPixel: settings.seoFacebookPixel || ""
      };

      return {
        statusCode: 200,
        message: "Success",
        data: transformedSettings,
      };
    }

    if (method === "POST") {
      let body;
      try {
        body = await readBody(event);
      } catch (bodyError) {
        console.error("Error reading request body:", bodyError);
        return {
          statusCode: 400,
          message: "Invalid request body",
          error: bodyError.message,
        };
      }

      // Validate required fields
      if (!body || typeof body !== 'object') {
        return {
          statusCode: 400,
          message: "Request body must be a valid JSON object",
        };
      }

      // Check if settings exist
      const existingSettings = await prisma.site_settings.findFirst();

      // Prepare data for database (use themeMode instead of selectedTheme)
      // Filter out undefined values to avoid database errors
      const dbData = {};
      
      // Only add fields that are not undefined
      if (body.siteName !== undefined) dbData.siteName = body.siteName;
      if (body.siteNameFontSize !== undefined) dbData.siteNameFontSize = body.siteNameFontSize;
      if (body.siteDescription !== undefined) dbData.siteDescription = body.siteDescription;
      if (body.siteLogo !== undefined) dbData.siteLogo = body.siteLogo;
      if (body.siteLoadingLogo !== undefined) dbData.siteLoadingLogo = body.siteLoadingLogo;
      if (body.siteFavicon !== undefined) dbData.siteFavicon = body.siteFavicon;
      if (body.siteLoginLogo !== undefined) dbData.siteLoginLogo = body.siteLoginLogo;
      if (body.showSiteNameInHeader !== undefined) dbData.showSiteNameInHeader = body.showSiteNameInHeader;
      if (body.customCSS !== undefined) dbData.customCSS = body.customCSS;
      if (body.selectedTheme !== undefined) dbData.themeMode = body.selectedTheme;
      if (body.customThemeFile !== undefined) dbData.customThemeFile = body.customThemeFile;
      if (body.currentFont !== undefined) dbData.currentFont = body.currentFont;
      if (body.fontSource !== undefined) dbData.fontSource = body.fontSource;
      if (body.seoTitle !== undefined) dbData.seoTitle = body.seoTitle;
      if (body.seoDescription !== undefined) dbData.seoDescription = body.seoDescription;
      if (body.seoKeywords !== undefined) dbData.seoKeywords = body.seoKeywords;
      if (body.seoAuthor !== undefined) dbData.seoAuthor = body.seoAuthor;
      if (body.seoOgImage !== undefined) dbData.seoOgImage = body.seoOgImage;
      if (body.seoTwitterCard !== undefined) dbData.seoTwitterCard = body.seoTwitterCard;
      if (body.seoCanonicalUrl !== undefined) dbData.seoCanonicalUrl = body.seoCanonicalUrl;
      if (body.seoRobots !== undefined) dbData.seoRobots = body.seoRobots;
      if (body.seoGoogleAnalytics !== undefined) dbData.seoGoogleAnalytics = body.seoGoogleAnalytics;
      if (body.seoGoogleTagManager !== undefined) dbData.seoGoogleTagManager = body.seoGoogleTagManager;
      if (body.seoFacebookPixel !== undefined) dbData.seoFacebookPixel = body.seoFacebookPixel;
      
      dbData.settingModifiedDate = new Date();

      let settings;
      if (existingSettings) {
        // Update existing settings
        settings = await prisma.site_settings.update({
          where: { settingID: existingSettings.settingID },
          data: dbData,
        });
      } else {
        // Create new settings
        settings = await prisma.site_settings.create({
          data: {
            ...dbData,
            settingCreatedDate: new Date(),
          },
        });
      }

      // Transform response to match new structure
      const transformedSettings = {
        siteName: settings.siteName || "corradAF",
        siteNameFontSize: settings.siteNameFontSize || 18,
        siteDescription: settings.siteDescription || "corradAF Base Project",
        siteLogo: settings.siteLogo || "",
        siteLoadingLogo: settings.siteLoadingLogo || "",
        siteFavicon: settings.siteFavicon || "",
        siteLoginLogo: settings.siteLoginLogo || "",
        showSiteNameInHeader: settings.showSiteNameInHeader !== false,
        customCSS: settings.customCSS || "",
        selectedTheme: settings.themeMode || "biasa", // Use themeMode as selectedTheme
        customThemeFile: settings.customThemeFile || "",
        currentFont: settings.currentFont || "",
        fontSource: settings.fontSource || "",
        // SEO fields
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        seoKeywords: settings.seoKeywords || "",
        seoAuthor: settings.seoAuthor || "",
        seoOgImage: settings.seoOgImage || "",
        seoTwitterCard: settings.seoTwitterCard || "summary_large_image",
        seoCanonicalUrl: settings.seoCanonicalUrl || "",
        seoRobots: settings.seoRobots || "index, follow",
        seoGoogleAnalytics: settings.seoGoogleAnalytics || "",
        seoGoogleTagManager: settings.seoGoogleTagManager || "",
        seoFacebookPixel: settings.seoFacebookPixel || ""
      };

      return {
        statusCode: 200,
        message: "Settings updated successfully",
        data: transformedSettings,
      };
    }

    return {
      statusCode: 405,
      message: "Method not allowed",
    };
  } catch (error) {
    console.error("Site settings API error:", error);
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return {
        statusCode: 400,
        message: "Duplicate entry error",
        error: error.message,
      };
    }
    
    if (error.code === 'P2025') {
      return {
        statusCode: 404,
        message: "Record not found",
        error: error.message,
      };
    }
    
    if (error.code && error.code.startsWith('P')) {
      return {
        statusCode: 400,
        message: "Database error",
        error: error.message,
        code: error.code,
      };
    }

    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
}); 