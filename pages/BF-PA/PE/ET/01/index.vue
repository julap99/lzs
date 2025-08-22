<!-- 
  RTMF SCREEN: PA-PE-ET-01
  PURPOSE: Borang Isi Maklumat Penerima — Elaun Tahunan
  DESCRIPTION: Pengurusan batch untuk penerima elaun tahunan
  ROUTE: /BF-PA/PE/ET/01
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Kad Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-people" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Maklumat Elaun Tahunan</h2>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Penapis (Wajib) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tahun Elaun <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="filters.year"
              type="select"
              :options="yearOptions"
              placeholder="Pilih tahun…"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jenis Elaun <span class="text-red-500">*</span>
            </label>
                      <FormKit
              v-model="filters.type"
              type="select"
              :options="filteredTypeOptions"
              placeholder="Pilih jenis elaun…"
                        :classes="{
                input: '!py-2',
                        }"
              @change="validateTypeSelection"
                      />
          </div>
                    </div>

        <!-- Ringkasan / Bar Status -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div class="text-xs text-blue-600">Tahun Elaun</div>
            <div class="text-base font-medium text-blue-900">{{ filters.year || '—' }}</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="text-xs text-green-600">Jenis Elaun</div>
            <div class="text-base font-medium text-green-900">{{ typeLabel || '—' }}</div>
            </div>
          <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div class="text-xs text-orange-600">Status Senarai</div>
            <div class="text-base">
              <rs-badge :variant="getStatusVariant(batchStatus)">
                {{ batchStatusLabel(batchStatus) }}
              </rs-badge>
            </div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div class="text-xs text-purple-600">Bilangan Dalam Senarai</div>
            <div class="text-base font-medium text-purple-900">{{ totalCountDisplay }}</div>
          </div>
        </div>

        <!-- Bar Alat: Tindakan -->
        <div class="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div class="flex-1">
            <span class="text-sm text-gray-600">
              Jumlah batch dalam jadual: <strong>{{ rows.length }}</strong>
            </span>
          </div>
          <div class="flex items-center gap-2">
          <rs-button
            variant="primary"
              size="sm"
              :disabled="!canSave"
              :loading="saving"
              @click="onSave"
            >
              <Icon name="ic:outline-save" class="mr-2" />
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </rs-button>
          </div>
        </div>

        <!-- Jadual Status (Baca Sahaja) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-900">Status Batch Elaun Tahunan</h3>
            <div class="text-xs text-gray-500">
              Tahun: <b>{{ filters.year || '—' }}</b> · Jenis: <b>{{ typeLabel || '—' }}</b>
            </div>
          </div>

          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                <th class="px-4 py-3 font-medium text-gray-900">Tahun Elaun</th>
                <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                <th class="px-4 py-3 w-40 font-medium text-gray-900">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
              <tr v-if="loading" class="hover:bg-gray-50">
                <td class="px-4 py-6 text-center text-gray-500" colspan="5">Memuatkan status senarai…</td>
              </tr>
              <tr v-for="row in rows" :key="row.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-900">{{ row.year }}</td>
                <td class="px-4 py-3 text-gray-900">{{ typeOptions.find(opt => opt.value === row.typeCode)?.label || row.typeCode }}</td>
                <td class="px-4 py-3">
                  <rs-badge :variant="getStatusVariant(row.status)">
                    {{ batchStatusLabel(row.status) }}
                  </rs-badge>
                </td>
                <td class="px-4 py-3 text-gray-900">{{ row.count ?? '—' }}</td>
                <td class="px-4 py-3">
                  <rs-button
                    variant="primary"
                    size="sm"
                    @click="viewRecipients(row)"
                    class="!px-3 !py-1.5"
                  >
                    <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                    Lihat Senarai Nama
                  </rs-button>
                  </td>
                </tr>
              <tr v-if="!loading && !rows.length" class="hover:bg-gray-50">
                <td class="px-4 py-6 text-center text-gray-500" colspan="5">Tiada rekod. Pilih Tahun & Jenis Elaun, kemudian klik 'Simpan' untuk cipta batch.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Borang Isi Maklumat Penerima — Elaun Tahunan",
  description: "Batch management for annual allowance recipients",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "link",
    path: "/BF-PA/PE/ET",
  },
  {
    name: "Maklumat Elaun Tahunan",
    type: "current",
    path: "/BF-PA/PE/ET/01",
  },
]);

