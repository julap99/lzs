import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Normalize paths
  const oldPath = body.filePath.endsWith("/")
    ? body.filePath
    : body.filePath + "/";
  const newPath = body.formData.path.endsWith("/")
    ? body.formData.path
    : body.formData.path + "/";

  // Get file paths
  const oldFilePath = path.join(process.cwd(), "pages", oldPath, "index.vue");
  const newFilePath = path.join(process.cwd(), "pages", newPath, "index.vue");

  try {
    // Create template content
    const templateContent = buildNuxtTemplate({
      title: body.formData.title || body.formData.name,
      name: body.formData.name,
    });

    if (oldPath !== newPath) {
      // Create the new folder if it doesn't exist
      fs.mkdirSync(path.dirname(newFilePath), { recursive: true });

      // Write the new file
      fs.writeFileSync(newFilePath, templateContent);

      // Delete the old file
      fs.unlinkSync(oldFilePath);

      // Remove empty directories
      let dirToCheck = path.dirname(oldFilePath);
      while (dirToCheck !== path.join(process.cwd(), "pages")) {
        if (fs.readdirSync(dirToCheck).length === 0) {
          fs.rmdirSync(dirToCheck);
          dirToCheck = path.dirname(dirToCheck);
        } else {
          break;
        }
      }
    } else {
      // Update existing file
      fs.writeFileSync(oldFilePath, templateContent);
    }

    return {
      statusCode: 200,
      message:
        oldPath !== newPath
          ? "Menu successfully moved and updated"
          : "Menu successfully updated",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
