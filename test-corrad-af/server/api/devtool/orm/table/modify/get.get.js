export default defineEventHandler(async (event) => {
  try {
    const { tableName } = getQuery(event);

    if (!tableName) {
      return {
        statusCode: 400,
        message: "Table name is required",
      };
    }

    const result = await prisma.$queryRaw`SELECT DATABASE() AS db_name`;
    // console.log(result[0].db_name);

    if (result.length === 0) {
      return {
        statusCode: 500,
        message: "Please check your database connection",
      };
    }

    let sqlRaw = `  SELECT 
                        c.COLUMN_NAME, 
                        c.DATA_TYPE, 
                        c.CHARACTER_MAXIMUM_LENGTH, 
                        c.COLUMN_DEFAULT, 
                        c.IS_NULLABLE, 
                        c.COLUMN_KEY,
                        kcu.REFERENCED_TABLE_NAME,
                        kcu.REFERENCED_COLUMN_NAME
                    FROM 
                        INFORMATION_SCHEMA.COLUMNS c
                    LEFT JOIN 
                        INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON 
                        c.TABLE_SCHEMA = kcu.TABLE_SCHEMA AND 
                        c.TABLE_NAME = kcu.TABLE_NAME AND 
                        c.COLUMN_NAME = kcu.COLUMN_NAME
                    WHERE 
                        c.TABLE_SCHEMA = '${result[0].db_name}' AND 
                        c.TABLE_NAME = '${tableName}';`;

    // console.log(sqlRaw);

    const getTableDetails = await prisma.$queryRawUnsafe(sqlRaw);
    // console.log(getTableDetails);

    /*
        [{
          "actions": "",
          "defaultValue": "",
          "length": "",
          "name": "PID",
          "nullable": "",
          "primaryKey": true,
          "type": "INT"
        },
        {
          "actions": "",
          "defaultValue": "",
          "length": "",
          "name": "Pproduct",
          "nullable": true,
          "primaryKey": "",
          "type": "VARCHAR"
        },
        {
          "actions": "",
          "defaultValue": "",
          "length": "",
          "name": "userID",
          "nullable": "",
          "primaryKey": "",
          "type": "[[user]]"
        }]
    */

    let tableDetailsData = [];

    // Loop through the result and convert bigInt to number
    for (let i = 0; i < getTableDetails.length; i++) {
      const table = getTableDetails[i];

      tableDetailsData.push({
        name: table.COLUMN_NAME,
        type: table.REFERENCED_TABLE_NAME
          ? `[[${table.REFERENCED_TABLE_NAME}]]`
          : table.DATA_TYPE.toUpperCase(),
        length: bigIntToNumber(table.CHARACTER_MAXIMUM_LENGTH),
        defaultValue: table.COLUMN_DEFAULT,
        nullable: table.IS_NULLABLE === "YES",
        primaryKey: table.COLUMN_KEY === "PRI",
        actions: {},
      });
    }

    return {
      statusCode: 200,
      message: "Success",
      data: tableDetailsData,
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});

function bigIntToNumber(bigInt) {
  if (bigInt === null) return null;
  return Number(bigInt.toString());
}