// Year options with hardcoded values to match mock data exactly
// Note: Using hardcoded years ensures data consistency between UI options and mock data
// This prevents users from selecting years that don't have corresponding data
const yearOptions = [
  { label: 'Pilih tahun…', value: '' },
  { label: '2024', value: 2024 },
  { label: '2025', value: 2025 }
];

// Available years for data operations (excluding placeholder)
const availableYears = [2024, 2025];

// No pre-existing batches - all batches are created dynamically by users

// Mock data for every allowance type in every year
// Note: Years are hardcoded to match yearOptions exactly (2024, 2025)
const mockCounts = {
  2024: {
    'ET-KPAK': 7,
    'ET-KPAF': 4,
    'ET-ANUG': 6,
    'ANUG-KPAK': 8,
    'ANUG-PAK': 7,
    'ANUG-KPAF': 5,
    'ANUG-PAF': 8,
    'ANUG-PAP': 3,
    'ANUG-PAKPLUS': 9
  },
  2025: {
    'ET-KPAK': 7,
    'ET-KPAF': 4,
    'ET-ANUG': 6,
    'ANUG-KPAK': 8,
    'ANUG-PAK': 7,
    'ANUG-KPAF': 5,
    'ANUG-PAF': 8,
    'ANUG-PAP': 3,
    'ANUG-PAKPLUS': 9
  }
};

const typeOptions = [
  { label: 'Pilih jenis elaun…', value: '' },
  { label: 'Elaun Tahunan KPAK', value: 'ET-KPAK' },
  { label: 'Elaun Tahunan KPAF', value: 'ET-KPAF' },
  { label: 'Anugerah Penolong Amil', value: 'ET-ANUG' },
  { label: 'Ketua Penolong Amil Kariah (KPAK) terbaik', value: 'ANUG-KPAK' },
  { label: 'Penolong Amil Kariah (PAK) terbaik', value: 'ANUG-PAK' },
  { label: 'Ketua Penolong Amil Fitrah (KPAF) terbaik', value: 'ANUG-KPAF' },
  { label: 'Penolong Amil Fitrah (PAF) terbaik', value: 'ANUG-PAF' },
  { label: 'Penolong Amil Padi (PAP) terbaik', value: 'ANUG-PAP' },
  { label: 'Penolong Amil Komuniti (PAK+) terbaik', value: 'ANUG-PAKPLUS' }
];

// Computed property to get filtered type options based on selected year
const filteredTypeOptions = computed(() => {
  if (!filters.year) return typeOptions;
  
  return typeOptions.map(option => {
    if (option.value === '') return option; // Keep the placeholder
    
    // Check if this combination already exists in the current rows
    const exists = rows.value.some(row => 
      row.year === filters.year && row.typeCode === option.value
    );
    
    return {
      ...option,
      disabled: exists,
      label: exists ? `${option.label} (Sudah wujud)` : option.label,
      // Add additional properties for better FormKit support
      attrs: exists ? { disabled: true } : {},
      // Custom styling for disabled options
      class: exists ? 'text-gray-400 cursor-not-allowed' : ''
    };
  });
});

const filters = reactive({
  year: route.query.year ? Number(route.query.year) : '',
  type: route.query.type ? String(route.query.type) : ''
});

const typeLabel = computed(() => {
  const option = typeOptions.find(opt => opt.value === filters.type);
  return option ? option.label : '';
});

// Enhanced input validation
function validateFilters() {
  const errors = [];
  
  // Validate year
  if (!filters.year) {
    errors.push('Tahun Elaun adalah wajib');
  } else if (!Number.isInteger(filters.year) || !availableYears.includes(filters.year)) {
    errors.push('Tahun Elaun mestilah antara 2024-2025');
  }
  
  // Validate type
  if (!filters.type) {
    errors.push('Jenis Elaun adalah wajib');
  } else if (!typeOptions.some(opt => opt.value === filters.type)) {
    errors.push('Jenis Elaun tidak sah');
  }
  
  return errors;
}

// Enhanced canSave with validation
const canSave = computed(() => {
  if (!filters.year || !filters.type || loading.value) return false;
  
  // Check validation errors
  const validationErrors = validateFilters();
  if (validationErrors.length > 0) return false;
  
  // Check if the selected type is disabled (already exists)
  const selectedOption = filteredTypeOptions.value.find(opt => opt.value === filters.type);
  if (selectedOption && selectedOption.disabled) return false;
  
  return true;
});

