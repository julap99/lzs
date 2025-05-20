<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header> Konfigurasi Tabung</template>
      <template #body>
        <div class="space-y-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Keterangan Aktiviti</h3>
            <p class="text-gray-700">
              Menerima aduan berkaitan permohonan bantuan segera daripada pihak ketiga. Aduan ini boleh diperoleh melalui pelbagai saluran seperti telefon, lawatan, atau pemantauan.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Kaedah/Operasi</h3>
            <ol class="list-decimal list-inside space-y-2 text-gray-700">
              <li>EPOAD menerima aduan secara rasmi atau tidak rasmi daripada pihak ketiga.</li>
              <li>EPOAD menilai secara awal keperluan bantuan berdasarkan maklumat yang diterima.</li>
            </ol>
          </div>

          <div class="flex justify-end mt-6">
            <rs-button variant="primary" @click="navigateToNext">
              Seterusnya
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Konfigurasi Tabung",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Konfigurasi Tabung (EPOAD)",
    type: "current",
    path: "/BF-PTPC/PC/TD/01",
  },
]);

const navigateToNext = () => {
  navigateTo("/BF-PTPC/PC/TD/02");
};
</script>
