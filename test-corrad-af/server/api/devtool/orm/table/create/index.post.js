import { spawn } from "node:child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import os from "os";

export default defineEventHandler(async (event) => {
  try {
    const { tableName, tableSchema, autoIncrementColumn } =
      await readBody(event);

    if (!tableName || !tableSchema) {
      return {
        statusCode: 400,
        message: "Bad Request",
      };
    }

    // Create Table
    const isTableCreated = await createTable(
      tableName,
      tableSchema,
      autoIncrementColumn
    );

    if (isTableCreated.statusCode !== 200)
      return {
        statusCode: 500,
        message: isTableCreated.message,
      };

    // Run Prisma Command
    const isPrismaCommandRun = await runPrismaCommand();
    if (!isPrismaCommandRun)
      return {
        statusCode: 500,
        message: "Prisma Command Failed",
      };

    return {
      statusCode: 200,
      message: "Table Created",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

async function createTable(tableName, tableSchema) {
  try {
    let rawSchema = ``;
    for (let i = 0; i < tableSchema.length; i++) {
      const column = tableSchema[i];

      // Sanitize rawSchema
      if (column.type.includes("[[") && column.type.includes("]]")) {
        const FKTableName = column.type.replace("[[", "").replace("]]", "");
        const primaryKey = await prisma.$queryRawUnsafe(
          "SHOW COLUMNS from " + FKTableName + " where `Key` = 'PRI'"
        );

        rawSchema += `${column.name} INT NOT NULL, FOREIGN KEY (${column.name}) REFERENCES ${FKTableName}(${primaryKey[0].Field})`;
      } else {
        rawSchema += `${column.name} 
        ${column.type}${column.length ? "(" + column.length + ")" : ""}
        ${column.defaultValue ? " DEFAULT " + column.defaultValue : ""} 
        ${column.nullable ? " NULL" : " NOT NULL "}
        ${column.primaryKey ? " PRIMARY KEY AUTO_INCREMENT" : ""}`;
      }

      if (i < tableSchema.length - 1) rawSchema += ", ";
    }

    const sqlStatement = `CREATE TABLE ${tableName} (${rawSchema})`;
    console.log(sqlStatement);

    const createTable = await prisma.$queryRawUnsafe(sqlStatement);
    if (!createTable)
      return {
        statusCode: 500,
        message: "Table Creation Failed",
      };

    return {
      statusCode: 200,
      message: "Table Created",
    };
  } catch (error) {
    console.log(error.message);

    // Get Message
    if (error.message.includes("already exists")) {
      return {
        statusCode: 500,
        message: `Table '${tableName}' already exists!`,
      };
    }

    if (error.message.includes("1064")) {
      return {
        statusCode: 500,
        message: "Please ensure the SQL syntax is correct!",
      };
    }

    return {
      statusCode: 500,
      message: "Table Creation Failed",
    };
  }
}

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
