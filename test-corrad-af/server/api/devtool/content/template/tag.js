import templates from "@@/templates/index.js";

export default defineEventHandler(async (event) => {
  try {
    if (!templates || templates?.tags.length == 0)
      return {
        statusCode: 404,
        message: "Template tags not found",
      };

    return {
      statusCode: 200,
      message: "List template tags successfully fetched",
      data: templates.tags,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
