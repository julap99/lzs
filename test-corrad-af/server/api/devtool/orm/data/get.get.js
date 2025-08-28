export default defineEventHandler(async (event) => {
  try {
    const { tableName } = getQuery(event);

    if (!tableName) {
      return {
        statusCode: 400,
        message: "Table name is required",
      };
    }

    // const JSONSchemaTable = getPrismaSchemaTable(tableName);
    // console.log(JSONSchemaTable);

    const getData = await prisma.$queryRawUnsafe(`SELECT * FROM ${tableName}`);

    if (getData.length === 0) {
      return {
        statusCode: 404,
        message: "Data not found",
      };
    }

    return {
      statusCode: 200,
      message: "Data successfully fetched",
      data: getData,
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
