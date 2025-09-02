<script setup>
const { siteSettings, loadSiteSettings } = useSiteSettings();

// Use site settings for global meta
useHead({
  title: () => siteSettings?.value?.siteName || 'corradAF',
  meta: [
    { name: 'description', content: () => siteSettings?.value?.siteDescription || 'corradAF Base Project' },
    { property: 'og:title', content: () => siteSettings?.value?.siteName || 'corradAF' },
    { property: 'og:description', content: () => siteSettings?.value?.siteDescription || 'corradAF Base Project' },
    { name: 'twitter:title', content: () => siteSettings?.value?.siteName || 'corradAF' },
    { name: 'twitter:description', content: () => siteSettings?.value?.siteDescription || 'corradAF Base Project' },
  ],
  link: [
    { rel: 'icon', href: () => siteSettings?.value?.siteFavicon || '/favicon.ico' },
    { rel: 'apple-touch-icon', href: () => siteSettings?.value?.siteFavicon || '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: "en",
  },
});

const nuxtApp = useNuxtApp();
const loading = ref(true);

onMounted(async () => {
  // Load site settings first
  await loadSiteSettings();
  
  // Hide loading indicator if not hydrating
  setTimeout(() => {
    loading.value = false;
  }, 1000);

  // Get theme from localStorage or site settings
  let theme = localStorage.getItem("theme") || siteSettings?.value?.selectedTheme || "biasa";
  document.documentElement.setAttribute("data-theme", theme);
});
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <Loading v-if="loading" />
      <NuxtPage :key="$route.fullPath" v-else />
    </NuxtLayout>
  </div>
</template>
