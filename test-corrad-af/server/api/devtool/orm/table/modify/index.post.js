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

    // Get existing table structure
    const existingColumns = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${tableName}
    `;

    // Compare and modify table structure
    for (const column of tableSchema) {
      const existingColumn = existingColumns.find(
        (c) => c.COLUMN_NAME === column.name
      );

      if (existingColumn) {
        // Modify existing column
        await modifyColumn(tableName, column, existingColumn);
      } else {
        // Add new column
        await addColumn(tableName, column);
      }
    }

    // Remove columns that are not in the new schema
    for (const existingColumn of existingColumns) {
      if (!tableSchema.find((c) => c.name === existingColumn.COLUMN_NAME)) {
        await removeColumn(tableName, existingColumn.COLUMN_NAME);
      }
    }

    // Update auto-increment column if necessary
    if (autoIncrementColumn) {
      await updateAutoIncrement(tableName, autoIncrementColumn);
    }

    // Run Prisma Command to update the schema
    const isPrismaCommandRun = await runPrismaCommand();
    if (!isPrismaCommandRun) {
      return {
        statusCode: 500,
        message: "Prisma Command Failed",
      };
    }

    return {
      statusCode: 200,
      message: "Table modified successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

async function modifyColumn(tableName, newColumn, existingColumn) {
  let alterStatement = `ALTER TABLE ${tableName} MODIFY COLUMN ${newColumn.name} ${newColumn.type}`;

  if (newColumn.length) {
    alterStatement += `(${newColumn.length})`;
  }

  alterStatement += newColumn.nullable ? " NULL" : " NOT NULL";

  if (newColumn.defaultValue) {
    alterStatement += ` DEFAULT ${newColumn.defaultValue}`;
  }

  await prisma.$executeRawUnsafe(alterStatement);
}

async function addColumn(tableName, column) {
  let alterStatement = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;

  if (column.length) {
    alterStatement += `(${column.length})`;
  }

  alterStatement += column.nullable ? " NULL" : " NOT NULL";

  if (column.defaultValue) {
    alterStatement += ` DEFAULT ${column.defaultValue}`;
  }

  await prisma.$executeRawUnsafe(alterStatement);
}

async function removeColumn(tableName, columnName) {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`
  );
}

async function updateAutoIncrement(tableName, autoIncrementColumn) {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE ${tableName} MODIFY ${autoIncrementColumn} INT AUTO_INCREMENT`
  );
}

async function runPrismaCommand(retries = 3) {
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

function spawnCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}
