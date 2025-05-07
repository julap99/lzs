import fileConfig from "./configuration.json";

export default defineEventHandler(async (event) => {
  try {
    // read configuration file if it exists and return error if it doesn't
    if (!fileConfig) {
      return {
        statusCode: 404,
        message: "Configuration file not found",
      };
    }

    // Get all tables with primary key
    const tables = await getAllTableWithPK();
    if (!tables) {
      return {
        statusCode: 500,
        message: "Please check your database connection",
      };
    }

    // Remove columnTypes [{"group": "Foreign Keys", "options": [{"label": "TABLE_NAME (COLUMN_NAME)", "value": "TABLE_NAME"}]}] from fileconfig before appending
    fileConfig.columnTypes = fileConfig.columnTypes.filter(
      (columnType) => columnType.group !== "Foreign Keys"
    );

    // Append columnTypes from fileconfig with tables
    fileConfig.columnTypes.push({
      ...tables,
    });

    return {
      statusCode: 200,
      message: "Configuration file successfully loaded",
      data: fileConfig,
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

async function getAllTableWithPK() {
  try {
    const tables = await prisma.$queryRaw` SELECT 
                                table_name,
                                column_name
                              FROM 
                                information_schema.columns
                              WHERE table_schema = DATABASE()
                              AND column_key = 'PRI'`;

    if (!tables) return false;

    // Reformat to {group: "table_name", options: [{label: "TABLE_NAME (COLUMN_NAME)", value: "TABLE_NAME"}]}
    const remapTables = tables.reduce((acc, table) => {
      const group = "Foreign Keys";
      const option = {
        label: `${table.TABLE_NAME} (${table.COLUMN_NAME})`,
        value: `[[${table.TABLE_NAME}]]`,
      };
      const existingGroup = acc.find((item) => item.group === group);

      if (existingGroup) {
        existingGroup.options.push(option);
      } else {
        acc.push({ group, options: [option] });
      }

      return acc;
    }, []);

    return remapTables[0];
  } catch (error) {
    console.log(error.message);
    return false;
  }
}
