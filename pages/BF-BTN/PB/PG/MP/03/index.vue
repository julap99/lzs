<template>
  <div>
    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kod QR Aktiviti</h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PA/KF/MP')"
          >
            <Icon name="material-symbols:arrow-back" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Session 1 QR Code -->
          <div class="flex flex-col items-center p-4 border rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Sesi 1</h3>
            <img
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `ID: ${aktivitiId}_S1\nTarikh: ${aktivitiTarikh}`
              )}`"
              alt="QR Code Sesi 1"
              class="w-48 h-48"
            />
            <p class="mt-4 text-sm text-gray-600">
              ID Aktiviti: {{ aktivitiId }}_S1
            </p>
            <p class="text-sm text-gray-600">
              Tarikh: {{ aktivitiTarikh }}
            </p>
          </div>

          <!-- Session 2 QR Code (if applicable) -->
          <div v-if="bilanganSesi === '2'" class="flex flex-col items-center p-4 border rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Sesi 2</h3>
            <img
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                `ID: ${aktivitiId}_S2\nTarikh: ${aktivitiTarikh}`
              )}`"
              alt="QR Code Sesi 2"
              class="w-48 h-48"
            />
            <p class="mt-4 text-sm text-gray-600">
              ID Aktiviti: {{ aktivitiId }}_S2
            </p>
            <p class="text-sm text-gray-600">
              Tarikh: {{ aktivitiTarikh }}
            </p>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kod QR Aktiviti",
});

const breadcrumb = ref([
  {
    title: "Utama",
    path: "/"
  },
  {
    title: "BF-PA",
    path: "/BF-PA"
  },
  {
    title: "Konfigurasi",
    path: "/BF-PA/KF"
  },
  {
    title: "Aktiviti",
    path: "/BF-PA/KF/MP"
  },
  {
    title: "Kod QR",
    path: "/BF-PA/KF/MP/03"
  }
]);

// Example data - in real implementation, this would come from the API
const aktivitiId = ref("ACT001");
const aktivitiTarikh = ref("20-03-2024");
const bilanganSesi = ref("2"); // This would come from the form data
</script> 