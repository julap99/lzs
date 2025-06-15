<script setup>
import { useThemeStore } from "~/stores/theme";

useHead({
  title: "New Agihan Sistem (NAS)",
  description: "Home page",
  htmlAttrs: {
    lang: "en",
  },
});

const themeStore = useThemeStore();
const nuxtApp = useNuxtApp();
const loading = ref(true);

onMounted(() => {
  // Hide loading indicator if not hydrating
  setTimeout(() => {
    loading.value = false;
  }, 1000);

  // Get theme from localStorage or use a default theme
  let theme = localStorage.getItem("theme") || "biasa";
  // Set it in the store
  themeStore.setTheme(theme);
  // Apply it to the document
  document.documentElement.setAttribute("data-theme", theme);
  // Ensure it's saved in localStorage
  localStorage.setItem("theme", theme);

  console.log("Theme applied:", theme);
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <Loading v-if="loading" />
      <NuxtPage :key="$route.fullPath" v-else />
    </NuxtLayout>
  </div>
</template>
