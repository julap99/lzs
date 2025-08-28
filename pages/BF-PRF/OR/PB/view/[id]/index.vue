<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Maklumat Cawangan</h2>
            <p class="text-sm text-gray-600 mt-1">{{ cawanganData.noRujukan }}</p>
          </div>
          <rs-badge :variant="getStatusVariant(cawanganData.status)">
            {{ cawanganData.status }}
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
                  <span class="text-gray-900">{{ cawanganData.noRujukan }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Cawangan:</span>
                  <span class="text-gray-900">{{ cawanganData.namaCawangan }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama HQ:</span>
                  <span class="text-gray-900">{{ cawanganData.namaHQ }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jenis Organisasi:</span>
                  <span class="text-gray-900">{{ cawanganData.jenisOrganisasi }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Status & Tarikh</h3>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status:</span>
                  <rs-badge :variant="getStatusVariant(cawanganData.status)">
                    {{ cawanganData.status }}
                  </rs-badge>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Tarikh Permohonan:</span>
                  <span class="text-gray-900">{{ formatDate(cawanganData.tarikhPermohonan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Masa Permohonan:</span>
                  <span class="text-gray-900">{{ formatTime(cawanganData.tarikhPermohonan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Daerah:</span>
                  <span class="text-gray-900">{{ cawanganData.daerah }}</span>
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
                  <span class="text-gray-900">{{ cawanganData.alamat.alamat1 }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 2:</span>
                  <span class="text-gray-900">{{ cawanganData.alamat.alamat2 }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Alamat 3:</span>
                  <span class="text-gray-900">{{ cawanganData.alamat.alamat3 || '-' }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Poskod:</span>
                  <span class="text-gray-900">{{ cawanganData.alamat.poskod }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Bandar:</span>
                  <span class="text-gray-900">{{ cawanganData.alamat.bandar }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Negeri:</span>
                  <span class="text-gray-900">{{ cawanganData.alamat.negeri }}</span>
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
                  <span class="font-medium text-gray-600">Nama Wakil:</span>
                  <span class="text-gray-900">{{ cawanganData.wakil.nama }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Telefon:</span>
                  <span class="text-gray-900">{{ cawanganData.wakil.telefon }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Emel:</span>
                  <span class="text-gray-900">{{ cawanganData.wakil.emel }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jawatan:</span>
                  <span class="text-gray-900">{{ cawanganData.wakil.jawatan }}</span>
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
                  <span class="text-gray-900">{{ cawanganData.bank.namaBank }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Akaun:</span>
                  <span class="text-gray-900">{{ cawanganData.bank.noAkaun }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Pemilik:</span>
                  <span class="text-gray-900">{{ cawanganData.bank.namaPemilik }}</span>
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

definePageMeta({ title: 'Maklumat Cawangan' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Senarai Cawangan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Maklumat Cawangan', type: 'current', path: `/BF-PRF/OR/PB/view/${route.params.id}` },
]);

// Mock data for the cawangan
const cawanganData = ref({
  noRujukan: 'PB-240511',
  namaCawangan: 'Cawangan Seri Damai',
  namaHQ: 'Yayasan Insan Malaysia',
  jenisOrganisasi: 'NGO',
  daerah: 'Kuala Lumpur',
  tarikhPermohonan: new Date().toISOString(),
  status: 'Menunggu Pengesahan',
  alamat: {
    alamat1: 'No. 123, Jalan Seri Damai 5/2',
    alamat2: 'Taman Seri Damai',
    alamat3: '',
    poskod: '43650',
    bandar: 'Bangi',
    negeri: 'Selangor'
  },
  wakil: {
    nama: 'Ahmad bin Abdullah',
    telefon: '012-3456789',
    emel: 'ahmad@seridamai.org',
    jawatan: 'Pengurus'
  },
  bank: {
    namaBank: 'Maybank',
    noAkaun: '1234567890123',
    namaPemilik: 'Cawangan Seri Damai'
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

const goBack = () => navigateTo('/BF-PRF/OR/PB');
const editItem = () => navigateTo(`/BF-PRF/OR/PB/kemaskini/${route.params.id}`);
const reviewItem = () => navigateTo('/BF-PRF/OR/PB/03');

// Load data based on ID when component mounts
onMounted(() => {
  // In a real implementation, this would fetch data from API based on route.params.id
  // For now, we use mock data with different values based on ID
  loadCawanganData(route.params.id);
});

const loadCawanganData = (id) => {
  // Mock different data based on ID
  const mockData = {
    'PB-240511': {
      noRujukan: 'PB-240511',
      namaCawangan: 'Cawangan Seri Damai',
      namaHQ: 'Yayasan Insan Malaysia',
      status: 'Menunggu Pengesahan'
    },
    'PB-240512': {
      noRujukan: 'PB-240512',
      namaCawangan: 'Cawangan Taman Ilmu',
      namaHQ: 'Pertubuhan Amal Jariah',
      status: 'Diluluskan'
    },
    'PB-240513': {
      noRujukan: 'PB-240513',
      namaCawangan: 'Cawangan Bandar Baru',
      namaHQ: 'Yayasan Pendidikan Islami Malaysia',
      status: 'Ditolak'
    }
  };

  if (mockData[id]) {
    cawanganData.value = { ...cawanganData.value, ...mockData[id] };
  }
};
</script> 