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
    <rs-card class="p-6 bg-white shadow-sm rounded-xl mb-6">
      <div class="space-y-4">
        <h1 class="text-3xl font-bold text-gray-800">Selamat Datang, {{ user.nama }}</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div class="flex flex-col">
            <span class="font-medium text-gray-500">Kategori Asnaf</span>
            <span class="text-gray-800">{{ user.peranan }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-500">Daerah</span>
            <span class="text-gray-800">{{ user.daerah }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-500">Kariah</span>
            <span class="text-gray-800">{{ user.kariah }}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-gray-500">Log Masuk Terakhir</span>
            <span class="text-gray-800">{{ user.loginTime }}</span>
          </div>
        </div>
      </div>
    </rs-card>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
            <p class="text-2xl font-semibold text-primary">
              {{ typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value }}
            </p>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Main Grid: Permohonan & Aktiviti -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Permohonan Terdahulu Section -->
      <rs-card class="lg:col-span-2">
        <template #header>
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-semibold">Permohonan Terdahulu</h2>
              <rs-badge variant="primary">{{ filteredPermohonan.length }} REKOD</rs-badge>
            </div>
            <div class="flex flex-wrap gap-2">
              <input type="text" v-model="searchText" placeholder="Cari no rujukan atau bantuan..." class="text-sm border rounded px-3 py-1 w-64" />
              <select v-model="filterStatus" class="text-sm border rounded px-3 py-1 w-44">
                <option value="">Semua Status</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Lulus">Lulus</option>
                <option value="Tolak">Tolak</option>
              </select>
            </div>
          </div>
        </template>
        <rs-table
          :data="paginatedPermohonan"
          :columns="permohonanColumns"
          :pageSize="pageSize"
          :totalRecords="filteredPermohonan.length"
          :currentPage="currentPage"
          @page-change="handlePageChange"
          :options="{ hover: true }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusBadge(data.text)">{{ data.text.toUpperCase() }}</rs-badge>
          </template>
        </rs-table>
        <p class="text-sm text-gray-500 mt-2">
          Menunjukkan {{ paginatedPermohonan.length ? (currentPage - 1) * pageSize + 1 : 0 }} hingga
          {{ (currentPage - 1) * pageSize + paginatedPermohonan.length }} dari {{ filteredPermohonan.length }} rekod
        </p>
      </rs-card>

      <!-- Aktiviti Terkini Section -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Aktiviti Terkini</h2>
        </template>
        <template #body>
          <ul class="divide-y divide-gray-200">
            <li v-for="(note, i) in notifications" :key="i" class="py-3 flex items-start gap-2">
              <Icon name="ic:baseline-upload" class="text-lg text-primary" />
              <span class="text-sm">{{ note.message }}</span>
            </li>
          </ul>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// =======================
// Dashboard Asnaf Logic
// =======================
import { ref, computed, onMounted } from 'vue';

const breadcrumb = [
  { title: 'Dashboard', to: '/asnaf/dashboard' },
];

const isLoading = ref(false);
const error = ref<null | { title: string; message: string }>(null);
const searchText = ref('');

// User info (should be dynamic in production)
const user = {
  nama: 'Ali bin Abu',
  peranan: 'Fakir',
  daerah: 'Gombak',
  kariah: 'Masjid Al-Khairiyah',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI summary data
const kpiData = ref([
  { title: 'Jumlah Keseluruhan Bantuan Diterima', value: 'RM 3,000', icon: 'ic:baseline-volunteer-activism', description: '' },
  { title: 'Permohonan Aktif', value: 1, icon: 'ic:baseline-hourglass-top', description: 'Sedang Diproses' },
  { title: 'Permohonan Ditolak', value: 1, icon: 'ic:baseline-cancel', description: '' },
  { title: 'Kemaskini Seterusnya', value: '25/04/2026', icon: 'ic:baseline-event-available', description: 'Tarikh Review' },
]);

const filterStatus = ref('');
const permohonanList = ref([
  { noRujukan: 'PMH/2025/0101', tarikh: '2025-06-14', bantuan: 'Bantuan Tunai', status: 'Dalam Proses' },
  { noRujukan: 'PMH/2025/0099', tarikh: '2025-06-13', bantuan: 'Bantuan Kecemasan', status: 'Lulus' },
  { noRujukan: 'PMH/2025/0088', tarikh: '2025-06-10', bantuan: 'Bantuan Pendidikan', status: 'Tolak' },
]);

const permohonanColumns = [
  { key: 'noRujukan', label: 'No. Rujukan' },
  { key: 'tarikh', label: 'Tarikh Permohonan' },
  { key: 'bantuan', label: 'Jenis Bantuan' },
  { key: 'status', label: 'Status' },
];

const filteredPermohonan = computed(() => {
  if (!filterStatus.value && !searchText.value) return permohonanList.value;
  return permohonanList.value.filter(p => {
    const matchStatus = !filterStatus.value || p.status === filterStatus.value;
    const matchSearch = !searchText.value ||
      p.noRujukan.toLowerCase().includes(searchText.value.toLowerCase()) ||
      p.bantuan.toLowerCase().includes(searchText.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const pageSize = 2;
const currentPage = ref(1);

const paginatedPermohonan = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredPermohonan.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const notifications = ref([
  { message: 'Permohonan PMH/2025/0099 telah diluluskan dan akan diproses.' },
]);

const getStatusBadge = (status: string): string => {
  return {
    'Dalam Proses': 'warning',
    'Lulus': 'success',
    'Tolak': 'danger',
  }[status] || 'default';
};

const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ms-MY').format(num);
};

const fetchDashboardData = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped></style>
