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
      <!-- Main Card with Two Sections -->
      <rs-card>
        <template #body>
          <!-- Section Title -->
          <h3 class="text-lg font-semibold mb-4">Maklumat Kategori</h3>
          <!-- Top Section: General Category Information -->
          <div class="mb-8">
            <div class="space-y-4">
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 w-40">Kod:</span>
                <span class="text-sm text-gray-900">{{ selectedKategori.kod }}</span>
              </div>
              
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 w-40">Kategori Maklumat:</span>
                <span class="text-sm text-gray-900">{{ selectedKategori.namaKategori }}</span>
              </div>
              
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 w-40">Status:</span>
                <rs-badge :variant="getStatusVariant(selectedKategori.status)">
                  {{ selectedKategori.status }}
                </rs-badge>
              </div>
              
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 w-40">Status data:</span>
                <span class="text-sm text-gray-900">{{ selectedKategori.statusData }}</span>
              </div>
              
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 w-40">Tarikh Mula:</span>
                <span class="text-sm text-gray-900">{{ formatDate(selectedKategori.tarikhMula) }}</span>
              </div>
              
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-600 w-40">Tarikh Tamat:</span>
                <span class="text-sm text-gray-900">{{ selectedKategori.tarikhTamat ? formatDate(selectedKategori.tarikhTamat) : '' }}</span>
              </div>
              <div class="flex justify-end pt-2">
                <rs-button variant="primary" class="px-6 py-3" @click="openEditMaklumatAsas">
                  <Icon name="mdi:pencil" class="mr-2" /> Kemaskini Kategori Maklumat
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Bottom Section: RUU Table -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Maklumat Kelulusan Data (RUU)</h3>
            
            <!-- Show table if data exists -->
            <rs-table
              v-if="ruuFields.length > 0"
              :data="ruuFields"
              :field="[
                'namaRuuField',
                'namaNasField',
                'kaedahKemaskini',
                'status',
                'statusData',
                'tarikhMula',
                'tarikhTamat',
                'tindakan'
              ]"
              :columns="[
                { key: 'namaRuuField', label: 'Nama RUU Field' },
                { key: 'namaNasField', label: 'Nama NAS Field' },
                { key: 'kaedahKemaskini', label: 'Kaedah Kemaskini' },
                { key: 'status', label: 'Status' },
                { key: 'statusData', label: 'Status data' },
                { key: 'tarikhMula', label: 'Tarikh Mula' },
                { key: 'tarikhTamat', label: 'Tarikh Tamat' },
                { key: 'tindakan', label: 'Tindakan' }
              ]"
              :pageSize="10"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true }"
            >
              <template v-slot:namaRuuField="data">
                <span class="font-medium">{{ data.value.namaRuuField }}</span>
              </template>
              <template v-slot:namaNasField="data">{{ data.value.namaNasField }}</template>
              <template v-slot:kaedahKemaskini="data">{{ data.value.kaedahKemaskini }}</template>
              <template v-slot:status="data">
                <rs-badge :variant="getStatusVariant(data.value.status)">
                  {{ data.value.status }}
                </rs-badge>
              </template>
              <template v-slot:statusData="data">{{ data.value.statusData }}</template>
              <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
              <template v-slot:tarikhTamat="data">{{ data.value.tarikhTamat ? formatDate(data.value.tarikhTamat) : '' }}</template>
              <template v-slot:tindakan="data">
                <rs-button variant="primary" size="sm" class="!px-3 !py-1" @click="openEditRuufield(data.value)">
                  Kemaskini
                </rs-button>
              </template>
            </rs-table>
            
            <!-- Show message when no data available -->
            <div v-else class="text-center py-8">
              <Icon name="mdi:database-off" class="text-gray-400 mb-4" size="48px" />
              <h4 class="text-lg font-medium text-gray-900 mb-2">Tiada Data Tersedia</h4>
              <p class="text-gray-600">Tiada maklumat kelulusan data (RUU) untuk kategori <strong>{{ selectedKategori?.namaKategori }}</strong> pada masa ini.</p>
            </div>
          </div>
        </template>
      </rs-card>

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

      <!-- Edit RUU Field Modal -->
      <div v-if="showRuufieldModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditRuufield"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini RUU Field</h3>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Nama RUU Field</label>
              <input v-model="ruufieldForm.namaRuuField" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Nama NAS Field</label>
              <input v-model="ruufieldForm.namaNasField" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Kaedah Kemaskini</label>
              <input v-model="ruufieldForm.kaedahKemaskini" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <select v-model="ruufieldForm.status" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status Data</label>
              <select v-model="ruufieldForm.statusData" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Draf">Draf</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
                <option value="Diluluskan">Diluluskan</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Mula</label>
              <input v-model="ruufieldForm.tarikhMula" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Tamat</label>
              <input v-model="ruufieldForm.tarikhTamat" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-2">
            <rs-button variant="secondary" @click="closeEditRuufield">Batal</rs-button>
            <rs-button variant="primary" @click="saveRuufield">
              <Icon name="mdi:content-save" class="mr-2" /> Simpan
            </rs-button>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between">
        <rs-button variant="secondary" @click="goBack" class="px-6 py-3">
          <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
        </rs-button>
        <rs-button variant="primary" @click="handleHantar" class="px-6 py-3">
          <Icon name="mdi:send" class="mr-2" /> Hantar
        </rs-button>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="mt-4">
      <rs-card>
        <template #body>
          <div class="text-center py-8">
            <Icon name="mdi:file-search" class="text-gray-400 mb-4" size="48px" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Rekod Tidak Ditemui</h3>
            <p class="text-gray-600">Maklumat Kategori dengan KOD "{{ selectedKod }}" tidak ditemui.</p>
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
let selectedKod = route.query.kod;
const currentKod = computed(() => route.query.kod || (allKategoriData.value[0]?.kod ?? null));

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
const ruuFields = ref([]);
const showEditModal = ref(false);
const editForm = ref({
  kod: '',
  namaKategori: '',
  status: 'Aktif',
  statusData: '',
  tarikhMula: '',
  tarikhTamat: ''
});
const showRuufieldModal = ref(false);
const ruufieldForm = ref({
  namaRuuField: '',
  namaNasField: '',
  kaedahKemaskini: '',
  status: 'Aktif',
  statusData: 'Draf',
  tarikhMula: '',
  tarikhTamat: ''
});
let editingRuufieldIndex = -1;

