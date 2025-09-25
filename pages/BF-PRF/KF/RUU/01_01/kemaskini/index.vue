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
    <div v-else-if="selectedKategori" class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Kategori</h2>
            <rs-button variant="secondary" @click="goBack">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Kategori Maklumat</h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Kod:</span>
              <span class="text-sm text-gray-900">{{ selectedKategori.kod }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Kategori Maklumat:</span>
              <span class="text-sm text-gray-900">{{ selectedKategori.namaKategori }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status:</span>
              <rs-badge :variant="getStatusVariant(selectedKategori.status)">
                {{ selectedKategori.status }}
              </rs-badge>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status Data:</span>
              <span class="text-sm text-gray-900">{{ selectedKategori.statusData }}</span>
            </div>
            
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Mula:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedKategori.tarikhMula) }}</span>
            </div>
            
            <div v-if="selectedKategori.tarikhTamat" class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Tamat:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedKategori.tarikhTamat) }}</span>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Edit Maklumat Asas Button -->
      <div class="flex justify-end">
        <rs-button variant="primary" class="px-6 py-3" @click="openEditMaklumatAsas">
          <Icon name="mdi:pencil" class="mr-2" /> Kemaskini Kategori Maklumat
        </rs-button>
      </div>

      <!-- Edit Maklumat Asas Modal -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditMaklumatAsas"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Kategori Maklumat</h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Kod</label>
              <input v-model="editForm.kod" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Kategori Maklumat</label>
              <input v-model="editForm.namaKategori" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status</label>
              <select v-model="editForm.status" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status Data</label>
              <input v-model="editForm.statusData" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Mula</label>
              <input v-model="editForm.tarikhMula" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Tamat</label>
              <input v-model="editForm.tarikhTamat" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              'kategoriMaklumat',
              'levelKategori',
              'bil',
              'indicator',
              'statusAktif',
              'statusData',
              'tarikhMula',
              'tindakan'
            ]"
            :columns="[
              { key: 'kategoriMaklumat', label: 'Kategori Maklumat' },
              { key: 'levelKategori', label: 'Level Kategori' },
              { key: 'bil', label: 'Bil' },
              { key: 'indicator', label: 'Indicator' },
              { key: 'statusAktif', label: 'Status Aktif' },
              { key: 'statusData', label: 'Status Data' },
              { key: 'tarikhMula', label: 'Tarikh Mula' },
              { key: 'tindakan', label: 'Tindakan' }
            ]"
            :pageSize="10"
            :showNoColumn="true"
            :options="{ variant: 'default', hover: true }"
          >
            <template v-slot:kategoriMaklumat="data">
              <span class="font-medium">{{ data.value.kategoriMaklumat }}</span>
            </template>
            <template v-slot:levelKategori="data">{{ data.value.levelKategori }}</template>
            <template v-slot:bil="data">{{ data.value.bil }}</template>
            <template v-slot:indicator="data">{{ data.value.indicator }}</template>
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
              <label class="text-sm font-medium text-gray-700">Kategori Maklumat</label>
              <input v-model="categoryForm.kategoriMaklumat" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Level Kategori</label>
              <input v-model="categoryForm.levelKategori" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Bil</label>
              <input v-model.number="categoryForm.bil" type="number" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">Indicator</label>
                <rs-button size="sm" variant="secondary" class="!px-2 !py-1" @click="addIndicatorRow">
                  <Icon name="mdi:plus" class="mr-1" /> Tambah Baris
                </rs-button>
              </div>
              <div class="mt-2 space-y-2">
                <div v-for="(ind, idx) in categoryIndicators" :key="idx" class="flex items-center gap-2">
                  <input v-model="categoryIndicators[idx]" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <rs-button size="sm" variant="danger" class="!px-2 !py-1" @click="removeIndicatorRow(idx)">
                    <Icon name="mdi:delete" />
                  </rs-button>
                </div>
              </div>
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
              @click="navigateTo(`/BF-PRF/KF/RUU/01_01/tambah_kategori?id=${currentId}`)"
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
            <p class="text-gray-600">Maklumat Kategori dengan ID "{{ selectedId }}" tidak ditemui.</p>
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
  title: "Maklumat Kategori",
});

