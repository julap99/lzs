<!-- 
  RTMF SCREEN: PA-PE-ET-01_01
  PURPOSE: Senarai Penolong Amil Layak Elaun Tahunan
  DESCRIPTION: List of eligible Penolong Amil for annual allowance with filtering and actions
  ROUTE: /BF-PA/PE/ET/01
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Icon name="ic:outline-people" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-xl font-semibold">
              Senarai Penolong Amil Layak Elaun Tahunan
            </h2>
          </div>
          <div class="flex items-center space-x-3">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="exportData"
            >
              <Icon name="ic:outline-download" class="mr-2" />
              Muat Turun
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="refreshData"
            >
              <Icon name="ic:outline-refresh" class="mr-2" />
              Kemas Kini
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Info Banner -->
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start">
            <Icon name="ic:outline-info" class="text-blue-600 mt-1 mr-3" />
            <div>
              <h4 class="font-semibold text-blue-900 mb-2">Maklumat Kelayakan Elaun Tahunan</h4>
              <div class="text-sm text-blue-800 space-y-1">
                <p>• Penolong Amil mesti berstatus "Aktif" pada tahun semasa</p>
                <p>• Elaun tahunan hanya boleh dikira dan dibayar sekali setahun</p>
                <p>• Kadar elaun berdasarkan kategori jawatan dan tahun perkhidmatan</p>
                <p>• Tahun perkhidmatan: {{ currentYear }} - {{ nextYear }}</p>
                <p>• Klik "Lihat" untuk maklumat terperinci seperti kadar elaun, tahun perkhidmatan, dan tarikh lantikan</p>
                <p>• Jadual memaparkan: No, Nama, Jawatan, Institusi, Status Lantikan, Status Pembayaran, dan Tindakan</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari nama atau ID Penolong Amil..."
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.jawatan"
              type="select"
              :options="jawatanOptions"
              placeholder="Jawatan/Kategori"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusLantikan"
              type="select"
              :options="statusLantikanOptions"
              placeholder="Status Lantikan"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusPembayaran"
              type="select"
              :options="statusPembayaranOptions"
              placeholder="Status Pembayaran"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalEligible }}</div>
            <p class="text-sm text-blue-700">Jumlah Layak</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">{{ totalCalculated }}</div>
            <p class="text-sm text-green-700">Telah Dikira</p>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-orange-600">{{ totalPending }}</div>
            <p class="text-sm text-orange-700">Menunggu</p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">{{ totalAmount }}</div>
            <p class="text-sm text-purple-700">Jumlah Elaun (RM)</p>
          </div>
        </div>

        <!-- Main Table -->
        <rs-table
          :data="filteredPenolongAmil"
          :columns="columns"
          :pageSize="pageSize"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
            responsive: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <template v-slot:statusLantikan="{ text }">
            <rs-badge :variant="getStatusLantikanVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:statusPembayaran="{ text }">
            <rs-badge :variant="getStatusPembayaranVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleView(text)"
                title="Lihat Butiran"
                class="!px-3 !py-1.5"
              >
                <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <rs-button
                v-if="canCalculateElaun(text)"
                variant="success"
                size="sm"
                @click="handleCalculateElaun(text)"
                title="Kira Elaun"
                class="!px-3 !py-1.5"
              >
                <Icon name="ic:outline-calculate" class="w-4 h-4 mr-1" />
                Kira Elaun
              </rs-button>
              <rs-button
                v-else
                variant="secondary"
                size="sm"
                disabled
                title="Elaun telah dikira"
                class="!px-3 !py-1.5"
              >
                <Icon name="ic:outline-check-circle" class="w-4 h-4 mr-1" />
                Telah Dikira
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Bulk Actions -->
    <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
      <rs-button
        variant="success"
        @click="handleBulkCalculate"
        :disabled="processing"
      >
        <Icon name="ic:outline-calculate" class="w-4 h-4 mr-1" />
        Kira Elaun (Bulk) ({{ selectedRows.length }})
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { navigateTo } from '#app';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Senarai Penolong Amil Layak Elaun Tahunan",
  description: "Senarai Penolong Amil yang layak untuk elaun tahunan",
});

const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "link",
    path: "/BF-PA/PE/ET",
  },
  {
    name: "Senarai Penolong Amil Layak",
    type: "current",
    path: "/BF-PA/PE/ET/01",
  },
]);

// Filters state
const filters = ref({
  searchQuery: "",
  jawatan: "",
  statusLantikan: "",
  statusPembayaran: "",
});

// Table state
const selectedRows = ref([]);
const processing = ref(false);
const pageSize = ref(10);

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

// Filter options
const jawatanOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Penolong Amil Kanan', value: 'Penolong Amil Kanan' },
  { label: 'Penolong Amil', value: 'Penolong Amil' },
  { label: 'Penolong Amil Muda', value: 'Penolong Amil Muda' },
];

const statusLantikanOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tamat', value: 'Tamat' },
  { label: 'Digantung', value: 'Digantung' },
];

const statusPembayaranOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Belum Dikira', value: 'Belum Dikira' },
  { label: 'Telah Dikira', value: 'Telah Dikira' },
  { label: 'Telah Dibayar', value: 'Telah Dibayar' },
];

