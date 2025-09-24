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
    <div v-else-if="selectedMultidimensi" class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Multidimensi</h2>
        </template>
      </rs-card>

      <!-- Action Buttons Below Title Card -->
      <div class="flex justify-end gap-3">
        <rs-button
          variant="primary"
          @click="navigateTo(`/BF-PRF/KF/MD/01_03?id=${selectedId}`)"
          class="px-6 py-3"
        >
          <Icon name="mdi:folder-plus" class="mr-2" /> Tambah Kategori Multidimensi
        </rs-button>
        <rs-button
          variant="secondary"
          @click="navigateTo(`/BF-PRF/KF/MD/01_06?id=${selectedId}`)"
          class="px-6 py-3"
        >
          <Icon name="mdi:chart-box" class="mr-2" /> Kuadran
        </rs-button>
      </div>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Maklumat Multidimensi</h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Nama:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.namaHadKifayah }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Keterangan:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.keterangan || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Formula 19:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.Formula_19 || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Formula 18:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.Formula_18 || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Mula:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedMultidimensi.tarikhMula) }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Tamat:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedMultidimensi.tarikhTamat) }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status:</span>
              <rs-badge :variant="getStatusVariant(selectedMultidimensi.status)">
                {{ selectedMultidimensi.status }}
              </rs-badge>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status Data:</span>
              <rs-badge :variant="getStatusVariant(selectedMultidimensi.statusData || selectedMultidimensi.status)">
                {{ selectedMultidimensi.statusData || selectedMultidimensi.status || 'Draf' }}
              </rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Edit Maklumat Button -->
      <div class="flex justify-end">
        <rs-button variant="primary" class="px-6 py-3" @click="openEditMaklumatAsas">
          <Icon name="mdi:pencil" class="mr-2" /> Kemaskini Maklumat
        </rs-button>
      </div>

      <!-- Edit Maklumat Modal -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditMaklumatAsas"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Maklumat Multidimensi</h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Nama</label>
              <input v-model="editForm.namaHadKifayah" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Keterangan</label>
              <input v-model="editForm.keterangan" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Formula 19</label>
              <input v-model="editForm.Formula_19" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Formula 18</label>
              <input v-model="editForm.Formula_18" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Mula</label>
              <input v-model="editForm.tarikhMula" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Tamat</label>
              <input v-model="editForm.tarikhTamat" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status</label>
              <select v-model="editForm.status" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status Data</label>
              <select v-model="editForm.statusData" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Draf">Draf</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-2">
            <rs-button variant="secondary" @click="closeEditMaklumatAsas">Batal</rs-button>
            <rs-button variant="primary" @click="saveMaklumatAsas">
              <Icon name="mdi:content-save" class="mr-2" /> Simpan
            </rs-button>
          </div>
        </div>
      </div>


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
import { ref, reactive, computed, onMounted, onActivated, nextTick } from "vue";

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
    name: "Senarai Multidimensi",
    type: "link",
    path: "/BF-PRF/KF/MD/01_01",
  },
  {
    name: "Maklumat Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_02",
  },
]);

// State management
const loading = ref(true);
const error = ref(null);
const selectedMultidimensi = ref(null);
const allMultidimensiData = ref([]);
const isSubmitting = ref(false);
const showEditModal = ref(false);
const editForm = ref({
  namaHadKifayah: '',
  keterangan: '',
  Formula_19: '',
  Formula_18: '',
  tarikhMula: '',
  tarikhTamat: '',
  status: 'Aktif',
  statusData: 'Draf'
});

// Form data
const formData = reactive({
  namaHadKifayah: "",
  keterangan: "",
  Formula_19: "",
  Formula_18: "",
  
  tarikhMula: "",
  tarikhTamat: "",
  status: "",
  statusData: "",
});

// Status options
const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

// Status Data options
const statusDataOptions = [
  { label: "Draf", value: "Draf" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

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
      allMultidimensiData.value = assignRowNumbers(mergedData);
    } else {
      allMultidimensiData.value = assignRowNumbers(defaultData);
    }
    
    // Find the selected item
    if (selectedId) {
      // Prefer matching by stable IDs first (string compare)
      selectedMultidimensi.value = allMultidimensiData.value.find(item => String(item.idMultidimensi || item.idHadKifayah) === String(selectedId));
      // Fallback to legacy numeric row selection
      if (!selectedMultidimensi.value) {
        const numericId = Number(selectedId);
        selectedMultidimensi.value = allMultidimensiData.value.find(item => item.no === numericId);
      }
      if (!selectedMultidimensi.value) {
        error.value = `Rekod dengan ID "${selectedId}" tidak ditemui.`;
      }
    } else {
      error.value = "ID Multidimensi tidak disediakan.";
    }
    
  } catch (error) {
    console.error('Error loading data:', error);
    error.value = "Ralat semasa memuatkan data.";
    allMultidimensiData.value = defaultData;
  } finally {
    loading.value = false;
  }
};

