<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Section 1: Ringkasan Maklumat Carian -->
    <rs-card class="mb-6">
      <template #header>Ringkasan Maklumat Carian</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nombor Pengenalan</div>
              <div class="font-bold">{{ searchSummary.idNo }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">ID Permohonan</div>
              <div class="font-bold">{{ searchSummary.appId }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh & Masa Carian</div>
              <div class="font-bold">{{ formatDate(searchSummary.searchDate) }}</div>
            </div>
          </rs-card>
        </div>
      </template>
    </rs-card>

    <!-- Section 2: Senarai Status -->
    <rs-card>
      <template #header>Senarai Status Pendaftaran Profil</template>
      <template #body>
        <rs-table
          class="mt-4"
          :data="profileStatusData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="data">
            <div class="flex justify-center">
              <rs-badge :variant="getStatusVariant(data.text)" size="sm">
                {{ data.text }}
              </rs-badge>
            </div>
          </template>
          <template v-slot:lastUpdate="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>
          <template v-slot:aksi="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="viewProfileDetail()"
            >
              Lihat Maklumat Penuh
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-4 space-x-2" v-if="canExport">
          <rs-button variant="secondary" @click="exportPDF">
            Eksport PDF
          </rs-button>
          <rs-button variant="secondary" @click="exportExcel">
            Eksport Excel
          </rs-button>
        </div>

        <!-- Empty state -->
        <div v-if="profileStatusData.length === 0" class="text-center text-gray-600 mt-6">
          Tiada pendaftaran dijumpai untuk nombor rujukan ini.
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  title: "Senarai Status Pendaftaran Profil",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Semak Status",
    type: "link",
    path: "/status-tracking",
  },
  {
    name: "Senarai Status Pendaftaran Profil",
    type: "current",
    path: "/status/profil",
  },
]);

// Summary Data
const searchSummary = ref({
  idNo: "900101145678",
  appId: "NAS-APP-2025-00123",
  searchDate: new Date(),
});

// DataTable
const profileStatusData = ref([
  {
    tarikhPendaftaran: "2025-06-01",
    jenisProfil: "Individu",
    idPermohonan: "NAS-PRF-2025-0001",
    status: "Menunggu Siasatan",
    lastUpdate: "2025-06-05 10:00",
    aksi: "NAS-PRF-2025-0001",
  },
  {
    tarikhPendaftaran: "2025-05-25",
    jenisProfil: "Organisasi",
    idPermohonan: "NAS-PRF-2025-0002",
    status: "Lulus",
    lastUpdate: "2025-06-03 14:30",
    aksi: "NAS-PRF-2025-0002",
  },
]);

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Siasatan": "warning",
    "Disemak": "primary",
    "Lulus": "success",
    "Tidak Lulus": "danger",
    "Diterima": "info",
    "Dibatalkan": "default",
  };
  return variants[status] || "default";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const viewProfileDetail = () => {
  navigateTo(`/BF-DP/Portal/profile/01`);
};

const exportPDF = () => {
  // Implement PDF export
  alert("Export PDF triggered!");
};

const exportExcel = () => {
  // Implement Excel export
  alert("Export Excel triggered!");
};

// Permission to export (can be dynamic)
const canExport = ref(true);
</script>

<style lang="scss" scoped>
// Optional styling
</style>
