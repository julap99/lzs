<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  title: "Permohonan Pengeluaran Tunai",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Pengeluaran Tunai Kaunter",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Permohonan",
    type: "current",
    path: "/BF-TNI/pengeluaran-tunai-kaunter/permohonan",
  },
]);
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
