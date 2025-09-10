<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kuadran</h2>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="navigateTo('/BF-PRF/KF/MD/01_06/tambah')">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Kuadran
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>

        <!-- Table Section with 8 columns -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :field="['kuadran','min_merit','max_merit','status_multidimensi','status','status_data','tarikhMula','tarikhTamat']"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:kuadran="data">{{ data.value.kuadran || 'N/A' }}</template>
          <template v-slot:min_merit="data">{{ data.value.min_merit || 'N/A' }}</template>
          <template v-slot:max_merit="data">{{ data.value.max_merit || 'N/A' }}</template>
          <template v-slot:status_multidimensi="data">{{ data.value.status_multidimensi || 'N/A' }}</template>
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.value.status)">
              {{ data.value.status }}
            </rs-badge>
          </template>
          <template v-slot:status_data="data">
            <rs-badge :variant="getStatusVariant(data.value.status_data)">
              {{ data.value.status_data || 'N/A' }}
            </rs-badge>
          </template>
          <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
          <template v-slot:tarikhTamat="data">{{ formatDate(data.value.tarikhTamat) }}</template>
        </rs-table>

        <!-- Kembali Button -->
        <div class="flex justify-start mt-6">
          <rs-button variant="secondary" @click="goBack">
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

// Get route to access query parameters
const route = useRoute();

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
    name: "Senarai Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_01",
  },
  {
    name: "Maklumat Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_02",
  },
  {
    name: "Senarai Kuadran",
    type: "current",
    path: "/BF-PRF/KF/MD/01_06",
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
    keterangan: "Had kifayah untuk ketua keluarga",
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
    const savedData = localStorage.getItem('multidimensi');
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
      kifayahLimits.value = assignRowNumbers(mergedData);
    } else {
      kifayahLimits.value = assignRowNumbers(defaultData);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    kifayahLimits.value = assignRowNumbers(defaultData);
  }
};


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
    console.log("Sample data:", kifayahLimits.value[0]);
  });
};

// Ensure each row has a sequential `no` field used as ID
const assignRowNumbers = (items) => {
  return (items || []).map((item, index) => ({ ...item, no: index + 1 }));
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
    default:
      return "default";
  }
};

// Go back function with selected ID
const goBack = () => {
  const selectedId = route.query.id;
  if (selectedId) {
    navigateTo(`/BF-PRF/KF/MD/01_02?id=${selectedId}`);
  } else {
    navigateTo('/BF-PRF/KF/MD/01_02');
  }
};
</script>