// Kategori mapping data (based on BF-PRF/KF/RUU/01_01)
const kategoriMapping = [
  { kod: "1", kategori: "Peribadi" },
  { kod: "2", kategori: "Alamat" },
  { kod: "3", kategori: "Pendidikan" },
  { kod: "4", kategori: "Pengislaman" },
  { kod: "5", kategori: "Perbankan" },
  { kod: "6", kategori: "Kesihatan" },
  { kod: "7", kategori: "Kemahiran" },
  { kod: "8", kategori: "Kediaman/Tempat Tinggal" },
  { kod: "9", kategori: "Pinjaman Harta" },
  { kod: "10", kategori: "Pemilikan Aset" },
  { kod: "11", kategori: "Pekerjaan" },
  { kod: "12", kategori: "Pendapatan dan Perbelanjaan Seisi Rumah" },
  { kod: "13", kategori: "Peribadi Tanggungan" },
  { kod: "14", kategori: "Pengislaman Tanggungan" },
  { kod: "15", kategori: "Perbankan Tanggungan" },
  { kod: "16", kategori: "Pendidikan Tanggungan" },
  { kod: "17", kategori: "Kesihatan Tanggungan" },
  { kod: "18", kategori: "Kemahiran Tanggungan" },
  { kod: "19", kategori: "Pekerjaan Tanggungan" },
];

// Function to get kategori description by kod
const getKategoriByKod = (kod) => {
  const mapping = kategoriMapping.find(item => item.kod === kod);
  return mapping ? mapping.kategori : "Peribadi"; // Default to Peribadi if not found
};

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

// Default data for different categories (matching lihat page exactly)
const getDefaultDataByKod = (kod) => {
  // Only Peribadi has data currently
  if (kod === "1" || kod === "Peribadi") {
    return [
      {
        namaRuuField: "Identification Type",
        namaNasField: "Jenis ID",
        kaedahKemaskini: "Update asnaf with approval/verify",
        status: "Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: "",
      },
      {
        namaRuuField: "Passport No",
        namaNasField: "Pengenalan ID",
        kaedahKemaskini: "Asnaf Review",
        status: "Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: "",
      },
      {
        namaRuuField: "MyKad",
        namaNasField: "Pengenalan ID",
        kaedahKemaskini: "Asnaf Review",
        status: "Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: "",
      },
    ];
  }
  
  // For all other categories, return empty array (no data available)
  return [];
};

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

