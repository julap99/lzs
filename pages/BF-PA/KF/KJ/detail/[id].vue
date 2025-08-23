<!-- 
  RTMF SCREEN: PA-KF-KJ-04_01 (Position Detail)
  PURPOSE: Paparan terperinci maklumat jawatan penolong amil
  DESCRIPTION: Read-only detailed view of a Penolong Amil position
  ROUTE: /BF-PA/KF/KJ/detail/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:file-text" class="w-6 h-6 mr-3 text-primary" />
            Paparan Terperinci Jawatan Penolong Amil
          </h1>
          <p class="text-sm text-gray-600 mt-1">Maklumat lengkap jawatan untuk kategori: <span class="font-medium text-gray-800">{{ categoryData.kategoriPenolongAmil }}</span></p>
        </div>
      </div>
    </div>

    <!-- Category Context Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:tag" class="w-5 h-5 mr-2" />
            Maklumat Kategori
          </h3>
          <rs-badge :variant="categoryData.status === 'Aktif' ? 'success' : 'secondary'">
            {{ categoryData.status }}
          </rs-badge>
        </div>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Penolong Amil</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                  {{ categoryData.kategoriPenolongAmil }}
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan Kategori</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  {{ categoryData.kodSingkatan }}
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Kategori</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  <rs-badge :variant="getStatusVariant(categoryData.status)">
                    {{ categoryData.status }}
                  </rs-badge>
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh Kuatkuasa Kategori</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  {{ formatDate(categoryData.tarikhKuatkuasa) }}
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rujukan Jawatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-mono">
                  {{ positionData.rujukan }}
                </div>
            </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Position Details Section -->
        <rs-card class="mb-6">
          <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:identification-card" class="w-5 h-5 mr-2" />
          Maklumat Jawatan
        </h3>
          </template>
          <template #body>
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Jawatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-medium">
                  {{ positionData.namaJawatan }}
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan Jawatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-medium">
                  {{ positionData.kodSingkatan }}
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Jawatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  <rs-badge :variant="getStatusVariant(positionData.status)">
                    {{ positionData.status }}
                  </rs-badge>
                </div>
              </div>
              <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh Kuatkuasa Jawatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  {{ formatDate(positionData.tarikhKuatkuasa) || 'Belum ditetapkan' }}
                </div>
            </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Enhanced Workflow Status -->
        <!-- Review History -->
        <rs-card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
              Sejarah Semakan
            </h3>
          </template>
          <template #body>
            <div class="p-6">
              <div class="space-y-4">
                <!-- Eksekutif Review -->
                <div class="flex items-start justify-between p-4">
                  <div class="flex items-start">
                    <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-gray-900">Eksekutif</h4>
                        <rs-badge variant="success">Selesai</rs-badge>
                      </div>
                      <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                      <div class="text-xs text-gray-600 space-y-1">
                        <p><strong>Disemak oleh:</strong> Dr. Aminah binti Abdullah (Eksekutif)</p>
                        <p><strong>Tarikh:</strong> 15-01-2024 10:30</p>
                        <p><strong>Catatan:</strong> Sokongan diberikan untuk penambahan jawatan Ketua Penolong Amil</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ketua Jabatan Review (Current) -->
                <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div class="flex items-start">
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-orange-900">Ketua Jabatan</h4>
                        <rs-badge variant="warning">Dalam Proses</rs-badge>
                      </div>
                      <p class="text-sm text-orange-700 mb-2">Pengesahan ketua jabatan</p>
                      <div class="text-xs text-orange-600 space-y-1">
                        <p><strong>Disemak oleh:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
                        <p><strong>Tarikh:</strong> {{ currentDate }}</p>
                        <p><strong>Status:</strong> Menunggu keputusan pengesahan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <rs-button
            variant="secondary"
            @click="navigateTo('/BF-PA/KF/KJ')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
          
          <!-- Action buttons removed - this is a view-only screen -->
        </div>

    <!-- Audit Trail Section -->
        <rs-card class="mt-8 bg-gray-50 border-gray-300">
          <template #header>
            <div class="bg-gray-100 border-b border-gray-300 flex items-center">
              <Icon name="ph:clock-clockwise" class="mr-2 text-gray-600" size="18" />
              <h3 class="text-lg font-semibold text-gray-600">Jejak Audit</h3>
              <p class="text-sm text-gray-500 mt-1">Maklumat rujukan sahaja</p>
            </div>
          </template>
          
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Dicipta Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.diciptaOleh }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Cipta</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formatDate(positionData.maklumatPegawai.tarikhCipta) }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Dikemaskini Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.dikemaskiniBoleh || 'Belum dikemaskini' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Kemaskini</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.tarikhKemaskini ? formatDate(positionData.maklumatPegawai.tarikhKemaskini) : 'Belum dikemaskini' }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Disahkan Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.disahkanOleh || 'Belum disahkan' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Pengesahan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.tarikhPengesahan ? formatDate(positionData.maklumatPegawai.tarikhPengesahan) : 'Belum disahkan' }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Diluluskan Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Kelulusan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ positionData.maklumatPegawai.tarikhKelulusan ? formatDate(positionData.maklumatPegawai.tarikhKelulusan) : 'Belum diluluskan' }}
                </div>
              </div>
            </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { formatDate } from "~/utils/dateFormatter";

