import { exec } from "node:child_process";

export default defineEventHandler(async (event) => {
  try {
    let error = false;

    // Run command yarn prisma studio
    exec("npx prisma studio", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        error = true;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

    if (error)
      return {
        statusCode: 500,
        message: "Internal Server Error",
      };

    return {
      statusCode: 200,
      message: "Prisma Studio successfully launched",
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
