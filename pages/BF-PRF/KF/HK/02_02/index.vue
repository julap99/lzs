<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="loading" class="mt-4 text-center">
      <Icon name="mdi:loading" class="animate-spin text-blue-500 mb-2" size="32px" />
      <p class="text-gray-600">Memuatkan maklumat...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-4">
      <rs-card>
        <template #body>
          <div class="text-center py-8">
            <Icon name="mdi:alert-circle" class="text-red-500 mb-4" size="48px" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ralat</h3>
            <p class="text-gray-600">{{ error }}</p>
            <rs-button variant="primary" @click="goBack" class="mt-4">
              <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Content -->
    <div v-else-if="selectedKifayah" class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Had Kifayah</h2>
          </div>
        </template>
      </rs-card>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Maklumat Asas</h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Nama Had Kifayah:</span>
              <span class="text-sm text-gray-900">{{ selectedKifayah.namaHadKifayah }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Keterangan:</span>
              <span class="text-sm text-gray-900">{{ selectedKifayah.keterangan || selectedKifayah.jenisIsiRumah || 'N/A' }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Pelarasan:</span>
              <span class="text-sm text-gray-900 font-semibold">RM {{ formatCurrency(selectedKifayah.kadarBerbayar) }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Mula:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedKifayah.tarikhMula) }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Tamat:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedKifayah.tarikhTamat) }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status:</span>
              <rs-badge :variant="getStatusVariant(selectedKifayah.status)">
                {{ selectedKifayah.status }}
              </rs-badge>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status Data:</span>
              <rs-badge :variant="getStatusDataVariant(selectedKifayah.statusData)">
                {{ selectedKifayah.statusData }}
              </rs-badge>
            </div>
            
          </div>
        </template>
      </rs-card>

      <!-- Categories Section -->
      <rs-card v-if="relatedCategories.length > 0">
        <template #header>
          <h3 class="text-lg font-semibold">Kategori Berkaitan</h3>
        </template>
        <template #body>
          <rs-table
            class="mt-2"
            :data="relatedCategories"
            :field="[
              'kategoriHadKifayah',
              'levelHadKifayah',
              'idLevel',
              'indicator',
              'hadKifayah',
              'statusAktif',
              'statusData',
              'tarikhMula',
              'tarikhTamat'
            ]"
            :pageSize="10"
            :options="{ variant: 'default', hover: true }"
          >
            <template v-slot:kategoriHadKifayah="data">{{ data.value.kategoriHadKifayah }}</template>
            <template v-slot:levelHadKifayah="data">{{ data.value.levelHadKifayah }}</template>
            <template v-slot:idLevel="data">{{ data.value.idLevel || data.value.bil }}</template>
            <template v-slot:indicator="data">{{ data.value.indicator }}</template>
            <template v-slot:hadKifayah="data">RM {{ formatCurrency(data.value.hadKifayah) }}</template>
            <template v-slot:statusAktif="data">
              <rs-badge :variant="data.value.statusAktif ? 'success' : 'danger'">
                {{ data.value.statusAktif ? 'Aktif' : 'Tidak Aktif' }}
              </rs-badge>
            </template>
            <template v-slot:statusData="data">{{ data.value.statusData }}</template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tarikhTamat="data">{{ formatDate(data.value.tarikhTamat) }}</template>
          </rs-table>
        </template>
      </rs-card>

      <!-- Action Buttons Card -->
      <rs-card>
        <template #body>
          <div class="flex justify-start">
            <rs-button variant="secondary" @click="goBack">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
            <rs-button v-if="false"
              variant="primary" 
              @click="navigateTo(`/BF-PRF/KF/HK/01_01/tambah_kategori?id=${selectedId}`)"
              class="px-6 py-3"
            >
              <Icon name="mdi:folder-plus" class="mr-2" /> Tambah Kategori
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Not Found State -->
    <div v-else class="mt-4">
      <rs-card>
        <template #body>
          <div class="text-center py-8">
            <Icon name="mdi:file-search" class="text-gray-400 mb-4" size="48px" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Rekod Tidak Ditemui</h3>
            <p class="text-gray-600">Maklumat Had Kifayah dengan ID "{{ selectedId }}" tidak ditemui.</p>
            <rs-button variant="primary" @click="goBack" class="mt-4">
              <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Maklumat Had Kifayah",
});

