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
          <h2 class="text-xl font-semibold">Semak dan Lulus Maklumat Komponen Profiling</h2>
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

      <!-- Kelulusan Section -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Kelulusan</h3>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Status Lulus/Tolak -->
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

            <!-- Catatan (Required if "Tidak Lulus") -->
            <div class="md:col-span-2" v-if="approvalForm.statusKelulusan === 'Tidak Lulus'">
              <label class="text-sm font-medium text-gray-700">Catatan</label>
              <FormKit
                type="textarea"
                v-model="approvalForm.catatan"
                rows="3"
                validation="required"
                placeholder="Masukkan catatan"
                class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Tarikh Lulus (Default to system date) -->
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Lulus</label>
              <FormKit
                type="date"
                v-model="approvalForm.tarikhLulus"
                :value="getCurrentDate()"
                class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Nama Pelulus (User's name from the system) -->
            <div>
              <label class="text-sm font-medium text-gray-700">Nama Pelulus</label>
              <FormKit
                type="text"
                v-model="approvalForm.namaPelulus"
                :value="user.name"
                disabled
                class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                @click="handleSave"
                class="px-6 py-3"
              >
                <Icon name="mdi:save" class="mr-2" /> Simpan
              </rs-button>
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
import { FormKit } from '@formkit/vue';  // Import FormKit

definePageMeta({
  title: 'Semak dan Lulus Proses Komponen',
});

const route = useRoute();
const selectedId = route.query.id;
const user = { name: 'Admin' };  // Mock user data (replace with actual user data)

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Senarai Maklumat Proses Komponen', type: 'link', path: '/BF-PRF/KF/PP/04_01' },
  { name: 'Semak dan Lulus Proses', type: 'current', path: '/BF-PRF/KF/PP/04_03' },
]);

const loading = ref(true);
const error = ref(null);
const selectedRecord = ref(null);
const approvalForm = ref({
  statusKelulusan: 'Lulus',
  catatan: '',
  tarikhLulus: '',
  namaPelulus: user.name,
});

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
    selectedRecord.value = parsed.find(i => String(i.idKomponenProfiling) === String(selectedId));
  } catch (e) {
    console.error('Error loading prosesKomponen', e);
    error.value = 'Ralat semasa memuatkan data.';
    selectedRecord.value = null;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  navigateTo('/BF-PRF/KF/PP/04_01');
};

const handleSave = () => {
  // Logic to save the approval form
  console.log('Data disimpan:', approvalForm.value);
};

const handleHantar = () => {
  // Logic to send the approval notification to Admin
  try {
    const { $toast } = useNuxtApp();
    $toast.success('Keputusan kelulusan dihantar kepada Admin');
  } catch (e) {
    alert('Keputusan kelulusan dihantar kepada Admin');
  }
};

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];  // Return current date in YYYY-MM-DD format
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
</script>
