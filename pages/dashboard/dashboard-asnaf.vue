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

    <!-- KFAM Section -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Kelas Fardu Ain Muallaf (KFAM) Terdekat</h2>
          <rs-button variant="primary" class="bg-teal-600 hover:bg-teal-700" @click="printKfam">
            <i class="fas fa-print mr-2"></i>
            Cetak
          </rs-button>
        </div>
      </template>
      <template #body>
        <div ref="kfamSectionRef" class="overflow-x-auto">
          <table class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Nama Pengajar</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">No Telefon</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Tempat Mengajar</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Daerah</th>
                <th class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Bahasa Penghantar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="kelas in kfamClassesList" :key="kelas.id">
                <td class="border border-gray-300 px-4 py-3">
                  <div class="font-medium">{{ kelas.nama_pengajar }}</div>
                  <div class="text-sm text-gray-600">{{ kelas.kelulusan }}</div>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-phone text-blue-600"></i>
                    <span>{{ kelas.no_telefon }}</span>
                  </div>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <div class="font-medium">{{ kelas.tempat_mengajar }}</div>
                  <div class="text-sm text-gray-600">{{ kelas.alamat_tempat }}</div>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{{ kelas.daerah }}</span>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{{ kelas.bahasa_penghantar }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
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

// KFAM mock data and print logic (referenced from AS/FR/02)
const kfamSectionRef = ref<HTMLElement | null>(null);
const kfamClassesList = ref([
  {
    id: 1,
    nama_pengajar: 'Ustaz Ahmad',
    kelulusan: 'Sijil Pengajian Islam',
    no_telefon: '012-3456789',
    tempat_mengajar: 'Masjid Al-Khairiyah',
    alamat_tempat: 'Jalan Masjid, 53100 Gombak, Selangor',
    daerah: 'Gombak',
    bahasa_penghantar: 'Bahasa Melayu',
  },
  {
    id: 2,
    nama_pengajar: 'Ustazah Farah',
    kelulusan: 'Ijazah Syariah',
    no_telefon: '013-9876543',
    tempat_mengajar: 'Surau Al-Hidayah',
    alamat_tempat: 'Taman Bukit, 68000 Ampang, Selangor',
    daerah: 'Ampang',
    bahasa_penghantar: 'Bahasa Melayu',
  },
  {
    id: 3,
    nama_pengajar: 'Brother Ali',
    kelulusan: 'Certified Daee',
    no_telefon: '011-2233445',
    tempat_mengajar: 'Community Center',
    alamat_tempat: 'Jalan Damai, 47400 Petaling Jaya, Selangor',
    daerah: 'Petaling',
    bahasa_penghantar: 'English',
  },
]);

const printKfam = () => {
  const node = kfamSectionRef.value;
  if (!node) return;
  const content = node.innerHTML;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Cetak KFAM</title>
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 16px; }
        h1 { font-size: 18px; margin: 0 0 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        thead tr { background: #f9fafb; }
        .text-sm { font-size: 12px; color: #6b7280; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; }
        .badge-blue { background: #dbeafe; color: #1d4ed8; }
        .badge-green { background: #d1fae5; color: #047857; }
        @media print { @page { size: A4; margin: 12mm; } }
      </style>
    </head>
    <body>
      <h1>Kelas Fardu Ain Muallaf (KFAM) Terdekat</h1>
      ${content}
      <script>window.onload = function(){ window.print(); setTimeout(function(){ window.close(); }, 300); }<\/script>
    </body>
  </html>`);
  printWindow.document.close();
};
</script>

<style scoped></style>
