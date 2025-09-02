export default defineEventHandler(async (event) => {
  // Get all users from database except userStatus = DELETED

  try {
    const users = await prisma.user.findMany({
      select: {
        userID: true,
        userUsername: true,
        userFullName: true,
        userEmail: true,
        userPhone: true,
        userStatus: true,
        userCreatedDate: true,
        userModifiedDate: true,
      },
      where: {
        userStatus: {
          not: "DELETED",
        },
      },
    });

    if (users) {
      // Get all roles for each user
      for (let i = 0; i < users.length; i++) {
        let roleOfUser = await prisma.userrole.findMany({
          select: {
            role: {
              select: {
                roleID: true,
                roleName: true,
              },
            },
          },
          where: {
            userRoleUserID: users[i].userID,
          },
        });

        users[i].roles = roleOfUser;
      }

      return {
        statusCode: 200,
        message: "Users successfully fetched",
        data: users,
      };
    } else {
      return {
        statusCode: 404,
        message: "No users found",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
