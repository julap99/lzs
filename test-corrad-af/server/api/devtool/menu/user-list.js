export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        userID: true,
        userUsername: true,
      },
      where: {
        userStatus: {
          not: "DELETED",
        },
      },
    });

    if (users) {
      return {
        statusCode: 200,
        message: "Users successfully fetched",
        data: users,
      };
    } else {
      return {
        statusCode: 404,
        message: "No Users found",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
