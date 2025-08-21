<!-- 
  RTMF SCREEN: PA-PE-ET-04
  PURPOSE: Kemaskini Maklumat Elaun Tahunan — Kemaskini
  DESCRIPTION: Kemaskini maklumat elaun tahunan untuk pengguna Eksekutif sahaja
  ROUTE: /BF-PA/PE/ET/04
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Kad Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-edit" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Kemaskini Maklumat Elaun Tahunan</h2>
          </div>
          <div class="text-xs text-gray-500">
            Rujukan: <b>{{ allowanceData.rujukan || '—' }}</b>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Borang Maklumat Asas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tahun Elaun <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="allowanceData.year"
              type="select"
              :options="yearOptions"
              placeholder="Pilih tahun…"
              :classes="{
                input: '!py-2',
              }"
              :disabled="true"
            />
            <p class="text-xs text-gray-500 mt-1">Tahun tidak boleh diubah selepas dibuat.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jenis Elaun <span class="text-red-500">*</span>
            </label>
            <FormKit
              v-model="allowanceData.type"
              type="select"
              :options="typeOptions"
              placeholder="Pilih jenis elaun…"
              :classes="{
                input: '!py-2',
              }"
              :disabled="true"
            />
            <p class="text-xs text-gray-500 mt-1">Jenis elaun tidak boleh diubah selepas dibuat.</p>
          </div>
        </div>

        <!-- Bahagian Nota -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nota
          </label>
          <FormKit
            v-model="allowanceData.notes"
            type="textarea"
            rows="3"
            placeholder="Masukkan nota atau ulasan untuk elaun ini..."
            :classes="{
              input: '!py-2',
            }"
          />
          <p class="text-xs text-gray-500 mt-1">Nota pilihan untuk rujukan dan audit.</p>
        </div>

        <!-- Pengurusan Penerima -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900">Senarai Penerima</h3>
            <div class="text-xs text-gray-500">
              Jumlah: <b>{{ recipients.length }}</b> penerima
            </div>
          </div>

          <!-- Tambah Penerima Baharu -->
          <div class="bg-gray-50 p-4 rounded-lg border mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Tambah Penerima Baharu</h4>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
              <FormKit
                v-model="newRecipient.name"
                type="text"
                placeholder="Nama"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="newRecipient.ic"
                type="text"
                placeholder="ID Pengenalan"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="newRecipient.category"
                type="select"
                :options="categoryOptions"
                placeholder="Kategori"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="newRecipient.parish"
                type="text"
                placeholder="Kariah/Daerah"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model.number="newRecipient.allowance"
                type="number"
                min="0"
                step="0.01"
                placeholder="Elaun (RM)"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex justify-end mt-3">
              <rs-button
                variant="primary"
                size="sm"
                :disabled="!canAddRecipient"
                @click="addRecipient"
              >
                <Icon name="ic:outline-plus" class="w-4 h-4 mr-2" />
                Tambah Penerima
              </rs-button>
            </div>
          </div>

          <!-- Jadual Penerima -->
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kariah/Daerah</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Elaun (RM)</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(recipient, index) in recipients" :key="recipient.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.name"
                      type="text"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.ic"
                      type="text"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.category"
                      type="select"
                      :options="categoryOptions"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="recipient.parish"
                      type="text"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-model.number="recipient.allowance"
                      type="number"
                      min="0"
                      step="0.01"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <rs-button
                      variant="danger"
                      size="sm"
                      @click="removeRecipient(index)"
                      class="!px-2 !py-1"
                    >
                      <Icon name="ic:outline-trash" class="w-4 h-4" />
                    </rs-button>
                  </td>
                </tr>
                <tr v-if="!recipients.length" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="6">
                    Tiada penerima dalam senarai ini. Tambah penerima baharu.
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-3 text-right font-medium" colspan="4">Jumlah (RM)</td>
                  <td class="px-4 py-3 font-semibold">{{ formatCurrency(totalAllowance) }}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Amaran Bajet -->
        <div v-if="totalAllowance > allowanceData.budget" class="mb-6">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <Icon name="ic:outline-warning" class="text-red-400 mr-3" size="20" />
              <div>
                <h4 class="text-sm font-medium text-red-800">Amaran Bajet</h4>
                <p class="text-sm text-red-700 mt-1">
                  Jumlah elaun (RM {{ formatCurrency(totalAllowance) }}) melebihi bajet (RM {{ formatCurrency(allowanceData.budget) }}).
                  Lebihan: RM {{ formatCurrency(excessAmount) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tindakan -->
        <div class="flex items-center justify-end gap-2">
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="goBack"
          >
            Batal
          </rs-button>
          <rs-button
            variant="secondary"
            size="sm"
            :disabled="saving"
            @click="saveDraft"
          >
            <Icon name="ic:outline-save" class="w-4 h-4 mr-2" />
            Simpan Draf
          </rs-button>
          <rs-button
            variant="success"
            size="sm"
            :disabled="!canSubmit || saving"
            @click="submitForApproval"
          >
            <Icon name="ic:outline-send" class="w-4 h-4 mr-2" />
            Hantar untuk Kelulusan
          </rs-button>
        </div>
      </template>
    </rs-card>
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
  title: "Kemaskini Maklumat Elaun Tahunan",
  description: "Edit allowance details for Eksekutif users only",
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

// Form data
const allowanceData = ref({
  id: '',
  rujukan: '',
  year: '',
  type: '',
  typeLabel: '',
  status: '',
  count: 0,
  totalAmount: 0,
  budget: 10000,
  notes: ''
});

// Recipients data
const recipients = ref([]);

// New recipient form
const newRecipient = ref({
  name: '',
  ic: '',
  category: '',
  parish: '',
  allowance: 0
});

// State
const saving = ref(false);

// Options
const currentYear = new Date().getFullYear();
const yearOptions = [
  { label: String(currentYear - 1), value: currentYear - 1 },
  { label: String(currentYear), value: currentYear }
];

const typeOptions = [
  { label: 'Elaun Tahunan KPAK', value: 'ET-KPAK' },
  { label: 'Elaun Tahunan KPAF', value: 'ET-KPAF' },
  { label: 'Anugerah Penolong Amil', value: 'ET-ANUG' },
  { label: 'Ketua Penolong Amil Kariah (KPAK) terbaik', value: 'ANUG-KPAK' },
  { label: 'Penolong Amil Kariah (PAK) terbaik', value: 'ANUG-PAK' },
  { label: 'Ketua Penolong Amil Fitrah (KPAF) terbaik', value: 'ANUG-KPAF' },
  { label: 'Penolong Amil Fitrah (PAF) terbaik', value: 'ANUG-PAF' },
  { label: 'Penolong Amil Padi (PAP) terbaik', value: 'ANUG-PAP' },
  { label: 'Penolong Amil Komuniti (PAK+) terbaik', value: 'ANUG-PAKPLUS' }
];

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
  return Math.max(0, totalAllowance.value - allowanceData.value.budget);
});