// Get query parameters
const route = useRoute();
const selectedId = route.query.id;

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/HK/01_01",
  },
  {
    name: "Maklumat Had Kifayah",
    type: "current",
    path: "/BF-PRF/KF/HK/01_02",
  },
]);

// State management
const loading = ref(true);
const error = ref(null);
const selectedKifayah = ref(null);
const allKifayahData = ref([]);
const relatedCategories = ref([]);

// Default data (fallback if no data in localStorage)
const defaultData = [
  {
    idHadKifayah: "HK001",
    namaHadKifayah: "Ketua Keluarga",
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    keterangan: "Had kifayah untuk ketua keluarga",
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMula: "2025-01-01",
    tarikhTamat: "2025-12-31",
    status: "Aktif",
    statusData: "Draf",
    tindakan: 1,
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
    tarikhTamat: item.tarikhTamat && !isNaN(new Date(item.tarikhTamat).getTime()) ? item.tarikhTamat : "2025-12-31",
    // Ensure status is valid
    status: item.status || "Aktif",
    statusData: item.statusData || "Draf",
    // Ensure keterangan is present with fallback to jenisIsiRumah for backward compatibility
    keterangan: item.keterangan || item.jenisIsiRumah || "N/A"
  };
};

// Function to load related categories
const loadRelatedCategories = () => {
  try {
    const savedCategories = localStorage.getItem('kifayahCategories');
    if (savedCategories && selectedId) {
      const allCategories = JSON.parse(savedCategories);
      // Filter categories that belong to the selected Had Kifayah and validate them
      const filteredCategories = allCategories.filter(category => 
        category.idHadKifayah === selectedId
      );
      // Validate each category to ensure all fields are present
      relatedCategories.value = filteredCategories.map(category => ({
        ...category,
        // Ensure idLevel is present with fallback to bil
        idLevel: category.idLevel || category.bil || '',
        // Ensure tarikhTamat is present with fallback
        tarikhTamat: category.tarikhTamat || "2025-12-31",
        // Ensure statusData is present
        statusData: category.statusData || "Draf"
      }));
    } else {
      relatedCategories.value = [];
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    relatedCategories.value = [];
  }
};

// Function to load data from localStorage
const loadData = () => {
  try {
    loading.value = true;
    error.value = null;
    
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
      allKifayahData.value = mergedData;
    } else {
      allKifayahData.value = defaultData;
    }
    
    // Find the selected item
    if (selectedId) {
      selectedKifayah.value = allKifayahData.value.find(item => item.idHadKifayah === selectedId);
      if (!selectedKifayah.value) {
        error.value = `Rekod dengan ID "${selectedId}" tidak ditemui.`;
      } else {
        // Load related categories
        loadRelatedCategories();
      }
    } else {
      error.value = "ID Had Kifayah tidak disediakan.";
    }
    
  } catch (error) {
    console.error('Error loading data:', error);
    error.value = "Ralat semasa memuatkan data.";
    allKifayahData.value = defaultData;
  } finally {
    loading.value = false;
  }
};

// Navigation function
const goBack = () => {
  navigateTo('/BF-PRF/KF/HK/02_01');
};

// Make sure the data loads when component mounts
onMounted(() => {
  loadData();
});

// Also refresh when the page becomes visible
onActivated(() => {
  loadData();
});

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

// Helper function to determine badge variant based on status data
const getStatusDataVariant = (statusData) => {
  switch (statusData) {
    case "Draf":
      return "default";
    case "Menunggu Kelulusan":
      return "warning";
    case "Lulus":
      return "success";
    case "Tolak":
      return "danger";
    default:
      return "default";
  }
};
</script>