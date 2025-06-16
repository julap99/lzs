<<<<<<< HEAD
<template>
  <div>
    <!-- Breadcrumb -->
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

    <!-- Main Dashboard -->
    <div v-else class="space-y-6">
      <!-- Ringkasan Pengguna -->
      <rs-card class="p-5 bg-white shadow-sm">
        <div class="grid md:grid-cols-4 gap-4">
          <div><strong>Nama:</strong> {{ user.nama }}</div>
          <div><strong>Peranan:</strong> {{ user.peranan }}</div>
          <div><strong>Daerah:</strong> {{ user.daerah }}</div>
          <div><strong>Kariah:</strong> {{ user.kariah }}</div>
          <div><strong>Login:</strong> {{ user.loginTime }}</div>
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

      <!-- Senarai Permohonan -->
      <rs-card>
        <template #header>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-lg font-semibold">Permohonan Sendiri</h2>
            <FormKit
              type="select"
              label="Status"
              v-model="filterStatus"
              :options="statusOptions"
              class="w-full md:w-48"
            />
          </div>
        </template>

        <rs-table
          :data="filteredPermohonan"
          :columns="permohonanColumns"
          :options="{ hover: true }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusBadge(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>
        </rs-table>
      </rs-card>

      <!-- Notifikasi -->
      <rs-card v-if="notifications.length">
        <template #header>
          <h2 class="text-lg font-semibold">Notifikasi Terkini</h2>
        </template>
        <ul class="divide-y">
          <li
            v-for="(note, i) in notifications"
            :key="i"
            class="py-2 flex items-start gap-2"
          >
            <span :class="getBadgeColor(note.type)" class="text-xs font-medium whitespace-nowrap">
              [{{ note.type }}]
            </span>
            <span class="text-sm">{{ note.message }}</span>
          </li>
        </ul>
      </rs-card>

      <rs-alert v-else variant="info">Tiada notifikasi baru.</rs-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const breadcrumb = [
  { title: 'Dashboard', to: '/asnaf/dashboard' },
];

const isLoading = ref(false);
const error = ref<null | { title: string; message: string }>(null);

// Dummy fetch simulation
const fetchDashboardData = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// User info
const user = {
  nama: 'Ali bin Abu',
  peranan: 'Asnaf',
  daerah: 'Gombak',
  kariah: 'Masjid Al-Khairiyah',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI Data
const kpiData = ref([
  { title: 'Jumlah Bantuan Diterima', value: 3000, icon: 'ic:baseline-volunteer-activism', description: 'Tahun Ini' },
  { title: 'Permohonan Aktif', value: 2, icon: 'ic:baseline-hourglass-top', description: 'Sedang Diproses' },
  { title: 'Permohonan Ditolak', value: 1, icon: 'ic:baseline-cancel', description: 'Tahun Ini' },
  { title: 'Kemaskini Terakhir', value: '25/04/2025', icon: 'ic:baseline-event-available', description: 'Tarikh' },
]);

// Permohonan
const filterStatus = ref('');
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Dalam Proses', value: 'Dalam Proses' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Tolak', value: 'Tolak' },
];

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
  if (!filterStatus.value) return permohonanList.value;
  return permohonanList.value.filter(p => p.status === filterStatus.value);
});

// Notifikasi
const notifications = ref([
  { type: 'success', message: 'Permohonan PMH/2025/0099 telah diluluskan dan akan diproses.' },
]);

// Utilities
const getBadgeColor = (type: string): string => {
  return {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    danger: 'text-red-600',
  }[type] || 'text-gray-500';
};

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

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
</style>
=======
<template>
  <div>
    <!-- Breadcrumb -->
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

    <!-- Main Dashboard -->
    <div v-else class="space-y-6">
      <!-- Ringkasan Pengguna -->
      <rs-card class="p-5 bg-white shadow-sm">
        <div class="grid md:grid-cols-4 gap-4">
          <div><strong>Nama:</strong> {{ user.nama }}</div>
          <div><strong>Peranan:</strong> {{ user.peranan }}</div>
          <div><strong>Daerah:</strong> {{ user.daerah }}</div>
          <div><strong>Kariah:</strong> {{ user.kariah }}</div>
          <div><strong>Login:</strong> {{ user.loginTime }}</div>
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

      <!-- Senarai Permohonan -->
      <rs-card>
        <template #header>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 class="text-lg font-semibold">Permohonan Sendiri</h2>
            <FormKit
              type="select"
              label="Status"
              v-model="filterStatus"
              :options="statusOptions"
              class="w-full md:w-48"
            />
          </div>
        </template>

        <rs-table
          :data="filteredPermohonan"
          :columns="permohonanColumns"
          :options="{ hover: true }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusBadge(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>
        </rs-table>
      </rs-card>

      <!-- Notifikasi -->
      <rs-card v-if="notifications.length">
        <template #header>
          <h2 class="text-lg font-semibold">Notifikasi Terkini</h2>
        </template>
        <ul class="divide-y">
          <li
            v-for="(note, i) in notifications"
            :key="i"
            class="py-2 flex items-start gap-2"
          >
            <span :class="getBadgeColor(note.type)" class="text-xs font-medium whitespace-nowrap">
              [{{ note.type }}]
            </span>
            <span class="text-sm">{{ note.message }}</span>
          </li>
        </ul>
      </rs-card>

      <rs-alert v-else variant="info">Tiada notifikasi baru.</rs-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const breadcrumb = [
  { title: 'Dashboard', to: '/asnaf/dashboard' },
];

const isLoading = ref(false);
const error = ref<null | { title: string; message: string }>(null);

// Dummy fetch simulation
const fetchDashboardData = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

// User info
const user = {
  nama: 'Ali bin Abu',
  peranan: 'Asnaf',
  daerah: 'Gombak',
  kariah: 'Masjid Al-Khairiyah',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI Data
const kpiData = ref([
  { title: 'Jumlah Bantuan Diterima', value: 3000, icon: 'ic:baseline-volunteer-activism', description: 'Tahun Ini' },
  { title: 'Permohonan Aktif', value: 2, icon: 'ic:baseline-hourglass-top', description: 'Sedang Diproses' },
  { title: 'Permohonan Ditolak', value: 1, icon: 'ic:baseline-cancel', description: 'Tahun Ini' },
  { title: 'Kemaskini Terakhir', value: '25/04/2025', icon: 'ic:baseline-event-available', description: 'Tarikh' },
]);

// Permohonan
const filterStatus = ref('');
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Dalam Proses', value: 'Dalam Proses' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Tolak', value: 'Tolak' },
];

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
  if (!filterStatus.value) return permohonanList.value;
  return permohonanList.value.filter(p => p.status === filterStatus.value);
});

// Notifikasi
const notifications = ref([
  { type: 'success', message: 'Permohonan PMH/2025/0099 telah diluluskan dan akan diproses.' },
]);

// Utilities
const getBadgeColor = (type: string): string => {
  return {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    danger: 'text-red-600',
  }[type] || 'text-gray-500';
};

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

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
</style>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
