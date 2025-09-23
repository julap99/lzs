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
          <h2 class="text-xl font-semibold">Maklumat Proses Profiling</h2>
        </template>
      </rs-card>

      <!-- Details Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Butiran</h3>
        </template>
        <template #body>
          <div class="space-y-4">
            
            <!-- Senarai Kod Proses moved above Nama Proses -->
            <div v-if="selectedRecord.kodProsesList && selectedRecord.kodProsesList.length" class="py-2 border-b border-gray-100">
              <div class="text-sm font-medium text-gray-600 mb-2">Senarai Kod Proses:</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(kod, idx) in selectedRecord.kodProsesList"
                  :key="idx"
                  class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {{ kod.value || kod }}
                </span>
              </div>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Nama Proses:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.namaProses || selectedRecord.namaHadKifayah }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Keterangan:</span>
              <span class="text-sm text-gray-900">{{ selectedRecord.keterangan || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Status:</span>
              <rs-badge :variant="getStatusVariant(selectedRecord.status)">
                {{ selectedRecord.status || 'Aktif' }}
              </rs-badge>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Status Data:</span>
              <rs-badge :variant="getStatusVariant(selectedRecord.statusData)">
                {{ selectedRecord.statusData || selectedRecord.status || 'Aktif' }}
              </rs-badge>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Tarikh Mula:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedRecord.tarikhMula) }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-48">Tarikh Tamat:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedRecord.tarikhTamat) }}</span>
            </div>

            
          </div>
        </template>
      </rs-card>

      <!-- Kelulusan Section -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Kelulusan</h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Status Kelulusan</label>
              <div class="mt-2 flex flex-wrap gap-6 text-sm text-gray-800">
                <label class="inline-flex items-center gap-2">
                  <input type="radio" class="accent-blue-600" value="Lulus" v-model="approvalForm.statusKelulusan" />
                  <span>Lulus</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="radio" class="accent-blue-600" value="Tidak Lulus" v-model="approvalForm.statusKelulusan" />
                  <span>Tidak Lulus</span>
                </label>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Catatan</label>
              <textarea v-model="approvalForm.catatan" rows="3" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan catatan"></textarea>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Lulus</label>
              <input v-model="approvalForm.tarikhLulus" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Nama Pelulus</label>
              <input v-model="approvalForm.namaPelulus" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama pelulus" />
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
                @click="handleHantar"
                class="px-6 py-3"
              >
                <Icon name="mdi:send" class="mr-2" /> Hantar
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
  title: 'Lihat Proses Profiling',
});

const route = useRoute();
const selectedId = route.query.id;

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Kelulusan Proses Profiling', type: 'link', path: '/BF-PRF/KF/PP/02_01' },
  { name: 'Lihat Proses', type: 'current', path: '/BF-PRF/KF/PP/02_02' },
]);

const loading = ref(true);
const error = ref(null);
const selectedRecord = ref(null);
const approvalForm = ref({
  statusKelulusan: 'Lulus',
  catatan: '',
  tarikhLulus: '',
  namaPelulus: '',
});

const loadData = () => {
  try {
    loading.value = true;
    error.value = null;
    const savedData = localStorage.getItem('prosesProfiling');
    if (!savedData) {
      selectedRecord.value = null;
      return;
    }
    const parsed = JSON.parse(savedData) || [];
    // Find by idPP or fallback keys
    selectedRecord.value = parsed
      .map(validateDataItem)
      .find((i) => String(i.idPP) === String(selectedId));
  } catch (e) {
    console.error('Error loading prosesProfiling:', e);
    error.value = 'Ralat semasa memuatkan data.';
    selectedRecord.value = null;
  } finally {
    loading.value = false;
  }
};

const validateDataItem = (item) => {
  return {
    ...item,
    // Keep idPP as-is; do not fallback to other fields
    idPP: item.idPP,
    kodProses: item.kodProses || item.idHadKifayah || 'PP001',
    namaProses: item.namaProses || item.namaHadKifayah || 'Proses Profiling',
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : '2025-01-01',
    status: item.status || 'Aktif',
    statusData: item.statusData || item.status || 'Aktif',
  };
};

const goBack = () => {
  navigateTo('/BF-PRF/KF/PP/02_01');
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

const getStatusVariant = (status) => {
  switch (status) {
    case 'Aktif':
      return 'success';
    case 'Tidak Aktif':
      return 'danger';
    case 'Menunggu Kelulusan':
      return 'warning';
    case 'Draf':
      return 'secondary';
    default:
      return 'default';
  }
};

// Handle Hantar action: show notification only
const handleHantar = () => {
  try {
    const { $toast } = useNuxtApp();
    if ($toast) {
      $toast.success('Kelulusan berjaya dihantar');
    } else {
      alert('Kelulusan berjaya dihantar');
    }
  } catch (e) {
    console.error('Notification error:', e);
    alert('Kelulusan berjaya dihantar');
  }
};
</script>

