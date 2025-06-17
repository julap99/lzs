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
      <rs-button variant="primary" @click="refreshData">
        <Icon name="ic:baseline-refresh" class="mr-1" /> Retry
      </rs-button>
    </template>
  </rs-alert>

  <!-- Main Dashboard Content -->
  <div v-else class="space-y-6">
    <!-- User Info Card -->
    <rs-card class="mb-6 p-5 bg-white shadow-sm">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">{{ user.peranan }} - {{ user.daerah }}</h1>
        <p class="text-sm text-gray-600 mt-2">Nama: <strong>{{ user.nama }}</strong></p>
        <p class="text-sm text-gray-500">Log Masuk Terakhir: {{ user.loginTime }}</p>
      </div>
    </rs-card>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <rs-card v-for="(kpi, index) in kpiList" :key="index" class="group transition-all duration-300 hover:shadow-md">
        <div class="relative p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10">
              <Icon :name="kpi.icon" class="text-xl text-primary" />
            </div>
            <div class="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">{{ kpi.description }}</div>
          </div>
          <div class="space-y-1">
            <h3 class="text-sm font-medium text-gray-500">{{ kpi.title }}</h3>
            <div class="flex items-baseline gap-2">
              <p class="text-3xl font-semibold tracking-tight text-primary">{{ formatNumber(kpi.value) }}</p>
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
              <rs-badge variant="primary">{{ filteredTasks.length }} REKOD</rs-badge>
            </div>
            <div class="flex gap-4">
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
          <div class="mb-4 flex flex-wrap gap-4">
            <FormKit type="text" v-model="filters.search" placeholder="Cari nama atau lokasi..." :classes="{ input: 'w-64' }" />
            <FormKit type="select" :options="statusOptions" v-model="filters.status" placeholder="Semua Status" :classes="{ input: 'w-44' }" />
          </div>
          <rs-table
            :data="paginatedTasks"
            :columns="taskColumns"
            :pageSize="pageSize"
            :totalRecords="filteredTasks.length"
            :currentPage="currentPage"
            @page-change="handlePageChange"
            :options="{ hover: true, showNoColumn: true }"
          />
          <p class="text-sm text-gray-500 mt-4">
            Menunjukkan {{ paginatedTasks.length ? (currentPage - 1) * pageSize + 1 : 0 }} hingga
            {{ (currentPage - 1) * pageSize + paginatedTasks.length }} dari {{ filteredTasks.length }} rekod
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
            <li v-for="(note, i) in notifications" :key="i" class="py-3 flex gap-3 items-start">
              <div class="p-2 rounded-full bg-primary/10">
                <Icon name="ic:baseline-upload" class="text-lg text-primary" />
              </div>
              <div>
                <p class="text-sm text-gray-700">{{ note.message }}</p>
                <p class="text-xs text-gray-400">{{ note.date }}</p>
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
// Dashboard EOAD Logic
// =======================
import { ref, computed } from 'vue';

const breadcrumb = ref([{ name: 'Dashboard', type: 'current', path: '/' }]);
const isLoading = ref(false);
const error = ref<{ title: string; message: string } | null>(null);
const currentPage = ref(1);
const pageSize = ref(5);

// User info (should be dynamic in production)
const user = {
  nama: 'Ahmad bin Ali',
  peranan: 'Eksekutif Operasi Agihan Daerah',
  daerah: 'Klang',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI summary data
const kpiList = ref([
  { title: 'Permohonan Baharu', value: 45, icon: 'ic:baseline-note-add', description: 'Baru' },
  { title: 'Perlu Tindakan', value: 12, icon: 'ic:baseline-error-outline', description: 'Tertunggak' },
  { title: 'Telah Diluluskan', value: 7, icon: 'ic:baseline-check-circle', description: 'Selesai' },
  { title: 'Tugasan Aktif', value: 5, icon: 'ic:baseline-assignment', description: 'Berjalan' },
]);

// Table columns
const taskColumns = [
  { key: 'tajuk', label: 'Tugasan' },
  { key: 'tarikh', label: 'Tarikh' },
  { key: 'status', label: 'Status' },
];

// Task list data
const taskList = ref([
  { tajuk: 'Kelulusan Bantuan - Permohonan 456', tarikh: '2025-06-13', status: 'Selesai' },
  { tajuk: 'Lawatan Tapak - Permohonan 123', tarikh: '2025-06-14', status: 'Belum Selesai' },
]);

// Activity feed notifications
const notifications = ref([
  { type: 'info', message: 'Permohonan 789 menunggu lawatan tapak.', date: '2025-06-15' },
  { type: 'success', message: 'Permohonan 456 telah diluluskan oleh EKP.', date: '2025-06-14' },
]);

// Filters for search and status
const filters = ref({ search: '', status: '' });

const filteredTasks = computed(() => {
  return taskList.value.filter((task) => {
    const matchSearch = !filters.value.search || task.tajuk.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchStatus = !filters.value.status || task.status === filters.value.status;
    return matchSearch && matchStatus;
  });
});

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredTasks.value.slice(start, start + pageSize.value);
});

const statusOptions = [
  { label: 'Selesai', value: 'Selesai' },
  { label: 'Belum Selesai', value: 'Belum Selesai' },
];

// Helper: Reset filters
const resetFilters = () => {
  filters.value.search = '';
  filters.value.status = '';
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
const refreshData = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 800);
};
</script>

<style scoped></style>
