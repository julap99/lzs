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
            <rs-button variant="secondary" @click="navigateTo(`/BF-PRF/KF/RUU/01_02/01_02_lihat?kod=${getKodForKategori(selectedKategori)}`)">
              <Icon name="mdi:eye" class="mr-1" /> Lihat
            </rs-button>
            <rs-button variant="secondary" @click="navigateTo(`/BF-PRF/KF/RUU/01_01/kemaskini?kod=${getKodForKategori(selectedKategori)}`)">
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
            <option v-for="opt in kategoriOptions" :key="opt.kod" :value="opt.value">{{ opt.value }}</option>
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
          <template v-slot:namaRuuField="data">{{ data.value.namaRuuField }}</template>
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
import { ref, computed, onMounted, onActivated, nextTick, watch } from "vue";

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
const kelulusanDataRuu = ref([]);
const allData = ref([]); // Store all data for filtering
const selectedKategori = ref("Peribadi");
const kategoriOptions = ref([
  { value: "Peribadi", kod: "1" },
  { value: "Alamat", kod: "2" },
  { value: "Pendidikan", kod: "3" },
  { value: "Pengislaman", kod: "4" },
  { value: "Perbankan", kod: "5" },
  { value: "Kesihatan", kod: "6" },
  { value: "Kemahiran", kod: "7" },
  { value: "Kediaman/Tempat Tinggal", kod: "8" },
  { value: "Pinjaman Harta", kod: "9" },
  { value: "Pemilikan Aset", kod: "10" },
  { value: "Pekerjaan", kod: "11" },
  { value: "Pendapatan dan Perbelanjaan Seisi Rumah", kod: "12" },
  { value: "Peribadi Tanggungan", kod: "13" },
  { value: "Pengislaman Tanggungan", kod: "14" },
  { value: "Perbankan Tanggungan", kod: "15" },
  { value: "Pendidikan Tanggungan", kod: "16" },
  { value: "Kesihatan Tanggungan", kod: "17" },
  { value: "Kemahiran Tanggungan", kod: "18" },
  { value: "Pekerjaan Tanggungan", kod: "19" },
]);

const filteredData = computed(() => {
  // Only show data for "Peribadi" category, empty for all other categories
  if (selectedKategori.value === "Peribadi") {
    return allData.value;
  }
  return []; // Empty array for all other categories
});

// Helper function to get kod for a given kategori
const getKodForKategori = (kategori) => {
  const option = kategoriOptions.value.find(opt => opt.value === kategori);
  return option ? option.kod : "1"; // Default to "1" if not found
};

// Default data (fallback if no data in localStorage)
const defaultData = [
  {
    id: 'default_1',
    namaRuuField: 'Identification Type',
    namaNasField: 'Jenis ID',
    kategori: 'Peribadi',
    kaedahKemaskini: 'Update asnaf with approval/verify',
    tarikhMula: '2026-01-01',
    statusData: 'Draf',
    status: 'Aktif',
    kod: '1',
    tarikhTamat: ''
  },
  {
    id: 'default_2',
    namaRuuField: 'Passport No',
    namaNasField: 'Pengenalan ID',
    kategori: 'Peribadi',
    kaedahKemaskini: 'Asnaf Review',
    tarikhMula: '2026-01-01',
    statusData: 'Draf',
    status: 'Aktif',
    kod: '2',
    tarikhTamat: ''
  },
  {
    id: 'default_3',
    namaRuuField: 'MyKad',
    namaNasField: 'Pengenalan ID',
    kategori: 'Peribadi',
    kaedahKemaskini: 'Asnaf Review',
    tarikhMula: '2026-01-01',
    statusData: 'Draf',
    status: 'Aktif',
    kod: '3',
    tarikhTamat: ''
  }
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

// Function to load saved categories from localStorage
const loadSavedCategories = () => {
  try {
    const savedCategories = localStorage.getItem('kategoriMaklumat');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      const savedCategoryNames = parsedCategories.map(cat => cat.namaKategori).filter(Boolean);
      
      // Merge with existing options, avoiding duplicates
      const existingOptions = [...kategoriOptions.value];
      savedCategoryNames.forEach(categoryName => {
        const exists = existingOptions.some(opt => opt.value === categoryName);
        if (!exists) {
          // Generate next available kod
          const nextKod = String(existingOptions.length + 1);
          existingOptions.push({ value: categoryName, kod: nextKod });
        }
      });
      kategoriOptions.value = existingOptions;
    }
  } catch (error) {
    console.error('Error loading saved categories:', error);
  }
};

// Function to load data from localStorage
const loadData = () => {
  try {
    // Only load default Peribadi data - other categories will be empty
    allData.value = defaultData;
    kelulusanDataRuu.value = defaultData;
  } catch (error) {
    console.error('Error loading data:', error);
    allData.value = defaultData;
    kelulusanDataRuu.value = defaultData;
  }
};

// Computed property to count pending approval items
const pendingApprovalCount = computed(() => {
  return filteredData.value.filter(
    (item) => item.status === "Menunggu Kelulusan"
  ).length;
});

// Watch for category selection changes and update table data
watch(selectedKategori, (newCategory) => {
  if (newCategory === "Peribadi") {
    kelulusanDataRuu.value = allData.value;
  } else {
    kelulusanDataRuu.value = []; // Empty for all other categories
  }
  refreshTable();
});

// Make sure the table refreshes when component mounts
onMounted(() => {
  loadSavedCategories();
  loadData();
  refreshTable();
});

// Also refresh when the page becomes visible (when returning from form)
onActivated(() => {
  loadSavedCategories();
  loadData();
  // Reset to Peribadi category when returning to the page
  selectedKategori.value = "Peribadi";
  refreshTable();
});

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
    console.log("Table refreshed, records:", filteredData.value.length);
    console.log("Pending approval:", pendingApprovalCount.value);
    console.log("Sample data:", filteredData.value[0]);
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
