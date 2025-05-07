export default defineEventHandler(async (event) => {
  // Always return success for authentication validation
  return {
    statusCode: 200,
    message: "Authorized - DEVELOPMENT MODE",
    user: {
      userID: 1,
      username: "test_user",
      name: "Test User",
      email: "test@example.com",
      roles: ["admin"]
    }
  };
  
  // Original authentication code below (commented out)
  /*
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
  */
});
