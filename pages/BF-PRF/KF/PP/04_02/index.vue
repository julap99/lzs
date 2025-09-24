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
    <div v-else-if="selectedRecord" class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Lihat Maklumat Komponen Profiling</h2>
        </template>
      </rs-card>

      <!-- Details Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Butiran</h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <!-- ID Komponen Profiling -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">ID Komponen Profiling:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.idKomponenProfiling }}</span>
            </div>
            
            <!-- Nama Pendaftaran (Dropdown) -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Nama Pendaftaran:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.namaPendaftaran || 'N/A' }}</span>
            </div>

            <!-- Kod Proses -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Kod Proses:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.kodProses || 'PP001' }}</span>
            </div>

            <!-- ID Menu -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">ID Menu:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.idMenu || '1' }}</span>
            </div>

            <!-- Status (Checkbox) -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Status:</span>
              <input type="checkbox" :checked="selectedRecord.status" disabled class="cursor-not-allowed" />
            </div>

            <!-- Status Data (Dropdown) -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Status Data:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.statusData || 'Aktif' }}</span>
            </div>

            <!-- Tarikh Mula -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Tarikh Mula:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedRecord.tarikhMula) }}</span>
            </div>

            <!-- Tarikh Tamat -->
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Tarikh Tamat:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedRecord.tarikhTamat) }}</span>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Actions -->
      <rs-card>
        <template #body>
          <div class="flex justify-between gap-3">
            <rs-button variant="secondary" @click="goBack" class="px-6 py-3">
              <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
            </rs-button>
            <div class="flex gap-3">
              <rs-button 
                variant="primary" 
                @click="navigateTo(`/BF-PRF/KF/PP/04_03?id=${selectedId}`)"
                class="px-6 py-3"
              >
                <Icon name="mdi:check-decagram" class="mr-2" /> Pergi Kelulusan
              </rs-button>
            </div>
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
            <p class="text-gray-600">Rekod dengan ID "{{ selectedId }}" tidak ditemui.</p>
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
import { ref, onMounted, onActivated } from 'vue';

definePageMeta({
  title: 'Lihat Proses Komponen',
});

const route = useRoute();
const selectedId = route.query.id;

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Senarai Maklumat Proses Komponen', type: 'link', path: '/BF-PRF/KF/PP/04_01' },
  { name: 'Lihat Proses', type: 'current', path: '/BF-PRF/KF/PP/04_02' },
]);

const loading = ref(true);
const error = ref(null);
const selectedRecord = ref(null);

const loadData = () => {
  try {
    loading.value = true;
    error.value = null;
    const savedData = localStorage.getItem('prosesKomponen');
    if (!savedData) {
      selectedRecord.value = null;
      return;
    }
    const parsed = JSON.parse(savedData) || [];
    // Find by idKomponenProfiling or fallback keys
    selectedRecord.value = parsed
      .map(validateDataItem)
      .find((i) => String(i.idKomponenProfiling) === String(selectedId));
  } catch (e) {
    console.error('Error loading prosesKomponen:', e);
    error.value = 'Ralat semasa memuatkan data.';
    selectedRecord.value = null;
  } finally {
    loading.value = false;
  }
};

const validateDataItem = (item) => {
  return {
    ...item,
    // Keep idKomponenProfiling as-is; do not fallback to other fields
    idKomponenProfiling: item.idKomponenProfiling,
    kodProses: item.kodProses || item.idHadKifayah || 'PP001',
    namaPendaftaran: item.namaPendaftaran || 'Pendaftaran Lengkap',
    idMenu: item.idMenu || '1',
    status: item.status || false,  // Checkbox type status
    statusData: item.statusData || 'Aktif',
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : '2025-01-01',
    tarikhTamat: item.tarikhTamat && !isNaN(new Date(item.tarikhTamat).getTime()) ? item.tarikhTamat : '2025-01-01',
  };
};

const goBack = () => {
  navigateTo('/BF-PRF/KF/PP/04_01');
};

onMounted(loadData);
onActivated(loadData);

const formatDate = (dateString) => {
  if (!dateString) return '';
  let date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Tarikh Tidak Sah';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('ms-MY', options);
};
</script>
