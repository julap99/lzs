<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
      <rs-spinner size="lg" />
    </div>

    <!-- Error State -->
    <rs-alert
      v-else-if="error"
      variant="danger"
      class="mb-6"
      :title="error.title"
      :description="error.message"
    >
      <template #actions>
        <rs-button variant="primary" @click="fetchDashboardData">
          <Icon name="ic:baseline-refresh" class="mr-1" /> Retry
        </rs-button>
      </template>
    </rs-alert>

    <template v-else>
      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <rs-card
          v-for="(kpi, index) in kpiData"
          :key="index"
          class="group transition-all duration-300 hover:shadow-md"
          :class="{ 'opacity-50': isLoading }"
        >
          <div class="relative p-5">
            <!-- Header with Icon -->
            <div class="flex items-center justify-between mb-4">
              <div class="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10">
                <Icon :name="kpi.icon" class="text-xl text-primary" />
              </div>
              <div class="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">
                {{ kpi.description }}
              </div>
            </div>

            <!-- Metric Value -->
            <div class="space-y-1">
              <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
              <div class="flex items-baseline gap-2">
                <p class="text-3xl font-semibold tracking-tight text-primary">
                  {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
                </p>
                <span v-if="kpi.trend" class="text-sm" :class="getTrendColor(kpi.trend)">
                  {{ kpi.trend }}%
                </span>
              </div>
            </div>
          </div>
        </rs-card>
      </div>

      <!-- Main Content -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <h2 class="text-xl font-semibold">Status Semua Akaun</h2>
              <rs-badge v-if="totalRecords" variant="primary">
                {{ totalRecords }} rekod
              </rs-badge>
            </div>
            <div class="flex items-center gap-4">
              <rs-button
                variant="outline"
                @click="resetFilters"
                :disabled="!hasActiveFilters"
              >
                <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
              </rs-button>
              <rs-button
                variant="primary"
                @click="exportToCSV"
                :loading="isExporting"
                :disabled="!tableData.length"
              >
                <Icon name="ic:baseline-download" class="mr-1" /> Export CSV
              </rs-button>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Filters -->
          <div class="flex flex-wrap gap-4 mb-6">
            <FormKit
              type="select"
              label="Jenis Akaun"
              v-model="filters.jenisAkaun"
              :options="jenisAkaunOptions"
              class="w-full md:w-48"
              :disabled="isLoading"
            />
            <FormKit
              type="select"
              label="Status Closing"
              v-model="filters.statusClosing"
              :options="statusClosingOptions"
              class="w-full md:w-48"
              :disabled="isLoading"
            />
            <FormKit
              type="text"
              label="Lokasi / Cawangan"
              v-model="filters.lokasi"
              placeholder="Cari lokasi..."
              class="w-full md:w-64"
              :disabled="isLoading"
            />
          </div>

          <!-- Main Table -->
          <rs-table
            :data="tableData"
            :options="{
              variant: 'default',
              striped: true,
              hover: true,
              loading: isLoading,
            }"
            :columns="tableColumns"
            :pageSize="pageSize"
            :totalRecords="totalRecords"
            :currentPage="currentPage"
            @page-change="handlePageChange"
            @sort-change="handleSortChange"
            advanced
          >
            <template v-slot:statusOpening="data">
              <rs-badge :variant="getStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:statusClosing="data">
              <rs-badge :variant="getStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:bakiBaseline="data">
              <span class="font-mono">RM {{ formatNumber(data.text) }}</span>
            </template>

            <template v-slot:lastClosingDate="data">
              <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
            </template>

            <template v-slot:lastOpeningDate="data">
              <span class="whitespace-nowrap">{{ formatDateTime(data.text) }}</span>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

// Types
interface KpiData {
  title: string;
  value: string | number;
  icon: string;
  description: string;
  trend?: number;
}

interface TableData {
  lokasi: string;
  namaAkaun: string;
  jenisAkaun: string;
  statusOpening: string;
  statusClosing: string;
  lastClosingDate: string;
  lastOpeningDate: string;
  bakiBaseline: number;
  picClosing: string;
  pkpPenerima: string;
}

interface Filters {
  jenisAkaun: string;
  statusClosing: string;
  lokasi: string;
}

interface ErrorState {
  title: string;
  message: string;
}

// Page Meta
definePageMeta({
  title: 'Dashboard: Ringkasan & Status Akaun Tunai',
});

// Constants
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const INITIAL_PAGE_SIZE = 10;

// State
const breadcrumb = [
  { title: 'Dashboard', to: '/BF-TNI/dashboard' },
  { title: 'Ringkasan & Status Akaun Tunai', to: '/BF-TNI/dashboard' },
];

const isLoading = ref(false);
const isExporting = ref(false);
const error = ref<ErrorState | null>(null);
const currentPage = ref(1);
const pageSize = ref(INITIAL_PAGE_SIZE);
const totalRecords = ref(0);
const refreshInterval = ref<number | null>(null);

