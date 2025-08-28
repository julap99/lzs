import { spawn } from "node:child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import os from "os";

export default defineEventHandler(async (event) => {
  const tableName = event.context.params.table;

  try {
    // Drop the table
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${tableName}`);

    // Run Prisma Command to update the schema
    const isPrismaCommandRun = await runPrismaCommand();
    if (!isPrismaCommandRun) {
      return {
        statusCode: 500,
        message: "Prisma Command Failed after table deletion",
      };
    }

    return {
      statusCode: 200,
      message: `Table '${tableName}' has been successfully deleted.`,
    };
  } catch (error) {
    console.error("Error deleting table:", error);
    return {
      statusCode: 500,
      message: `Failed to delete table '${tableName}'. Error: ${error.message}`,
    };
  }
});

async function runPrismaCommand() {
  try {
    console.log("---------- Run Prisma Command ----------");

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const directory = resolve(__dirname, "../..");

    // Command to execute
    const command = "npx prisma db pull && npx prisma generate";

    // Determine the appropriate shell command based on the platform
    let shellCommand;
    let spawnOptions;
    switch (os.platform()) {
      case "win32":
        shellCommand = `Start-Process cmd -ArgumentList '/c cd "${directory}" && ${command}' -Verb RunAs`;
        spawnOptions = {
          shell: "powershell.exe",
          args: ["-Command", shellCommand],
        };
        break;
      case "darwin":
      case "linux":
        shellCommand = `cd "${directory}" && ${command}`;
        spawnOptions = {
          shell: "sh",
          args: ["-c", shellCommand],
        };
        break;
      default:
        console.error("Unsupported platform:", os.platform());
        return false;
    }

    // Spawn child process using the appropriate shell command
    const childProcess = spawn(spawnOptions.shell, spawnOptions.args, {
      stdio: "inherit",
    });

    // Listen for child process events
    return new Promise((resolve, reject) => {
      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Prisma commands executed successfully");
          resolve(true);
        } else {
          console.error(`Child process exited with code ${code}`);
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error("Error running Prisma commands:", error);
    return false;
  }
}
