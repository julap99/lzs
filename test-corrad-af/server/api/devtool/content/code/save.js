import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Overwrite vue code from path in body with new code
    const filePath = path.join(process.cwd() + "/pages/", body.path + ".vue");
    fs.writeFileSync(filePath, body.code, "utf8");

    return {
      statusCode: 200,
      message: "Code successfully saved",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
