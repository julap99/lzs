<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Semua Tuntutan (Pelulus)</h2>
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
          :columns="columns"
          :pageSize="pageSize"
          :showNoColumn="true"
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
                v-if="text.status === 'Untuk Kelulusan'"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="handleSemakKelulusan(text.id)"
              >
                <Icon name="ph:check" class="w-4 h-4 mr-1" />
                Semak & Buat Kelulusan
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
  title: 'Senarai Semua Tuntutan (Pelulus)',
});

const breadcrumb = ref([
  {
    name: 'Tuntutan dengan Siasatan',
    type: 'link',
    path: '/BF-BTN/tuntutan-dengan-siasatan',
  },
  {
    name: 'Senarai Tuntutan Pelulus',
    type: 'current',
    path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus',
  },
]);

// Table columns configuration
const columns = [
  {
    key: 'noTuntutan',
    label: 'No. Tuntutan',
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

// Options for filters
const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Untuk Kelulusan', value: 'Untuk Kelulusan' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Tidak Lulus', value: 'Tidak Lulus' },
];

// State
const searchQuery = ref('');
const filters = ref({
  status: '',
});
const pageSize = ref(10);
const currentPage = ref(1);

// Sample data - Replace with actual API call
const tuntutanList = ref([
  {
    id: 'TDS-2024-001',
    noTuntutan: 'TDS-2024-001',
    noGL: 'GL-2024-001',
    namaPemohon: 'Ahmad bin Abdullah',
    tarikhTuntutan: '2024-03-20T09:30:00',
    amaunTuntutan: 5000.00,
    statusPermohonan: 'Untuk Kelulusan',
    pegawaiETD: 'Sarah binti Omar',
    tindakan: {
      id: 'TDS-2024-001',
      status: 'Untuk Kelulusan'
    }
  },
  // Add more sample data as needed
]);

// Computed properties
const filteredTuntutan = computed(() => {
  let result = tuntutanList.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      item.noTuntutan.toLowerCase().includes(query) ||
      item.namaPemohon.toLowerCase().includes(query) ||
      item.noGL.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (filters.value.status) {
    result = result.filter(item => item.statusPermohonan === filters.value.status);
  }

  return result;
});

const totalTuntutan = computed(() => filteredTuntutan.value.length);

const totalPages = computed(() => Math.ceil(totalTuntutan.value / pageSize.value));

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalTuntutan.value);
});

// Utility functions
const formatNumber = (value) => {
  return new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY');
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('ms-MY');
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Untuk Kelulusan':
      return 'warning';
    case 'Lulus':
      return 'success';
    case 'Tidak Lulus':
      return 'danger';
    default:
      return 'primary';
  }
};

// Action handlers
const viewTuntutan = (tuntutanId) => {
  // Navigate to tuntutan details page
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus/${tuntutanId}`);
};

const handleSemakKelulusan = (tuntutanId) => {
  // Navigate to TDS-04 screen
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus/${tuntutanId}/semak-kelulusan`);
};
</script>

<style lang="scss" scoped></style>
