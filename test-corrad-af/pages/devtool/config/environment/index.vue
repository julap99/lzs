<script setup>
definePageMeta({
  title: "Environment",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal, $router } = useNuxtApp();
const env = ref({});

const { data: envData } = await useFetch("/api/devtool/config/env", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

env.value = envData.value.data;
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-code-mirror mode="javascript" v-model="env" disabled />
  </div>
</template>
