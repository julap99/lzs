import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method !== "POST") {
    return {
      statusCode: 405,
      message: "Method not allowed",
    };
  }

  try {
    const body = await readBody(event);
    const { themeName, themeCSS } = body;

    if (!themeName || !themeCSS) {
      return {
        statusCode: 400,
        message: "Theme name and CSS are required",
      };
    }

    // Validate theme name (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9-_]+$/.test(themeName)) {
      return {
        statusCode: 400,
        message: "Theme name can only contain letters, numbers, hyphens, and underscores",
      };
    }

    // Path to theme.css file
    const themeCSSPath = path.join(process.cwd(), 'assets', 'style', 'css', 'base', 'theme.css');

    // Check if theme.css exists
    if (!fs.existsSync(themeCSSPath)) {
      return {
        statusCode: 404,
        message: "theme.css file not found",
      };
    }

    // Read current theme.css content
    let currentContent = fs.readFileSync(themeCSSPath, 'utf8');

    // Check if theme already exists
    const themePattern = new RegExp(`html\\[data-theme="${themeName}"\\]`, 'g');
    if (themePattern.test(currentContent)) {
      return {
        statusCode: 409,
        message: `Theme "${themeName}" already exists`,
      };
    }

    // Format the new theme CSS
    const formattedThemeCSS = themeCSS.trim();
    
    // Ensure the CSS starts with the correct selector if not provided
    let finalThemeCSS;
    if (!formattedThemeCSS.includes(`html[data-theme="${themeName}"]`)) {
      finalThemeCSS = `html[data-theme="${themeName}"] {\n${formattedThemeCSS}\n}`;
    } else {
      finalThemeCSS = formattedThemeCSS;
    }

    // Add the new theme to the end of the file
    const newContent = currentContent + '\n\n' + finalThemeCSS + '\n';

    // Write the updated content back to the file
    fs.writeFileSync(themeCSSPath, newContent, 'utf8');

    return {
      statusCode: 200,
      message: "Custom theme added successfully",
      data: {
        themeName,
        success: true
      },
    };

  } catch (error) {
    console.error("Add custom theme error:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    };
  }
}); 