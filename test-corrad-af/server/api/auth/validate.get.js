export default defineEventHandler(async (event) => {
  try {
    const { userID } = event.context.user;

    if (userID == null) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }

    const validatedUser = await prisma.user.findFirst({
      where: {
        userID: parseInt(userID),
      },
    });
    if (!validatedUser) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }

    return {
      statusCode: 200,
      message: "Authorized",
    };
  } catch (error) {
    return {
      statusCode: 401,
      message: "Unauthorized",
    };
  }
});
