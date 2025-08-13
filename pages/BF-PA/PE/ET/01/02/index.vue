<!-- 
  RTMF SCREEN: PA-PE-ET-01_02
  PURPOSE: Paparan Pengiraan Elaun Tahunan
  DESCRIPTION: Display and calculation of annual allowance for Penolong Amil
  ROUTE: /BF-PA/PE/ET/01/02
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Icon name="ic:outline-calculate" class="mr-3 text-green-600" size="24" />
            <h2 class="text-xl font-semibold">
              Pengiraan Elaun Tahunan
            </h2>
          </div>
          <div class="flex items-center space-x-3">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="goBack"
            >
              <Icon name="ic:outline-arrow-back" class="mr-2" />
              Kembali
            </rs-button>
            <rs-button
              v-if="!isReadOnly"
              variant="success"
              size="sm"
              @click="confirmCalculation"
              :disabled="processing"
            >
              <Icon name="ic:outline-check-circle" class="mr-2" />
              Sahkan Pengiraan
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Info Banner -->
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start">
            <Icon name="ic:outline-info" class="text-green-600 mt-1 mr-3" />
            <div>
              <h4 class="font-semibold text-green-900 mb-2">Maklumat Pengiraan Elaun Tahunan</h4>
              <div class="text-sm text-green-800 space-y-1">
                <p>• Pengiraan elaun tahunan hanya boleh dibuat sekali setahun untuk setiap Penolong Amil</p>
                <p>• Kadar elaun berdasarkan kategori jawatan dan tahun perkhidmatan</p>
                <p>• Selepas disahkan, pengiraan tidak boleh diubah dan akan diproses untuk pembayaran</p>
                <p>• Tahun perkhidmatan: {{ currentYear }} - {{ nextYear }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Mode Indicator -->
        <div v-if="isBulkMode" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center">
            <Icon name="ic:outline-group" class="text-blue-600 mr-3" />
            <div>
              <h4 class="font-semibold text-blue-900">Mod Pengiraan Bulk</h4>
              <p class="text-sm text-blue-800">Pengiraan elaun untuk {{ selectedPenolongAmil.length }} Penolong Amil yang dipilih</p>
            </div>
          </div>
        </div>

        <!-- Single Penolong Amil Details -->
        <div v-if="!isBulkMode && selectedPenolongAmil.length === 1" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Penolong Amil</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">ID Penolong Amil</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ selectedPenolongAmil[0].id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPenolongAmil[0].nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jawatan/Kategori</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPenolongAmil[0].jawatan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Institusi</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPenolongAmil[0].institusi }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Lantikan</label>
                <rs-badge :variant="getStatusLantikanVariant(selectedPenolongAmil[0].statusLantikan)">
                  {{ selectedPenolongAmil[0].statusLantikan }}
                </rs-badge>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh Lantikan</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPenolongAmil[0].tarikhLantikan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh Tamat</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPenolongAmil[0].tarikhTamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tahun Perkhidmatan</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedPenolongAmil[0].tahunPerkhidmatan }} tahun</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bulk Penolong Amil List -->
        <div v-if="isBulkMode" class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Senarai Penolong Amil yang Dipilih</h3>
          <rs-table
            :data="selectedPenolongAmil"
            :columns="bulkColumns"
            :pageSize="5"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
          >
            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>
          </rs-table>
        </div>

        <!-- Calculation Form -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Pengiraan Elaun Tahunan</h3>
          
          <!-- Single Calculation -->
          <div v-if="!isBulkMode" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kadar Elaun Bulanan (RM)</label>
                <FormKit
                  v-model="calculationData.kadarElaun"
                  type="number"
                  :classes="{
                    input: '!py-2',
                  }"
                  :disabled="isReadOnly"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tahun Perkhidmatan</label>
                <FormKit
                  v-model="calculationData.tahunPerkhidmatan"
                  type="number"
                  :classes="{
                    input: '!py-2',
                  }"
                  :disabled="true"
                  min="1"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Elaun Tahunan (RM)</label>
                <div class="p-2 bg-gray-100 border border-gray-300 rounded-md">
                  <span class="text-lg font-semibold text-green-600">{{ calculatedAmount }}</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Formula Pengiraan:</h4>
              <p class="text-sm text-gray-700">
                Kadar Elaun Bulanan × 12 bulan = RM {{ calculationData.kadarElaun }} × 12 = RM {{ calculatedAmount }}
              </p>
            </div>
          </div>

          <!-- Bulk Calculation Summary -->
          <div v-if="isBulkMode" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-blue-50 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-blue-600">{{ selectedPenolongAmil.length }}</div>
                <p class="text-sm text-blue-700">Jumlah Penolong Amil</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-green-600">{{ totalCalculatedAmount }}</div>
                <p class="text-sm text-green-700">Jumlah Elaun (RM)</p>
              </div>
              <div class="bg-orange-50 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-orange-600">{{ averageAmount }}</div>
                <p class="text-sm text-orange-700">Purata Elaun (RM)</p>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg text-center">
                <div class="text-2xl font-bold text-purple-600">{{ currentYear }}</div>
                <p class="text-sm text-purple-700">Tahun Perkhidmatan</p>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900 mb-2">Ringkasan Pengiraan Bulk:</h4>
              <p class="text-sm text-gray-700">
                Pengiraan elaun tahunan akan dibuat untuk {{ selectedPenolongAmil.length }} Penolong Amil dengan jumlah keseluruhan RM {{ totalCalculatedAmount }}
              </p>
            </div>
          </div>
        </div>

        <!-- Confirmation Section -->
        <div v-if="!isReadOnly" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-start">
            <Icon name="ic:outline-warning" class="text-yellow-600 mt-1 mr-3" />
            <div>
              <h4 class="font-semibold text-yellow-900 mb-2">Pengesahan Pengiraan</h4>
              <div class="text-sm text-yellow-800 space-y-1">
                <p>• Pastikan semua maklumat adalah betul sebelum disahkan</p>
                <p>• Selepas disahkan, pengiraan tidak boleh diubah</p>
                <p>• Elaun akan diproses untuk pembayaran secara automatik</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <rs-button
            variant="secondary-outline"
            @click="goBack"
          >
            Batal
          </rs-button>
          <rs-button
            v-if="!isReadOnly"
            variant="success"
            @click="confirmCalculation"
            :disabled="processing"
          >
            <Icon name="ic:outline-check-circle" class="mr-2" />
            Sahkan Pengiraan
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