// KPI Data
const kpiData: Ref<KpiData[]> = ref([
  {
    title: 'Total Akaun Aktif',
    value: 0,
    icon: 'ic:baseline-account-balance',
    description: 'Auto count',
    trend: 5.2,
  },
  {
    title: 'Total Akaun Belum Ditutup (hari ini)',
    value: 0,
    icon: 'ic:baseline-pending-actions',
    description: 'Auto count',
    trend: -2.1,
  },
  {
    title: 'Total Akaun Sudah Ditutup (hari ini)',
    value: 0,
    icon: 'ic:baseline-check-circle',
    description: 'Auto count',
    trend: 8.4,
  },
  {
    title: 'Last Update',
    value: '-',
    icon: 'ic:baseline-update',
    description: 'Auto-captured',
  },
]);

// Filters
const filters = ref<Filters>({
  jenisAkaun: '',
  statusClosing: '',
  lokasi: '',
});

const jenisAkaunOptions = [
  { label: 'Semua', value: '' },
  { label: 'Cawangan', value: 'Cawangan' },
  { label: 'Amil', value: 'Amil' },
  { label: 'EOAD', value: 'EOAD' },
  { label: 'Baitul', value: 'Baitul' },
  { label: 'HQ', value: 'HQ' },
];

const statusClosingOptions = [
  { label: 'Semua', value: '' },
  { label: 'Ditutup', value: 'Ditutup' },
  { label: 'Belum Closing', value: 'Belum Closing' },
  { label: 'Menunggu PKP', value: 'Menunggu PKP' },
];

// Table Configuration
const tableColumns = [
  { key: 'lokasi', label: 'Lokasi / Akaun Tunai', sortable: true },
  { key: 'namaAkaun', label: 'Nama Akaun / Cawangan', sortable: true },
  { key: 'jenisAkaun', label: 'Jenis Akaun', sortable: true },
  { key: 'statusOpening', label: 'Status Opening', sortable: true },
  { key: 'statusClosing', label: 'Status Closing', sortable: true },
  { key: 'lastClosingDate', label: 'Tarikh & Masa Last Closing', sortable: true },
  { key: 'lastOpeningDate', label: 'Tarikh & Masa Last Opening', sortable: true },
  { key: 'bakiBaseline', label: 'Baki Baseline terkini (RM)', sortable: true },
  { key: 'picClosing', label: 'PIC Closing terakhir', sortable: true },
  { key: 'pkpPenerima', label: 'PKP Penerima', sortable: true },
];

const tableData = ref<TableData[]>([]);

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '');
});

// Utility Functions
const getStatusVariant = (status: string): string => {
  const variants: Record<string, string> = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Ditutup': 'success',
    'Belum Closing': 'warning',
    'Menunggu PKP': 'info',
  };
  return variants[status] || 'default';
};

const getTrendColor = (trend: number): string => {
  if (trend > 0) return 'text-success';
  if (trend < 0) return 'text-danger';
  return 'text-gray-500';
};

const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ms-MY').format(num);
};

const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString('ms-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Event Handlers
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchDashboardData();
};

const handleSortChange = (sort: { key: string; order: 'asc' | 'desc' }) => {
  // TODO: Implement sorting logic
  console.log('Sort changed:', sort);
};

const resetFilters = () => {
  filters.value = {
    jenisAkaun: '',
    statusClosing: '',
    lokasi: '',
  };
  currentPage.value = 1;
  fetchDashboardData();
};

const exportToCSV = async () => {
  try {
    isExporting.value = true;
    // TODO: Implement CSV export functionality
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    console.log('Export to CSV');
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  } finally {
    isExporting.value = false;
  }
};

// Data Fetching
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // TODO: Replace with actual API calls
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    // Mock data
    tableData.value = [
      {
        lokasi: 'HQ',
        namaAkaun: 'Akaun Utama',
        jenisAkaun: 'HQ',
        statusOpening: 'Aktif',
        statusClosing: 'Ditutup',
        lastClosingDate: '2024-03-20 15:30:00',
        lastOpeningDate: '2024-03-20 08:00:00',
        bakiBaseline: 1000000,
        picClosing: 'Ahmad bin Abdullah',
        pkpPenerima: 'Sarah binti Ismail',
      },
      {
        lokasi: 'Cawangan Shah Alam',
        namaAkaun: 'Akaun Cawangan',
        jenisAkaun: 'Cawangan',
        statusOpening: 'Aktif',
        statusClosing: 'Belum Closing',
        lastClosingDate: '2024-03-19 15:30:00',
        lastOpeningDate: '2024-03-19 08:00:00',
        bakiBaseline: 500000,
        picClosing: 'Mohd Ali bin Hassan',
        pkpPenerima: '-',
      },
    ];

    totalRecords.value = tableData.value.length;

    // Update KPI values
    kpiData.value[0].value = 150;
    kpiData.value[1].value = 45;
    kpiData.value[2].value = 105;
    kpiData.value[3].value = new Date().toLocaleString('ms-MY');
  } catch (err) {
    error.value = {
      title: 'Error Loading Data',
      message: 'Failed to load dashboard data. Please try again.',
    };
    console.error('Error fetching dashboard data:', err);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchDashboardData();
  refreshInterval.value = window.setInterval(fetchDashboardData, REFRESH_INTERVAL);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>