const canAddRecipient = computed(() => {
  return newRecipient.value.name && 
         newRecipient.value.ic && 
         newRecipient.value.category && 
         newRecipient.value.parish && 
         newRecipient.value.allowance > 0;
});

const canSubmit = computed(() => {
  return recipients.value.length > 0 && 
         recipients.value.every(r => 
           r.name && r.ic && r.category && r.parish && 
           isFinite(r.allowance) && Number(r.allowance) >= 0
         );
});

// Helper functions
function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getTypeLabel(type) {
  const option = typeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
}

// Load allowance data
function loadAllowanceData() {
  const id = route.query.id;
  if (!id) {
    toast.error('ID elaun tidak ditemui');
    goBack();
    return;
  }

  // Load from localStorage or use sample data
  const year = route.query.year;
  const type = route.query.type;
  
  if (year && type) {
    // Load from localStorage
    const recipientsKey = `et:recipients:${year}:${type}`;
    const countKey = `et:count:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    
    try {
      const recipientsData = localStorage.getItem(recipientsKey);
      const count = localStorage.getItem(countKey);
      const status = localStorage.getItem(statusKey);
      
      if (recipientsData) {
        recipients.value = JSON.parse(recipientsData);
      }
      
      // Update allowance data
      allowanceData.value = {
        ...allowanceData.value,
        id: id,
        rujukan: id,
        year: Number(year),
        type: type,
        typeLabel: getTypeLabel(type),
        status: status || 'DRAF',
        count: Number(count) || 0,
        totalAmount: totalAllowance.value,
        budget: 10000, // Default budget
        notes: ''
      };
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuatkan data elaun');
    }
  } else {
    // Use sample data for demonstration
    allowanceData.value = {
      id: id,
      rujukan: id,
      year: 2024,
      type: 'ET-KPAK',
      typeLabel: 'Elaun Tahunan KPAK',
      status: 'DRAF',
      count: 25,
      totalAmount: 12500.00,
      budget: 10000.00,
      notes: 'Elaun untuk KPAK tahun 2024'
    };
    
    // Sample recipients
    recipients.value = [
      {
        paId: 'PA001',
        name: 'Ahmad bin Abdullah',
        ic: '800101145678',
        category: 'KPAK',
        parish: 'Kariah A',
        allowance: 500.00
      },
      {
        paId: 'PA002',
        name: 'Siti binti Mohamed',
        ic: '820315123456',
        category: 'KPAK',
        parish: 'Kariah B',
        allowance: 500.00
      }
    ];
  }
}

// Recipient management functions
function addRecipient() {
  if (!canAddRecipient.value) return;
  
  const recipient = {
    paId: `PA${Date.now()}`,
    ...newRecipient.value
  };
  
  recipients.value.push(recipient);
  
  // Reset form
  newRecipient.value = {
    name: '',
    ic: '',
    category: '',
    parish: '',
    allowance: 0
  };
  
  toast.success('Penerima berjaya ditambah');
}

function removeRecipient(index) {
  recipients.value.splice(index, 1);
  toast.success('Penerima berjaya dibuang');
}

// Save functions
async function saveDraft() {
  saving.value = true;
  try {
    await wait(400);
    
    // Update localStorage
    const year = allowanceData.value.year;
    const type = allowanceData.value.type;
    const count = recipients.value.length;
    
    const recipientsKey = `et:recipients:${year}:${type}`;
    const countKey = `et:count:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    
    localStorage.setItem(recipientsKey, JSON.stringify(recipients.value));
    localStorage.setItem(countKey, String(count));
    localStorage.setItem(statusKey, 'DRAF');
    
    toast.success('Draf berjaya disimpan');
    goBack();
  } finally {
    saving.value = false;
  }
}

async function submitForApproval() {
  if (!canSubmit.value) return;
  
  saving.value = true;
  try {
    await wait(600);
    
    // Update localStorage
    const year = allowanceData.value.year;
    const type = allowanceData.value.type;
    const count = recipients.value.length;
    
    const recipientsKey = `et:recipients:${year}:${type}`;
    const countKey = `et:count:${year}:${type}`;
    const statusKey = `et:status:${year}:${type}`;
    
    localStorage.setItem(recipientsKey, JSON.stringify(recipients.value));
    localStorage.setItem(countKey, String(count));
    localStorage.setItem(statusKey, 'SEDANG PROSES');
    
    toast.success('Permohonan berjaya dihantar untuk kelulusan');
    goBack();
  } finally {
    saving.value = false;
  }
}

// Utility functions
function wait(ms) { 
  return new Promise(res => setTimeout(res, ms)); 
}

// Load data on mount
onMounted(() => {
  loadAllowanceData();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 