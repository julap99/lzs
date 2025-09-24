<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Multidimensi</h2>
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="navigateTo('01_01/tambah')">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
            </rs-button>
            <rs-button v-if="false" variant="secondary" @click="navigateTo('/BF-PRF/KF/HK/01_01/tambah_kategori')">
              <Icon name="mdi:folder-plus" class="mr-1" /> Tambah Kategori
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>

        <!-- Table Section with 5 columns -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="kifayahLimits"
          :field="['nama','keterangan','tarikhMula','statusData','tindakan']"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:nama="data">{{ data.value.namaMultidimensi }}</template>
          <template v-slot:keterangan="data">{{ data.value.keterangan || 'N/A' }}</template>
          <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
          <template v-slot:statusData="data">
            <rs-badge :variant="getStatusVariant(data.value.statusData)">
              {{ data.value.statusData }}
            </rs-badge>
          </template>
          <template v-slot:tindakan="data">
            <rs-button
              variant="primary"
              size="sm"
              class="!px-2 !py-1"
              @click="navigateTo(`/BF-PRF/KF/MD/01_02?id=${data.value.idMultidimensi || data.value.idHadKifayah || data.value.no}`)"
              >Kemaskini
              <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
            </rs-button>
            <rs-button
              variant="secondary"
              size="sm"
              class="!px-2 !py-1 ml-2"
              @click="navigateTo({ path: '/BF-PRF/KF/MD/01_04', query: { id: data.value.idMultidimensi || data.value.idHadKifayah } })"
              >Lihat
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
    path: "/BF-PRF/KF/MD/admin",
  },
  {
    name: "Senarai Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_01",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const kifayahLimits = ref([]);

// Default data (fallback if no data in localStorage)
const defaultData = [
  // Section A: Kadar Had Kifayah Utama
  {
    idMultidimensi: "MD001",
    namaHadKifayah: "Ketua Keluarga",
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMula: "2025-01-01",
    status: "Aktif",
    statusData: "Draf",
    tindakan: 1,
    keterangan: "Had kifayah untuk ketua keluarga",
  },
];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Normalize IDs to use idMultidimensi going forward
    idMultidimensi: item.idMultidimensi || item.idHadKifayah || `MD${Date.now().toString().slice(-6)}`,
    // Normalize name across forms (tambah uses namaMultidimensi)
    namaMultidimensi: item.namaMultidimensi || item.namaHadKifayah || "",
    // Ensure keterangan is string from localStorage
    keterangan: typeof item.keterangan === 'string' ? item.keterangan : (item.keterangan ?? ''),
    // Ensure numeric values are valid
    kadarBerbayar: isNaN(parseFloat(item.kadarBerbayar)) ? 0 : parseFloat(item.kadarBerbayar),
    kadarPercuma: isNaN(parseFloat(item.kadarPercuma)) ? 0 : parseFloat(item.kadarPercuma),
    // Ensure date is valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2025-01-01",
    // Ensure status is valid
    status: item.status || "Aktif",
    // Prefer statusData column for table; fallback to status; default to Draf
    statusData: item.statusData || item.status || "Draf",
  };
};

// Function to load data from localStorage
const loadData = () => {
  try {
    const savedData = localStorage.getItem('multidimensi');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Ensure statusData is sourced from localStorage entries
      const validatedData = parsedData.map(item => {
        const sanitized = validateDataItem(item);
        sanitized.statusData = (item && item.statusData) ? item.statusData : (item && item.status) ? item.status : 'Draf';
        return sanitized;
      });
      // Use saved data exclusively when present to avoid stale defaults
      kifayahLimits.value = assignRowNumbers(validatedData);
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
  return (items || []).map((item, index) => ({ ...item, no: item.no || index + 1 }));
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
</script>
