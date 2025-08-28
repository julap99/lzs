export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Delete user
    const user = await prisma.role.updateMany({
      where: {
        roleID: body.id,
      },
      data: {
        roleStatus: "DELETED",
        roleModifiedDate: new Date(),
      },
    });

    if (user) {
      return {
        statusCode: 200,
        message: "User deleted successfully",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message,
    };
  }
});