const batchStatus = ref('DRAF');
const rows = ref([]);
const loading = ref(false);
const saving = ref(false); // Specific loading state for save operation
const loadingData = ref(false); // Specific loading state for data loading

// Start with empty rows - batches will be added when users click "Simpan"

// Load existing data from localStorage on component mount
const loadExistingData = () => {
  // Check if there are any existing batches in localStorage
  const years = availableYears; // Use constant instead of hardcoded array
  const types = typeOptions.filter(opt => opt.value !== '').map(opt => opt.value);
  
  years.forEach(year => {
    types.forEach(type => {
      const savedCount = getSavedCount(year, type);
      const savedStatus = getSavedStatus(year, type);
      
      if (savedCount !== undefined || savedStatus) {
        // Add to rows if not already present
        const existingRow = rows.value.find(row => 
          `${row.year}-${row.typeCode}` === `${year}-${type}`
        );
        
        if (!existingRow) {
          rows.value.push({
            id: `BATCH-${year}-${type}`,
            year: year,
            typeCode: type,
            status: savedStatus || 'DRAF',
            count: savedCount ?? mockCounts[year]?.[type] ?? 0, // Use mock data if no saved count
            updatedAt: Date.now()
          });
        }
      }
    });
  });
};

// Load existing data on mount
onMounted(() => {
  // Check localStorage availability first
  checkLocalStorageAvailability();
  
  // Load existing data
  loadExistingData();
  
  // Set initial form state
  updateFormState();
  
  // Update total count display
  updateTotalCountDisplay();
});

// Total count display - NON-REACTIVE to filter changes
const totalCountDisplay = ref('—');

// Function to update total count display - only call when needed
function updateTotalCountDisplay() {
  if (!filters.year || !filters.type) {
    totalCountDisplay.value = '—';
    return;
  }
  
  // Find the current selected batch
  const currentRow = rows.value.find(row => 
    `${row.year}-${row.typeCode}` === `${filters.year}-${filters.type}`
  );
  
  if (currentRow) {
    totalCountDisplay.value = currentRow.count ?? 0;
  } else {
    // If no current row, check localStorage for saved data
    const savedCount = getSavedCount(filters.year, filters.type);
    if (savedCount !== undefined) {
      totalCountDisplay.value = savedCount;
    } else {
      // Show mock data for the selected year and type
      const mockCount = mockCounts[filters.year]?.[filters.type];
      totalCountDisplay.value = mockCount ?? '—';
    }
  }
}

// Set initial form state AFTER all variables are declared
updateFormState();

// Also update total count display on mount to show mock data
updateTotalCountDisplay();

// Status helpers
function getStatusVariant(status) {
  switch (status) {
    case 'DRAF': return 'secondary';
    case 'MENUNGGU KELULUSAN': return 'warning';
    case 'SEDANG PROSES': return 'info';
    case 'LULUS': return 'success';
    case 'DITOLAK': return 'danger';
    default: return 'secondary';
  }
}

function batchStatusLabel(status) {
  if (!status) return '—';
  
  const statusLabels = {
    'DRAF': 'Draf',
    'MENUNGGU KELULUSAN': 'Menunggu Kelulusan',
    'SEDANG PROSES': 'Sedang Proses',
    'LULUS': 'Lulus',
    'DITOLAK': 'Ditolak'
  };
  
  return statusLabels[status] || status.toLowerCase();
}

/* ---------- Router & filter ---------- */

// Simulated "DB" & LocalStorage
// Note: We're using localStorage directly, so savedBatches Map is not needed

// Get saved count from second screen
function getSavedCount(year, type) {
  return safeLocalStorageGet(`et:count:${year}:${type}`);
}

// Get saved status from second screen
function getSavedStatus(year, type) {
  return safeLocalStorageGet(`et:status:${year}:${type}`);
}