// Mock data - replace with actual API calls
const penolongAmil = ref([
  {
    id: 'PA001',
    nama: 'Ahmad bin Abdullah',
    jawatan: 'Penolong Amil Kanan',
    institusi: 'Masjid Al-Hidayah',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Belum Dikira',
    tahunPerkhidmatan: 5,
    kadarElaun: '1,200.00',
    elaunTahunan: '6,000.00',
    tarikhLantikan: '15/01/2020',
    tarikhTamat: '14/01/2025',
  },
  {
    id: 'PA002',
    nama: 'Siti binti Mohamed',
    jawatan: 'Penolong Amil',
    institusi: 'Masjid Al-Amin',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Telah Dikira',
    tahunPerkhidmatan: 3,
    kadarElaun: '800.00',
    elaunTahunan: '2,400.00',
    tarikhLantikan: '20/03/2021',
    tarikhTamat: '19/03/2026',
  },
  {
    id: 'PA003',
    nama: 'Mohamed bin Ismail',
    jawatan: 'Penolong Amil Muda',
    institusi: 'Masjid Al-Ikhlas',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Belum Dikira',
    tahunPerkhidmatan: 1,
    kadarElaun: '600.00',
    elaunTahunan: '600.00',
    tarikhLantikan: '10/06/2023',
    tarikhTamat: '09/06/2028',
  },
  {
    id: 'PA004',
    nama: 'Fatimah binti Ali',
    jawatan: 'Penolong Amil Kanan',
    institusi: 'Masjid Al-Falah',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Telah Dibayar',
    tahunPerkhidmatan: 7,
    kadarElaun: '1,200.00',
    elaunTahunan: '8,400.00',
    tarikhLantikan: '05/02/2018',
    tarikhTamat: '04/02/2025',
  },
  {
    id: 'PA005',
    nama: 'Abdul Rahman bin Omar',
    jawatan: 'Penolong Amil',
    institusi: 'Masjid Al-Rahman',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Belum Dikira',
    tahunPerkhidmatan: 2,
    kadarElaun: '800.00',
    elaunTahunan: '1,600.00',
    tarikhLantikan: '12/08/2022',
    tarikhTamat: '11/08/2027',
  },
]);

// Table columns - Following RTMF requirements exactly
const columns = [
  {
    key: "id",
    label: "No",
    sortable: true,
    width: "70px",
  },
  {
    key: "nama",
    label: "Nama",
    sortable: true,
    width: "160px",
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
    width: "120px",
  },
  {
    key: "institusi",
    label: "Institusi",
    sortable: true,
    width: "140px",
  },
  {
    key: "statusLantikan",
    label: "Status Lantikan",
    sortable: true,
    width: "120px",
  },
  {
    key: "statusPembayaran",
    label: "Status Pembayaran",
    sortable: true,
    width: "120px",
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "140px",
  },
];

// Computed properties
const filteredPenolongAmil = computed(() => {
  return penolongAmil.value.filter(pa => {
    const matchesSearch = !filters.value.searchQuery || 
      pa.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      pa.nama.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesJawatan = !filters.value.jawatan || pa.jawatan === filters.value.jawatan;
    const matchesStatusLantikan = !filters.value.statusLantikan || pa.statusLantikan === filters.value.statusLantikan;
    const matchesStatusPembayaran = !filters.value.statusPembayaran || pa.statusPembayaran === filters.value.statusPembayaran;
    
    return matchesSearch && matchesJawatan && matchesStatusLantikan && matchesStatusPembayaran;
  }).map(pa => ({
    // Include all required columns as per RTMF requirements
    id: pa.id,
    nama: pa.nama,
    jawatan: pa.jawatan,
    institusi: pa.institusi,
    statusLantikan: pa.statusLantikan,
    statusPembayaran: pa.statusPembayaran,
    tindakan: pa.id, // Pass ID for action buttons
  }));
});

const totalEligible = computed(() => filteredPenolongAmil.value.length);
const totalCalculated = computed(() => filteredPenolongAmil.value.filter(pa => pa.statusPembayaran === 'Telah Dikira').length);
const totalPending = computed(() => filteredPenolongAmil.value.filter(pa => pa.statusPembayaran === 'Belum Dikira').length);
const totalAmount = computed(() => {
  // We need to calculate from the original data since filtered data doesn't include elaunTahunan
  const total = penolongAmil.value
    .filter(pa => pa.statusPembayaran === 'Telah Dikira')
    .reduce((sum, pa) => sum + parseFloat(pa.elaunTahunan.replace(',', '')), 0);
  return total.toLocaleString('en-MY', { minimumFractionDigits: 2 });
});

// Helper functions
const getStatusLantikanVariant = (status) => {
  switch (status) {
    case 'Aktif': return 'success';
    case 'Tamat': return 'warning';
    case 'Digantung': return 'danger';
    default: return 'secondary'; // Use secondary instead of default
  }
};

const getStatusPembayaranVariant = (status) => {
  switch (status) {
    case 'Belum Dikira': return 'warning';
    case 'Telah Dikira': return 'info';
    case 'Telah Dibayar': return 'success';
    default: return 'secondary'; // Use secondary instead of default
  }
};

const canCalculateElaun = (paId) => {
  const pa = penolongAmil.value.find(p => p.id === paId);
  return pa && pa.statusPembayaran === 'Belum Dikira';
};

// Action handlers
const handleView = (paId) => {
  navigateTo(`/BF-PA/PE/ET/01/${paId}`);
};

const handleCalculateElaun = (paId) => {
  navigateTo(`/BF-PA/PE/ET/01/02?id=${paId}`);
};

const handleBulkCalculate = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih Penolong Amil untuk dikira elaun');
    return;
  }

  processing.value = true;
  
  try {
    // Navigate to bulk calculation page
    navigateTo('/BF-PA/PE/ET/01/02?bulk=true');
  } catch (error) {
    toast.error('Ralat semasa memproses pengiraan bulk');
    console.error('Error in bulk calculation:', error);
  } finally {
    processing.value = false;
  }
};

const exportData = () => {
  toast.info('Fungsi eksport akan diimplementasikan');
};

const refreshData = async () => {
  try {
    processing.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Data telah dikemas kini');
  } catch (error) {
    toast.error('Ralat semasa mengemas kini data');
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  // Load initial data
  refreshData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 