definePageMeta({
  title: "Paparan Terperinci Jawatan Penolong Amil",
});

const route = useRoute();
const positionId = route.params.id;

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Jawatan', path: '/BF-PA/KF/KJ' },
  { name: 'Paparan Terperinci', path: null }
];

// Mock position data
const positionData = ref({
  rujukan: "KJ-2024-001",
  namaJawatan: "Ketua Penolong Amil",
  kodSingkatan: "KPA",
  status: "Aktif",
      tarikhKuatkuasa: "01-01-2024",
  maklumatPegawai: {
    diciptaOleh: "Ahmad bin Ali",
    tarikhCipta: "2024-01-15",
    dikemaskiniBoleh: "Siti binti Ahmad",
    tarikhKemaskini: "2024-02-01",
    disahkanOleh: "Hasan bin Omar",
    tarikhPengesahan: "2024-02-03",
    diluluskanOleh: "Fatimah binti Ibrahim",
    tarikhKelulusan: "2024-02-05"
  }
});

// Mock category data for context
const categoryData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
      tarikhKuatkuasa: "01-01-2024"
});

// Current user role removed - not needed for view-only screen

// Helper functions
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info',
  };
  return variants[status] || 'disabled';
};

// Workflow visualization helpers
const getWorkflowStepClass = (step) => {
  const status = positionData.value.status;
  
  if (step === 1) { // Eksekutif
    return 'bg-green-500'; // Always completed for created items
  } else if (step === 2) { // Ketua Jabatan
    if (status === 'Menunggu Pengesahan') return 'bg-yellow-500'; // In progress
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'bg-green-500'; // Completed
    if (status === 'Tidak Aktif') return 'bg-red-500'; // Rejected
    return 'bg-gray-300'; // Not started
  } else if (step === 3) { // Ketua Divisyen
    if (status === 'Menunggu Kelulusan') return 'bg-blue-500'; // In progress
    if (status === 'Aktif') return 'bg-green-500'; // Completed (approved)
    if (status === 'Tidak Aktif') return 'bg-red-500'; // Rejected
    return 'bg-gray-300'; // Not started
  }
  return 'bg-gray-300';
};

const getWorkflowStepIcon = (step) => {
  const status = positionData.value.status;
  
  if (step === 1) { // Eksekutif
    return 'ph:check';
  } else if (step === 2) { // Ketua Jabatan
    if (status === 'Menunggu Pengesahan') return 'ph:clock';
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'ph:check';
    if (status === 'Tidak Aktif') return 'ph:x';
    return 'ph:minus';
  } else if (step === 3) { // Ketua Divisyen
    if (status === 'Menunggu Kelulusan') return 'ph:clock';
    if (status === 'Aktif') return 'ph:check';
    if (status === 'Tidak Aktif') return 'ph:x';
    return 'ph:minus';
  }
  return 'ph:minus';
};

const getWorkflowStepStatus = (step) => {
  const status = positionData.value.status;
  
  if (step === 1) { // Eksekutif
    return 'Selesai';
  } else if (step === 2) { // Ketua Jabatan
    if (status === 'Menunggu Pengesahan') return 'Dalam Proses';
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'Selesai';
    if (status === 'Tidak Aktif') return 'Ditolak';
    return 'Belum Mula';
  } else if (step === 3) { // Ketua Divisyen
    if (status === 'Menunggu Kelulusan') return 'Dalam Proses';
    if (status === 'Aktif') return 'Diluluskan';
    if (status === 'Tidak Aktif') return 'Ditolak';
    return 'Belum Mula';
  }
  return 'Belum Mula';
};

const getWorkflowStepDescription = (step) => {
  if (step === 1) { // Eksekutif
    return 'Jawatan dicipta dan disokong';
  } else if (step === 2) { // Ketua Jabatan
    return 'Pengesahan jawatan';
  } else if (step === 3) { // Ketua Divisyen
    return 'Kelulusan akhir jawatan';
  }
  return '';
};

const getWorkflowStepBadge = (step) => {
  const status = positionData.value.status;
  if (step === 1) { // Eksekutif
    return 'success';
  } else if (step === 2) { // Ketua Jabatan
    if (status === 'Menunggu Pengesahan') return 'warning';
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'success';
    if (status === 'Tidak Aktif') return 'danger';
    return 'secondary';
  } else if (step === 3) { // Ketua Divisyen
    if (status === 'Menunggu Kelulusan') return 'info';
    if (status === 'Aktif') return 'success';
    if (status === 'Tidak Aktif') return 'danger';
    return 'secondary';
  }
  return 'secondary';
};

const getCurrentStatusDescription = () => {
  const status = positionData.value.status;
  const descriptions = {
    'Aktif': 'Jawatan telah diluluskan dan aktif untuk digunakan',
    'Tidak Aktif': 'Jawatan telah ditolak atau dinyahaktifkan',
    'Menunggu Pengesahan': 'Jawatan menunggu pengesahan oleh Ketua Jabatan',
    'Menunggu Kelulusan': 'Jawatan menunggu kelulusan oleh Ketua Divisyen',
  };
  return descriptions[status] || 'Status tidak diketahui';
};

// Role-based action permissions and navigation methods removed - not needed for view-only screen
</script> 