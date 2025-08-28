import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const codeDefault = `
    export default defineEventHandler(async (event) => {
      
      // const query = await getQuery(event); // Get Params from URL
      // const body = await readBody(event); // Get Body Data

      return {
        statusCode: 200,
        message: "API Route Created",
      };

    });`;

    // Overwrite vue code from path in body with new code
    const filePath = path.join(process.cwd() + "/server/", body.path + ".js");

    if (body.type == "update") {
      fs.writeFileSync(filePath, body.code, "utf8");
    } else if (body.type == "add") {
      // if the folder doesn't exist, create it
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      fs.writeFileSync(filePath, codeDefault, "utf8");
    } else if (body.type == "edit") {
      // if the folder doesn't exist, create it
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      // Copy the file from the default path to the new path
      const oldPath = path.join(
        process.cwd() + "/server/",
        body.oldPath + ".js"
      );

      // Copy file
      fs.copyFileSync(oldPath, filePath);

      // Delete old file
      fs.unlinkSync(oldPath);
    } else if (body.type == "delete") {
      // Delete file from path
      fs.unlinkSync(filePath);

      return {
        statusCode: 200,
        message: "Code successfully deleted",
      };
    }

    return {
      statusCode: 200,
      message: "Code successfully saved",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
