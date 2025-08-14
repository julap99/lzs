import templates from "@@/templates/index.js";

export default defineEventHandler(async (event) => {
  try {
    const query = await getQuery(event);
    const id = query.id;

    if (!templates || templates?.data.length == 0)
      return {
        statusCode: 404,
        message: "Template data not found",
      };

    //   Search template by id
    const template = templates.data.find((item) => item.id == id);

    return {
      statusCode: 200,
      message: "Template data successfully fetched",
      data: template,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error",
    };
  }
});
