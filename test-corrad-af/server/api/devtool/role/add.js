export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Check if the role already exists
    const allRole = await prisma.role.findMany({
      where: {
        roleStatus: "ACTIVE",
      },
    });

    const roleExist = allRole.find((role) => {
      return role?.roleName.toLowerCase() === body?.name.toLowerCase();
    });

    if (roleExist) {
      return {
        statusCode: 400,
        message: "Role already exists",
      };
    }

    // add new role
    const role = await prisma.role.create({
      data: {
        roleName: body.name,
        roleDescription: body.description || "",
        roleStatus: "ACTIVE",
        roleCreatedDate: new Date(),
      },
    });

    if (role) {
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
                  userRoleRoleID: role.roleID,
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
          message: "Role successfully added!",
          data: {
            role,
            assignedUsers: validUserRoles.length,
            totalUsers: body.users.length,
          },
        };
      }

      return {
        statusCode: 200,
        message: "Role successfully added!",
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