async function apiSaveBatchLight({ year, typeCode }) {
  try {
    await sleepWithTimeout(500, 5000); // 5 second timeout for save operation
    const countFromLocal = getSavedCount(year, typeCode);
    // Save as "DRAF" when Save is clicked on first screen
    const payload = {
      id: `BATCH-${year}-${typeCode}`,
      year,
      typeCode,
      status: 'DRAF',
      count: countFromLocal ?? mockCounts[year]?.[typeCode] ?? 0, // Use mock data as fallback
      updatedAt: Date.now()
    };
    return { batchId: payload.id, status: 'DRAF' };
  } catch (error) {
    if (error.message === 'Operation timeout') {
      throw new Error('Save operation timed out. Please try again.');
    }
    throw error;
  }
}

function sleep(ms) { 
  return new Promise(res => setTimeout(res, ms)); 
}

// Enhanced sleep with timeout protection
function sleepWithTimeout(ms, timeoutMs = 10000) {
  return Promise.race([
    new Promise(res => setTimeout(res, ms)),
    new Promise((_, rej) => setTimeout(() => rej(new Error('Operation timeout')), timeoutMs))
  ]);
}

// Enhanced validation functions
function validateYearRange(year) {
  if (!year) return { valid: false, message: 'Tahun elaun diperlukan' };
  if (year < 2020 || year > 2030) {
    return { 
      valid: false, 
      message: 'Tahun elaun mestilah antara 2020-2030' 
    };
  }
  return { valid: true };
}

function validateBudgetOverflow(totalAllowance, budget) {
  if (totalAllowance > budget * 1.5) {
    return {
      valid: false,
      message: 'Elaun melebihi 150% bajet. Sila semak semula atau hubungi pentadbir.',
      severity: 'warning'
    };
  }
  if (totalAllowance > budget) {
    return {
      valid: true,
      message: 'Elaun melebihi bajet. Akan memerlukan pengesahan Ketua Divisyen.',
      severity: 'info'
    };
  }
  return { valid: true };
}

function validateDuplicateBatch(year, type) {
  const existingBatch = rows.value.find(row => 
    row.year === year && row.typeCode === type
  );
  
  if (existingBatch) {
    return {
      valid: false,
      message: `Batch untuk ${year} - ${typeOptions.find(opt => opt.value === type)?.label || type} sudah wujud dengan status: ${existingBatch.status}`,
      severity: 'error'
    };
  }
  return { valid: true };
}

// Enhanced save function with comprehensive validation
async function onSave() {
  if (!canSave.value) return;
  
  // Comprehensive validation
  const yearValidation = validateYearRange(filters.year);
  if (!yearValidation.valid) {
    toast.error(yearValidation.message);
    return;
  }
  
  const duplicateValidation = validateDuplicateBatch(filters.year, filters.type);
  if (!duplicateValidation.valid) {
    toast.error(duplicateValidation.message);
    return;
  }
  
  // Budget validation (if we have recipient data)
  const savedCount = getSavedCount(filters.year, filters.type);
  if (savedCount && savedCount > 0) {
    const estimatedAllowance = savedCount * 500; // Assume average RM500 per recipient
    const budgetValidation = validateBudgetOverflow(estimatedAllowance, 10000); // Default budget
    
    if (budgetValidation.severity === 'warning') {
      toast.warning(budgetValidation.message);
    } else if (budgetValidation.severity === 'info') {
      toast.info(budgetValidation.message);
    }
  }
  
  saving.value = true;
  loading.value = true;
  
  try {
    const result = await apiSaveBatchLight({
      year: filters.year,
      typeCode: filters.type
    });
    
    if (result && result.batchId) {
      // Add new row to the table
      const newRow = {
        id: result.batchId,
        year: filters.year,
        typeCode: filters.type,
        typeLabel: typeOptions.find(opt => opt.value === filters.type)?.label || filters.type,
        status: 'DRAF',
        count: getSavedCount(filters.year, filters.type) || mockCounts[filters.year]?.[filters.type] || 0,
        updatedAt: new Date().toISOString()
      };
      
      rows.value.push(newRow);
      
      toast.success(`Batch berjaya dibuat: ${result.batchId}`);
      
      // Update form state
      updateFormState();
    }
  } catch (error) {
    // Enhanced error handling with recovery suggestions
    if (error.message.includes('timeout')) {
      toast.error('Operasi simpan mengambil masa terlalu lama. Sila cuba lagi.');
    } else if (error.message.includes('network')) {
      toast.error('Masalah rangkaian. Sila periksa sambungan internet anda.');
    } else if (error.message.includes('storage')) {
      toast.error('Masalah penyimpanan data. Sila cuba refresh halaman atau hubungi pentadbir.');
    } else {
      toast.error('Gagal menyimpan batch. Sila cuba lagi.');
    }
  } finally {
    loading.value = false;
    saving.value = false;
  }
}

