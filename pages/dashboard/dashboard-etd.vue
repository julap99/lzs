<template>
  <!-- Breadcrumb Navigation -->
  <LayoutsBreadcrumb :items="breadcrumb" />

  <!-- Loading Spinner -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
    <rs-spinner size="lg" />
  </div>

  <!-- Error Alert -->
  <rs-alert v-else-if="error" variant="danger" class="mb-6" :title="error.title" :description="error.message">
    <template #actions>
      <rs-button variant="primary" @click="fetchDashboardData">
        <Icon name="ic:baseline-refresh" class="mr-1" /> Retry
      </rs-button>
    </template>
  </rs-alert>

  <!-- Main Dashboard Content -->
  <div v-else class="space-y-6">
    <!-- User Info Card -->
    <rs-card class="mb-6">
      <template #body>
        <div class="p-4">
          <h1 class="text-3xl font-bold text-gray-800 mt-2">
            Eksekutif Teknikal Daerah - Hulu Selangor
          </h1>
          <p class="text-sm text-gray-600 mt-1">
            Nama: <strong>Encik Amirul Azwan</strong>
          </p>
          <p class="text-sm text-gray-500">
            Log Masuk Terakhir: {{ formatDateTime(new Date().toISOString()) }}
          </p>
        </div>
      </template>
    </rs-card>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <rs-card
        v-for="(kpi, index) in kpiData"
        :key="index"
        class="group transition-all duration-300 hover:shadow-md"
      >
        <div class="relative p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10">
              <Icon :name="kpi.icon" class="text-xl text-primary" />
            </div>
            <div class="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">
              {{ kpi.description }}
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-semibold tracking-tight text-primary">
                {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
              </p>
              <span v-if="kpi.trend" :class="getTrendColor(kpi.trend)" class="text-sm">
                {{ kpi.trend }}%
              </span>
            </div>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Main Grid: Task List & Activity Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Task List Section -->
      <rs-card class="lg:col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <h2 class="text-xl font-semibold">Tugasan</h2>
              <rs-badge variant="primary">{{ filteredData.length }} REKOD</rs-badge>
            </div>
            <div class="flex gap-4">
              <rs-button variant="outline" @click="resetFilters">
                <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
              </rs-button>
              <rs-button variant="primary" @click="exportToCSV">
                <Icon name="ic:baseline-download" class="mr-1" /> Export CSV
              </rs-button>
            </div>
          </div>
        </template>
        <template #body>
          <!-- Filters -->
          <div class="mb-4 flex flex-wrap gap-4">
            <FormKit type="text" v-model="filters.search" placeholder="Cari nama atau lokasi..." :classes="{ input: 'w-64' }" />
            <FormKit type="select" :options="lokasiOptions" v-model="filters.lokasi" placeholder="Lokasi" :classes="{ input: 'w-44' }" />
            <FormKit type="select" :options="kategoriOptions" v-model="filters.kategori" placeholder="Kategori Bantuan" :classes="{ input: 'w-44' }" />
            <FormKit type="select" :options="statusOptions" v-model="filters.status" placeholder="Status" :classes="{ input: 'w-44' }" />
          </div>
          <!-- Table -->
          <rs-table
            :data="paginatedData"
            :columns="columns"
            :pageSize="pageSize"
            :totalRecords="filteredData.length"
            :currentPage="currentPage"
            @page-change="handlePageChange"
            :options="{ striped: true, hover: true, showNoColumn: true }"
          >
            <template v-slot:status="data">
              <rs-badge :variant="getStatusVariant(data.text)">{{ data.text }}</rs-badge>
            </template>
            <template v-slot:tindakan>
              <rs-button variant="primary" size="sm">
                <Icon name="ic:baseline-upload-file" class="mr-1" /> Sediakan BQ
              </rs-button>
            </template>
          </rs-table>
          <p class="text-sm text-gray-500 mt-4">
            Menunjukkan {{ paginatedData.length ? (currentPage - 1) * pageSize + 1 : 0 }} hingga
            {{ (currentPage - 1) * pageSize + paginatedData.length }} dari {{ filteredData.length }} rekod
          </p>
        </template>
      </rs-card>

      <!-- Activity Feed Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Aktiviti Terkini</h2>
        </template>
        <template #body>
          <ul class="divide-y divide-gray-200">
            <li v-for="item in tableData" :key="item.no" class="py-3 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <Icon name="ic:baseline-upload" class="text-lg text-primary" />
                <div>
                  <p class="text-sm text-gray-700">{{ item.namaPemohon }} - {{ item.status }}</p>
                  <p class="text-xs text-gray-400">{{ item.tarikhMohon }}</p>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// =======================
// Dashboard ETD Logic
// =======================
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

// Types
interface KpiData {
  title: string;
  value: number | string;
  icon: string;
  description?: string;
  trend?: number;
}

interface TableData {
  no: number;
  namaPemohon: string;
  lokasi: string;
  kategori: string;
  tarikhMohon: string;
  status: string;
}

interface Filters {
  search: string;
  lokasi: string;
  kategori: string;
  status: string;
}

interface ErrorState {
  title: string;
  message: string;
}

const REFRESH_INTERVAL = 300000;
const INITIAL_PAGE_SIZE = 10;

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "current",
    path: "/",
  },
]);

