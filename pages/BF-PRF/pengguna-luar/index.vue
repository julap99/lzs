<!-- Redirect: This page simply forwards /BF-PRF/pengguna-luar to the Pengguna Luar dashboard. -->
<script setup>
import { onMounted } from "vue";

definePageMeta({
  title: "Pengguna Luar",
});

onMounted(() => {
  navigateTo('/BF-PRF/pengguna-luar/dashboard');
});
</script>

<template>
  <div />
</template> 