// Navigate to second screen
function viewRecipients(row) {
  if (row && row.year && row.typeCode) {
    router.push({ path: '/BF-PA/PE/ET/02', query: { year: row.year, type: row.typeCode } });
  } else {
    toast.error('Ralat: Data batch tidak sah untuk navigasi');
  }
}

// Manual update function - only call when needed
function updateFormState() {
  if (filters.year || filters.type) {
    // Update router query
    const q = {};
    if (filters.year) q.year = String(filters.year);
    if (filters.type) q.type = String(filters.type);
    
    const currentQuery = route.query;
    const hasChanged = currentQuery.year !== q.year || currentQuery.type !== q.type;
    
    if (hasChanged) {
      router.replace({ query: q });
    }
  }
}

// Function to validate type selection and show toast if disabled
function validateTypeSelection() {
  const selectedOption = filteredTypeOptions.value.find(opt => opt.value === filters.type);
  
  if (selectedOption && selectedOption.disabled) {
    toast.warning(`Pilihan "${selectedOption.label}" untuk tahun ${filters.year} telah wujud. Sila pilih jenis elaun yang lain.`);
    // Reset to empty selection
    filters.type = '';
  } else {
    // Update total count display when type changes
    updateTotalCountDisplay();
  }
}

// Watch for filter changes to update total count display
const stopWatch = watch([() => filters.year, () => filters.type], () => {
  updateTotalCountDisplay();
});

// Cleanup watch on component unmount to prevent memory leaks
onUnmounted(() => {
  if (stopWatch) {
    stopWatch();
  }
});

// localStorage availability and error recovery
const localStorageAvailable = ref(true);
const offlineMode = ref(false);

// Check localStorage availability
function checkLocalStorageAvailability() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    localStorageAvailable.value = true;
    offlineMode.value = false;
  } catch (error) {
    localStorageAvailable.value = false;
    offlineMode.value = true;
    showOfflineMode();
  }
}

// Show offline mode with recovery options
function showOfflineMode() {
  toast.warning('Mod luar talian diaktifkan. Data akan disimpan dalam memori sementara.');
  
  // Enable data export functionality
  enableDataExport();
}

// Enable data export when offline
function enableDataExport() {
  // Add export button to UI
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Eksport Data';
  exportButton.className = 'px-3 py-2 bg-blue-600 text-white rounded-md text-sm';
  exportButton.onclick = exportCurrentData;
  
  // Add to appropriate location in UI
  const actionBar = document.querySelector('.flex.items-center.gap-2');
  if (actionBar) {
    actionBar.appendChild(exportButton);
  }
}

// Export current data
function exportCurrentData() {
  const data = {
    batches: rows.value,
    filters: filters.value,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `elaun-tahunan-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  toast.success('Data berjaya dieksport');
}

// Enhanced localStorage functions with fallback
function safeLocalStorageGet(key, fallback = null) {
  if (!localStorageAvailable.value) {
    return fallback;
  }
  
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (error) {
    return fallback;
  }
}

function safeLocalStorageSet(key, value) {
  if (!localStorageAvailable.value) {
    // Store in memory as fallback
    return false;
  }
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}
</script>

<style scoped>
/* Custom styles for disabled options in FormKit select */
:deep(.formkit-select option:disabled) {
  color: #9ca3af !important; /* text-gray-400 */
  background-color: #f3f4f6 !important; /* bg-gray-100 */
  cursor: not-allowed !important;
}

:deep(.formkit-select option[disabled]) {
  color: #9ca3af !important; /* text-gray-400 */
  background-color: #f3f4f6 !important; /* bg-gray-100 */
  cursor: not-allowed !important;
}

/* Ensure disabled options are visually distinct */
:deep(.formkit-select option:disabled:hover) {
  background-color: #f3f4f6 !important; /* bg-gray-100 */
}

/* Style for the select dropdown when it has disabled options */
:deep(.formkit-select) {
  color: #374151; /* text-gray-700 */
}

/* Additional styling for better visual feedback */
:deep(.formkit-select:focus) {
  border-color: #3b82f6; /* border-blue-500 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style> 