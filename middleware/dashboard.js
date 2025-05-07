export default defineNuxtRouteMiddleware(async (to, from) => {
  // For root paths, redirect to login page
  if (to.path === '/') {
    return navigateTo("/login");
  }
  
  // Allow access to all other routes without authentication checks
  return;
});
