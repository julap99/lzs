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
    <div v-else class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Kategori Multidimensi</h2>
          </div>
        </template>
      </rs-card>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Maklumat Multidimensi</h3>
            <rs-button variant="primary" @click="navigateTo(`/BF-PRF/KF/MD/01_05?id=${selectedId}`)" class="px-6 py-3">
              <Icon name="mdi:folder-plus" class="mr-2" /> Tambah Kategori
            </rs-button>
          </div>
        </template>
        <template #body>
          <div class="max-w-4xl mx-auto">
            <FormKit 
              type="form" 
              :actions="false" 
              @submit="handleSubmit"
              v-model="formData"
            >
              <div class="grid grid-cols-1 gap-6">
                <!-- Kategori -->
                <div>
                  <FormKit
                    type="text"
                    name="kategori"
                    label="Kategori"
                    placeholder="Masukkan kategori"
                    validation="required"
                    :validation-messages="{
                      required: 'Kategori diperlukan'
                    }"
                    help="Masukkan kategori multidimensi"
                  />
                </div>

                <!-- Pemberat -->
                <div>
                  <FormKit
                    type="text"
                    name="pemberat"
                    label="Pemberat"
                    placeholder="Masukkan pemberat"
                    validation="required"
                    :validation-messages="{
                      required: 'Pemberat diperlukan'
                    }"
                    help="Masukkan nilai pemberat"
                  />
                </div>

                <!-- Skor Tertinggi -->
                <div>
                  <FormKit
                    type="text"
                    name="skor_tertinggi"
                    label="Skor Tertinggi"
                    placeholder="Masukkan skor tertinggi"
                    validation="required"
                    :validation-messages="{
                      required: 'Skor tertinggi diperlukan'
                    }"
                    help="Masukkan nilai skor tertinggi"
                  />
                </div>

                <!-- Jadual Skor LOV -->
                <div class="md:col-span-2">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Jadual Skor LOV</label>
                    <rs-button
                      type="button"
                      variant="secondary"
                      size="sm"
                      @click="addJadualSkorRow"
                      :disabled="jadualSkorRows.length >= 5"
                      class="px-3 py-1"
                    >
                      <Icon name="mdi:plus" class="mr-1" size="16" />
                      Tambah Baris
                    </rs-button>
                  </div>
                  
                  <div class="space-y-2">
                    <div 
                      v-for="(row, index) in jadualSkorRows" 
                      :key="index"
                      class="flex items-center space-x-2"
                    >
                      <FormKit
                        type="text"
                        :name="`jadual_skor_lov_${index}`"
                        :placeholder="`Jadual Skor LOV ${index + 1}`"
                        v-model="row.value"
                        validation="required"
                        :validation-messages="{
                          required: 'Jadual skor LOV diperlukan'
                        }"
                        class="flex-1"
                      />
                      <rs-button
                        type="button"
                        variant="danger"
                        size="sm"
                        @click="removeJadualSkorRow(index)"
                        class="px-2 py-1"
                      >
                        <Icon name="mdi:delete" size="16" />
                      </rs-button>
                    </div>
                  </div>
                  
                  <p class="text-xs text-gray-500 mt-1">
                    Maksimum 5 baris. Baris yang ada: {{ jadualSkorRows.length }}/5
                  </p>
                </div>

                <!-- Tarikh Mula -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    label="Tarikh Mula"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh mula diperlukan'
                    }"
                    help="Pilih tarikh mula berkuatkuasa"
                  />
                </div>

                <!-- Tarikh Tamat -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhTamat"
                    label="Tarikh Tamat"
                    help="Pilih tarikh tamat (opsional)"
                  />
                </div>

                <!-- Status -->
                <div>
                  <FormKit
                    type="select"
                    name="status"
                    label="Status"
                    :options="statusOptions"
                    placeholder="Pilih status"
                    validation="required"
                    :validation-messages="{
                      required: 'Status diperlukan'
                    }"
                    help="Pilih status multidimensi"
                  />
                </div>

                <!-- Status Data -->
                <div>
                  <FormKit
                    type="select"
                    name="statusData"
                    label="Status Data"
                    :options="statusDataOptions"
                    placeholder="Pilih status data"
                    validation="required"
                    :validation-messages="{
                      required: 'Status Data diperlukan'
                    }"
                    help="Pilih Status Data multidimensi"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between pt-6 border-t mt-8">
                <rs-button 
                  type="button" 
                  variant="secondary" 
                  @click="goBack"
                >
                  <Icon name="mdi:arrow-left" class="mr-2" />
                  Kembali
                </rs-button>
                <div class="flex space-x-4">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="goBack"
                  >
                    Batal
                  </rs-button>
                  <rs-button 
                    btnType="submit" 
                    variant="primary"
                    :disabled="isSubmitting"
                  >
                    <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                    <Icon v-else name="material-symbols:save" class="mr-2" />
                    {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                  </rs-button>
                </div>
              </div>
            </FormKit>
          </div>
        </template>
      </rs-card>

    </div>

    
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Maklumat Kategori Multidimensi",
});

// Get query parameters
const route = useRoute();
const selectedId = route.query.id;
console.log('MD/01_03 - route.query:', route.query);
console.log('MD/01_03 - selectedId:', selectedId);

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
  {
    name: "Maklumat Kategori Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_02",
  },
]);

// State management
const loading = ref(true);
const error = ref(null);
const selectedKifayah = ref(null);
const allKifayahData = ref([]);
const isSubmitting = ref(false);

