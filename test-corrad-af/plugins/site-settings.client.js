export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (process.client) {
    const { loadSiteSettings } = useSiteSettings();
    
    // Load site settings on app initialization
    await loadSiteSettings();
  }
}); 