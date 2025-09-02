export default defineEventHandler(async (event) => {
  // Get all users from database

  try {
    const roles = await prisma.role.findMany({
      select: {
        roleID: true,
        roleName: true,
        roleDescription: true,
        roleStatus: true,
        roleCreatedDate: true,
        roleModifiedDate: true,
      },
      where: {
        roleStatus: {
          not: "DELETED",
        },
        roleID: {
          not: 1,
        },
      },
    });

    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        let userOfRole = await prisma.userrole.findMany({
          select: {
            user: {
              select: {
                userUsername: true,
              },
            },
          },
          where: {
            userRoleRoleID: roles[i].roleID,
          },
        });

        roles[i].users = userOfRole;
      }

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
