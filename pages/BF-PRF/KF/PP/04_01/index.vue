<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Maklumat Komponen Profiling</h2>
        </div>
      </template>

      <template #body>
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-gray-100 rounded">
          <p>Jumlah Konfigurasi: {{ kifayahLimits.length }}</p>
          <p>Kelulusan Menunggu: {{ pendingApprovalCount }}</p>
        </div>

        <!-- Updated Table Section with 6 columns -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :field="['idKomponenProfiling','namaPendaftaran','kodProses','idMenu','tarikhMula','statusData','actions']"
          :pageSize="10"
          :showNoColumn="false"
          :showFilter="true"
          :showSearch="true"  
          :options="{
            variant: 'default',
            hover: true,
            bordered: true,
            striped: true,
          }"
          advanced
        >
          <template v-slot:idKomponenProfiling="data">
            <div>{{ data.value.idKomponenProfiling || 'N/A' }}</div>
          </template>
          
          <template v-slot:namaPendaftaran="data">
            <div>{{ data.value.namaPendaftaran || 'Pendaftaran Lengkap' }}</div>
          </template>
          
          <template v-slot:kodProses="data">
            <div>{{ data.value.kodProses || 'PP001' }}</div>
          </template>
          
          <template v-slot:idMenu="data">
            <div>{{ data.value.idMenu || '1' }}</div>
          </template>

          <template v-slot:tarikhMula="data">
            <div>{{ formatDate(data.value.tarikhMula) }}</div>
          </template>
          
          <template v-slot:statusData="data">
            <rs-badge :variant="getStatusVariant(data.value.statusData)">
              {{ data.value.statusData || 'Aktif' }}
            </rs-badge>
          </template>
          
          <template v-slot:actions="data">
            <rs-button
              variant="secondary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PRF/KF/PP/04_02?id=${data.value.idKomponenProfiling}`)"
            >
              Lihat
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1 ml-2"
              @click="navigateTo(`/BF-PRF/KF/PP/04_03?id=${data.value.idKomponenProfiling}`)"
            >
              Kelulusan
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
// import type { bottom } from "@popperjs/core";
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Komponen Profiling",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Senarai Maklumat Komponen Profiling",
    type: "current",
    path: "/BF-PRF/KF/PP/04_01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([]);

// Default data (empty array - no hardcoded data)
const defaultData = [];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure standardized id exists
    idKomponenProfiling: item.idKomponenProfiling || item.kodProses || item.idHadKifayah,
    // Ensure new fields are present
    namaPendaftaran: item.namaPendaftaran || "Pendaftaran Lengkap",
    kodProses: item.kodProses || "PP001",
    idMenu: item.idMenu || "1", // Default ID Menu to '1'
    // Ensure date is valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2025-01-01",
    // Ensure status is valid
    statusData: item.statusData || item.status || "Aktif",
  };
};

// Function to load data from localStorage
const loadData = () => {
  try {
    const savedData = localStorage.getItem('prosesKomponen');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and sanitize parsed data
      const validatedData = parsedData.map(validateDataItem);
      kifayahLimits.value = validatedData;
    } else {
      kifayahLimits.value = [];
    }
  } catch (error) {
    console.error('Error loading data:', error);
    kifayahLimits.value = [];
  }
};

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return kifayahLimits.value.filter(
    (item) => item.statusData === "Menunggu Kelulusan"
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
  
  let date;
  if (typeof dateString === 'string') {
    date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Tarikh Tidak Sah";
    }
  } else if (dateString instanceof Date) {
    date = dateString;
    if (isNaN(date.getTime())) {
      return "Tarikh Tidak Sah";
    }
  } else {
    return "Tarikh Tidak Sah";
  }

  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("ms-MY", options);
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
    case "Draf":
      return "secondary";
    default:
      return "default";
  }
};
</script>
