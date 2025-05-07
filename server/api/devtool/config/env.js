import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  // Get .env file, parse and return
  const envFile = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envFile)) {
    return {
      statusCode: 404,
      message: "File not found",
    };
  }

  const env = fs.readFileSync(envFile, "utf-8");

  return {
    statusCode: 200,
    message: "Success",
    data: env,
  };
});