// Get query parameters
const route = useRoute();
const selectedId = route.query.id;
const currentId = computed(() => route.query.id || (allKategoriData.value[0]?.id ?? null));

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/RUU/admin",
  },
  {
    name: "Konfigurasi Kelulusan Data (RUU)",
    type: "link",
    path: "/BF-PRF/KF/RUU/01_01",
  },
  {
    name: "Maklumat Kategori",
    type: "current",
    path: "/BF-PRF/KF/RUU/01_01/kemaskini",
  },
]);

// State management
const loading = ref(true);
const error = ref(null);
const selectedKategori = ref(null);
const allKategoriData = ref([]);
const relatedCategories = ref([]);
const showCategoryModal = ref(false);
const categoryForm = ref({
  kategoriMaklumat: '',
  levelKategori: '',
  bil: 0,
  indicator: '',
  statusAktif: true,
  statusData: '',
  tarikhMula: '',
});
let editingCategoryIndex = -1;
const categoryIndicators = ref([]); // array of indicator strings
const showEditModal = ref(false);
const editForm = ref({
  kod: '',
  namaKategori: '',
  status: 'Aktif',
  statusData: '',
  tarikhMula: '',
  tarikhTamat: ''
});

// Default data (fallback if no data in localStorage)
const defaultData = [
  {
    id: "1",
    kod: "1",
    namaKategori: "Peribadi",
    status: "Tidak Aktif",
    statusData: "Draf",
    tarikhMula: "2026-01-01",
    tarikhTamat: "",
  },
];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure date is valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2026-01-01",
    // Ensure status is valid
    status: item.status || "Aktif"
  };
};

