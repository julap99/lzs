export default defineNuxtRouteMiddleware((to, from) => {
  // Redirect to login page instead of directly to dashboard
  return navigateTo("/login");
});