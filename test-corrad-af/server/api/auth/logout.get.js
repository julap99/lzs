export default defineEventHandler(async (event) => {
  try {
    event.res.setHeader("Set-Cookie", [
      `accessToken=; HttpOnly; Secure; SameSite=Lax; Path=/`,
      `refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/`,
    ]);

    return {
      statusCode: 200,
      message: "Logout success",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      message: "Server error",
    };
  }
});
