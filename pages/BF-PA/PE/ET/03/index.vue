<!-- 
  RTMF SCREEN: PA-PE-ET-03
  PURPOSE: Lihat Maklumat Elaun Tahunan — Paparan Lengkap
  DESCRIPTION: Paparan lengkap maklumat elaun tahunan yang telah dihantar (untuk semua peranan)
  ROUTE: /BF-PA/PE/ET/03
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Maklumat Elaun Tahunan
          </h1>
        </div>
      </div>
    </div>

    <!-- Basic Information Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Asas</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Elaun</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                {{ batchData.year || '—' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Elaun</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ batchData.typeLabel || '—' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="px-3 py-2">
                <rs-badge :variant="getStatusVariant(batchData.status)">
                  {{ batchData.status || '—' }}
                </rs-badge>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bilangan Penerima</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                {{ recipients.length }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Financial Information Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Kewangan</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bajet Diperuntukkan</label>
              <div class="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-blue-900 font-semibold">
                RM {{ formatCurrency(batchData.budget) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Elaun</label>
              <div class="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-900 font-semibold">
                RM {{ formatCurrency(totalAllowance) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ excessAmount > 0 ? 'Lebihan' : 'Baki' }}
              </label>
              <div class="px-3 py-2 border rounded-md font-semibold" 
                   :class="excessAmount > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-gray-50 border-gray-200 text-gray-900'">
                RM {{ formatCurrency(Math.abs(balanceAmount)) }}
              </div>
            </div>
          </div>
          
          <!-- Budget Warning -->
          <div v-if="excessAmount > 0" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start">
              <Icon name="ic:outline-warning" class="text-red-400 mr-3 flex-shrink-0 mt-0.5" size="20" />
              <div>
                <h4 class="text-sm font-medium text-red-800">Amaran: Elaun Melebihi Bajet</h4>
                <p class="text-sm text-red-700 mt-1">
                  Jumlah elaun melebihi bajet sebanyak <span class="font-medium">RM {{ formatCurrency(excessAmount) }}</span>.
                  Permohonan ini memerlukan pengesahan dari Ketua Jabatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Review History -->
    <div class="mb-6 p-6 border border-gray-200 rounded-lg">
      <h3 class="text-lg font-semibold mb-4 text-gray-900">
        Sejarah Semakan
      </h3>
      
      <div class="space-y-4">
        <!-- Eksekutif -->
        <div class="flex items-start justify-between p-4">
          <div class="flex items-start">
            <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">Eksekutif</h4>
                <rs-badge variant="success">Selesai</rs-badge>
              </div>
              <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
              <div class="text-xs text-gray-600 space-y-1">
                <p><strong>Disemak oleh:</strong> Ahmad bin Abdullah</p>
                <p><strong>Tarikh:</strong> 15 Jan 2024</p>
                <p><strong>Catatan:</strong> Permohonan elaun khas untuk 48 aktiviti/tahun telah disemak dan disokong.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Ketua Jabatan Review (Current) -->
        <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div class="flex items-start">
            <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-orange-900">Ketua Jabatan</h4>
                <rs-badge variant="warning">Dalam Proses</rs-badge>
              </div>
              <p class="text-sm text-orange-700 mb-2">Pengesahan ketua jabatan</p>
              <div class="text-xs text-orange-600 space-y-1">
                <p><strong>Disemak oleh:</strong> -</p>
                <p><strong>Tarikh:</strong> -</p>
                <p><strong>Status:</strong> Menunggu keputusan pengesahan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipients List Card -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Senarai Penerima</h3>
          <div class="text-sm text-gray-500">
            Jumlah: <span class="font-medium">{{ recipients.length }}</span> penerima
          </div>
        </div>
      </template>
      <template #body>
        <div class="p-6">
          <!-- Search -->
          <div class="mb-4">
            <FormKit
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama, ID pengenalan, atau kariah..."
              :classes="{
                input: '!py-2',
              }"
              class="max-w-md"
            />
          </div>



          <!-- Recipients Table -->
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Bil.</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kariah/Daerah</th>
                  <th class="px-4 py-3 font-medium text-gray-900 text-right">Elaun (RM)</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(recipient, index) in filteredRecipients" :key="recipient.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ recipient.name }}</td>
                  <td class="px-4 py-3 text-gray-700">{{ recipient.ic }}</td>
                  <td class="px-4 py-3">
                    <rs-badge variant="secondary" size="sm">{{ recipient.category }}</rs-badge>
                  </td>
                  <td class="px-4 py-3 text-gray-700">{{ recipient.parish }}</td>
                  <td class="px-4 py-3 text-right font-medium text-gray-900">
                    {{ formatCurrency(recipient.allowance) }}
                  </td>
                </tr>
                <tr v-if="!filteredRecipients.length" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="6">
                    {{ searchQuery ? 'Tiada hasil carian ditemui.' : 'Tiada penerima dalam senarai.' }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-3 text-right font-medium" colspan="5">Jumlah Keseluruhan (RM)</td>
                  <td class="px-4 py-3 text-right font-bold text-lg">{{ formatCurrency(totalAllowance) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 mt-6">

      
      <div class="flex gap-2">
        <rs-button
          variant="info"
          @click="exportToCSV"
          :loading="exportLoading"
          class="flex items-center"
        >
          <Icon name="ic:outline-download" class="w-4 h-4 mr-2" />
          Eksport CSV
        </rs-button>
        
        <rs-button
          variant="warning"
          @click="exportToPDF"
          :loading="exportLoading"
          class="flex items-center"
        >
          <Icon name="ic:outline-picture-as-pdf" class="w-4 h-4 mr-2" />
          Eksport PDF
        </rs-button>
      </div>
      
      <rs-button
        variant="primary"
        @click="goBack"
        class="flex items-center"
      >
        <Icon name="ic:outline-arrow-left" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Lihat Maklumat Elaun Tahunan",
  description: "View complete allowance details for all roles",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();

const goBack = () => router.back();

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
    name: "Maklumat Elaun",
    type: "current",
    path: "/BF-PA/PE/ET/03",
  },
]);

// Data
const batchData = ref({
  id: '',
  rujukan: '',
  year: '',
  type: '',
  typeLabel: '',
  status: '',
  budget: 10000,
  notes: ''
});

const recipients = ref([]);
const searchQuery = ref('');

// Type mapping
const typeOptions = {
  'ET-KPAK': 'Elaun Tahunan KPAK',
  'ET-KPAF': 'Elaun Tahunan KPAF', 
  'ET-KHAS': 'Elaun Khas - 48 Aktiviti/Tahun',
  'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
  'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
  'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
  'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
  'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
  'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
};

// Advanced filtering and export functionality
const advancedFilters = ref({
  dateRange: { start: null, end: null },
  amountRange: { min: 0, max: null },
  status: [],
  category: []
});

const showAdvancedFilters = ref(false);
const exportLoading = ref(false);

// Available filter options
const filterOptions = {
  status: [
    { label: 'DRAF', value: 'DRAF' },
    { label: 'SEDANG PROSES', value: 'SEDANG PROSES' },
    { label: 'MENUNGGU KELULUSAN', value: 'MENUNGGU KELULUSAN' },
    { label: 'PERLU PENGESAHAN', value: 'PERLU PENGESAHAN' },
    { label: 'LULUS', value: 'LULUS' },
    { label: 'DITOLAK', value: 'DITOLAK' }
  ],
  category: [
    { label: 'KPAK', value: 'KPAK' },
    { label: 'KPAF', value: 'KPAF' },
    { label: 'PAK', value: 'PAK' },
    { label: 'PAF', value: 'PAF' },
    { label: 'PAP', value: 'PAP' },
    { label: 'PAK+', value: 'PAKPLUS' }
  ]
};

// Computed values
const totalAllowance = computed(() => {
  return recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0);
});

const excessAmount = computed(() => {
  return Math.max(0, totalAllowance.value - batchData.value.budget);
});

const balanceAmount = computed(() => {
  return totalAllowance.value - batchData.value.budget;
});

// Filtered recipients based on advanced filters
const filteredRecipients = computed(() => {
  let filtered = recipients.value;
  
  // Status filter
  if (advancedFilters.value.status.length > 0) {
    filtered = filtered.filter(r => advancedFilters.value.status.includes(r.category));
  }
  
  // Amount range filter
  if (advancedFilters.value.amountRange.min > 0) {
    filtered = filtered.filter(r => r.allowance >= advancedFilters.value.amountRange.min);
  }
  if (advancedFilters.value.amountRange.max) {
    filtered = filtered.filter(r => r.allowance <= advancedFilters.value.amountRange.max);
  }
  
  return filtered;
});

// Helper functions
function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getStatusVariant(status) {
  switch (status) {
    case 'DRAF': return 'secondary';
    case 'SEDANG PROSES': return 'info';
    case 'MENUNGGU KELULUSAN': return 'warning';
    case 'PERLU PENGESAHAN': return 'warning';
    case 'LULUS': return 'success';
    case 'DITOLAK': return 'danger';
    default: return 'secondary';
  }
}

// Note: Timeline functions removed - using simple "Sejarah Semakan" pattern instead

// Load data function
function loadBatchData() {
  const id = route.params.id;
  const year = route.query.year;
  const type = route.query.type;
  
  if (!id || !year || !type) {
    // Load mock data for demonstration if no parameters
    loadMockData();
    return;
  }
  
  try {
    // Load from localStorage
    const recipientsKey = `et:recipients:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    const notesKey = `et:notes:${year}:${type}`;
    const budgetKey = `et:budget:${year}:${type}`;
    
    const recipientsData = localStorage.getItem(recipientsKey);
    const status = localStorage.getItem(statusKey);
    const notes = localStorage.getItem(notesKey);
    const budget = localStorage.getItem(budgetKey);
    
    if (recipientsData) {
      recipients.value = JSON.parse(recipientsData);
    } else {
      // Fallback to mock data if no localStorage data
      loadMockData();
      return;
    }
    
    // Set batch data
    batchData.value = {
      id: id,
      rujukan: id,
      year: Number(year),
      type: type,
      typeLabel: typeOptions[type] || type,
      status: status || 'SEDANG PROSES',
      budget: Number(budget) || 10000,
      notes: notes || ''
    };
    
  } catch (error) {
    // Fallback to mock data on error
    loadMockData();
  }
}

// Mock data function
function loadMockData() {
  // Generate mock batch data
  const mockYear = 2024;
  const mockType = 'ET-KHAS';
  const mockStatus = 'MENUNGGU KELULUSAN';
  
  batchData.value = {
    id: 'ET-2024-001',
    rujukan: 'ET-2024-001',
    year: mockYear,
    type: mockType,
    typeLabel: typeOptions[mockType] || mockType,
    status: mockStatus,
    budget: 15000,
    notes: 'Elaun khas untuk 48 aktiviti/tahun 2024. Permohonan ini telah disemak dan disokong oleh eksekutif.'
  };
  
  // Generate mock recipients data for ET-KHAS (Elaun Khas - 48 Aktiviti/Tahun)
  recipients.value = [
    {
      paId: 'PA2024001',
      name: 'Ahmad bin Abdullah',
      ic: '800101011234',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 400.00
    },
    {
      paId: 'PA2024002',
      name: 'Mohd Zain bin Ismail',
      ic: '750315085678',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 400.00
    },
    {
      paId: 'PA2024003',
      name: 'Siti Aminah binti Omar',
      ic: '820520149012',
      category: 'KPAF',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 400.00
    },
    {
      paId: 'PA2024004',
      name: 'Abdul Rahman bin Hassan',
      ic: '780812063456',
      category: 'PAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 400.00
    },
    {
      paId: 'PA2024005',
      name: 'Nor Azizah binti Ahmad',
      ic: '830615083456',
      category: 'PAF',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 400.00
    },
    {
      paId: 'PA2024006',
      name: 'Mohd Faiz bin Omar',
      ic: '790325127890',
      category: 'PAP',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 400.00
    }
  ];
  

}

// Export function
async function exportData() {
  exportLoading.value = true;
  
  try {
    const data = [
      ['Nama', 'IC', 'Kategori', 'Kariah/Daerah', 'Elaun (RM)', 'Status'],
      ...filteredRecipients.value.map(r => [
        r.name,
        r.ic,
        r.category,
        r.parish,
        r.allowance.toFixed(2),
        batchData.value.status
      ])
    ];
    
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `elaun-tahunan-${batchData.value.year}-${batchData.value.type}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Data berjaya dieksport ke CSV');
  } catch (error) {
    toast.error('Gagal mengeksport data. Sila cuba lagi.');
  } finally {
    exportLoading.value = false;
  }
}

// Clear all filters
function clearAdvancedFilters() {
  advancedFilters.value = {
    dateRange: { start: null, end: null },
    amountRange: { min: 0, max: null },
    status: [],
    category: []
  };
}

// Toggle advanced filters
function toggleAdvancedFilters() {
  showAdvancedFilters.value = !showAdvancedFilters.value;
}

// Load data on mount
onMounted(() => {
  loadBatchData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 