<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Maklumat Kelulusan Data (RUU)</h2>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="navigateTo('/BF-PRF/KF/RUU/01_01/tambah_kategori')">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Kategori Maklumat
            </rs-button>
            <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_04/lihat')">
              <Icon name="mdi:eye" class="mr-1" /> Lihat
            </rs-button>
            <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_04/kemaskini')">
              <Icon name="mdi:pencil" class="mr-1" /> Kemaskini
            </rs-button>
            <rs-button v-if="false" variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_01/tambah_kategori')">
              <Icon name="mdi:folder-plus" class="mr-1" /> Tambah Kategori
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="mb-4 flex items-center gap-3">
          <label class="text-sm font-medium">Kategori Maklumat</label>
          <select v-model="selectedKategori" class="border rounded px-2 py-1 text-sm">
            <option value="">Semua</option>
            <option v-for="opt in kategoriOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
        <!-- Updated Table Section with requested columns -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredData"
          :field="['namaRuuField','namaNasField','kaedahKemaskini','tarikhMula','statusData']"
          :columns="[
            { key: 'namaRuuField', label: 'Nama RUU Field' },
            { key: 'namaNasField', label: 'Nama NAS Field' }
          ]"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:namaRuuField="data">{{ data.value.namaRuuField || data.value.namaHadKifayah }}</template>
          <template v-slot:namaNasField="data">{{ data.value.namaNasField || data.value.kategori || '-' }}</template>
          <template v-slot:kaedahKemaskini="data">{{ data.value.kaedahKemaskini || 'Manual' }}</template>
          <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
          <template v-slot:statusData="data">
            <rs-badge :variant="getStatusVariant(data.value.statusData || data.value.status)">
              {{ data.value.statusData || data.value.status }}
            </rs-badge>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Konfigurasi Kelulusan Data (RUU)",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/RUU/admin",
  },
  {
    name: "Konfigurasi Kelulusan Data (RUU)",
    type: "current",
    path: "/BF-PRF/KF/RUU/admin",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([]);
const selectedKategori = ref("");
const kategoriOptions = [
  "Peribadi",
  "Alamat",
  "Pendidikan",
  "Pengislaman",
  "Perbankan",
  "Kesihatan",
  "Kemahiran",
  "Alamat",
  "Kediaman/Tempat Tinggal",
  "Pinjaman Harta",
  "Pemilikan Aset",
  "Pekerjaan",
  "Pendapatan dan Perbelanjaan Seisi Rumah",
  "Peribadi Tanggungan",
  "Pengislaman Tanggungan",
  "Perbankan Tanggungan",
  "Pendidikan Tanggungan",
  "Kesihatan Tanggungan",
  "Kemahiran Tanggungan",
  "Pekerjaan Tanggungan",
];

const filteredData = computed(() => {
  if (!selectedKategori.value) return kifayahLimits.value;
  return kifayahLimits.value.filter((item) => {
    const kategori = item.namaNasField || item.kategori || "";
    return kategori === selectedKategori.value;
  });
});

// Default data (fallback if no data in localStorage)
const defaultData = [
  {
    namaRuuField: "Identification Type",
    namaNasField: "Jenis ID",
    kaedahKemaskini: "Update asnaf with approval/verify",
    tarikhMula: "2030-01-01",
    statusData: "Draf",
  },
  {
    namaRuuField: "Passport No",
    namaNasField: "Pengenalan ID",
    kaedahKemaskini: "Asnaf Review",
    tarikhMula: "2026-01-01",
    statusData: "Draf",
  },
  {
    namaRuuField: "MyKad",
    namaNasField: "Pengenalan ID",
    kaedahKemaskini: "Asnaf Review",
    tarikhMula: "2026-01-01",
    statusData: "Draf",
  },
];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure numeric values are valid
    kadarBerbayar: isNaN(parseFloat(item.kadarBerbayar)) ? 0 : parseFloat(item.kadarBerbayar),
    kadarPercuma: isNaN(parseFloat(item.kadarPercuma)) ? 0 : parseFloat(item.kadarPercuma),
    // Ensure date is valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2025-01-01",
    // Ensure status is valid
    status: item.status || "Aktif"
  };
};

// Function to load data from localStorage
const loadData = () => {
  try {
    const savedData = localStorage.getItem('kifayahLimits');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and sanitize parsed data
      const validatedData = parsedData.map(validateDataItem);
      
      // Merge with default data, giving priority to saved data
      const mergedData = [...defaultData];
      validatedData.forEach(savedItem => {
        // Check if item already exists in default data
        const existingIndex = mergedData.findIndex(item => item.idHadKifayah === savedItem.idHadKifayah);
        if (existingIndex >= 0) {
          // Replace existing item
          mergedData[existingIndex] = validateDataItem(savedItem);
        } else {
          // Add new item
          mergedData.push(validateDataItem(savedItem));
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
    console.log("Sample data:", kifayahLimits.value[0]);
  });
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  
  // Handle different date formats and validate
  let date;
  if (typeof dateString === 'string') {
    // Check if it's a valid date string
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

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "0.00";
  
  // Convert to number and validate
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return "0.00";
  }
  
  // Ensure it's a valid number and format to 2 decimal places
  return numValue.toFixed(2);
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
      return "info";
    default:
      return "default";
  }
};
</script>
