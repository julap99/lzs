<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kiraan Jumlah Elaun Mengikut Penolong Amil</h2>
        </div>
      </template>

      <template #body>
        <div class="text-center py-8">
          <Icon
            name="material-symbols:info-outline"
            class="text-blue-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Sila pilih aktiviti dari senarai untuk melihat kiraan elaun
          </p>
          <p class="text-gray-600 mb-6">
            Tiada aktiviti dipilih untuk dikirakan elaun
          </p>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PE/MP/01')"
          >
            Kembali ke Senarai Aktiviti
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

definePageMeta({
  title: "Kiraan Jumlah Elaun Mengikut Penolong Amil",
  description: "Semak dan kira elaun penolong amil berdasarkan kehadiran aktiviti",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Penolong Amil",
    type: "link",
    path: "/BF-PA/PE/MP/01",
  },
  {
    name: "Mesyuarat/Program",
    type: "link",
    path: "/BF-PA/PE/MP/01",
  },
  {
    name: "Kira Jumlah Elaun",
    type: "current",
    path: "/BF-PA/PE/MP/02",
  },
]);

onMounted(() => {
  // Redirect to activity selection if accessed directly
  navigateTo("/BF-PA/PE/MP/01");
});
</script>
