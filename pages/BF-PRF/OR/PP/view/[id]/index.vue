<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Maklumat Organisasi</h2>
            <p class="text-sm text-gray-600 mt-1">{{ organisasiData.noRujukan }}</p>
          </div>
          <rs-badge :variant="getStatusVariant(organisasiData.status)">
            {{ organisasiData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Maklumat Asas -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Asas</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Rujukan:</span>
                  <span class="text-gray-900">{{ organisasiData.noRujukan }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Organisasi:</span>
                  <span class="text-gray-900">{{ organisasiData.namaOrganisasi }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jenis Organisasi:</span>
                  <span class="text-gray-900">{{ organisasiData.jenisOrganisasi }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Pendaftaran:</span>
                  <span class="text-gray-900">{{ organisasiData.noPendaftaran }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Status & Tarikh</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status:</span>
                  <rs-badge :variant="getStatusVariant(organisasiData.status)">
                    {{ organisasiData.status }}
                  </rs-badge>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Tarikh Permohonan:</span>
                  <span class="text-gray-900">{{ formatDate(organisasiData.tarikhPermohonan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Masa Permohonan:</span>
                  <span class="text-gray-900">{{ formatTime(organisasiData.tarikhPermohonan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status Pendaftaran:</span>
                  <span class="text-gray-900">{{ organisasiData.statusPendaftaran }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Alamat -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Alamat</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 1:</span>
                  <span class="text-gray-900">{{ organisasiData.alamat.alamat1 }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 2:</span>
                  <span class="text-gray-900">{{ organisasiData.alamat.alamat2 }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 3:</span>
                  <span class="text-gray-900">{{ organisasiData.alamat.alamat3 || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Poskod:</span>
                  <span class="text-gray-900">{{ organisasiData.alamat.poskod }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Bandar:</span>
                  <span class="text-gray-900">{{ organisasiData.alamat.bandar }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Negeri:</span>
                  <span class="text-gray-900">{{ organisasiData.alamat.negeri }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Kariah/Zon -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Kariah/Zon</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Kariah:</span>
                  <span class="text-gray-900">{{ organisasiData.kariah.kariah }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Cawangan:</span>
                  <span class="text-gray-900">{{ organisasiData.kariah.cawangan || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Zon:</span>
                  <span class="text-gray-900">{{ organisasiData.kariah.zon || '-' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Struktur:</span>
                  <span class="text-gray-900">{{ organisasiData.struktur }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Perhubungan -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Perhubungan</h3>
            
            <div v-for="(wakil, index) in organisasiData.wakil" :key="index" class="border rounded-lg p-4 bg-gray-50">
              <h4 class="font-medium text-gray-700 mb-3">Wakil {{ index + 1 }}</h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">Nama:</span>
                    <span class="text-gray-900">{{ wakil.nama }}</span>
                  </div>
                  
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">ID Pengenalan:</span>
                    <span class="text-gray-900">{{ wakil.idPengenalan }}</span>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">No. Telefon:</span>
                    <span class="text-gray-900">{{ wakil.telefon }}</span>
                  </div>
                  
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="font-medium text-gray-600">Emel:</span>
                    <span class="text-gray-900">{{ wakil.emel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Bank -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Bank</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Bank:</span>
                  <span class="text-gray-900">{{ organisasiData.bank.namaBank }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Akaun:</span>
                  <span class="text-gray-900">{{ organisasiData.bank.noAkaun }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Pemilik:</span>
                  <span class="text-gray-900">{{ organisasiData.bank.namaPemilik }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-start mt-8 pt-6 border-t">
          <rs-button variant="primary-outline" @click="goBack">
            Kembali
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

definePageMeta({ title: 'Maklumat Organisasi' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Senarai Organisasi', type: 'link', path: '/BF-PRF/OR/PP' },
  { name: 'Maklumat Organisasi', type: 'current', path: `/BF-PRF/OR/PP/view/${route.params.id}` },
]);

// Mock data for the organisasi
const organisasiData = ref({
  noRujukan: 'ORG-240501',
  namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
  jenisOrganisasi: 'Swasta',
  noPendaftaran: '201801012345',
  tarikhPermohonan: new Date().toISOString(),
  status: 'Menunggu Pengesahan',
  statusPendaftaran: 'Berdaftar',
  struktur: 'HQ',
  alamat: {
    alamat1: 'No. 45, Jalan Teknologi 2/1',
    alamat2: 'Taman Perindustrian Teknologi',
    alamat3: 'Seksyen 2',
    poskod: '40000',
    bandar: 'Shah Alam',
    negeri: 'Selangor'
  },
  kariah: {
    kariah: 'MASJID PEKAN SHAH ALAM',
    cawangan: 'Cawangan Utama',
    zon: 'Zon A'
  },
  wakil: [
    {
      nama: 'Dato\' Ahmad bin Hassan',
      idPengenalan: '750101014567',
      telefon: '03-55123456',
      emel: 'ahmad.hassan@teknologimaju.com'
    },
    {
      nama: 'Siti Zainab binti Omar',
      idPengenalan: '820515023456',
      telefon: '019-2345678',
      emel: 'zainab.omar@teknologimaju.com'
    }
  ],
  bank: {
    namaBank: 'CIMB Bank',
    noAkaun: '8001234567890',
    namaPemilik: 'Syarikat Teknologi Maju Sdn Bhd'
  }
});

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ms-MY');
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('ms-MY');

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

const goBack = () => navigateTo('/BF-PRF/OR/PP');

// Load data based on ID when component mounts
onMounted(() => {
  // In a real implementation, this would fetch data from API based on route.params.id
  // For now, we use mock data with different values based on ID
  loadOrganisasiData(route.params.id);
});

const loadOrganisasiData = (id) => {
  // Mock different data based on ID
  const mockData = {
    'ORG-240501': {
      noRujukan: 'ORG-240501',
      namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
      jenisOrganisasi: 'Swasta',
      status: 'Menunggu Pengesahan'
    },
    'ORG-240502': {
      noRujukan: 'ORG-240502',
      namaOrganisasi: 'Pertubuhan Amal Iman Malaysia',
      jenisOrganisasi: 'NGO',
      status: 'Diluluskan'
    },
    'ORG-240503': {
      noRujukan: 'ORG-240503',
      namaOrganisasi: 'Sekolah Menengah Tahfiz Al-Amin',
      jenisOrganisasi: 'IPT',
      status: 'Diluluskan'
    }
  };

  if (mockData[id]) {
    organisasiData.value = { ...organisasiData.value, ...mockData[id] };
  }
};
</script> 