const isLoading = ref(false);
const isExporting = ref(false);
const error = ref<ErrorState | null>(null);
const currentPage = ref(1);
const pageSize = ref(INITIAL_PAGE_SIZE);
const totalRecords = ref(0);
const refreshInterval = ref<number | null>(null);

const kpiData: Ref<KpiData[]> = ref([
  { title: 'Permohonan Diterima', value: 0, icon: 'ic:baseline-home-repair-service', description: 'Perlu Semakan', trend: 0 },
  { title: 'BQ Telah Disediakan', value: 0, icon: 'ic:baseline-description', description: 'Selesai', trend: 0 },
  { title: 'Projek Berjalan', value: 0, icon: 'ic:baseline-construction', description: 'Dalam Tindakan', trend: 0 },
  { title: 'Laporan Selesai', value: '', icon: 'ic:baseline-check-circle', description: 'Lengkap' }
]);

const tableData = ref<TableData[]>([]);

const filters = ref<Filters>({
  search: '',
  lokasi: '',
  kategori: '',
  status: ''
});

const lokasiOptions = [
  { label: 'Kampung Pertak', value: 'Kampung Pertak' },
  { label: 'Batang Kali', value: 'Batang Kali' }
];

const kategoriOptions = [
  { label: 'Bina Rumah', value: 'Bina Rumah' },
  { label: 'Baiki Rumah', value: 'Baiki Rumah' }
];

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Belum Disemak', value: 'Belum Disemak' },
  { label: 'BQ Disediakan', value: 'BQ Disediakan' },
  { label: 'Menunggu Tindakan', value: 'Menunggu Tindakan' },
  { label: 'Ditolak', value: 'Ditolak' }
];

const columns = [
  { key: 'no', label: 'No.' },
  { key: 'namaPemohon', label: 'Nama Pemohon' },
  { key: 'lokasi', label: 'Lokasi' },
  { key: 'kategori', label: 'Kategori Bantuan' },
  { key: 'tarikhMohon', label: 'Tarikh Mohon' },
  { key: 'status', label: 'Status Semakan' },
  { key: 'tindakan', label: 'Tindakan' }
];

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchSearch = !filters.value.search || Object.values(item).some(val => String(val).toLowerCase().includes(filters.value.search.toLowerCase()));
    const matchLokasi = !filters.value.lokasi || item.lokasi === filters.value.lokasi;
    const matchKategori = !filters.value.kategori || item.kategori === filters.value.kategori;
    const matchStatus = !filters.value.status || item.status === filters.value.status;
    return matchSearch && matchLokasi && matchKategori && matchStatus;
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

const getStatusVariant = (status: string): string => {
  const variants: Record<string, string> = {
    'Belum Disemak': 'warning',
    'BQ Disediakan': 'success',
    'Menunggu Tindakan': 'info',
    'Ditolak': 'danger'
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

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString('ms-MY', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const resetFilters = () => {
  filters.value.search = '';
  filters.value.lokasi = '';
  filters.value.kategori = '';
  filters.value.status = '';
};

const exportToCSV = () => {
  // Integrate with backend or CSV export library as needed
  console.log('Exporting to CSV...');
};

const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    await new Promise(resolve => setTimeout(resolve, 1000));
    tableData.value = [
      {
        no: 1,
        namaPemohon: 'Noraini binti Kassim',
        lokasi: 'Kampung Pertak',
        kategori: 'Bina Rumah',
        tarikhMohon: '2025-06-10',
        status: 'Belum Disemak'
      },
      {
        no: 2,
        namaPemohon: 'Abdul Majid bin Osman',
        lokasi: 'Batang Kali',
        kategori: 'Baiki Rumah',
        tarikhMohon: '2025-06-11',
        status: 'BQ Disediakan'
      }
    ];
    kpiData.value[0].value = 150;
    kpiData.value[1].value = 45;
    kpiData.value[2].value = 105;
    kpiData.value[3].value = 80;
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

<style scoped lang="scss">
  p {
    margin: 0;
  }
</style>