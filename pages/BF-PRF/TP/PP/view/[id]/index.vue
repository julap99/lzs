<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Maklumat Recipient</h2>
            <p class="text-sm text-gray-600 mt-1">{{ recipientData.noRujukan }}</p>
          </div>
          <rs-badge :variant="getStatusVariant(recipientData.status)">
            {{ recipientData.status }}
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
                  <span class="text-gray-900">{{ recipientData.noRujukan }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Recipient:</span>
                  <span class="text-gray-900">{{ recipientData.namaRecipient }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jenis Recipient:</span>
                  <span class="text-gray-900">{{ recipientData.jenisRecipient }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jenis Pengenalan:</span>
                  <span class="text-gray-900">{{ recipientData.jenisPengenalan }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Status & Tarikh</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status:</span>
                  <rs-badge :variant="getStatusVariant(recipientData.status)">
                    {{ recipientData.status }}
                  </rs-badge>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Tarikh Permohonan:</span>
                  <span class="text-gray-900">{{ formatDate(recipientData.tarikhPermohonan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Masa Permohonan:</span>
                  <span class="text-gray-900">{{ formatTime(recipientData.tarikhPermohonan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Pengenalan:</span>
                  <span class="text-gray-900">{{ recipientData.noPengenalan }}</span>
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
                  <span class="text-gray-900">{{ recipientData.alamat.alamat1 }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 2:</span>
                  <span class="text-gray-900">{{ recipientData.alamat.alamat2 }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 3:</span>
                  <span class="text-gray-900">{{ recipientData.alamat.alamat3 || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Poskod:</span>
                  <span class="text-gray-900">{{ recipientData.alamat.poskod }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Bandar:</span>
                  <span class="text-gray-900">{{ recipientData.alamat.bandar }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Negeri:</span>
                  <span class="text-gray-900">{{ recipientData.alamat.negeri }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Perhubungan -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Perhubungan</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Telefon:</span>
                  <span class="text-gray-900">{{ recipientData.perhubungan.telefon }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Emel:</span>
                  <span class="text-gray-900">{{ recipientData.perhubungan.emel || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Telefon Alternatif:</span>
                  <span class="text-gray-900">{{ recipientData.perhubungan.telefonAlternatif || '-' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Waris:</span>
                  <span class="text-gray-900">{{ recipientData.perhubungan.namaWaris || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Bank (jika Syarikat) -->
          <div v-if="recipientData.jenisRecipient === 'Syarikat'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Bank</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Bank:</span>
                  <span class="text-gray-900">{{ recipientData.bank?.namaBank || '-' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Akaun:</span>
                  <span class="text-gray-900">{{ recipientData.bank?.noAkaun || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Pemilik:</span>
                  <span class="text-gray-900">{{ recipientData.bank?.namaPemilik || '-' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Syarikat:</span>
                  <span class="text-gray-900">{{ recipientData.noSyarikat || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Kesihatan (jika berkaitan) -->
          <div v-if="recipientData.jenisRecipient === 'Individu'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Kesihatan</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Kategori Kesihatan:</span>
                  <span class="text-gray-900">{{ recipientData.kesihatan?.kategori || '-' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Kondisi Khusus:</span>
                  <span class="text-gray-900">{{ recipientData.kesihatan?.kondisiKhusus || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Hospital Rujukan:</span>
                  <span class="text-gray-900">{{ recipientData.kesihatan?.hospitalRujukan || '-' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Kad OKU:</span>
                  <span class="text-gray-900">{{ recipientData.kesihatan?.noKadOKU || '-' }}</span>
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

definePageMeta({ title: 'Maklumat Recipient' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Senarai Recipient', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Maklumat Recipient', type: 'current', path: `/BF-PRF/TP/PP/view/${route.params.id}` },
]);

// Mock data for the recipient
const recipientData = ref({
  noRujukan: 'RE-240511',
  namaRecipient: 'Ahmad Bin Abdullah',
  jenisRecipient: 'Individu',
  jenisPengenalan: 'MyKad',
  noPengenalan: '880101011234',
  tarikhPermohonan: new Date().toISOString(),
  status: 'Menunggu Pengesahan',
  alamat: {
    alamat1: 'No. 789, Jalan Harmoni 3/5',
    alamat2: 'Taman Harmoni',
    alamat3: '',
    poskod: '43650',
    bandar: 'Bangi',
    negeri: 'Selangor'
  },
  perhubungan: {
    telefon: '012-3456789',
    emel: 'ahmad.abdullah@email.com',
    telefonAlternatif: '019-8765432',
    namaWaris: 'Siti Aminah binti Ahmad'
  },
  kesihatan: {
    kategori: 'Dialisis',
    kondisiKhusus: 'Buah Pinggang Kronik',
    hospitalRujukan: 'Hospital Putrajaya',
    noKadOKU: 'OKU123456789'
  },
  bank: null,
  noSyarikat: null
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

const goBack = () => navigateTo('/BF-PRF/TP/PP');

// Load data based on ID when component mounts
onMounted(() => {
  // In a real implementation, this would fetch data from API based on route.params.id
  // For now, we use mock data with different values based on ID
  loadRecipientData(route.params.id);
});

const loadRecipientData = (id) => {
  // Mock different data based on ID
  const mockData = {
    'RE-240511': {
      noRujukan: 'RE-240511',
      namaRecipient: 'Ahmad Bin Abdullah',
      jenisRecipient: 'Individu',
      jenisPengenalan: 'MyKad',
      status: 'Menunggu Pengesahan'
    },
    'RE-240512': {
      noRujukan: 'RE-240512',
      namaRecipient: 'Pusat Dialisis Al-Falah Sdn Bhd',
      jenisRecipient: 'Syarikat',
      jenisPengenalan: 'ID Syarikat',
      status: 'Diluluskan',
      bank: {
        namaBank: 'Public Bank',
        noAkaun: '9876543210',
        namaPemilik: 'Pusat Dialisis Al-Falah Sdn Bhd'
      },
      noSyarikat: 'SSM-201801023456',
      kesihatan: null
    },
    'RE-240513': {
      noRujukan: 'RE-240513',
      namaRecipient: 'Siti Fatimah Binti Ali',
      jenisRecipient: 'Individu',
      jenisPengenalan: 'Foreign ID',
      status: 'Ditolak'
    }
  };

  if (mockData[id]) {
    recipientData.value = { ...recipientData.value, ...mockData[id] };
  }
};
</script> 