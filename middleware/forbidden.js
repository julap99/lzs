export default defineNuxtRouteMiddleware(async (to, from) => {
  // Throw error to page 404 not found
  throw new Error("Forbidden");
});
