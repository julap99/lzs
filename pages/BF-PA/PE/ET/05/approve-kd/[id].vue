<!-- 
  RTMF SCREEN: PA-PE-ET-05-03 (Final Approval)
  PURPOSE: Kelulusan Akhir Elaun — Ketua Divisyen
  DESCRIPTION: Final approval page for Ketua Divisyen to approve all allowances (including excess budget cases)
  ROUTE: /BF-PA/PE/ET/05/approve-kd/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:gavel" class="w-6 h-6 mr-3 text-purple-600" />
            Kelulusan Akhir Elaun Tahunan
          </h1>
          <p class="text-gray-600 mt-1">
            Rujukan: <span class="font-medium">{{ batchData.rujukan || '—' }}</span> · 
            Status: <rs-badge variant="warning" size="sm">{{ batchData.status || 'SEDANG PROSES' }}</rs-badge>
          </p>
        </div>
        <!-- Loading Indicator -->
        <div v-if="loading" class="flex items-center text-blue-600">
          <Icon name="ph:arrow-clockwise" class="w-5 h-5 mr-2 animate-spin" />
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
          <!-- Budget Warning (if applicable) -->
          <div v-if="excessAmount > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <Icon name="ph:warning" class="text-orange-400 mr-3 flex-shrink-0 mt-0.5" size="20" />
              <div>
                <h4 class="text-sm font-medium text-orange-800">Elaun Melebihi Bajet - Telah Disahkan</h4>
                <p class="text-sm text-orange-700 mt-1">
                  Jumlah elaun <span class="font-medium">RM {{ formatCurrency(totalAllowance) }}</span> 
                  melebihi bajet <span class="font-medium">RM {{ formatCurrency(batchData.budget) }}</span> 
                  sebanyak <span class="font-medium">RM {{ formatCurrency(excessAmount) }}</span>.
                  <br><span class="font-medium">Ketua Jabatan telah mengesahkan keperluan ini.</span>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Normal Budget Status -->
          <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <Icon name="ph:check-circle" class="text-green-400 mr-3 flex-shrink-0 mt-0.5" size="20" />
              <div>
                <h4 class="text-sm font-medium text-green-800">Elaun Dalam Bajet</h4>
                <p class="text-sm text-green-700 mt-1">
                  Jumlah elaun <span class="font-medium">RM {{ formatCurrency(totalAllowance) }}</span> 
                  berada dalam bajet <span class="font-medium">RM {{ formatCurrency(batchData.budget) }}</span>.
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
              <div :class="[
                'px-3 py-2 border rounded-md font-semibold text-lg',
                excessAmount > 0 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : 'bg-green-50 border-green-200 text-green-900'
              ]">
                RM {{ formatCurrency(totalAllowance) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ excessAmount > 0 ? 'Lebihan' : 'Baki' }}
              </label>
              <div :class="[
                'px-3 py-2 border rounded-md font-semibold text-lg',
                excessAmount > 0 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : 'bg-green-50 border-green-200 text-green-900'
              ]">
                RM {{ formatCurrency(excessAmount > 0 ? excessAmount : remainingBudget) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Full Approval Timeline Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Aliran Kerja Kelulusan Lengkap</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-4">
            <!-- Eksekutif -->
            <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <Icon name="ph:user" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Eksekutif</p>
                  <p class="text-sm text-gray-600">Dibuat & Dihantar</p>
                </div>
              </div>
              <rs-badge variant="success" size="sm">Selesai</rs-badge>
            </div>
            
            <!-- Ketua Jabatan -->
            <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <Icon name="ph:check-circle" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Ketua Jabatan</p>
                  <p class="text-sm text-gray-600">
                    {{ excessAmount > 0 ? 'Pengesahan (Selesai)' : 'Kelulusan (Selesai)' }}
                  </p>
                </div>
              </div>
              <rs-badge variant="success" size="sm">Selesai</rs-badge>
            </div>
            
            <!-- Ketua Divisyen (Current) -->
            <div class="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                  <Icon name="ph:gavel" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Ketua Divisyen</p>
                  <p class="text-sm text-gray-600">Kelulusan Akhir (Sedang Proses)</p>
                </div>
              </div>
              <rs-badge variant="warning" size="sm">Sedang Proses</rs-badge>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Previous Approvals Card -->
    <rs-card v-if="previousApprovals.length > 0" class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Keputusan Sebelumnya</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="approval in previousApprovals" :key="approval.id" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <Icon 
                      :name="approval.status === 'approved' ? 'ph:check-circle' : 'ph:user-circle-gear'" 
                      :class="[
                        'mr-2',
                        approval.status === 'approved' ? 'text-green-500' : 'text-orange-500'
                      ]" 
                      size="16" 
                    />
                    <span class="text-sm font-medium text-gray-900">
                      {{ approval.approvedBy || approval.verifiedBy }}
                    </span>
                    <rs-badge 
                      :variant="approval.status === 'approved' ? 'success' : 'warning'" 
                      size="sm" 
                      class="ml-2"
                    >
                      {{ approval.status === 'approved' ? 'Lulus' : 'Sahkan' }}
                    </rs-badge>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">
                    {{ approval.comments }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(approval.approvedAt || approval.verifiedAt) }}
                  </p>
                </div>
              </div>
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

    <!-- Final Approval Form Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Borang Kelulusan Akhir</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-6">
            <!-- Decision -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Keputusan Akhir <span class="text-red-500">*</span>
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    v-model="finalApprovalData.decision"
                    type="radio"
                    value="approve"
                    class="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm font-medium text-gray-900">Luluskan</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="finalApprovalData.decision"
                    type="radio"
                    value="reject"
                    class="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span class="text-sm font-medium text-gray-900">Tolak</span>
                </label>
              </div>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tarikh Kelulusan Akhir <span class="text-red-500">*</span>
              </label>
              <input
                v-model="finalApprovalData.date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <!-- Comments -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ulasan Kelulusan Akhir <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="finalApprovalData.comments"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Masukkan ulasan mengenai kelulusan akhir ini..."
                required
              ></textarea>
            </div>

            <!-- Rejection Reason (Conditional) -->
            <div v-if="finalApprovalData.decision === 'reject'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sebab Penolakan <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="finalApprovalData.rejectionReason"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Nyatakan sebab penolakan..."
                required
              ></textarea>
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
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
      
      <div class="flex gap-3">
        <rs-button
          variant="danger"
          :disabled="!canSubmit || submitting"
          @click="rejectAllowance"
          class="flex items-center"
        >
          <Icon name="ph:x-circle" class="w-4 h-4 mr-2" />
          {{ submitting ? 'Memproses...' : 'Tolak' }}
        </rs-button>
        <rs-button
          variant="success"
          :disabled="!canSubmit || submitting"
          @click="approveAllowance"
          class="flex items-center"
        >
          <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
          {{ submitting ? 'Memproses...' : 'Luluskan' }}
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
  title: "Kelulusan Akhir Elaun Tahunan",
  description: "Final approval page for Ketua Divisyen to approve all allowances",
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
    name: "Kelulusan Akhir",
    type: "current",
    path: "/BF-PA/PE/ET/05/approve-kd",
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
const previousApprovals = ref([]);
const loading = ref(false);

