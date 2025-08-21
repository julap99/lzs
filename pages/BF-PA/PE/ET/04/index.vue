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
  const id = route.query.id;
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
    
    const recipientsData = localStorage.getItem(recipientsKey);
    const status = localStorage.getItem(statusKey);
    
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
      budget: 10000, // Default budget
      notes: ''
    };
    
    // Check if editing is allowed
    if (!['DRAF', 'SEDANG PROSES'].includes(batchData.value.status)) {
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
    console.error('Error loading data:', error);
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

// Recipient management
function addNewRecipient() {
  if (!canAddRecipient.value) {
    toast.error('Maksimum 10 penerima telah ditetapkan.');
    return;
  }
  
  recipients.value.push({
    paId: `PA${Date.now()}`,
    name: '',
    ic: '',
    category: '',
    parish: '',
    allowance: 0
  });
  
  toast.success('Penerima berjaya ditambah');
}

function removeRecipient(index) {
  const recipient = recipients.value[index];
  recipients.value.splice(index, 1);
  toast.success(`${recipient.name} telah dibuang dari senarai`);
}

// Save functions
async function saveDraft() {
  if (!hasChanges.value) {
    toast.info('Tiada perubahan untuk disimpan');
    return;
  }
  
  saving.value = true;
  try {
    await wait(400);
    
    // Update localStorage
    const year = batchData.value.year;
    const type = batchData.value.type;
    const count = recipients.value.length;
    
    const recipientsKey = `et:recipients:${year}:${type}`;
    const countKey = `et:count:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    
    localStorage.setItem(recipientsKey, JSON.stringify(recipients.value));
    localStorage.setItem(countKey, String(count));
    localStorage.setItem(statusKey, 'DRAF');
    
    // Update original data for change detection
    originalData.value = {
      batchData: JSON.parse(JSON.stringify(batchData.value)),
      recipients: JSON.parse(JSON.stringify(recipients.value))
    };
    
    toast.success('Draf berjaya disimpan. Anda boleh terus mengedit atau hantar untuk kelulusan.');
  } catch (error) {
    toast.error('Gagal menyimpan draf. Sila cuba lagi.');
  } finally {
    saving.value = false;
  }
}

async function submitForApproval() {
  // Validate required fields
  if (!canSubmit.value) {
    toast.error('Sila pastikan semua maklumat lengkap sebelum hantar untuk kelulusan');
    return;
  }
  
  // Check if there are unsaved changes
  if (hasChanges.value) {
    toast.warning('Sila simpan draf terlebih dahulu sebelum hantar untuk kelulusan');
    return;
  }
  
  saving.value = true;
  try {
    await wait(600);
    
    // Update localStorage with final data
    const year = batchData.value.year;
    const type = batchData.value.type;
    const count = recipients.value.length;
    
    const recipientsKey = `et:recipients:${year}:${type}`;
    const countKey = `et:count:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    
    localStorage.setItem(recipientsKey, JSON.stringify(recipients.value));
    localStorage.setItem(countKey, String(count));
    localStorage.setItem(statusKey, 'MENUNGGU KELULUSAN');
    
    // Show appropriate message based on budget
    if (excessAmount.value > 0) {
      toast.success('Permohonan berjaya dihantar! Status: MENUNGGU KELULUSAN. Permohonan ini memerlukan pengesahan kerana melebihi bajet.');
    } else {
      toast.success('Permohonan berjaya dihantar! Status: MENUNGGU KELULUSAN. Permohonan ini akan diproses untuk kelulusan.');
    }
    
    // Navigate back to main ET dashboard
    await navigateTo('/BF-PA/PE/ET');
  } catch (error) {
    toast.error('Gagal menghantar permohonan. Sila cuba lagi.');
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