// Form data
const formData = reactive({
  kategori: "",
  pemberat: "",
  skor_tertinggi: "",
  jadual_skor_lov: "",
  tarikhMula: "",
  tarikhTamat: "",
  status: "",
  statusData: "",
});

// Dynamic rows for Jadual Skor LOV
const jadualSkorRows = ref([]);

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
    jadual_skor_lov: "Jadual Skor LOV Value",
    pemberat: "Pemberat Value",
    skor_tertinggi: "Skor Tertinggi Value",
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
    
    // Do not fetch by ID; allow page to render and create new entries
    
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
  console.log('MD/01_03 goBack - selectedId:', selectedId);
  console.log('MD/01_03 goBack - route.query:', route.query);
  
  // Try to get ID from multiple sources
  let idToUse = selectedId;
  
  // If no ID from query, try to get it from localStorage or use the last accessed ID
  if (!idToUse) {
    // Try to get the most recent multidimensi ID from localStorage
    try {
      const savedData = localStorage.getItem('multidimensi');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.length > 0) {
          // Use the ID from the most recent record
          idToUse = parsedData[parsedData.length - 1].idMultidimensi || parsedData[parsedData.length - 1].idHadKifayah;
        }
      }
    } catch (error) {
      console.error('Error getting ID from localStorage:', error);
    }
  }
  
  if (idToUse) {
    console.log('Navigating to MD/01_02 with ID:', idToUse);
    navigateTo(`/BF-PRF/KF/MD/01_02?id=${idToUse}`);
  } else {
    console.log('No ID found, navigating to MD/01_02 without ID');
    navigateTo('/BF-PRF/KF/MD/01_02');
  }
};

// Handle form submission
const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Get the selected ID from route query
    const route = useRoute();
    const selectedId = route.query.id;
    
    if (!selectedId) {
      alert('ID tidak ditemukan. Sila kembali dan cuba lagi.');
      return;
    }
    
    // Load existing kategori data for this multidimensi ID
    const existingKategoriData = JSON.parse(localStorage.getItem('multidimensi_kategori') || '{}');
    const kategoriList = existingKategoriData[selectedId] || [];
    
    // Collect jadual skor lov data from dynamic rows
    const jadualSkorLovArray = jadualSkorRows.value.map(row => row.value).filter(value => value.trim() !== "");
    
    // Generate new ID for the record
    const newId = `MDK${Date.now().toString().slice(-6)}`;
    
    // Create new record
    const newRecord = {
      idMultidimensi: selectedId,
      idKategori: newId,
      kategori: formData.kategori,
      pemberat: formData.pemberat,
      skor_tertinggi: formData.skor_tertinggi,
      jadual_skor_lov: jadualSkorLovArray.join(", "), // Join array values with comma
      jadual_skor_lov_array: jadualSkorLovArray, // Store as array for future use
      tarikhMula: formData.tarikhMula,
      tarikhTamat: formData.tarikhTamat,
      status: formData.status,
      statusData: formData.statusData,
      tindakan: kategoriList.length + 1,
      created_at: new Date().toISOString(),
    };
    
    // Add new record to kategori data for this multidimensi ID
    kategoriList.push(newRecord);
    existingKategoriData[selectedId] = kategoriList;
    
    // Save to localStorage under multidimensi_kategori key
    localStorage.setItem('multidimensi_kategori', JSON.stringify(existingKategoriData));
    
    // Show success message
    console.log('New kategori record created successfully:', newRecord);
    console.log('Jadual Skor LOV Array:', jadualSkorLovArray);
    alert(`Data kategori berjaya disimpan dengan ID: ${newId}`);
    
    // Navigate to MD/01_04 to show the kategori data
    await navigateTo(`/BF-PRF/KF/MD/01_04?id=${selectedId}`);
    
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Ralat semasa menyimpan data.');
  } finally {
    isSubmitting.value = false;
  }
};


// Populate form with existing data
const populateForm = () => {
  if (selectedKifayah.value) {
    formData.kategori = selectedKifayah.value.kategori || "";
    formData.pemberat = selectedKifayah.value.pemberat || "";
    formData.skor_tertinggi = selectedKifayah.value.skor_tertinggi || "";
    formData.jadual_skor_lov = selectedKifayah.value.jadual_skor_lov || "";
    formData.tarikhMula = selectedKifayah.value.tarikhMula || "";
    formData.tarikhTamat = selectedKifayah.value.tarikhTamat || "";
    formData.status = selectedKifayah.value.status || "";
    formData.statusData = selectedKifayah.value.statusData || selectedKifayah.value.status || "Draf";
    
    // Initialize jadual skor rows
    if (selectedKifayah.value.jadual_skor_lov_array && Array.isArray(selectedKifayah.value.jadual_skor_lov_array)) {
      jadualSkorRows.value = selectedKifayah.value.jadual_skor_lov_array.map((item, index) => ({ id: index, value: item }));
    } else {
      // Add one default row
      jadualSkorRows.value = [{ id: 0, value: "" }];
    }
  } else {
    // Add one default row if no existing data
    jadualSkorRows.value = [{ id: 0, value: "" }];
  }
};

// Add new row for Jadual Skor LOV
const addJadualSkorRow = () => {
  if (jadualSkorRows.value.length < 5) {
    const newId = jadualSkorRows.value.length > 0 ? Math.max(...jadualSkorRows.value.map(row => row.id)) + 1 : 0;
    jadualSkorRows.value.push({ id: newId, value: "" });
  }
};

// Remove row from Jadual Skor LOV
const removeJadualSkorRow = (index) => {
  if (jadualSkorRows.value.length > 1) {
    jadualSkorRows.value.splice(index, 1);
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