// Function to load RUU fields based on selected kategori kod
const loadRuufields = () => {
  try {
    console.log('Loading RUU fields for kod:', selectedKod);
    const savedRuufields = localStorage.getItem('ruuFields');
    if (savedRuufields) {
      const parsedData = JSON.parse(savedRuufields);
      // Filter RUU fields by selected kategori kod
      const filteredData = parsedData.filter(field => field.kategoriKod === selectedKod);
      console.log('Filtered saved RUU fields for kod', selectedKod, ':', filteredData);
      
      if (filteredData.length > 0) {
        ruuFields.value = filteredData.map(validateDataItem);
        console.log('Loaded saved RUU fields:', ruuFields.value);
      } else {
        // No saved data for this kod, use default data
        console.log('No saved data for kod', selectedKod, ', using default data');
        const defaultData = getDefaultDataByKod(selectedKod);
        console.log('Using default data for kod:', selectedKod, defaultData);
        ruuFields.value = defaultData.map((item, index) => ({
          ...item,
          id: `default_${index + 1}`,
          kategoriKod: selectedKod
        }));
        console.log('Final RUU fields:', ruuFields.value);
      }
    } else {
      // Use default data for the selected kategori kod and add necessary fields for editing
      const defaultData = getDefaultDataByKod(selectedKod);
      console.log('Using default data for kod:', selectedKod, defaultData);
      ruuFields.value = defaultData.map((item, index) => ({
        ...item,
        id: `default_${index + 1}`,
        kategoriKod: selectedKod
      }));
      console.log('Final RUU fields:', ruuFields.value);
    }
  } catch (error) {
    console.error('Error loading RUU fields:', error);
    const defaultData = getDefaultDataByKod(selectedKod);
    ruuFields.value = defaultData.map((item, index) => ({
      ...item,
      id: `default_${index + 1}`,
      kategoriKod: selectedKod
    }));
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
    
    // Determine KOD to use (route kod or fallback to first record)
    const kodToUse = route.query.kod || "1";
    console.log('Loading data for kod:', kodToUse);
    console.log('Available kategori data:', allKategoriData.value);
    
    if (kodToUse) {
      // Update selectedKod before loading RUU fields
      selectedKod = kodToUse;
      
      // Create selectedKategori from mapping if not found in saved data
      const foundKategori = allKategoriData.value.find(item => item.kod === kodToUse);
      console.log('Found kategori:', foundKategori);
      
      selectedKategori.value = foundKategori || {
        id: kodToUse,
        kod: kodToUse,
        namaKategori: getKategoriByKod(kodToUse),
        status: "Tidak Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: ""
      };
      
      console.log('Selected kategori:', selectedKategori.value);
      
      // Load RUU fields for this specific kategori
      loadRuufields();
      // Seed edit form with current values
      editForm.value = {
        kod: selectedKategori.value.kod || '',
        namaKategori: selectedKategori.value.namaKategori || '',
        status: selectedKategori.value.status || 'Aktif',
        statusData: selectedKategori.value.statusData || '',
        tarikhMula: selectedKategori.value.tarikhMula || '',
        tarikhTamat: selectedKategori.value.tarikhTamat || ''
      };
    } else {
      error.value = "Tiada KOD untuk dipaparkan.";
    }
    
    // Ensure selectedKategori is always set for any valid kod
    if (!selectedKategori.value && kodToUse) {
      selectedKategori.value = {
        id: kodToUse,
        kod: kodToUse,
        namaKategori: getKategoriByKod(kodToUse),
        status: "Tidak Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: ""
      };
      selectedKod = kodToUse;
      loadRuufields();
      console.log('Fallback selectedKategori set:', selectedKategori.value);
    }
    
    // Final check to ensure selectedKategori is set
    if (!selectedKategori.value && route.query.kod) {
      console.log('Final fallback: Setting selectedKategori for kod:', route.query.kod);
      selectedKategori.value = {
        id: route.query.kod,
        kod: route.query.kod,
        namaKategori: getKategoriByKod(route.query.kod),
        status: "Tidak Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: ""
      };
      selectedKod = route.query.kod;
      loadRuufields();
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

// RUU field edit handlers
const openEditRuufield = (row) => {
  if (!ruuFields.value) return;
  editingRuufieldIndex = ruuFields.value.findIndex(
    (r) => r.id === row.id
  );
  ruufieldForm.value = { ...row };
  showRuufieldModal.value = true;
};

const closeEditRuufield = () => {
  showRuufieldModal.value = false;
  editingRuufieldIndex = -1;
};

const saveRuufield = () => {
  if (editingRuufieldIndex < 0) return;
  // Update in-memory with kategoriKod
  ruuFields.value[editingRuufieldIndex] = { ...ruufieldForm.value, kategoriKod: selectedKod };

  // Persist to localStorage - merge with existing data
  try {
    const savedRuufields = localStorage.getItem('ruuFields');
    let allRuufields = [];
    if (savedRuufields) {
      allRuufields = JSON.parse(savedRuufields);
      // Remove existing entries for this kategoriKod
      allRuufields = allRuufields.filter(field => field.kategoriKod !== selectedKod);
    }
    // Add updated entries for this kategoriKod
    const updatedForKod = ruuFields.value.map(field => ({ ...field, kategoriKod: selectedKod }));
    const merged = [...allRuufields, ...updatedForKod];
    localStorage.setItem('ruuFields', JSON.stringify(merged));

    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('RUU field berjaya dikemaskini');
  } catch (e) {
    console.error('Gagal menyimpan RUU field:', e);
  }

  showRuufieldModal.value = false;
  editingRuufieldIndex = -1;
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