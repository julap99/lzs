<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Semua Tuntutan (EOAD / ETD)</h2>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Tuntutan, Nama Pemohon, atau No GL..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Main Table -->
        <rs-table
          :data="filteredTuntutan"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <!-- Custom column templates -->
          <template v-slot:noTuntutan="{ text }">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewTuntutan(text)"
            >
              {{ text }}
            </a>
          </template>

          <template v-slot:amaunTuntutan="{ text }">
            <div class="font-medium text-right">
              RM {{ formatNumber(text) }}
            </div>
          </template>

          <template v-slot:tarikhTuntutan="{ text }">
            <div>
              <div class="font-medium">{{ formatDate(text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
            </div>
          </template>

          <template v-slot:statusPermohonan="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex space-x-2">
              <rs-button
                v-if="text.status === 'Dalam Semakan'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSemakPengesahan(text.id)"
              >
                <Icon name="ph:check" class="w-4 h-4 mr-1" />
                Semak & Buat Pengesahan
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{
                wrapper: 'w-20',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga
              {{ paginationEnd }} daripada {{ totalTuntutan }} entri
            </span>
            <div class="flex gap-1">
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: 'Senarai Semua Tuntutan (EOAD / ETD)',
});

const breadcrumb = ref([
  {
    name: 'Tuntutan',
    type: 'link',
    path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad',
  },
  {
    name: 'Senarai Tuntutan EOAD',
    type: 'current',
    path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad',
  },
]);

// Table columns configuration
const columns = [
  {
    key: 'noTuntutan',
    label: 'No. Tuntutan / ID Tuntutan',
    sortable: true,
  },
  {
    key: 'noGL',
    label: 'No. GL',
    sortable: true,
  },
  {
    key: 'namaPemohon',
    label: 'Nama Pemohon / Institusi',
    sortable: true,
  },
  {
    key: 'tarikhTuntutan',
    label: 'Tarikh Tuntutan',
    sortable: true,
  },
  {
    key: 'amaunTuntutan',
    label: 'Amaun Tuntutan (RM)',
    sortable: true,
  },
  {
    key: 'statusPermohonan',
    label: 'Status Permohonan',
    sortable: true,
  },
  {
    key: 'pegawaiETD',
    label: 'Pegawai ETD/EOAD',
    sortable: true,
  },
  {
    key: 'tindakan',
    label: 'Tindakan',
    sortable: false,
  },
];

// State
const searchQuery = ref('');
const filters = ref({
  status: '',
});
const pageSize = ref(10);
const currentPage = ref(1);

// Options for filters
const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Dalam Semakan', value: 'Dalam Semakan' },
  { label: 'Untuk Kelulusan', value: 'Untuk Kelulusan' },
  { label: 'Perlu Penambahbaikan', value: 'Perlu Penambahbaikan' },
];

// Sample data - in real app, this would come from an API
const tuntutanList = ref([
  {
    id: 'TUN-2024-001',
    noTuntutan: 'TUN-2024-001',
    noGL: 'GL-001-2024',
    namaPemohon: 'Ahmad bin Abdullah',
    tarikhTuntutan: new Date().toISOString(),
    amaunTuntutan: 5000.00,
    statusPermohonan: 'Dalam Semakan',
    pegawaiETD: 'Siti Aminah',
    tindakan: { id: 'TUN-2024-001', status: 'Dalam Semakan' }
  },
  {
    id: 'TUN-2024-002',
    noTuntutan: 'TUN-2024-002',
    noGL: 'GL-002-2024',
    namaPemohon: 'Masjid Al-Hidayah',
    tarikhTuntutan: new Date(Date.now() - 86400000).toISOString(),
    amaunTuntutan: 8000.00,
    statusPermohonan: 'Dalam Semakan',
    pegawaiETD: 'Siti Aminah',
    tindakan: { id: 'TUN-2024-002', status: 'Dalam Semakan' }
  },
  {
    id: 'TUN-2024-003',
    noTuntutan: 'TUN-2024-003',
    noGL: 'GL-003-2024',
    namaPemohon: 'Sekolah Agama Rakyat Al-Amin',
    tarikhTuntutan: new Date(Date.now() - 172800000).toISOString(),
    amaunTuntutan: 12000.00,
    statusPermohonan: 'Dalam Semakan',
    pegawaiETD: 'Siti Aminah',
    tindakan: { id: 'TUN-2024-003', status: 'Dalam Semakan' }
  },
  {
    id: 'TUN-2024-004',
    noTuntutan: 'TUN-2024-004',
    noGL: 'GL-004-2024',
    namaPemohon: 'Surau Kampung Baru',
    tarikhTuntutan: new Date(Date.now() - 259200000).toISOString(),
    amaunTuntutan: 3500.00,
    statusPermohonan: 'Dalam Semakan',
    pegawaiETD: 'Siti Aminah',
    tindakan: { id: 'TUN-2024-004', status: 'Dalam Semakan' }
  },
  {
    id: 'TUN-2024-005',
    noTuntutan: 'TUN-2024-005',
    noGL: 'GL-005-2024',
    namaPemohon: 'Pusat Tahfiz Al-Quran',
    tarikhTuntutan: new Date(Date.now() - 345600000).toISOString(),
    amaunTuntutan: 15000.00,
    statusPermohonan: 'Dalam Semakan',
    pegawaiETD: 'Siti Aminah',
    tindakan: { id: 'TUN-2024-005', status: 'Dalam Semakan' }
  },
]);

// Computed properties
const filteredTuntutan = computed(() => {
  let filtered = [...tuntutanList.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.noTuntutan.toLowerCase().includes(query) ||
      item.namaPemohon.toLowerCase().includes(query) ||
      item.noGL.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(item => 
      item.statusPermohonan === filters.value.status
    );
  }

  return filtered;
});

const totalTuntutan = computed(() => filteredTuntutan.value.length);
const totalPages = computed(() => Math.ceil(totalTuntutan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalTuntutan.value));

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY');
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('ms-MY');
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const getStatusVariant = (status) => {
  const variants = {
    'Dalam Semakan': 'warning',
    'Untuk Kelulusan': 'info',
    'Perlu Penambahbaikan': 'danger',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

const viewTuntutan = (tuntutanId) => {
  // Navigate to tuntutan details page
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/${tuntutanId}`);
};

const handleSemakPengesahan = (tuntutanId) => {
  // Navigate to TDS-02 screen
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/${tuntutanId}/pengesahan`);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