// Final approval form data
const finalApprovalData = ref({
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

const remainingBudget = computed(() => {
  return Math.max(0, batchData.value.budget - totalAllowance.value);
});

const canSubmit = computed(() => {
  if (!finalApprovalData.value.decision) return false;
  if (!finalApprovalData.value.date) return false;
  if (!finalApprovalData.value.comments.trim()) return false;
  if (finalApprovalData.value.decision === 'reject' && !finalApprovalData.value.rejectionReason.trim()) return false;
  return true;
});

// Helper functions
function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return '—';
  }
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
    const verificationKey = `et:verification:${year}:${type}`;
    const approvalKey = `et:approval:${year}:${type}`;
    const budgetKey = `et:budget:${year}:${type}`;
    
    const recipientsData = localStorage.getItem(recipientsKey);
    const status = localStorage.getItem(statusKey);
    const notes = localStorage.getItem(notesKey);
    const verification = localStorage.getItem(verificationKey);
    const approval = localStorage.getItem(approvalKey);
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
      status: status || 'SEDANG PROSES',
      budget: Number(budget) || 10000, // Load from actual data or use default
      notes: notes || ''
    };
    
    // Load previous approvals
    previousApprovals.value = [];
    if (verification) {
      try {
        const verificationData = JSON.parse(verification);
        previousApprovals.value.push({
          id: 'verification',
          ...verificationData
        });
      } catch (e) {
        // Skip invalid verification data
      }
    }
    if (approval) {
      try {
        const approvalData = JSON.parse(approval);
        previousApprovals.value.push({
          id: 'approval',
          ...approvalData
        });
      } catch (e) {
        // Skip invalid approval data
      }
    }
    
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
  const mockStatus = 'SEDANG PROSES';
  
  batchData.value = {
    id: 'ET-2024-003',
    rujukan: 'ET-2024-003',
    year: mockYear,
    type: mockType,
    typeLabel: typeOptions[mockType] || mockType,
    status: mockStatus,
    budget: 10000,
    notes: 'Elaun tahunan untuk KPAK tahun 2024. Jumlah elaun melebihi bajet dan telah disahkan oleh Ketua Jabatan.'
  };
  
  // Generate mock recipients data
  recipients.value = [
    {
      paId: 'PA2024012',
      name: 'Ahmad bin Abdullah',
      ic: '800101011234',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 800.00
    },
    {
      paId: 'PA2024013',
      name: 'Mohd Zain bin Ismail',
      ic: '750315085678',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 800.00
    },
    {
      paId: 'PA2024014',
      name: 'Abdul Rahman bin Hassan',
      ic: '820520149012',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 800.00
    },
    {
      paId: 'PA2024015',
      name: 'Mohd Faiz bin Omar',
      ic: '780812063456',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 800.00
    },
    {
      paId: 'PA2024016',
      name: 'Zulkifli bin Ahmad',
      ic: '790325127890',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 800.00
    },
    {
      paId: 'PA2024017',
      name: 'Ahmad Fadzil bin Ibrahim',
      ic: '810415032345',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 800.00
    },
    {
      paId: 'PA2024018',
      name: 'Mohd Hafiz bin Zainal',
      ic: '760628096789',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 800.00
    }
  ];
  
  // Mock previous approvals
  previousApprovals.value = [
    {
      id: 'verification',
      status: 'verified',
      verifiedBy: 'Ketua Jabatan',
      verifiedAt: '2024-01-20T10:00:00Z',
      comments: 'Elaun melebihi bajet adalah wajar kerana bilangan penerima yang tinggi dan elaun yang diperlukan untuk aktiviti tahunan.',
      decision: 'verify',
      date: '2024-01-20'
    }
  ];
}

