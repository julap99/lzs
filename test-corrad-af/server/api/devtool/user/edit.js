export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Update user
    const user = await prisma.user.updateMany({
      where: {
        userUsername: body.username,
      },
      data: {
        userFullName: body?.fullname || "",
        userEmail: body?.email || "",
        userPhone: body?.phone || "",
        userStatus: body.status,
        userModifiedDate: new Date(),
      },
    });

    if (user.count > 0) {
      const getUserID = await prisma.user.findFirst({
        where: {
          userUsername: body.username,
        },
      });

      if (getUserID) {
        // Delete all user roles
        await prisma.userrole.deleteMany({
          where: {
            userRoleUserID: getUserID.userID,
          },
        });

        // Add new user roles
        if (body.role && Array.isArray(body.role)) {
          const userRoles = await Promise.all(
            body.role.map(async (role) => {
              const existingRole = await prisma.role.findFirst({
                where: {
                  roleID: role.value,
                },
              });

              if (existingRole) {
                return prisma.userrole.create({
                  data: {
                    userRoleUserID: getUserID.userID,
                    userRoleRoleID: role.value,
                    userRoleCreatedDate: new Date(),
                  },
                });
              }
              return null;
            })
          );

          const validUserRoles = userRoles.filter(Boolean);

          return {
            statusCode: 200,
            message: "User updated successfully",
            data: {
              assignedRoles: validUserRoles.length,
              totalRoles: body.role.length,
            },
          };
        }

        return {
          statusCode: 200,
          message: "User updated successfully",
        };
      }
    }

    return {
      statusCode: 404,
      message: "User not found",
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
