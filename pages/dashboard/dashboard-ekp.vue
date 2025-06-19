<template>
  <!-- Breadcrumb Navigation -->
  <LayoutsBreadcrumb :items="breadcrumb" />

  <!-- Loading Spinner -->
  <div v-if="isLoading" class="flex justify-center items-center min-h-[200px]">
    <rs-spinner size="lg" />
  </div>
  <!-- Error Alert -->
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

  <!-- Main Dashboard Content -->
  <div v-else class="space-y-6">
    <!-- User Info Card -->
    <rs-card class="mb-6">
      <template #body>
        <div class="p-4">
          <h1 class="text-3xl font-bold text-gray-800 mt-2">
            Eksekutif Khidmat Pelanggan - {{ user.cawangan }}
          </h1>
          <p class="text-sm text-gray-600 mt-1">
            Nama: <strong>{{ user.nama }}</strong>
          </p>
          <p class="text-sm text-gray-500">
            Log Masuk Terakhir: {{ user.loginTime }}
          </p>
        </div>
      </template>
    </rs-card>

    <!-- KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <rs-card
        v-for="(kpi, index) in kpiList"
        :key="index"
        class="group transition-all duration-300 hover:shadow-md"
      >
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2.5 rounded-lg bg-primary/5">
              <Icon :name="kpi.icon" class="text-xl text-primary" />
            </div>
            <div class="text-xs font-medium px-2 py-1 rounded-full bg-primary/5 text-primary">
              Auto count
            </div>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-600 mb-1">{{ kpi.title }}</div>
            <div class="text-2xl font-bold text-primary">{{ kpi.value }}</div>
          </div>
        </div>
      </rs-card>
    </div>

    <!-- Main Grid: Activity Feed & Donut Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Activity Feed Section -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">Aktiviti Terkini</h2>
        </template>
        <div class="space-y-4 p-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
          >
            <div class="p-2 rounded-full bg-info/10">
              <Icon name="ic:baseline-notifications" class="text-info text-lg" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </rs-card>

      <!-- Donut Chart Section -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold text-primary">Carta Ringkasan Prestasi</h2>
        </template>
        <client-only>
          <VueApexCharts
            type="donut"
            height="300"
            :series="chartSeries"
            :options="chartOptions"
          />
        </client-only>
      </rs-card>
    </div>

    <!-- Statistik Permohonan Table -->
    <rs-card class="mt-6">
      <template #header>
        <h2 class="text-lg font-semibold text-primary">Statistik Permohonan Mengikut Status</h2>
      </template>
      <rs-table
        :columns="statistikColumns"
        :data="statistikPermohonan"
        :options="{ striped: true, hover: true }"
      >
        <template #status="{ text }">
          <rs-badge :variant="getStatusVariant(text)">
            {{ text }}
          </rs-badge>
        </template>
      </rs-table>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
// =======================
// Dashboard EKP Logic
// =======================
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "current",
    path: "/",
  },
]);

// User info (should be dynamic in production)
const user = ref({
  nama: 'Haslina bt Yusuf',
  peranan: 'Eksekutif Kelulusan Permohonan (EKP)',
  cawangan: 'Cawangan Shah Alam',
  loginTime: new Date().toLocaleString('ms-MY'),
});

// Error and loading state
const error = ref<{ title: string; message: string } | null>(null);
const isLoading = ref(false);

// KPI summary data
const kpiList = ref([
  { title: 'Jumlah Permohonan Hari Ini', value: 120, icon: 'ic:baseline-person-add' },
  { title: 'Permohonan Selesai', value: 80, icon: 'ic:baseline-check-circle' },
  { title: 'Permohonan Rework', value: 25, icon: 'ic:baseline-autorenew' },
  { title: 'Permohonan Draf', value: 15, icon: 'ic:baseline-drafts' },
]);

// Recent Activities
const recentActivities = ref([
  { id: 1, message: 'Permohonan baharu Ahmad bin Abdullah', time: '5 minit lepas' },
  { id: 2, message: 'Kelulusan disahkan oleh Sarah bt Ismail', time: '30 minit lepas' },
]);

// Chart Data
const chartSeries = [10, 3, 2];
const chartOptions = {
  labels: ['Selesai', 'Rework', 'Draf'],
  colors: ['#22c55e', '#f97316', '#3b82f6'],
  legend: { position: 'bottom' },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: () => chartSeries.reduce((a, b) => a + b, 0).toString()
          }
        }
      }
    }
  }
};

// Statistik Table
const statistikColumns = [
  { key: 'jenis', label: 'Jenis' },
  { key: 'status', label: 'Status' },
  { key: 'jumlah', label: 'Jumlah' },
];

const statistikPermohonan = ref([
  { jenis: 'Bantuan Kesihatan', status: 'DITOLAK', jumlah: 10 },
  { jenis: 'Bantuan Kewangan', status: 'DISEMAK', jumlah: 30 },
  { jenis: 'Bantuan Pendidikan', status: 'DILULUSKAN', jumlah: 40 },
]);

// Status Badge Variant
const getStatusVariant = (status: string) => {
  return {
    DITOLAK: 'danger',
    DISEMAK: 'info',
    DILULUSKAN: 'success',
  }[status] || 'default';
};

// Dummy data loader
const fetchDashboardData = () => {
  isLoading.value = true;
  error.value = null;
  setTimeout(() => {
    isLoading.value = false;
    // simulate error
    // error.value = { title: "Ralat", message: "Gagal ambil data." }
  }, 1000);
};
</script>

<style scoped>
</style>
