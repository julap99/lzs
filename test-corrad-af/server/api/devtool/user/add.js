import sha256 from "crypto-js/sha256.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const password = sha256("abc123").toString();
  let secretKey = generateSecretKey();

  try {
    // Get user from database
    const allUser = await prisma.user.findMany({
      where: {
        userStatus: "ACTIVE",
      },
    });

    // Check if the user already exists
    const userExist = allUser.find((user) => {
      return user?.userUsername.toLowerCase() === body?.username.toLowerCase();
    });

    if (userExist)
      return {
        statusCode: 400,
        message: "Username already exists",
      };

    //  Validate secret key
    do {
      secretKey = generateSecretKey();
    } while (
      allUser.find((user) => {
        return user?.userSecretKey === secretKey;
      })
    );

    // Add New User
    const user = await prisma.user.create({
      data: {
        userSecretKey: secretKey,
        userUsername: body.username,
        userPassword: password,
        userFullName: body?.fullname || "",
        userEmail: body?.email || "",
        userPhone: body?.phone || "",
        userStatus: "ACTIVE",
        userCreatedDate: new Date(),
      },
    });

    if (user) {
      // Add user roles if provided
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
                  userRoleUserID: user.userID,
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
          message: "User successfully added!",
          data: {
            user,
            assignedRoles: validUserRoles.length,
            totalRoles: body.role.length,
          },
        };
      }

      return {
        statusCode: 200,
        message: "User successfully added!",
        data: { user },
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

function generateSecretKey() {
  //   Generate Secret Key number and alphabet. Format : xxxx-xxxx-xxxx-xxxx
  let secretKey = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      secretKey += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    if (i < 3) {
      secretKey += "-";
    }
  }

  return secretKey;
}

async function checkRoleID(roleID) {
  const role = await prisma.role.findFirst({
    where: {
      roleID: roleID,
    },
  });

  if (!role) {
    return false;
  } else {
    return true;
  }
}
