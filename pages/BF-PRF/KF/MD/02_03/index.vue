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
            <h2 class="text-xl font-semibold">Multidimensi</h2>
          </div>
        </template>
      </rs-card>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Multidimensi</h3>
            </div>
          </div>
        </template>
        <template #body>
          <div class="space-y-4">
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Nama:</span>
              <span class="text-sm text-gray-900">{{ selectedKifayah.namaHadKifayah }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Keterangan:</span>
              <span class="text-sm text-gray-900">{{ selectedKifayah.keterangan || 'N/A' }}</span>
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
            
            <!-- Multidimensi Details -->
            <div class="pt-4">
              <h4 class="text-md font-semibold mb-2">Multidimensi</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Kuadran:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.kuadran || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Min Merit:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.min_merit || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Max Merit:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.max_merit || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Status Multidimensi:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.status_multidimensi || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Kategori:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.kategori || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Pemberat:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.pemberat || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1">
                  <span class="text-sm font-medium text-gray-600 w-40">Skor Tertinggi:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.skor_tertinggi || 'N/A' }}</span>
                </div>
                <div class="flex items-center py-1 md:col-span-2">
                  <span class="text-sm font-medium text-gray-600 w-40">Jadual Skor LOV:</span>
                  <span class="text-sm text-gray-900">{{ selectedKifayah.jadual_skor_lov || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Kuadran Section -->
      <rs-card v-if="hasKuadranData">
        <template #header>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Kuadran</h3>
            </div>
          </div>
        </template>
        <template #body>
          <rs-table
            class="mt-4"
            :data="kuadranData"
            :field="['kuadran','min_merit','max_merit','status_multidimensi','status_data','tarikhMula','tarikhTamat']"
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
            <template v-slot:status_data="data">
              <rs-badge :variant="getStatusVariant(data.value.status_data)">
                {{ data.value.status_data || 'N/A' }}
              </rs-badge>
            </template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tarikhTamat="data">{{ formatDate(data.value.tarikhTamat) }}</template>
          </rs-table>
        </template>
      </rs-card>

      <!-- Action Buttons Card -->
      <rs-card>
        <template #body>
          <div class="flex justify-end">
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

      <!-- Kelulusan Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Kelulusan</h2>
          </div>
        </template>
        <template #body>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Status Kelulusan</label>
              <FormKit
                type="radio"
                name="statusKelulusan"
                :options="statusKelulusanOptions"
                validation="required"
                :validation-messages="{
                  required: 'Status kelulusan diperlukan'
                }"
                help="Pilih status kelulusan"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Catatan -->
              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="catatan"
                  label="Catatan"
                  placeholder="Masukkan catatan kelulusan (opsional)"
                  rows="3"
                  help="Catatan atau nota tambahan untuk kelulusan"
                />
              </div>
              
              <!-- Tarikh Pelulus -->
              <div>
                <FormKit
                  type="date"
                  name="tarikhPelulus"
                  label="Tarikh Pelulus"
                  help="Pilih tarikh pelulus"
                />
              </div>
              
              <!-- Nama Pelulus -->
              <div>
                <FormKit
                  type="text"
                  name="namaPelulus"
                  label="Nama Pelulus"
                  placeholder="Masukkan nama pelulus"
                  help="Nama orang yang meluluskan"
                />
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons Card -->
      <rs-card>
        <template #body>
          <div class="flex justify-between items-center">
            <rs-button variant="secondary" @click="goBack" class="px-6 py-3">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit" class="px-6 py-3">
              <Icon name="mdi:send" class="mr-1" /> Hantar
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
    path: "/BF-PRF/KF/MD/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/MD/01_01",
  },
  {
    name: "Multidimensi",
    type: "link",
    path: `/BF-PRF/KF/MD/01_02?id=${selectedId}`,
  },
  {
    name: "Lihat Maklumat",
    type: "current",
    path: `/BF-PRF/KF/MD/01_04?id=${selectedId}`,
  },
]);

// State management
const loading = ref(true);
const error = ref(null);
const selectedKifayah = ref(null);
const allKifayahData = ref([]);

