<!-- 
  RTMF SCREEN: PA-PE-ET-01_01 Detail
  PURPOSE: Butiran Penolong Amil Layak Elaun Tahunan
  DESCRIPTION: Detailed view of eligible Penolong Amil for annual allowance
  ROUTE: /BF-PA/PE/ET/01/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Icon name="ic:outline-person" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-xl font-semibold">
              Butiran Penolong Amil: {{ penolongAmil?.nama }}
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
              v-if="canCalculateElaun"
              variant="success"
              size="sm"
              @click="handleCalculateElaun"
            >
              <Icon name="ic:outline-calculate" class="mr-2" />
              Kira Elaun
            </rs-button>
            <rs-button
              v-else
              variant="secondary"
              size="sm"
              disabled
            >
              <Icon name="ic:outline-check-circle" class="mr-2" />
              Telah Dikira
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
              <h4 class="font-semibold text-blue-900 mb-2">Status Elaun Tahunan</h4>
              <div class="flex items-center space-x-4">
                <rs-badge :variant="getStatusPembayaranVariant(penolongAmil?.statusPembayaran)">
                  {{ penolongAmil?.statusPembayaran }}
                </rs-badge>
                <span class="text-sm text-blue-800">
                  Tahun Perkhidmatan: {{ currentYear }} - {{ nextYear }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Peribadi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">ID Penolong Amil</label>
                <p class="mt-1 text-sm text-gray-900 font-mono">{{ penolongAmil?.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama Penuh</label>
                <p class="mt-1 text-sm text-gray-900">{{ penolongAmil?.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jawatan/Kategori</label>
                <p class="mt-1 text-sm text-gray-900">{{ penolongAmil?.jawatan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Institusi</label>
                <p class="mt-1 text-sm text-gray-900">{{ penolongAmil?.institusi }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Lantikan</label>
                <rs-badge :variant="getStatusLantikanVariant(penolongAmil?.statusLantikan)">
                  {{ penolongAmil?.statusLantikan }}
                </rs-badge>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh Lantikan</label>
                <p class="mt-1 text-sm text-gray-900">{{ penolongAmil?.tarikhLantikan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh Tamat</label>
                <p class="mt-1 text-sm text-gray-900">{{ penolongAmil?.tarikhTamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tahun Perkhidmatan</label>
                <p class="mt-1 text-sm text-gray-900">{{ penolongAmil?.tahunPerkhidmatan }} tahun</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Allowance Information -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Maklumat Elaun</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-blue-700 mb-2">Kadar Elaun Bulanan</label>
              <p class="text-2xl font-bold text-blue-900">RM {{ penolongAmil?.kadarElaun }}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-green-700 mb-2">Elaun Tahunan</label>
              <p class="text-2xl font-bold text-green-900">RM {{ penolongAmil?.elaunTahunan }}</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <label class="block text-sm font-medium text-purple-700 mb-2">Status Pembayaran</label>
              <rs-badge :variant="getStatusPembayaranVariant(penolongAmil?.statusPembayaran)" class="text-lg">
                {{ penolongAmil?.statusPembayaran }}
              </rs-badge>
            </div>
          </div>
        </div>

        <!-- Calculation Details -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Butiran Pengiraan</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Formula Pengiraan</h4>
                <div class="space-y-2 text-sm text-gray-700">
                  <p>• Kadar Elaun Bulanan: RM {{ penolongAmil?.kadarElaun }}</p>
                  <p>• Bilangan Bulan: 12 bulan</p>
                  <p>• Elaun Tahunan = RM {{ penolongAmil?.kadarElaun }} × 12</p>
                  <p>• Jumlah = RM {{ penolongAmil?.elaunTahunan }}</p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Kelayakan</h4>
                <div class="space-y-2 text-sm text-gray-700">
                  <p>• Status Lantikan: {{ penolongAmil?.statusLantikan }}</p>
                  <p>• Tahun Perkhidmatan: {{ penolongAmil?.tahunPerkhidmatan }} tahun</p>
                  <p>• Tahun Semasa: {{ currentYear }}</p>
                  <p>• Layak Elaun: {{ isEligible ? 'Ya' : 'Tidak' }}</p>
                </div>
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
            Kembali
          </rs-button>
          <rs-button
            v-if="canCalculateElaun"
            variant="success"
            @click="handleCalculateElaun"
          >
            <Icon name="ic:outline-calculate" class="mr-2" />
            Kira Elaun Tahunan
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
  title: "Butiran Penolong Amil",
  description: "Butiran lengkap Penolong Amil untuk elaun tahunan",
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
    name: "Butiran Penolong Amil",
    type: "current",
    path: `/BF-PA/PE/ET/01/${route.params.id}`,
  },
]);

// State
const penolongAmil = ref(null);
const loading = ref(true);

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

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
    kadarElaun: '1,200.00',
    elaunTahunan: '6,000.00',
    tarikhLantikan: '15-01-2020',
    tarikhTamat: '14-01-2025',
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
    tarikhLantikan: '20-03-2021',
    tarikhTamat: '19-03-2026',
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
    tarikhLantikan: '10-06-2023',
    tarikhTamat: '09-06-2028',
  },
];

// Computed properties
const canCalculateElaun = computed(() => {
  return penolongAmil.value && penolongAmil.value.statusPembayaran === 'Belum Dikira';
});

const isEligible = computed(() => {
  return penolongAmil.value && penolongAmil.value.statusLantikan === 'Aktif';
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

const getStatusPembayaranVariant = (status) => {
  switch (status) {
    case 'Belum Dikira': return 'warning';
    case 'Telah Dikira': return 'info';
    case 'Telah Dibayar': return 'success';
    default: return 'disabled'; // Use disabled for proper grey color
  }
};

// Action handlers
const goBack = () => {
  router.back();
};

const handleCalculateElaun = () => {
  navigateTo(`/BF-PA/PE/ET/01/02?id=${penolongAmil.value.id}`);
};

// Load data
const loadPenolongAmil = async () => {
  try {
    loading.value = true;
    const id = route.params.id;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pa = mockPenolongAmil.find(p => p.id === id);
    if (pa) {
      penolongAmil.value = pa;
    } else {
      toast.error('Penolong Amil tidak dijumpai');
      goBack();
    }
  } catch (error) {
    toast.error('Ralat semasa memuat data');
    console.error('Error loading Penolong Amil:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPenolongAmil();
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 