// Ensure each row has a stable `no` field; preserve existing `no` if present
const assignRowNumbers = (items) => {
  return (items || []).map((item, index) => ({ ...item, no: item.no || index + 1 }));
};

// Navigation function
const goBack = () => {
  navigateTo('/BF-PRF/KF/MD/01_01');
};

// Edit modal handlers (mirror HK behaviour, adapted to MD fields)
const openEditMaklumatAsas = () => {
  if (!selectedMultidimensi.value) return;
  editForm.value = {
    namaHadKifayah: selectedMultidimensi.value.namaHadKifayah || '',
    keterangan: selectedMultidimensi.value.keterangan || '',
    Formula_19: selectedMultidimensi.value.Formula_19 || '',
    Formula_18: selectedMultidimensi.value.Formula_18 || '',
    tarikhMula: selectedMultidimensi.value.tarikhMula || '',
    tarikhTamat: selectedMultidimensi.value.tarikhTamat || '',
    status: selectedMultidimensi.value.status || 'Aktif',
    statusData: selectedMultidimensi.value.statusData || selectedMultidimensi.value.status || 'Draf'
  };
  showEditModal.value = true;
};

const closeEditMaklumatAsas = () => {
  showEditModal.value = false;
};

const saveMaklumatAsas = () => {
  if (!selectedMultidimensi.value) return;
  // Update the selected item
  const updated = {
    ...selectedMultidimensi.value,
    ...editForm.value,
  };
  selectedMultidimensi.value = updated;

  // Persist back into the array kept in localStorage ("multidimensi")
  try {
    const savedDataRaw = localStorage.getItem('multidimensi');
    let all = [];
    if (savedDataRaw) {
      all = JSON.parse(savedDataRaw);
    }
    const idx = all.findIndex(item => String(item.idMultidimensi || item.idHadKifayah) === String(selectedId));
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updated };
    } else {
      all.push({ ...(updated || {}), idMultidimensi: selectedId });
    }
    localStorage.setItem('multidimensi', JSON.stringify(all));
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Maklumat telah dikemaskini');
  } catch (e) {
    console.error('Gagal menyimpan data multidimensi:', e);
  }

  showEditModal.value = false;
};

// Handle form submission
const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Load existing data
    const existingData = loadExistingData();
    
    // Find the current record and update it (support both idMultidimensi and legacy idHadKifayah)
    const recordIndex = existingData.findIndex(item => (item.idMultidimensi || item.idHadKifayah) == selectedId);
    
    if (recordIndex >= 0) {
      // Update existing record
      existingData[recordIndex] = {
        ...existingData[recordIndex],
        namaHadKifayah: formData.namaHadKifayah,
        keterangan: formData.keterangan,
        Formula_19: formData.Formula_19,
        Formula_18: formData.Formula_18,
        
        tarikhMula: formData.tarikhMula,
        tarikhTamat: formData.tarikhTamat,
        status: formData.status,
        statusData: formData.statusData,
      };
    } else {
      // Create new record if not found
      const newRecord = {
        idMultidimensi: selectedId,
        namaHadKifayah: formData.namaHadKifayah,
        keterangan: formData.keterangan,
        Formula_19: formData.Formula_19,
        Formula_18: formData.Formula_18,
        
        tarikhMula: formData.tarikhMula,
        tarikhTamat: formData.tarikhTamat,
        status: formData.status,
        statusData: formData.statusData,
        tindakan: existingData.length + 1,
      };
      existingData.push(newRecord);
    }
    
    // Save to localStorage
    localStorage.setItem('multidimensi', JSON.stringify(existingData));
    
    // Show success message
    console.log('Data saved successfully:', formData);
    alert('Data berjaya disimpan!');
    
    // Navigate back
    await navigateTo('/BF-PRF/KF/MD/01_01');
    
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Ralat semasa menyimpan data.');
  } finally {
    isSubmitting.value = false;
  }
};

// Function to load existing data from localStorage
const loadExistingData = () => {
  try {
    const savedData = localStorage.getItem('multidimensi');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading existing data:', error);
  }
  return [];
};

// Populate form with existing data
const populateForm = () => {
  if (selectedMultidimensi.value) {
    formData.namaHadKifayah = selectedMultidimensi.value.namaHadKifayah || "";
    formData.keterangan = selectedMultidimensi.value.keterangan || "";
    formData.Formula_19 = selectedMultidimensi.value.Formula_19 || "";
    formData.Formula_18 = selectedMultidimensi.value.Formula_18 || "";
    formData.kadarBerbayar = selectedMultidimensi.value.kadarBerbayar || "";
    formData.tarikhMula = selectedMultidimensi.value.tarikhMula || "";
    formData.tarikhTamat = selectedMultidimensi.value.tarikhTamat || "";
    formData.status = selectedMultidimensi.value.status || "";
    formData.statusData = selectedMultidimensi.value.statusData || selectedMultidimensi.value.status || "Draf";
  }
};


// Make sure the data loads when component mounts
onMounted(() => {
  loadData();
  // Populate form after data is loaded
  nextTick(() => {
    populateForm();
  });
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