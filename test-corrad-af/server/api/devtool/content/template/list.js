import templates from "@@/templates/index.js";

export default defineEventHandler(async (event) => {
  try {
    if (!templates || templates?.data.length == 0)
      return {
        statusCode: 404,
        message: "Template data not found",
      };

    return {
      statusCode: 200,
      message: "List template data successfully fetched",
      data: templates.data,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
