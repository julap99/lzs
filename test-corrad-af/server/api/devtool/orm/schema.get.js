import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const { type } = getQuery(event);

    if (!type) {
      return {
        statusCode: 400,
        message: "Type is required",
      };
    }

    if (type !== "table" && type !== "field") {
      return {
        statusCode: 400,
        message: "Invalid type",
      };
    }

    let schema = null;
    if (type == "table") schema = getPrismaSchemaTable();

    return {
      statusCode: 200,
      message: "Schema successfully fetched",
      data: schema,
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