// Options for status kelulusan radio buttons
const statusKelulusanOptions = [
  { label: "Lulus", value: "Lulus" },
  { label: "Tolak", value: "Tolak" },
];

// Computed property for kuadran data
const kuadranData = computed(() => {
  if (!selectedKifayah.value) return [];
  
  // Create an array with the selected kifayah data for the table
  return [{
    kuadran: selectedKifayah.value.kuadran || 'N/A',
    min_merit: selectedKifayah.value.min_merit || 'N/A',
    max_merit: selectedKifayah.value.max_merit || 'N/A',
    status_multidimensi: selectedKifayah.value.status_multidimensi || 'N/A',
    status_data: selectedKifayah.value.status_data || 'N/A',
    tarikhMula: selectedKifayah.value.tarikhMula || 'N/A',
    tarikhTamat: selectedKifayah.value.tarikhTamat || 'N/A'
  }];
});

// Computed property to check if there's actual kuadran data
const hasKuadranData = computed(() => {
  if (!selectedKifayah.value) return false;
  
  // Check if any of the kuadran fields have meaningful data (not 'N/A' or empty)
  const hasKuadran = selectedKifayah.value.kuadran && selectedKifayah.value.kuadran !== 'N/A';
  const hasMinMerit = selectedKifayah.value.min_merit && selectedKifayah.value.min_merit !== 'N/A';
  const hasMaxMerit = selectedKifayah.value.max_merit && selectedKifayah.value.max_merit !== 'N/A';
  const hasStatusMultidimensi = selectedKifayah.value.status_multidimensi && selectedKifayah.value.status_multidimensi !== 'N/A';
  const hasStatusData = selectedKifayah.value.status_data && selectedKifayah.value.status_data !== 'N/A';
  
  // Return true if at least one kuadran field has data
  return hasKuadran || hasMinMerit || hasMaxMerit || hasStatusMultidimensi || hasStatusData;
});

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
    tarikhTamat: "2025-12-31",
    status: "Aktif",
    tindakan: 1,
    keterangan: "Had kifayah untuk ketua keluarga",
    Formula_19: "Formula 19 Value",
    Formula_18: "Formula 18 Value",
  },
];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure numeric values are valid
    kadarBerbayar: isNaN(parseFloat(item.kadarBerbayar)) ? 0 : parseFloat(item.kadarBerbayar),
    kadarPercuma: isNaN(parseFloat(item.kadarPercuma)) ? 0 : parseFloat(item.kadarPercuma),
    // Ensure dates are valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2025-01-01",
    tarikhTamat: item.tarikhTamat && !isNaN(new Date(item.tarikhTamat).getTime()) ? item.tarikhTamat : "2025-12-31",
    // Ensure status is valid
    status: item.status || "Aktif"
  };
};


// Function to load data from localStorage
const loadData = () => {
  try {
    loading.value = true;
    error.value = null;
    
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
      allKifayahData.value = assignRowNumbers(mergedData);
    } else {
      allKifayahData.value = assignRowNumbers(defaultData);
    }
    
    // Find the selected item
    if (selectedId) {
      const numericId = Number(selectedId);
      selectedKifayah.value = allKifayahData.value.find(item => item.no === numericId);
      if (!selectedKifayah.value) {
        error.value = `Rekod dengan ID "${selectedId}" tidak ditemui.`;
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

// Ensure each row has a sequential `no` field used as ID
const assignRowNumbers = (items) => {
  return (items || []).map((item, index) => ({ ...item, no: index + 1 }));
};

// Navigation function
const goBack = () => {
  navigateTo('/BF-PRF/KF/MD/02_01');
};

// Handle form submission
const handleSubmit = () => {
  // Get form data from the FormKit form
  const formData = {
    statusKelulusan: '', // This would be populated from the form
    catatan: '',
    tarikhPelulus: '',
    namaPelulus: ''
  };
  
  console.log('Form submitted with data:', formData);
  
  // Show success notification
  alert('Hantaran kelulusan berjaya dihantar');
  
  // Navigate back or to next page
  goBack();
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