// Final approval functions
async function approveAllowance() {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  try {
    await wait(600);
    
    // Update localStorage with enhanced error handling
    const year = batchData.value.year;
    const type = batchData.value.type;
    const statusKey = `et:status:${year}:${type}`;
    const finalApprovalKey = `et:finalApproval:${year}:${type}`;
    
    try {
      localStorage.setItem(statusKey, 'LULUS');
      localStorage.setItem(finalApprovalKey, JSON.stringify({
        ...finalApprovalData.value,
        approvedBy: 'Ketua Divisyen',
        approvedAt: new Date().toISOString(),
        status: 'approved'
      }));
      
      toast.success('Elaun berjaya diluluskan secara muktamad. Status telah dikemas kini.');
      goBack();
    } catch (storageError) {
      toast.error('Gagal menyimpan data kelulusan akhir. Sila cuba lagi atau hubungi pentadbir sistem.');
    }
  } catch (error) {
    toast.error('Proses kelulusan akhir gagal. Sila cuba lagi.');
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
    const finalRejectionKey = `et:finalRejection:${year}:${type}`;
    
    try {
      localStorage.setItem(statusKey, 'DITOLAK');
      localStorage.setItem(finalRejectionKey, JSON.stringify({
        ...finalApprovalData.value,
        rejectedBy: 'Ketua Divisyen',
        rejectedAt: new Date().toISOString(),
        status: 'rejected'
      }));
      
      toast.success('Elaun telah ditolak secara muktamad. Status telah dikemas kini.');
      goBack();
    } catch (storageError) {
      toast.error('Gagal menyimpan data penolakan akhir. Sila cuba lagi atau hubungi pentadbir sistem.');
    }
  } catch (error) {
    toast.error('Proses penolakan akhir gagal. Sila cuba lagi.');
  } finally {
    submitting.value = false;
  }
}

// Utility functions
function wait(ms) { 
  return new Promise(res => setTimeout(res, ms)); 
}

// Load data on mount
onMounted(() => {
  loadBatchData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 