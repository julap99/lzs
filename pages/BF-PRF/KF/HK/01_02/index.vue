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
            <rs-button variant="secondary" @click="goBack">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
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
              <span class="text-sm font-medium text-gray-600 w-40">Jenis Isi Rumah:</span>
              <span class="text-sm text-gray-900">{{ selectedKifayah.jenisIsiRumah || 'N/A' }}</span>
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
              <span class="text-sm font-medium text-gray-600 w-40">Status:</span>
              <rs-badge :variant="getStatusVariant(selectedKifayah.status)">
                {{ selectedKifayah.status }}
              </rs-badge>
            </div>
            
            <div v-if="selectedKifayah.keterangan" class="flex items-start py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Keterangan:</span>
              <span class="text-sm text-gray-900 flex-1">{{ selectedKifayah.keterangan }}</span>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="(category, index) in relatedCategories" 
              :key="index"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-semibold text-gray-900">{{ category.kategoriHadKifayah }}</h4>
                <rs-badge :variant="category.statusAktif ? 'success' : 'danger'">
                  {{ category.statusAktif ? 'Aktif' : 'Tidak Aktif' }}
                </rs-badge>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Level:</span>
                  <span class="text-gray-900">{{ category.levelHadKifayah }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">ID Level:</span>
                  <span class="text-gray-900">{{ category.bil }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Indicator:</span>
                  <span class="text-gray-900">{{ category.indicator }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Status Data:</span>
                  <span class="text-gray-900">{{ category.statusData }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Tarikh Mula:</span>
                  <span class="text-gray-900">{{ formatDate(category.tarikhMula) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons Card -->
      <rs-card>
        <template #body>
          <div class="flex justify-end">
            <rs-button 
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
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMula: "2025-01-01",
    status: "Aktif",
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
    // Ensure status is valid
    status: item.status || "Aktif"
  };
};

// Function to load related categories
const loadRelatedCategories = () => {
  try {
    const savedCategories = localStorage.getItem('kifayahCategories');
    if (savedCategories && selectedId) {
      const allCategories = JSON.parse(savedCategories);
      // Filter categories that belong to the selected Had Kifayah
      relatedCategories.value = allCategories.filter(category => 
        category.idHadKifayah === selectedId
      );
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
  navigateTo('/BF-PRF/KF/HK/01_01');
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
</script>