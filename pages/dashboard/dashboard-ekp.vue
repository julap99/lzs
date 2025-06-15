<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Info Pengguna -->
    <rs-card class="p-5">
      <div class="grid md:grid-cols-4 gap-4">
        <div><strong>Nama:</strong> {{ user.nama }}</div>
        <div><strong>Peranan:</strong> {{ user.peranan }}</div>
        <div><strong>Cawangan:</strong> {{ user.cawangan }}</div>
        <div><strong>Login:</strong> {{ user.loginTime }}</div>
      </div>
    </rs-card>

    <!-- KPI Cards -->
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

    <!-- Aktiviti Terkini + Carta -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Aktiviti Terkini -->
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

      <!-- Carta Donut Prestasi -->
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

    <!-- Statistik Permohonan Mengikut Status -->
    <rs-card>
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
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const breadcrumb = ref([{ title: 'Dashboard EKP', to: '/dashboard-ekp' }]);

const user = {
  nama: 'Haslina bt Yusuf',
  peranan: 'Eksekutif Kelulusan Permohonan (EKP)',
  cawangan: 'Cawangan Shah Alam',
  loginTime: new Date().toLocaleString('ms-MY'),
};

// KPI Cards
const kpiList = ref([
  { title: 'Jumlah Permohonan Hari Ini', value: 120, icon: 'ic:baseline-person-add' },
  { title: 'Permohonan Selesai', value: 80, icon: 'ic:baseline-check-circle' },
  { title: 'Permohonan Rework', value: 25, icon: 'ic:baseline-autorenew' },
  { title: 'Permohonan Draf', value: 15, icon: 'ic:baseline-drafts' },
]);

// Carta Prestasi
const chartSeries = [10, 3, 2]; // Selesai, Rework, Draf
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

// Statistik Permohonan
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
const getStatusVariant = (status: string) => {
  return {
    DITOLAK: 'danger',
    DISEMAK: 'info',
    DILULUSKAN: 'success',
  }[status] || 'default';
};

// Aktiviti Terkini
const recentActivities = ref([
  { id: 1, message: 'Permohonan baharu Ahmad bin Abdullah', time: '5 minit lepas' },
  { id: 2, message: 'Kelulusan disahkan oleh Sarah bt Ismail', time: '30 minit lepas' },
]);
</script>

<style scoped>
</style>
