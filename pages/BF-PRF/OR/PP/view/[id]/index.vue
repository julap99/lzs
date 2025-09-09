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

// Mock data for the organisasi (standardized to PP/02/kemaskini fields)
const organisasiData = ref({
  noRujukan: 'ORG-240501',
  namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
  jenisOrganisasi: 'NGO',
  noPendaftaran: '201801012345',
  tarikhPermohonan: new Date().toISOString(),
  status: 'Menunggu Pengesahan',
  statusPendaftaran: 'Berdaftar',
  struktur: 'HQ',
  hq: '',
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
    cawangan: '',
    zon: ''
  },
  wakil: [
    {
      nama: "Dato' Ahmad bin Hassan",
      idPengenalan: '750101014567',
      telefon: '03-55123456',
      emel: 'ahmad.hassan@teknologimaju.com'
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
    'Dalam Pembetulan': 'info',
    'Disahkan': 'success',
    'Perlu Pembetulan': 'warning',
    'Tidak Sah': 'danger'
  };
  return variants[status] || 'default';
};

const goBack = () => navigateTo('/BF-PRF/OR/PP');

// Load data based on ID when component mounts
onMounted(() => {
  loadOrganisasiData(route.params.id);
});

// Standardized mock dataset per ID
const loadOrganisasiData = (id) => {
  const dataset = {
    'ORG-240501': {
      noRujukan: 'ORG-240501',
      namaOrganisasi: 'Syarikat Teknologi Maju Sdn Bhd',
      jenisOrganisasi: 'NGO',
      noPendaftaran: '201801012345',
      status: 'Menunggu Pengesahan',
      statusPendaftaran: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      alamat: { alamat1: 'No. 45, Jalan Teknologi 2/1', alamat2: 'Taman Perindustrian Teknologi', alamat3: 'Seksyen 2', poskod: '40000', bandar: 'Shah Alam', negeri: 'Selangor' },
      kariah: { kariah: 'MASJID PEKAN SHAH ALAM', cawangan: '', zon: '' },
      wakil: [ { nama: "Dato' Ahmad bin Hassan", idPengenalan: '750101014567', telefon: '03-55123456', emel: 'ahmad.hassan@teknologimaju.com' } ],
      bank: { namaBank: 'CIMB Bank', noAkaun: '8001234567890', namaPemilik: 'Syarikat Teknologi Maju Sdn Bhd' }
    },
    'ORG-240502': {
      noRujukan: 'ORG-240502',
      namaOrganisasi: 'Pertubuhan Amal Iman Malaysia',
      jenisOrganisasi: 'NGO',
      noPendaftaran: 'PPM-123/2020',
      status: 'Dalam Pembetulan',
      statusPendaftaran: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      alamat: { alamat1: 'No. 10, Jalan Iman 3/2', alamat2: 'Taman Iman Jaya', alamat3: '', poskod: '53100', bandar: 'Kuala Selangor', negeri: 'Selangor' },
      kariah: { kariah: 'MASJID PEKAN KUALA SELANGOR', cawangan: '', zon: 'Zon A' },
      wakil: [ { nama: 'Ustaz Ibrahim bin Yusof', idPengenalan: '730505045678', telefon: '03-22345678', emel: 'ibrahim@amaliman.org' } ],
      bank: { namaBank: 'Maybank', noAkaun: '5123456789012', namaPemilik: 'Pertubuhan Amal Iman Malaysia' }
    },
    'ORG-240503': {
      noRujukan: 'ORG-240503',
      namaOrganisasi: 'Sekolah Menengah Tahfiz Al-Amin',
      jenisOrganisasi: 'Institusi',
      noPendaftaran: 'IPT-456/2019',
      status: 'Disahkan',
      statusPendaftaran: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      alamat: { alamat1: 'No. 88, Jalan Aman 2/4', alamat2: 'Taman Aman', alamat3: 'Seksyen 5', poskod: '28400', bandar: 'Rawang', negeri: 'Selangor' },
      kariah: { kariah: 'MASJID RAWANG', cawangan: '', zon: 'Zon Utara' },
      wakil: [ { nama: 'Dr. Ahmad Fauzi bin Abdul Rahman', idPengenalan: '650815056789', telefon: '09-33456789', emel: 'fauzi@tahfizalamin.edu.my' } ],
      bank: { namaBank: 'Bank Islam', noAkaun: '2098765432109', namaPemilik: 'Sekolah Menengah Tahfiz Al-Amin' }
    },
    'ORG-240504': {
      noRujukan: 'ORG-240504',
      namaOrganisasi: 'Pertubuhan Kebajikan Islam Selangor',
      jenisOrganisasi: 'NGO',
      noPendaftaran: 'PPM-789/2021',
      status: 'Perlu Pembetulan',
      statusPendaftaran: 'Berdaftar',
      struktur: 'HQ',
      hq: '',
      alamat: { alamat1: 'No. 15, Jalan Kebajikan 4/2', alamat2: 'Taman Kebajikan', alamat3: 'Seksyen 3', poskod: '47000', bandar: 'Sungai Buloh', negeri: 'Selangor' },
      kariah: { kariah: 'MASJID SUNGAI BULOH', cawangan: '', zon: 'Zon B' },
      wakil: [ { nama: 'Ustazah Siti Aminah binti Mohd Ali', idPengenalan: '780312087654', telefon: '03-44567890', emel: 'siti@kebajikanislam.org' } ],
      bank: { namaBank: 'RHB Bank', noAkaun: '2012345678901', namaPemilik: 'Pertubuhan Kebajikan Islam Selangor' }
    },
    'ORG-240505': {
      noRujukan: 'ORG-240505',
      namaOrganisasi: 'Syarikat Pembinaan Tidak Sah Sdn Bhd',
      jenisOrganisasi: 'Swasta',
      noPendaftaran: '201901012345',
      status: 'Tidak Sah',
      statusPendaftaran: 'Tidak Berdaftar',
      struktur: 'HQ',
      hq: '',
      alamat: { alamat1: 'No. 99, Jalan Tidak Sah 1/1', alamat2: 'Taman Tidak Sah', alamat3: 'Seksyen 1', poskod: '50000', bandar: 'Klang', negeri: 'Selangor' },
      kariah: { kariah: 'MASJID KLANG', cawangan: '', zon: 'Zon Selatan' },
      wakil: [ { nama: 'Encik Ali bin Abu', idPengenalan: '850505123456', telefon: '03-55667788', emel: 'ali@tidaksh.com' } ],
      bank: { namaBank: 'Public Bank', noAkaun: '3123456789012', namaPemilik: 'Syarikat Pembinaan Tidak Sah Sdn Bhd' }
    }
  };

  if (dataset[id]) {
    organisasiData.value = { ...organisasiData.value, ...dataset[id] };
  }
};
</script> 