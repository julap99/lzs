// NOTE:
// - Minimal, safe redirect middleware.
// - Only redirect the app root ("/") to the login page.
// - Avoids redirecting other routes to prevent redirect loops that can cause
//   "Maximum call stack size exceeded" during navigation or build.
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/") return navigateTo("/login");
});