definePageMeta({
  title: "Pengiraan Elaun Tahunan",
  description: "Pengiraan elaun tahunan untuk Penolong Amil",
});

const toast = useToast();
const route = useRoute();
const router = useRouter();

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
    type: "link",
    path: "/BF-PA/PE/ET/01",
  },
  {
    name: "Pengiraan Elaun Tahunan",
    type: "current",
    path: "/BF-PA/PE/ET/01/02",
  },
]);

// State
const processing = ref(false);
const isReadOnly = ref(false);
const isBulkMode = ref(false);
const selectedPenolongAmil = ref([]);

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

// Calculation data
const calculationData = ref({
  kadarElaun: 0,
  tahunPerkhidmatan: 0,
});

// Mock data - replace with actual API calls
const mockPenolongAmil = [
  {
    id: 'PA001',
    nama: 'Ahmad bin Abdullah',
    jawatan: 'Penolong Amil Kanan',
    institusi: 'Masjid Al-Hidayah',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Belum Dikira',
    tahunPerkhidmatan: 5,
    kadarElaun: 1200.00,
    elaunTahunan: 6000.00,
    tarikhLantikan: '15/01/2020',
    tarikhTamat: '14/01/2025',
  },
  {
    id: 'PA002',
    nama: 'Siti binti Mohamed',
    jawatan: 'Penolong Amil',
    institusi: 'Masjid Al-Amin',
    statusLantikan: 'Aktif',
    statusPembayaran: 'Belum Dikira',
    tahunPerkhidmatan: 3,
    kadarElaun: 800.00,
    elaunTahunan: 2400.00,
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
    kadarElaun: 600.00,
    elaunTahunan: 600.00,
    tarikhLantikan: '10/06/2023',
    tarikhTamat: '09/06/2028',
  },
];

// Bulk table columns
const bulkColumns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    width: "80px",
  },
  {
    key: "nama",
    label: "Nama",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusi",
    label: "Institusi",
    sortable: true,
  },
  {
    key: "statusLantikan",
    label: "Status",
    sortable: true,
  },
  {
    key: "kadarElaun",
    label: "Kadar Elaun (RM)",
    sortable: true,
  },
];

// Computed properties
const calculatedAmount = computed(() => {
  if (calculationData.value.kadarElaun && calculationData.value.tahunPerkhidmatan) {
    return (calculationData.value.kadarElaun * 12).toLocaleString('en-MY', { minimumFractionDigits: 2 });
  }
  return '0.00';
});

const totalCalculatedAmount = computed(() => {
  return selectedPenolongAmil.value
    .reduce((sum, pa) => sum + (pa.kadarElaun * 12), 0)
    .toLocaleString('en-MY', { minimumFractionDigits: 2 });
});

const averageAmount = computed(() => {
  if (selectedPenolongAmil.value.length === 0) return '0.00';
  const total = selectedPenolongAmil.value.reduce((sum, pa) => sum + (pa.kadarElaun * 12), 0);
  return (total / selectedPenolongAmil.value.length).toLocaleString('en-MY', { minimumFractionDigits: 2 });
});

// Helper functions
const getStatusLantikanVariant = (status) => {
  switch (status) {
    case 'Aktif': return 'success';
    case 'Tamat': return 'warning';
    case 'Digantung': return 'danger';
    default: return 'disabled'; // Use disabled for proper grey color
  }
};

// Action handlers
const goBack = () => {
  router.back();
};

const confirmCalculation = async () => {
  try {
    processing.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (isBulkMode.value) {
      toast.success(`${selectedPenolongAmil.value.length} pengiraan elaun tahunan berjaya disahkan`);
    } else {
      toast.success('Pengiraan elaun tahunan berjaya disahkan');
    }
    
    // Navigate back to list
    navigateTo('/BF-PA/PE/ET/01');
  } catch (error) {
    toast.error('Ralat semasa mengesahkan pengiraan');
    console.error('Error confirming calculation:', error);
  } finally {
    processing.value = false;
  }
};

// Initialize data
onMounted(() => {
  const { id, bulk } = route.query;
  
  if (bulk === 'true') {
    isBulkMode.value = true;
    // In real app, get selected Penolong Amil from store/API
    selectedPenolongAmil.value = mockPenolongAmil;
  } else if (id) {
    isBulkMode.value = false;
    const pa = mockPenolongAmil.find(p => p.id === id);
    if (pa) {
      selectedPenolongAmil.value = [pa];
      calculationData.value.kadarElaun = pa.kadarElaun;
      calculationData.value.tahunPerkhidmatan = pa.tahunPerkhidmatan;
    }
  }
  
  // Check if already calculated
  if (selectedPenolongAmil.value.length > 0) {
    const allCalculated = selectedPenolongAmil.value.every(pa => pa.statusPembayaran === 'Telah Dikira');
    if (allCalculated) {
      isReadOnly.value = true;
      toast.info('Elaun tahunan telah dikira untuk Penolong Amil ini');
    }
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 