<!-- 
  RTMF SCREEN: PA-PE-ET-04
  PURPOSE: Kemaskini Maklumat Elaun Tahunan — Eksekutif Sahaja
  DESCRIPTION: Kemaskini maklumat elaun tahunan yang telah dihantar (hanya untuk Eksekutif, sebelum kelulusan)
  ROUTE: /BF-PA/PE/ET/04
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ic:outline-edit" class="w-6 h-6 mr-3 text-blue-600" />
            Kemaskini Maklumat Elaun Tahunan
          </h1>
          <p class="text-gray-600 mt-1">
            Rujukan: <span class="font-medium">{{ batchData.rujukan || '—' }}</span> · 
            Status: <rs-badge :variant="getStatusVariant(batchData.status)" size="sm">{{ batchData.status }}</rs-badge>
          </p>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Elaun</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                {{ batchData.year || '—' }}
              </div>
              <p class="text-xs text-gray-500 mt-1">Tidak boleh diubah selepas dibuat</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Elaun</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ batchData.typeLabel || '—' }}
              </div>
              <p class="text-xs text-gray-500 mt-1">Tidak boleh diubah selepas dibuat</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bilangan Penerima</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                {{ recipients.length }}
              </div>
              <p class="text-xs text-gray-500 mt-1">Dikemas kini secara automatik</p>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Bajet (RM)</label>
              <FormKit
                v-model.number="batchData.budget"
                type="number"
                min="0"
                step="100"
                :classes="{
                  input: '!py-2 !px-3 !text-lg !font-semibold !text-gray-900 !bg-white !border-gray-300 !rounded-md',
                }"
              />
              <p class="text-xs text-blue-600 mt-1">Boleh dikemas kini</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Elaun (RM)</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold text-lg">
                {{ formatCurrency(totalAllowance) }}
              </div>
              <p class="text-xs text-gray-600 mt-1">Dikira secara automatik</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ excessAmount > 0 ? 'Lebihan (RM)' : 'Baki (RM)' }}
              </label>
              <div class="px-3 py-2 border rounded-md font-semibold text-lg" 
                   :class="excessAmount > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-gray-50 border-gray-200 text-gray-900'">
                {{ formatCurrency(Math.abs(balanceAmount)) }}
              </div>
              <p class="text-xs mt-1" :class="excessAmount > 0 ? 'text-red-600' : 'text-gray-600'">
                {{ excessAmount > 0 ? 'Perlu pengesahan' : 'Dalam had bajet' }}
              </p>
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
                  Permohonan ini akan memerlukan pengesahan dari Ketua Jabatan sebelum diluluskan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Notes Card -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Ulasan Eksekutif</h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Ulasan semasa:</p>
            <div class="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p class="text-gray-900">{{ batchData.notes || 'Tiada ulasan' }}</p>
            </div>
          </div>
          <rs-button
            variant="primary"
            @click="openNotesModal"
            class="flex items-center"
          >
            <Icon name="ic:outline-edit" class="w-4 h-4 mr-2" />
            {{ batchData.notes ? 'Kemaskini Ulasan' : 'Tambah Ulasan' }}
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Recipients Management Card -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Pengurusan Penerima</h3>
          <div class="text-sm text-gray-500">
            Jumlah: <span class="font-medium">{{ recipients.length }}</span> penerima
          </div>
        </div>
      </template>
      <template #body>
        <div class="p-6">
          <!-- Recipients Table -->
          <div class="overflow-x-auto rounded-lg border mb-6">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Bil.</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kariah/Daerah</th>
                  <th class="px-4 py-3 font-medium text-gray-900 text-right">Elaun (RM)</th>
                  <th class="px-4 py-3 font-medium text-gray-900 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(recipient, index) in recipients" :key="recipient.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.name"
                      type="text"
                      :classes="{ input: '!py-1 !px-2 !text-sm' }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.ic"
                      type="text"
                      :classes="{ input: '!py-1 !px-2 !text-sm' }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.category"
                      type="select"
                      :options="categoryOptions"
                      :classes="{ input: '!py-1 !px-2 !text-sm' }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.parish"
                      type="text"
                      :classes="{ input: '!py-1 !px-2 !text-sm' }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model.number="recipient.allowance"
                      type="number"
                      min="0"
                      step="0.01"
                      :classes="{ input: '!py-1 !px-2 !text-sm !text-right' }"
                    />
                  </td>
                  <td class="px-4 py-3 text-center">
                    <rs-button
                      variant="danger"
                      size="sm"
                      @click="removeRecipient(index)"
                      class="!px-2 !py-1"
                    >
                      <Icon name="ic:outline-delete" class="w-4 h-4" />
                    </rs-button>
                  </td>
                </tr>
                <tr v-if="!recipients.length">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                    Tiada penerima dalam senarai. Tambah penerima baharu.
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-3 text-right font-medium" colspan="5">Jumlah Keseluruhan (RM)</td>
                  <td class="px-4 py-3 text-right font-bold text-lg">{{ formatCurrency(totalAllowance) }}</td>
                  <td class="px-4 py-3 text-center">
                    <rs-button 
                      variant="success" 
                      size="sm" 
                      @click="addNewRecipient"
                      class="flex items-center"
                      title="Tambah Penerima Baharu"
                    >
                      <Icon name="ic:outline-plus" class="w-4 h-4" />
                    </rs-button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">
        <Icon name="ic:outline-info" class="inline mr-1" />
        Kemaskini hanya dibenarkan sebelum kelulusan
      </div>
      
      <div class="flex gap-3">
        <rs-button
          variant="secondary-outline"
          @click="goBack"
          class="flex items-center"
        >
          <Icon name="ic:outline-close" class="w-4 h-4 mr-2" />
          Batal
        </rs-button>
        <rs-button
          variant="secondary"
          :disabled="saving || !hasChanges"
          @click="saveDraft"
          class="flex items-center"
        >
          <Icon name="ic:outline-save" class="w-4 h-4 mr-2" />
          {{ saving ? 'Menyimpan...' : 'Simpan Draf' }}
        </rs-button>
        <rs-button
          variant="success"
          :disabled="!canSubmit || saving || hasChanges"
          @click="submitForApproval"
          class="flex items-center"
        >
          <Icon name="ic:outline-send" class="w-4 h-4 mr-2" />
          {{ saving ? 'Menghantar...' : 'Hantar untuk Kelulusan' }}
        </rs-button>
      </div>
    </div>

    <!-- Validation Summary -->
    <rs-card v-if="showValidationSummary" class="mb-6" variant="danger">
      <template #header>
        <h3 class="text-lg font-semibold text-red-900">Ralat Validasi</h3>
      </template>
      <template #body>
        <div class="p-4">
          <div class="space-y-2">
            <div v-if="validationErrors.budget" class="flex items-start">
              <Icon name="ic:outline-error" class="text-red-500 mr-2 mt-0.5 flex-shrink-0" size="16" />
              <div>
                <span class="font-medium text-red-900">Bajet:</span>
                <span class="text-red-700 ml-2">{{ validationErrors.budget }}</span>
              </div>
            </div>
            
            <div v-if="validationErrors.notes" class="flex items-start">
              <Icon name="ic:outline-error" class="text-red-500 mr-2 mt-0.5 flex-shrink-0" size="16" />
              <div>
                <span class="font-medium text-red-900">Ulasan:</span>
                <span class="text-red-700 ml-2">{{ validationErrors.notes }}</span>
              </div>
            </div>
            
            <div v-for="(error, key) in validationErrors" :key="key" 
                 v-if="key.startsWith('recipient_')" class="flex items-start">
              <Icon name="ic:outline-error" class="text-red-500 mr-2 mt-0.5 flex-shrink-0" size="16" />
              <div>
                <span class="font-medium text-red-900">Penerima {{ parseInt(key.split('_')[1]) + 1 }}:</span>
                <span class="text-red-700 ml-2">{{ error }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <rs-button variant="secondary-outline" @click="showValidationSummary = false">
              Tutup
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Notes Modal -->
    <div v-if="showNotesModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-blue-100">
                <Icon name="ic:outline-edit" class="h-6 w-6 text-blue-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ batchData.notes ? 'Kemaskini Ulasan' : 'Tambah Ulasan' }}
                </h3>
                <div class="mt-4">
                  <p class="text-sm text-gray-500 mb-4">
                    Masukkan ulasan atau catatan mengenai elaun tahunan ini. Ulasan ini akan dilihat oleh Ketua Jabatan dan Ketua Divisyen semasa proses kelulusan.
                  </p>
                  
                  <FormKit
                    v-model="tempNotes"
                    type="textarea"
                    rows="4"
                    placeholder="Masukkan ulasan anda di sini..."
                    :classes="{
                      input: '!py-2 !px-3 !border-gray-300 !rounded-md !focus:ring-2 !focus:ring-blue-500 !focus:border-blue-500',
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <rs-button
              variant="primary"
              class="w-full sm:w-auto sm:ml-3"
              @click="confirmNotes"
              :loading="saving"
            >
              <Icon name="ic:outline-check" class="w-4 h-4 mr-2" />
              Simpan Ulasan
            </rs-button>
            <rs-button
              variant="secondary-outline"
              class="mt-3 w-full sm:mt-0 sm:w-auto"
              @click="closeNotesModal"
              :disabled="saving"
            >
              Batal
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

definePageMeta({
  title: "Kemaskini Maklumat Elaun Tahunan",
  description: "Edit allowance details for Eksekutif users before approval",
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
    name: "Kemaskini Maklumat",
    type: "current",
    path: "/BF-PA/PE/ET/04",
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
const originalData = ref({});

// State
const saving = ref(false);
const submitting = ref(false); // Added for submitForApproval

// Notes modal state
const showNotesModal = ref(false);
const tempNotes = ref('');

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

// Category options
const categoryOptions = [
  { label: 'PAK', value: 'PAK' },
  { label: 'KPAK', value: 'KPAK' },
  { label: 'PAF', value: 'PAF' },
  { label: 'KPAF', value: 'KPAF' },
  { label: 'PAP', value: 'PAP' },
  { label: 'PAK+', value: 'PAK+' }
];

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

const canAddRecipient = computed(() => {
  return recipients.value.length < 10; // Allow up to 10 recipients
});

const canSubmit = computed(() => {
  return recipients.value.length > 0 && 
         recipients.value.every(r => 
           r.name && r.ic && r.category && r.parish && 
           isFinite(r.allowance) && Number(r.allowance) >= 0
         );
});

const hasChanges = computed(() => {
  return JSON.stringify(batchData.value) !== JSON.stringify(originalData.value.batchData) ||
         JSON.stringify(recipients.value) !== JSON.stringify(originalData.value.recipients);
});

// Enhanced validation and keyboard shortcuts
const validationErrors = ref({});
const showValidationSummary = ref(false);

// Advanced validation functions
function validateBudget(budget) {
  if (!budget || budget <= 0) {
    return { valid: false, message: 'Bajet mestilah lebih daripada RM 0' };
  }
  if (budget > 1000000) {
    return { valid: false, message: 'Bajet tidak boleh melebihi RM 1,000,000' };
  }
  return { valid: true };
}

function validateRecipientData(recipient) {
  const errors = [];
  
  if (!recipient.name || recipient.name.trim().length < 2) {
    errors.push('Nama penerima mestilah sekurang-kurangnya 2 aksara');
  }
  
  if (!recipient.ic || !/^\d{12}$/.test(recipient.ic)) {
    errors.push('Nombor IC mestilah 12 digit');
  }
  
  if (!recipient.category) {
    errors.push('Kategori penerima diperlukan');
  }
  
  if (!recipient.parish) {
    errors.push('Kariah/daerah diperlukan');
  }
  
  if (recipient.allowance < 0) {
    errors.push('Elaun tidak boleh negatif');
  }
  
  if (recipient.allowance > 10000) {
    errors.push('Elaun tidak boleh melebihi RM 10,000 setiap penerima');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    message: errors.join('; ')
  };
}

// Comprehensive validation before save/submit
function validateAllData() {
  validationErrors.value = {};
  let hasErrors = false;
  
  // Validate budget
  const budgetValidation = validateBudget(batchData.value.budget);
  if (!budgetValidation.valid) {
    validationErrors.value.budget = budgetValidation.message;
    hasErrors = true;
  }
  
  // Validate all recipients
  recipients.value.forEach((recipient, index) => {
    const recipientValidation = validateRecipientData(recipient);
    if (!recipientValidation.valid) {
      validationErrors.value[`recipient_${index}`] = recipientValidation.message;
      hasErrors = true;
    }
  });
  
  // Validate batch notes
  if (!batchData.value.notes || batchData.value.notes.trim().length < 10) {
    validationErrors.value.notes = 'Ulasan mestilah sekurang-kurangnya 10 aksara';
    hasErrors = true;
  }
  
  if (hasErrors) {
    showValidationSummary.value = true;
    toast.error('Sila betulkan ralat validasi sebelum menyimpan');
    return false;
  }
  
  return true;
}

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
      status: status || 'DRAF',
      budget: Number(budget) || 10000,
      notes: notes || ''
    };
    
    // Check if editing is allowed
    if (status === 'LULUS' || status === 'DITOLAK') {
      toast.error('Kemaskini tidak dibenarkan selepas kelulusan');
      goBack();
      return;
    }
    
    // Store original data for change detection
    originalData.value = {
      batchData: JSON.parse(JSON.stringify(batchData.value)),
      recipients: JSON.parse(JSON.stringify(recipients.value))
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
  const mockType = 'ET-KPAK';
  const mockStatus = 'DRAF';
  
  batchData.value = {
    id: 'ET-2024-001',
    rujukan: 'ET-2024-001',
    year: mockYear,
    type: mockType,
    typeLabel: typeOptions[mockType] || mockType,
    status: mockStatus,
    budget: 15000,
    notes: 'Elaun tahunan untuk KPAK tahun 2024. Permohonan ini sedang dalam draf dan boleh dikemas kini.'
  };
  
  // Generate mock recipients data
  recipients.value = [
    {
      paId: 'PA2024001',
      name: 'Ahmad bin Abdullah',
      ic: '800101-01-1234',
      category: 'KPAK',
      parish: 'Kariah Masjid Sultan Salahuddin Abdul Aziz Shah',
      allowance: 500.00
    },
    {
      paId: 'PA2024002',
      name: 'Mohd Zain bin Ismail',
      ic: '750315-08-5678',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Amin',
      allowance: 500.00
    },
    {
      paId: 'PA2024003',
      name: 'Abdul Rahman bin Hassan',
      ic: '820520-14-9012',
      category: 'KPAK',
      parish: 'Kariah Masjid Al-Hidayah',
      allowance: 500.00
    }
  ];
  
  // Store original data for change detection
  originalData.value = {
    batchData: JSON.parse(JSON.stringify(batchData.value)),
    recipients: JSON.parse(JSON.stringify(recipients.value))
  };
  

}

// Enhanced recipient management
function addNewRecipient() {
  if (recipients.value.length >= 50) {
    toast.error('Maksimum 50 penerima dibenarkan setiap batch');
    return;
  }
  
  const newRecipient = {
    paId: `PA-${Date.now()}`,
    name: '',
    ic: '',
    category: '',
    parish: '',
    allowance: 0,
    _isNew: true,
    _isEditing: true
  };
  
  recipients.value.push(newRecipient);
  
  // Scroll to the new recipient
  nextTick(() => {
    const lastRow = document.querySelector('tbody tr:last-child');
    if (lastRow) {
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function removeRecipient(index) {
  const recipient = recipients.value[index];
  
  if (recipient._isNew) {
    recipients.value.splice(index, 1);
    toast.success('Penerima baharu telah dibuang');
  } else {
    if (confirm(`Adakah anda pasti mahu membuang ${recipient.name} dari senarai?`)) {
      recipients.value.splice(index, 1);
      toast.success('Penerima telah dibuang dari senarai');
      hasChanges.value = true;
    }
  }
}

// Enhanced save functions with validation
async function saveDraft() {
  if (!validateAllData()) return;
  
  saving.value = true;
  try {
    await wait(600);
    
    // Save to localStorage
    const year = batchData.value.year;
    const type = batchData.value.type;
    const recipientsKey = `et:recipients:${year}:${type}`;
    const notesKey = `et:notes:${year}:${type}`;
    const budgetKey = `et:budget:${year}:${type}`;
    
    localStorage.setItem(recipientsKey, JSON.stringify(recipients.value));
    localStorage.setItem(notesKey, batchData.value.notes);
    localStorage.setItem(budgetKey, String(batchData.value.budget));
    
    toast.success('Draf berjaya disimpan');
    hasChanges.value = false;
  } catch (error) {
    toast.error('Gagal menyimpan draf. Sila cuba lagi.');
  } finally {
    saving.value = false;
  }
}

async function submitForApproval() {
  if (!validateAllData()) return;
  
  if (hasChanges.value) {
    toast.warning('Sila simpan perubahan terlebih dahulu sebelum menghantar untuk kelulusan');
    return;
  }
  
  submitting.value = true;
  try {
    await wait(800);
    
    // Update status and save
    const year = batchData.value.year;
    const type = batchData.value.type;
    const statusKey = `et:status:${year}:${type}`;
    
    localStorage.setItem(statusKey, 'MENUNGGU KELULUSAN');
    
    toast.success('Permohonan berjaya dihantar untuk kelulusan');
    
    // Navigate back to main dashboard
    router.push('/BF-PA/PE/ET');
  } catch (error) {
    toast.error('Gagal menghantar permohonan. Sila cuba lagi.');
  } finally {
    submitting.value = false;
  }
}

// Notes modal functions
function openNotesModal() {
  tempNotes.value = batchData.value.notes || '';
  showNotesModal.value = true;
}

function closeNotesModal() {
  showNotesModal.value = false;
  tempNotes.value = '';
}

async function confirmNotes() {
  if (!tempNotes.value.trim()) {
    toast.warning('Sila masukkan ulasan');
    return;
  }
  
  saving.value = true;
  try {
    batchData.value.notes = tempNotes.value.trim();
    
    // Save to localStorage
    const year = batchData.value.year;
    const type = batchData.value.type;
    const notesKey = `et:notes:${year}:${type}`;
    localStorage.setItem(notesKey, batchData.value.notes);
    
    toast.success('Ulasan berjaya disimpan');
    closeNotesModal();
  } catch (error) {
    toast.error('Gagal menyimpan ulasan. Sila cuba lagi.');
  } finally {
    saving.value = false;
  }
}

// Utility functions
function wait(ms) { 
  return new Promise(res => setTimeout(res, ms)); 
}

// Warn user before leaving if there are unsaved changes
watch(hasChanges, (newValue) => {
  if (newValue) {
    window.addEventListener('beforeunload', beforeUnloadHandler);
  } else {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
  }
});

function beforeUnloadHandler(event) {
  event.preventDefault();
  event.returnValue = 'Anda mempunyai perubahan yang belum disimpan. Adakah anda pasti untuk meninggalkan halaman ini?';
}

// Load data on mount
onMounted(() => {
  loadBatchData();
});


</script>

<style scoped>
/* Add any additional styles here */
</style> 