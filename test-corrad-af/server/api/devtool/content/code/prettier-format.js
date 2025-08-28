import prettier from "prettier";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (body.code === undefined) {
      return {
        statusCode: 400,
        message: "Bad Request",
      };
    }

    const code = prettier.format(body.code, { semi: false, parser: "vue" });

    return {
      statusCode: 200,
      message: "Code successfully formatted",
      data: code,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
});
