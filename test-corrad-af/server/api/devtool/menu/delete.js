import fs from "fs";
import path from "path";
import navigationData from "~/navigation";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Get file path
    const filePath = path.join(process.cwd() + "/pages/", body.filePath);

    // Delete path
    fs.rmSync(filePath, { recursive: true, force: true });

    // Remove menu from navigation
    removeMenuFromNavigation(body.filePath);

    return {
      statusCode: 200,
      message: "Menu successfully deleted and removed from navigation!",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});

function removeMenuFromNavigation(menuPath) {
  const removeMenuItem = (items) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].path === menuPath) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].child && items[i].child.length > 0) {
        if (removeMenuItem(items[i].child)) {
          return true;
        }
      }
    }
    return false;
  };

  navigationData.forEach((section) => {
    if (section.child) {
      removeMenuItem(section.child);
    }
  });

  // Save updated navigation data
  const navigationFilePath = path.join(process.cwd(), "navigation", "index.js");
  const navigationContent = `export default ${JSON.stringify(
    navigationData,
    null,
    2
  )};`;
  fs.writeFileSync(navigationFilePath, navigationContent, "utf8");
}
