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
          <h1 class="text-3xl font-bold text-gray-800">Selamat Datang, {{ user.nama }}</h1>
          <p class="text-sm text-gray-600 mt-2">
            Peranan: <strong>{{ user.peranan }}</strong> | Daerah: <strong>{{ user.daerah }}</strong> | Kariah: <strong>{{ user.kariah }}</strong>
          </p>
          <p class="text-sm text-gray-500">Log Masuk Terakhir: {{ user.loginTime }}</p>
        </div>
      </template>
    </rs-card>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div>
            <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
            <p class="text-3xl font-semibold tracking-tight text-primary">
              {{ kpi.isCurrency ? 'RM ' + formatNumber(kpi.value) : formatNumber(kpi.value) }}
            </p>
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
            <h2 class="text-lg font-semibold">Senarai Tugasan</h2>
            <div class="flex gap-2">
              <rs-button variant="outline" @click="resetFilters">
                <Icon name="ic:baseline-refresh" class="mr-1" /> Reset
              </rs-button>
              <rs-button variant="primary" @click="exportData">
                <Icon name="ic:baseline-download" class="mr-1" /> Eksport Excel
              </rs-button>
            </div>
          </div>
        </template>
        <template #body>
          <!-- Filters -->
          <div class="mb-4 flex flex-wrap gap-4">
            <input
              type="text"
              v-model="searchText"
              placeholder="Cari tugasan..."
              class="rs-input w-64"
            />
            <select v-model="statusFilter" class="rs-input w-44">
              <option value="">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Belum Selesai">Belum Selesai</option>
            </select>
          </div>
          <!-- Task Table -->
          <rs-table
            :data="paginatedData"
            :columns="columns"
            :pageSize="pageSize"
            :totalRecords="filteredData.length"
            :currentPage="currentPage"
            @page-change="handlePageChange"
            :options="{ striped: true, hover: true }"
          />
          <p class="text-sm text-gray-500 mt-4">
            Menunjukkan {{ paginatedData.length ? (currentPage - 1) * pageSize + 1 : 0 }} hingga
            {{ (currentPage - 1) * pageSize + paginatedData.length }} dari {{ filteredData.length }} rekod
          </p>
        </template>
      </rs-card>

      <!-- Activity Feed Section -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Aktiviti Terkini</h2>
        </template>
        <template #body>
          <ul class="divide-y divide-gray-200">
            <li
              v-for="(item, i) in notifications"
              :key="i"
              class="py-3 flex gap-2 items-start"
            >
              <Icon name="ic:baseline-upload" class="text-lg text-primary" />
              <span class="text-sm text-gray-700">{{ item.message }}</span>
            </li>
          </ul>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// =======================
// Dashboard Amil Logic
// =======================
import { ref, computed, onMounted } from 'vue';

// Breadcrumb navigation
const breadcrumb = ref([{ name: 'Dashboard', type: 'current', path: '/' }]);

// Loading and error state
const isLoading = ref(false);
const error = ref<null | { title: string; message: string }>(null);

// Pagination and filter state
const pageSize = ref(5);
const currentPage = ref(1);
const searchText = ref('');
const statusFilter = ref('');

// User info (should be dynamic in production)
const user = {
  nama: 'Ustaz Haitham Ismail',
  peranan: 'Penolong Amil Kariah',
  daerah: 'Sabak Bernam',
  kariah: 'Masjid Al‑Islahiah (Tebuk Jawa)',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI summary data
const kpiData = ref([
  { title: 'Insentif Terkumpul', value: 1200, icon: 'ic:baseline-attach-money', description: 'Belum Proses', isCurrency: true },
  { title: 'Asnaf Berdaftar', value: 48, icon: 'ic:baseline-person-search', description: 'Bulan Ini' },
  { title: 'Permohonan Bantuan', value: 20, icon: 'ic:baseline-fact-check', description: 'Aktif' },
  { title: 'Senarai Tugasan', value: 8, icon: 'ic:baseline-assignment', description: 'Terkini' },
]);

// Table columns
const columns = [
  { key: 'tajuk', label: 'Tugasan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'status', label: 'Status' },
];

// Task list data
const taskList = ref([
  { tajuk: 'Sahkan Bancian PMH/2025/1001', tarikh: '2025-06-15', status: 'Belum Selesai' },
  { tajuk: 'Semak Tuntutan Elaun 001', tarikh: '2025-06-14', status: 'Selesai' },
]);

// Computed: Filtered and paginated data
const filteredData = computed(() => {
  return taskList.value.filter(item => {
    const matchSearch = item.tajuk.toLowerCase().includes(searchText.value.toLowerCase());
    const matchStatus = !statusFilter.value || item.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

// Activity feed notifications
const notifications = ref([
  { message: 'Bancian PMH/2025/1001 telah dihantar ke JPPA.' },
  { message: 'Tuntutan elaun bulan Mei telah diluluskan.' },
]);

// Helper: Reset filters
const resetFilters = () => {
  searchText.value = '';
  statusFilter.value = '';
};

// Helper: Export data (placeholder)
const exportData = () => {
  // Integrate with backend or Excel export library as needed
  console.log('Exporting to Excel...');
};

// Pagination handler
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// Helper: Format numbers (currency, etc.)
const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ms-MY').format(num);
};

// Data fetch simulation
const fetchDashboardData = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
};

onMounted(fetchDashboardData);
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
