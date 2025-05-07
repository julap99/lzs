export default defineEventHandler(async (event) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        roleID: true,
        roleName: true,
      },
      where: {
        roleStatus: {
          not: "DELETED",
        },
      },
    });

    if (roles) {
      return {
        statusCode: 200,
        message: "Roles successfully fetched",
        data: roles,
      };
    } else {
      return {
        statusCode: 404,
        message: "No Roles found",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
