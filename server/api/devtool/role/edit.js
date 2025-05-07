export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    // Edit role
    const role = await prisma.role.update({
      where: {
        roleID: body.id,
      },
      data: {
        roleName: body.name,
        roleDescription: body.description,
        roleModifiedDate: new Date(),
      },
    });

    if (role) {
      // Delete all user roles for this role
      await prisma.userrole.deleteMany({
        where: {
          userRoleRoleID: body.id,
        },
      });

      // Add User to the role if users are provided
      if (body.users && Array.isArray(body.users)) {
        const userRoles = await Promise.all(
          body.users.map(async (el) => {
            const user = await prisma.user.findFirst({
              where: {
                userUsername: el.value,
              },
            });

            if (user) {
              return prisma.userrole.create({
                data: {
                  userRoleUserID: user.userID,
                  userRoleRoleID: body.id,
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
          message: "Role successfully edited!",
          data: {
            role,
            assignedUsers: validUserRoles.length,
            totalUsers: body.users.length,
          },
        };
      }

      return {
        statusCode: 200,
        message: "Role successfully edited!",
        data: { role },
      };
    } else {
      return {
        statusCode: 500,
        message: "Something went wrong! Please contact your administrator.",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
