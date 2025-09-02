export default defineNuxtRouteMiddleware(async (to, from) => {
  // Validate every request to every page
  const { data: validateUser } = await useFetch("/api/auth/validate", {
    method: "GET",
  });

  // If user is not logged in, redirect to logout page
  if (validateUser.value.statusCode === 401) return true;

  return navigateTo("/dashboard");
});