// Function to load related categories
const loadRelatedCategories = () => {
  try {
    const savedCategories = localStorage.getItem('kategoriMaklumatCategories');
    if (savedCategories && currentId.value) {
      const allCategories = JSON.parse(savedCategories);
      // Filter categories that belong to the selected Kategori
      relatedCategories.value = allCategories.filter(category => 
        category.idKategori === currentId.value
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
    
    const savedData = localStorage.getItem('kategoriMaklumat');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and sanitize parsed data
      const validatedData = parsedData.map(validateDataItem);
      
      // Merge with default data, giving priority to saved data
      const mergedData = [...defaultData];
      validatedData.forEach(savedItem => {
        // Check if item already exists in default data
        const existingIndex = mergedData.findIndex(item => item.id === savedItem.id);
        if (existingIndex >= 0) {
          // Replace existing item
          mergedData[existingIndex] = validateDataItem(savedItem);
        } else {
          // Add new item
          mergedData.push(validateDataItem(savedItem));
        }
      });
      allKategoriData.value = mergedData;
    } else {
      allKategoriData.value = defaultData;
    }
    
    // Determine ID to use (route id or fallback to first record)
    const idToUse = route.query.id || (allKategoriData.value[0]?.id ?? null);
    if (idToUse) {
      selectedKategori.value = allKategoriData.value.find(item => item.id === idToUse) || null;
      if (!selectedKategori.value) {
        error.value = `Rekod dengan ID "${idToUse}" tidak ditemui.`;
      } else {
        // Load related categories
        loadRelatedCategories();
        // Seed edit form with current values
        editForm.value = {
          kod: selectedKategori.value.kod || '',
          namaKategori: selectedKategori.value.namaKategori || '',
          status: selectedKategori.value.status || 'Aktif',
          statusData: selectedKategori.value.statusData || '',
          tarikhMula: selectedKategori.value.tarikhMula || '',
          tarikhTamat: selectedKategori.value.tarikhTamat || ''
        };
      }
    } else {
      error.value = "Tiada data untuk dipaparkan.";
    }
    
  } catch (error) {
    console.error('Error loading data:', error);
    error.value = "Ralat semasa memuatkan data.";
    allKategoriData.value = defaultData;
  } finally {
    loading.value = false;
  }
};

// Navigation function
const goBack = () => {
  navigateTo('/BF-PRF/KF/RUU/01_01');
};

// Edit modal handlers
const openEditMaklumatAsas = () => {
  if (!selectedKategori.value) return;
  editForm.value = {
    kod: selectedKategori.value.kod || '',
    namaKategori: selectedKategori.value.namaKategori || '',
    status: selectedKategori.value.status || 'Aktif',
    statusData: selectedKategori.value.statusData || '',
    tarikhMula: selectedKategori.value.tarikhMula || '',
    tarikhTamat: selectedKategori.value.tarikhTamat || ''
  };
  showEditModal.value = true;
};

const closeEditMaklumatAsas = () => {
  showEditModal.value = false;
};

const saveMaklumatAsas = () => {
  if (!selectedKategori.value) return;
  // Update the selected item
  const updated = {
    ...selectedKategori.value,
    ...editForm.value,
  };
  selectedKategori.value = updated;

  // Persist back into the array
  const index = allKategoriData.value.findIndex(i => i.id === currentId.value);
  if (index !== -1) {
    allKategoriData.value[index] = { ...updated };
  }

  // Save to localStorage
  try {
    localStorage.setItem('kategoriMaklumat', JSON.stringify(allKategoriData.value));
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kategori Maklumat telah dikemaskini');
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
    // Redirect to RUU/01_01 after brief delay
    setTimeout(() => {
      navigateTo('/BF-PRF/KF/RUU/01_01');
    }, 1000);
  } catch (error) {
    console.error('Error showing notification:', error);
    // Fallback notification
    alert('Data berjaya dihantar kepada pelulus');
    // Redirect even if toast fails
    navigateTo('/BF-PRF/KF/RUU/01_01');
  }
};

// Category edit handlers
const openEditCategory = (row) => {
  if (!relatedCategories.value) return;
  editingCategoryIndex = relatedCategories.value.findIndex(
    (c) => c.kategoriMaklumat === row.kategoriMaklumat && c.levelKategori === row.levelKategori && c.bil === row.bil
  );
  categoryForm.value = { ...row };
  // Seed indicators array (split by comma if string)
  if (Array.isArray(row.indicator)) {
    categoryIndicators.value = [...row.indicator];
  } else if (typeof row.indicator === 'string' && row.indicator.trim() !== '') {
    // Split by semicolon or comma, support "ff1; ff2" or "ff1, ff2"
    categoryIndicators.value = row.indicator
      .split(/[;,]+/)
      .map(s => s.trim())
      .filter(Boolean);
  } else {
    categoryIndicators.value = [''];
  }
  showCategoryModal.value = true;
};

const closeEditCategory = () => {
  showCategoryModal.value = false;
  editingCategoryIndex = -1;
};

const saveCategory = () => {
  if (editingCategoryIndex < 0) return;
  // Update in-memory
  const indicatorValue = categoryIndicators.value
    .map(v => (v || '').toString().trim())
    .filter(Boolean)
    .join('; '); // persist using semicolon to match existing data format
  relatedCategories.value[editingCategoryIndex] = { ...categoryForm.value, indicator: indicatorValue };

  // Persist to localStorage (preserve other entries for other IDs if present)
  try {
    const savedCategoriesRaw = localStorage.getItem('kategoriMaklumatCategories');
    let all = [];
    if (savedCategoriesRaw) {
      all = JSON.parse(savedCategoriesRaw);
      // Remove entries for this selectedId
      all = all.filter((c) => c.idKategori !== currentId.value);
    }
    // Append updated entries with the same idKategori
    const updatedForId = relatedCategories.value.map((c) => ({ ...c, idKategori: currentId.value }));
    const merged = [...all, ...updatedForId];
    localStorage.setItem('kategoriMaklumatCategories', JSON.stringify(merged));

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kategori berjaya dikemaskini');
  } catch (e) {
    console.error('Gagal menyimpan kategori:', e);
  }

  showCategoryModal.value = false;
  editingCategoryIndex = -1;
};

const addIndicatorRow = () => {
  categoryIndicators.value.push('');
};

const removeIndicatorRow = (index) => {
  if (categoryIndicators.value.length <= 1) {
    categoryIndicators.value[0] = '';
    return;
  }
  categoryIndicators.value.splice(index, 1);
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
  
  <style scoped>
  :deep(.formkit-outer) {
    margin-bottom: 0 !important;
  }
  :deep(.formkit-label) {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  :deep(.formkit-help) {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
  
  :deep(.formkit-messages) {
    margin-top: 0.25rem;
  }
  
  :deep(.formkit-message) {
    font-size: 0.875rem;
    color: #dc2626;
  }
  
  :deep(.formkit-input) {
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  :deep(.formkit-input:focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
  }
  
  :deep(.formkit-input[aria-invalid="true"]) {
    border-color: #dc2626;
  }
  
  :deep(.formkit-input[aria-invalid="true"]:focus) {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  
  </style>