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

      <!-- Edit Maklumat Asas Button -->
      <div class="flex justify-end">
        <rs-button variant="primary" class="px-6 py-3" @click="openEditMaklumatAsas">
          <Icon name="mdi:pencil" class="mr-2" /> Kemaskini Maklumat Asas
        </rs-button>
      </div>

      <!-- Edit Maklumat Asas Modal -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditMaklumatAsas"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Maklumat Asas</h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Nama Had Kifayah</label>
              <input v-model="editForm.namaHadKifayah" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Jenis Isi Rumah</label>
              <input v-model="editForm.jenisIsiRumah" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Pelarasan (RM)</label>
              <input v-model.number="editForm.kadarBerbayar" type="number" step="0.01" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Mula</label>
              <input v-model="editForm.tarikhMula" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status</label>
              <select v-model="editForm.status" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div class="flex items-start">
              <label class="text-sm font-medium text-gray-700 w-40 mt-2">Keterangan</label>
              <textarea v-model="editForm.keterangan" rows="3" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
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
              'bil',
              'indicator',
              'hadKifayah',
              'statusAktif',
              'statusData',
              'tarikhMula',
              'tindakan'
            ]"
            :columns="[
              { key: 'kategoriHadKifayah', label: 'Kategori' },
              { key: 'levelHadKifayah', label: 'Level Had Kifayah' },
              { key: 'bil', label: 'Bil' },
              { key: 'indicator', label: 'Indicator' },
              { key: 'hadKifayah', label: 'Had Kifayah' },
              { key: 'statusAktif', label: 'Status Aktif' },
              { key: 'statusData', label: 'Status Data' },
              { key: 'tarikhMula', label: 'Tarikh Mula' },
              { key: 'tindakan', label: 'Tindakan' }
            ]"
            :pageSize="10"
            :showNoColumn="true"
            :options="{ variant: 'default', hover: true }"
          >
            <template v-slot:kategoriHadKifayah="data">
              <span class="font-medium">{{ data.value.kategoriHadKifayah }}</span>
            </template>
            <template v-slot:levelHadKifayah="data">{{ data.value.levelHadKifayah }}</template>
            <template v-slot:bil="data">{{ data.value.bil }}</template>
            <template v-slot:indicator="data">{{ data.value.indicator }}</template>
            <template v-slot:hadKifayah="data">RM {{ formatCurrency(data.value.hadKifayah) }}</template>
            <template v-slot:statusAktif="data">
              <rs-badge :variant="data.value.statusAktif ? 'success' : 'danger'">
                {{ data.value.statusAktif ? 'Aktif' : 'Tidak Aktif' }}
              </rs-badge>
            </template>
            <template v-slot:statusData="data">{{ data.value.statusData }}</template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tindakan="data">
              <rs-button variant="primary" size="sm" class="!px-2 !py-1" @click="openEditCategory(data.value)">
                Kemaskini
                <Icon name="mdi:pencil" class="ml-1" size="1rem" />
              </rs-button>
            </template>
          </rs-table>
        </template>
      </rs-card>

      <!-- Edit Category Modal -->
      <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditCategory"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Kategori</h3>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Kategori Had Kifayah</label>
              <input v-model="categoryForm.kategoriHadKifayah" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Level Had Kifayah</label>
              <input v-model="categoryForm.levelHadKifayah" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Bil</label>
              <input v-model.number="categoryForm.bil" type="number" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Indicator</label>
              <input v-model="categoryForm.indicator" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Had Kifayah (RM)</label>
              <input v-model.number="categoryForm.hadKifayah" type="number" step="0.01" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status Aktif</label>
              <select v-model="categoryForm.statusAktif" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option :value="true">Aktif</option>
                <option :value="false">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status Data</label>
              <input v-model="categoryForm.statusData" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Mula</label>
              <input v-model="categoryForm.tarikhMula" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-2">
            <rs-button variant="secondary" @click="closeEditCategory">Batal</rs-button>
            <rs-button variant="primary" @click="saveCategory">
              <Icon name="mdi:content-save" class="mr-2" /> Simpan
            </rs-button>
          </div>
        </div>
      </div>

      <!-- Action Buttons Card -->
      <rs-card>
        <template #body>
          <div class="flex justify-end gap-3">
            <rs-button 
              variant="primary" 
              @click="navigateTo(`/BF-PRF/KF/HK/01_01/tambah_kategori?id=${selectedId}`)"
              class="px-6 py-3"
            >
              <Icon name="mdi:folder-plus" class="mr-2" /> Tambah Kategori
            </rs-button>
            <rs-button 
              variant="success" 
              @click="handleHantar"
              class="px-6 py-3"
            >
              <Icon name="mdi:send" class="mr-2" /> Hantar
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
const showCategoryModal = ref(false);
const categoryForm = ref({
  kategoriHadKifayah: '',
  levelHadKifayah: '',
  bil: 0,
  indicator: '',
  hadKifayah: 0,
  statusAktif: true,
  statusData: '',
  tarikhMula: '',
});
let editingCategoryIndex = -1;
const showEditModal = ref(false);
const editForm = ref({
  namaHadKifayah: '',
  jenisIsiRumah: '',
  kadarBerbayar: 0,
  tarikhMula: '',
  status: 'Aktif',
  keterangan: ''
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
        // Seed edit form with current values
        editForm.value = {
          namaHadKifayah: selectedKifayah.value.namaHadKifayah || '',
          jenisIsiRumah: selectedKifayah.value.jenisIsiRumah || '',
          kadarBerbayar: selectedKifayah.value.kadarBerbayar ?? 0,
          tarikhMula: selectedKifayah.value.tarikhMula || '',
          status: selectedKifayah.value.status || 'Aktif',
          keterangan: selectedKifayah.value.keterangan || ''
        };
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

// Edit modal handlers
const openEditMaklumatAsas = () => {
  if (!selectedKifayah.value) return;
  editForm.value = {
    namaHadKifayah: selectedKifayah.value.namaHadKifayah || '',
    jenisIsiRumah: selectedKifayah.value.jenisIsiRumah || '',
    kadarBerbayar: selectedKifayah.value.kadarBerbayar ?? 0,
    tarikhMula: selectedKifayah.value.tarikhMula || '',
    status: selectedKifayah.value.status || 'Aktif',
    keterangan: selectedKifayah.value.keterangan || ''
  };
  showEditModal.value = true;
};

const closeEditMaklumatAsas = () => {
  showEditModal.value = false;
};

const saveMaklumatAsas = () => {
  if (!selectedKifayah.value) return;
  // Update the selected item
  const updated = {
    ...selectedKifayah.value,
    ...editForm.value,
    kadarBerbayar: Number(editForm.value.kadarBerbayar) || 0,
  };
  selectedKifayah.value = updated;

  // Persist back into the array
  const index = allKifayahData.value.findIndex(i => i.idHadKifayah === selectedId);
  if (index !== -1) {
    allKifayahData.value[index] = { ...updated };
  }

  // Save to localStorage
  try {
    localStorage.setItem('kifayahLimits', JSON.stringify(allKifayahData.value));
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Maklumat asas telah dikemaskini');
  } catch (e) {
    console.error('Gagal menyimpan data:', e);
  }

  showEditModal.value = false;
};

// Handle Hantar button click
const handleHantar = () => {
  console.log('Hantar button clicked!'); // Debug log
  try {
    // Show success notification
    const { $toast } = useNuxtApp();
    if ($toast) {
      $toast.success('Data berjaya dihantar kepada pelulus');
      console.log('Toast notification sent successfully');
    } else {
      // Fallback notification if toast is not available
      console.log('Toast not available, using fallback');
      alert('Data berjaya dihantar kepada pelulus');
    }
  } catch (error) {
    console.error('Error showing notification:', error);
    // Fallback notification
    alert('Data berjaya dihantar kepada pelulus');
  }
};

// Category edit handlers
const openEditCategory = (row) => {
  if (!relatedCategories.value) return;
  editingCategoryIndex = relatedCategories.value.findIndex(
    (c) => c.kategoriHadKifayah === row.kategoriHadKifayah && c.levelHadKifayah === row.levelHadKifayah && c.bil === row.bil
  );
  categoryForm.value = { ...row };
  showCategoryModal.value = true;
};

const closeEditCategory = () => {
  showCategoryModal.value = false;
  editingCategoryIndex = -1;
};

const saveCategory = () => {
  if (editingCategoryIndex < 0) return;
  // Update in-memory
  relatedCategories.value[editingCategoryIndex] = { ...categoryForm.value };

  // Persist to localStorage (preserve other entries for other IDs if present)
  try {
    const savedCategoriesRaw = localStorage.getItem('kifayahCategories');
    let all = [];
    if (savedCategoriesRaw) {
      all = JSON.parse(savedCategoriesRaw);
      // Remove entries for this selectedId
      all = all.filter((c) => c.idHadKifayah !== selectedId);
    }
    // Append updated entries with the same idHadKifayah
    const updatedForId = relatedCategories.value.map((c) => ({ ...c, idHadKifayah: selectedId }));
    const merged = [...all, ...updatedForId];
    localStorage.setItem('kifayahCategories', JSON.stringify(merged));

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kategori berjaya dikemaskini');
  } catch (e) {
    console.error('Gagal menyimpan kategori:', e);
  }

  showCategoryModal.value = false;
  editingCategoryIndex = -1;
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