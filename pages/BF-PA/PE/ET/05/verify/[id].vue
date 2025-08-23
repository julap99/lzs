<!-- 
  RTMF SCREEN: PA-PE-ET-05-01 (Verification)
  PURPOSE: Pengesahan Elaun Melebihi Bajet — Ketua Jabatan
  DESCRIPTION: Verification page for Ketua Jabatan to verify allowances that exceed budget before Ketua Divisyen approval
  ROUTE: /BF-PA/PE/ET/05/verify/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ic:baseline-admin-panel-settings" class="w-6 h-6 mr-3 text-orange-600" />
            Pengesahan Elaun Melebihi Bajet
          </h1>
          <p class="text-gray-600 mt-1">
            Rujukan: <span class="font-medium">{{ batchData.rujukan || '—' }}</span> · 
            Status: <rs-badge variant="warning" size="sm">PERLU PENGESAHAN</rs-badge>
          </p>
        </div>
        <!-- Loading Indicator -->
        <div v-if="loading" class="flex items-center text-blue-600">
          <Icon name="ic:baseline-refresh" class="w-5 h-5 mr-2 animate-spin" />
          <span class="text-sm">Memuatkan data...</span>
        </div>
      </div>
    </div>

    <!-- Change Summary Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Ringkasan Perubahan</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <Icon name="ic:baseline-warning" class="text-orange-400 mr-3 flex-shrink-0 mt-0.5" size="20" />
              <div>
                <h4 class="text-sm font-medium text-orange-800">Elaun Melebihi Bajet</h4>
                <p class="text-sm text-orange-700 mt-1">
                  Jumlah elaun <span class="font-medium">RM {{ formatCurrency(totalAllowance) }}</span> 
                  melebihi bajet <span class="font-medium">RM {{ formatCurrency(batchData.budget) }}</span> 
                  sebanyak <span class="font-medium">RM {{ formatCurrency(excessAmount) }}</span>.
                </p>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div class="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-900 font-semibold text-lg">
                RM {{ formatCurrency(totalAllowance) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Lebihan</label>
              <div class="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-900 font-semibold text-lg">
                RM {{ formatCurrency(excessAmount) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Approval Timeline Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Aliran Kerja Kelulusan</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-4">
            <!-- Eksekutif -->
            <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <Icon name="ic:baseline-person" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Eksekutif</p>
                  <p class="text-sm text-gray-600">Dibuat & Dihantar</p>
                </div>
              </div>
              <rs-badge variant="success" size="sm">Selesai</rs-badge>
            </div>
            
            <!-- Ketua Jabatan (Current) -->
            <div class="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                  <Icon name="ic:baseline-admin-panel-settings" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Ketua Jabatan</p>
                  <p class="text-sm text-gray-600">Pengesahan (Sedang Proses)</p>
                </div>
              </div>
              <rs-badge variant="warning" size="sm">Sedang Proses</rs-badge>
            </div>
            
            <!-- Ketua Divisyen -->
            <div class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <Icon name="ic:baseline-person" class="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Ketua Divisyen</p>
                  <p class="text-sm text-gray-600">Menunggu Pengesahan</p>
                </div>
              </div>
              <rs-badge variant="secondary" size="sm">Belum Mula</rs-badge>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Eksekutif Notes Card -->
    <rs-card v-if="batchData.notes" class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Ulasan Eksekutif</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-gray-700">{{ batchData.notes }}</p>
          </div>
        </div>
      </template>
    </rs-card>

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
                <tr v-for="(recipient, index) in recipients" :key="recipient.paId" class="hover:bg-gray-50">
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

    <!-- Verification Form Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Borang Pengesahan</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-6">
            <!-- Decision -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Keputusan <span class="text-red-500">*</span>
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="verificationData.decision"
                    type="radio"
                    value="verify"
                    class="mr-2 text-orange-600 focus:ring-orange-500"
                  />
                  <span class="text-sm font-medium text-gray-900">Sahkan</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="verificationData.decision"
                    type="radio"
                    value="reject"
                    class="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span class="text-sm font-medium text-gray-900">Tolak</span>
                </label>
              </div>
              <p v-if="!verificationData.decision && canSubmit === false" class="text-sm text-red-600 mt-1">
                Sila pilih keputusan pengesahan
              </p>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tarikh Pengesahan <span class="text-red-500">*</span>
              </label>
              <input
                v-model="verificationData.date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <p v-if="!verificationData.date && canSubmit === false" class="text-sm text-red-600 mt-1">
                Sila pilih tarikh pengesahan
              </p>
            </div>

            <!-- Comments -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ulasan Pengesahan <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="verificationData.comments"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Masukkan ulasan mengenai pengesahan ini..."
                required
              ></textarea>
              <p v-if="!verificationData.comments.trim() && canSubmit === false" class="text-sm text-red-600 mt-1">
                Sila masukkan ulasan pengesahan
              </p>
            </div>

            <!-- Rejection Reason (Conditional) -->
            <div v-if="verificationData.decision === 'reject'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sebab Penolakan <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="verificationData.rejectionReason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Nyatakan sebab penolakan..."
                required
              ></textarea>
              <p v-if="verificationData.decision === 'reject' && !verificationData.rejectionReason.trim() && canSubmit === false" class="text-sm text-red-600 mt-1">
                Sila masukkan sebab penolakan
              </p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <rs-button
        variant="secondary-outline"
        @click="goBack"
        class="flex items-center"
      >
        <Icon name="ic:baseline-arrow-back" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
      
      <div class="flex gap-3">
        <rs-button
          variant="danger"
          :disabled="!canSubmit || submitting"
          @click="rejectAllowance"
          class="flex items-center"
        >
          <Icon name="ic:outline-cancel" class="w-4 h-4 mr-2" />
          {{ submitting ? 'Memproses...' : 'Tolak' }}
        </rs-button>
        <rs-button
          variant="success"
          :disabled="!canSubmit || submitting"
          @click="verifyAllowance"
          class="flex items-center"
        >
          <Icon name="ic:baseline-check-circle" class="w-4 h-4 mr-2" />
          {{ submitting ? 'Memproses...' : 'Sahkan' }}
        </rs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Pengesahan Elaun Melebihi Bajet",
  description: "Verification page for Ketua Jabatan to verify excess budget allowances",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();

const goBack = () => router.push('/BF-PA/PE/ET');

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
    name: "Pengesahan",
    type: "current",
    path: "/BF-PA/PE/ET/05/verify",
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
const submitting = ref(false);
const loading = ref(false);

// Verification form data
const verificationData = ref({
  decision: '',
  date: new Date().toISOString().split('T')[0],
  comments: '',
  rejectionReason: ''
});

// Type mapping
const typeOptions = {
  'ET-KPAK': 'Elaun Tahunan KPAK',
  'ET-KPAF': 'Elaun Tahunan KPAF', 
  'ET-ANUG': 'Anugerah Penolong Amil',
  'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
  'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
  'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
  'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
  'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
  'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
};

// Computed values
const totalAllowance = computed(() => {
  return recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0);
});

const excessAmount = computed(() => {
  return Math.max(0, totalAllowance.value - batchData.value.budget);
});

const canSubmit = computed(() => {
  if (!verificationData.value.decision) return false;
  if (!verificationData.value.date) return false;
  if (!verificationData.value.comments.trim()) return false;
  if (verificationData.value.decision === 'reject' && !verificationData.value.rejectionReason.trim()) return false;
  return true;
});

// Helper functions
function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Load data function
async function loadBatchData() {
  loading.value = true;
  
  try {
    const id = route.params.id;
    const year = route.query.year;
    const type = route.query.type;
    
    if (!id || !year || !type) {
      // Load mock data for demonstration if no parameters
      loadMockData();
      return;
    }
    
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
    
    // Set batch data with enhanced budget loading
    batchData.value = {
      id: id,
      rujukan: id,
      year: Number(year),
      type: type,
      typeLabel: typeOptions[type] || type,
      status: status || 'PERLU PENGESAHAN',
      budget: Number(budget) || 10000, // Load from actual data or use default
      notes: notes || ''
    };
    
  } catch (error) {
    // Fallback to mock data on error
    loadMockData();
  } finally {
    loading.value = false;
  }
}

// Mock data function
function loadMockData() {
  // Generate mock batch data
  const mockYear = 2024;
  const mockType = 'ET-KPAK';
  const mockStatus = 'PERLU PENGESAHAN';
  
  batchData.value = {
    id: 'ET-2024-001',
    rujukan: 'ET-2024-001',
    year: mockYear,
    type: mockType,
    typeLabel: typeOptions[mockType] || mockType,
    status: mockStatus,
    budget: 10000,
    notes: 'Elaun tahunan untuk KPAK tahun 2024. Jumlah elaun melebihi bajet kerana bilangan penerima yang tinggi dan elaun yang diperlukan untuk aktiviti tahunan.'
  };
  
  // Generate mock recipients data
  recipients.value = [
    {
      paId: 'PA2024001',
      name: 'Ahmad bin Abdullah',
      ic: '800101011234',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 800.00
    },
    {
      paId: 'PA2024002',
      name: 'Mohd Zain bin Ismail',
      ic: '750315085678',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 800.00
    },
    {
      paId: 'PA2024003',
      name: 'Abdul Rahman bin Hassan',
      ic: '820520149012',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 800.00
    },
    {
      paId: 'PA2024004',
      name: 'Mohd Faiz bin Omar',
      ic: '780812063456',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 800.00
    },
    {
      paId: 'PA2024005',
      name: 'Zulkifli bin Ahmad',
      ic: '790325127890',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 800.00
    },
    {
      paId: 'PA2024006',
      name: 'Ahmad Fadzil bin Ibrahim',
      ic: '810415032345',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 800.00
    },
    {
      paId: 'PA2024007',
      name: 'Mohd Hafiz bin Zainal',
      ic: '760628096789',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 800.00
    }
  ];
}

// Verification functions
async function verifyAllowance() {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  try {
    await wait(600);
    
    // Update localStorage with enhanced error handling
    const year = batchData.value.year;
    const type = batchData.value.type;
    const statusKey = `et:status:${year}:${type}`;
    const verificationKey = `et:verification:${year}:${type}`;
    
    try {
      localStorage.setItem(statusKey, 'SEDANG PROSES');
      localStorage.setItem(verificationKey, JSON.stringify({
        ...verificationData.value,
        verifiedBy: 'Ketua Jabatan',
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      }));
      
      toast.success('Elaun berjaya disahkan. Status telah dikemas kini.');
      goBack();
    } catch (storageError) {
      toast.error('Gagal menyimpan data pengesahan. Sila cuba lagi atau hubungi pentadbir sistem.');
    }
  } catch (error) {
    toast.error('Proses pengesahan gagal. Sila cuba lagi.');
  } finally {
    submitting.value = false;
  }
}

async function rejectAllowance() {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  try {
    await wait(600);
    
    // Update localStorage with enhanced error handling
    const year = batchData.value.year;
    const type = batchData.value.type;
    const statusKey = `et:status:${year}:${type}`;
    const rejectionKey = `et:rejection:${year}:${type}`;
    
    try {
      localStorage.setItem(statusKey, 'DITOLAK');
      localStorage.setItem(rejectionKey, JSON.stringify({
        ...verificationData.value,
        rejectedBy: 'Ketua Jabatan',
        rejectedAt: new Date().toISOString(),
        status: 'rejected'
      }));
      
      toast.success('Elaun telah ditolak. Status telah dikemas kini.');
      goBack();
    } catch (storageError) {
      toast.error('Gagal menyimpan data penolakan. Sila cuba lagi atau hubungi pentadbir sistem.');
    }
  } catch (error) {
    toast.error('Proses penolakan gagal. Sila cuba lagi.');
  } finally {
    submitting.value = false;
  }
}

// Helper function for async operations
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load data on mount
onMounted(() => {
  loadBatchData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style>