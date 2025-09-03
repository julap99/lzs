<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Had Kifayah Utama</h2>
          <rs-button variant="primary" @click="navigateTo('01_01/tambah')">
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

        <!-- Updated Table Section with 8 columns -->
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
          <template v-slot:idHadKifayah="data">{{ data.text }}</template>
          <template v-slot:namaHadKifayah="data">{{ data.text }}</template>
          <template v-slot:kategori="data">{{ data.text }}</template>
          <template v-slot:jenisIsiRumah="data">{{ data.text }}</template>
          <template v-slot:kadarBerbayar="data">RM {{ formatCurrency(data.text) }}</template>
          <template v-slot:kadarPercuma="data">RM {{ formatCurrency(data.text) }}</template>
          <template v-slot:tarikhMula="data">{{ formatDate(data.text) }}</template>
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
              @click="navigateTo('01_02')"
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
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

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
const kifayahLimits = ref([]);

// Default data (fallback if no data in localStorage)
const defaultData = [
  // Section A: Kadar Had Kifayah Utama
  {
    idHadKifayah: "HK001",
    namaHadKifayah: "Ketua Keluarga",
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMula: "2025-01-01",
    status: "Aktif",
    tindakan: 1,
  },
];

// Function to load data from localStorage
const loadData = () => {
  try {
    const savedData = localStorage.getItem('kifayahLimits');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Merge with default data, giving priority to saved data
      const mergedData = [...defaultData];
      parsedData.forEach(savedItem => {
        // Check if item already exists in default data
        const existingIndex = mergedData.findIndex(item => item.idHadKifayah === savedItem.idHadKifayah);
        if (existingIndex >= 0) {
          // Replace existing item
          mergedData[existingIndex] = savedItem;
        } else {
          // Add new item
          mergedData.push(savedItem);
        }
      });
      kifayahLimits.value = mergedData;
    } else {
      kifayahLimits.value = defaultData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    kifayahLimits.value = defaultData;
  }
};

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  ).length;
});

// Make sure the table refreshes when component mounts
onMounted(() => {
  loadData();
  refreshTable();
});

// Also refresh when the page becomes visible (when returning from form)
onActivated(() => {
  loadData();
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
