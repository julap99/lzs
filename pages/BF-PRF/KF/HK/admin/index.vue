<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Konfigurasi Had Kifayah</h2>
          <rs-button variant="primary" @click="navigateTo('admin/tambah')">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-gray-100 rounded">
          <p>Jumlah Konfigurasi: {{ kifayahLimits.length }}</p>
          <p>Kelulusan Menunggu: {{ pendingApprovalCount }}</p>
        </div>

        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:kategori="data">{{ data.text }}</template>
          <template v-slot:jenisIsiRumah="data">{{ data.text }}</template>
          <template v-slot:kadarBerbayar="data"> RM {{ formatCurrency(data.text) }} </template>
          <template v-slot:kadarPercuma="data"> RM {{ formatCurrency(data.text) }} </template>
          <template v-slot:tarikhMulaBerkuatkuasa="data">{{ formatDate(data.text) }}</template>

          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`admin/${data.text}`)"
              >Lebih
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Had Kifayah",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "current",
    path: "/BF-PRF/KF/HK/admin",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([
  // Section A: Kadar Had Kifayah Utama
  {
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 1,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Dewasa Bekerja",
    kadarBerbayar: 412.00,
    kadarPercuma: 412.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Menunggu Kelulusan",
    tindakan: 2,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Dewasa Tidak Bekerja",
    kadarBerbayar: 167.00,
    kadarPercuma: 167.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 3,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Tanggungan IPT",
    kadarBerbayar: 613.00,
    kadarPercuma: 613.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Tidak Aktif",
    tindakan: 4,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Tanggungan 7-17 Tahun",
    kadarBerbayar: 408.00,
    kadarPercuma: 408.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 5,
  },
  {
    kategori: "Utama",
    jenisIsiRumah: "Tanggungan 6 Tahun ke Bawah",
    kadarBerbayar: 175.00,
    kadarPercuma: 175.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Menunggu Kelulusan",
    tindakan: 6,
  },
  // Section B: Kadar Had Kifayah Tambahan
  {
    kategori: "Tambahan",
    jenisIsiRumah: "OKU",
    kadarBerbayar: 247.00,
    kadarPercuma: 247.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 7,
  },
  {
    kategori: "Tambahan",
    jenisIsiRumah: "Pesakit Kronik",
    kadarBerbayar: 243.00,
    kadarPercuma: 243.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Aktif",
    tindakan: 8,
  },
  {
    kategori: "Tambahan",
    jenisIsiRumah: "Penjagaan Anak < 12 Tahun",
    kadarBerbayar: 330.00,
    kadarPercuma: 330.00,
    tarikhMulaBerkuatkuasa: "2025-01-01",
    status: "Tidak Aktif",
    tindakan: 9,
  },
]);

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  ).length;
});

// Make sure the table refreshes when component mounts
onMounted(() => {
  refreshTable();
});

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
    console.log("Table refreshed, records:", kifayahLimits.value.length);
    console.log("Pending approval:", pendingApprovalCount.value);
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toFixed(2);
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};
</script>
