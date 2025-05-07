import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);

  try {
    // Get vue code from path in query
    const filePath = path.join(process.cwd() + "/server/", query.path + ".js");
    const code = fs.readFileSync(filePath, "utf8");

    return {
      statusCode: 200,
      message: "Code successfully loaded",
      data: code,
    };
  } catch (error) {
    // console.log(error);
    return {
      statusCode: 500,
      message: "File not found",
    };
  }
});
