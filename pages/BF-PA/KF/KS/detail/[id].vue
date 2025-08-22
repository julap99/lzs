<!-- 
  RTMF SCREEN: PA-KF-KS-01_02 (Detail View)
  PURPOSE: Paparan terperinci maklumat sesi penolong amil dengan konteks kategori
  DESCRIPTION: Enhanced detail view for Penolong Amil session with category context and workflow
  ROUTE: /BF-PA/KF/KS/detail/[id]
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
            Paparan Terperinci Sesi Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Maklumat lengkap sesi untuk kategori: <span class="font-medium text-gray-800">{{ categoryData.kategoriPenolongAmil }}</span></p>
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ categoryData.kodSingkatan }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh Kuatkuasa Kategori</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ formatDate(categoryData.tarikhKuatkuasa) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rujukan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-mono">
                {{ sessionData.rujukan }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Session Tables Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:table" class="w-5 h-5 mr-2" />
          Maklumat Sesi Dalam Kategori
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <!-- Sesi dalam Kategori -->
          <div class="mb-8">
            <h4 class="text-md font-semibold text-gray-900 mb-4">Sesi dalam Kategori</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Nama Sesi</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Mula</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Tamat</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(sesi, index) in sessionData.maklumatSesi" :key="index">
                    <td class="p-3 border text-sm text-gray-900">{{ sesi.sesi }}</td>
                    <td class="p-3 border text-sm text-gray-900">{{ formatDate(sesi.mula) }}</td>
                    <td class="p-3 border text-sm text-gray-900">{{ formatDate(sesi.tamat) }}</td>
                    <td class="p-3 border">
                      <rs-badge :variant="sesi.status === 'AKTIF' ? 'success' : 'secondary'" size="sm">
                        {{ sesi.status }}
                      </rs-badge>
                    </td>
                    <td class="p-3 border text-sm text-gray-900">{{ sesi.tarikh ? formatDate(sesi.tarikh) : 'Belum ditetapkan' }}</td>
                  </tr>
                  <tr v-if="!sessionData.maklumatSesi || sessionData.maklumatSesi.length === 0">
                    <td colspan="5" class="p-6 text-center text-gray-500">Tiada sesi ditetapkan untuk kategori ini</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Enhanced Workflow Status -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:flow-arrow" class="w-5 h-5 mr-2" />
          Status Aliran Kerja Kelulusan
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-6">
            <!-- Workflow Timeline -->
            <div class="relative">
              <!-- Progress Line -->
              <div class="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              
              <!-- Step 1: Eksekutif -->
              <div class="relative flex items-start space-x-4 pb-6">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getWorkflowStepClass(1)
                  ]">
                    <Icon :name="getWorkflowStepIcon(1)" class="w-4 h-4 text-white" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Eksekutif - Sokongan</p>
                      <p class="text-sm text-gray-500">{{ getWorkflowStepDescription(1) }}</p>
                    </div>
                    <rs-badge :variant="getWorkflowStepBadge(1)" size="sm">
                      {{ getWorkflowStepStatus(1) }}
                    </rs-badge>
                  </div>
                </div>
              </div>

              <!-- Step 2: Ketua Jabatan -->
              <div class="relative flex items-start space-x-4 pb-6">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getWorkflowStepClass(2)
                  ]">
                    <Icon :name="getWorkflowStepIcon(2)" class="w-4 h-4 text-white" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Ketua Jabatan - Pengesahan</p>
                      <p class="text-sm text-gray-500">{{ getWorkflowStepDescription(2) }}</p>
                    </div>
                    <rs-badge :variant="getWorkflowStepBadge(2)" size="sm">
                      {{ getWorkflowStepStatus(2) }}
                    </rs-badge>
                  </div>
                </div>
              </div>

              <!-- Step 3: Ketua Divisyen -->
              <div class="relative flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getWorkflowStepClass(3)
                  ]">
                    <Icon :name="getWorkflowStepIcon(3)" class="w-4 h-4 text-white" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Ketua Divisyen - Kelulusan Akhir</p>
                      <p class="text-sm text-gray-500">{{ getWorkflowStepDescription(3) }}</p>
                    </div>
                    <rs-badge :variant="getWorkflowStepBadge(3)" size="sm">
                      {{ getWorkflowStepStatus(3) }}
                    </rs-badge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Status Summary -->
            <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div class="flex items-center">
                <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Status Semasa</p>
                  <p class="text-sm text-gray-600">{{ getCurrentStatusDescription() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center">
      <rs-button
        variant="secondary-outline"
        @click="navigateTo('/BF-PA/KF/KS')"
        class="flex items-center"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
      
      <div class="flex gap-3">
        <!-- Role-based Action Buttons -->
        <!-- Action buttons removed - this is a view-only screen -->
      </div>
    </div>

    <!-- Jejak Audit (Read-Only Reference Section) -->
    <rs-card class="mt-8 bg-gray-50 border-gray-300">
      <template #header>
        <div class="bg-gray-100 border-b border-gray-300 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-600 flex items-center">
            <Icon name="ph:clock-clockwise" class="w-5 h-5 mr-2 text-gray-500" />
            Jejak Audit
          </h3>
          <p class="text-sm text-gray-500 mt-1">Maklumat rujukan sahaja</p>
        </div>
      </template>
      <template #body>
        <div class="p-6 bg-gray-50">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Dicipta Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.diciptaOleh }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Cipta</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(sessionData.maklumatPegawai.tarikhCipta) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Dikemaskini Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.dikemaskiniBoleh || 'Belum dikemaskini' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kemaskini</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.tarikhKemaskini ? formatDate(sessionData.maklumatPegawai.tarikhKemaskini) : 'Belum dikemaskini' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Disahkan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.disahkanOleh || 'Belum disahkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Pengesahan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.tarikhPengesahan ? formatDate(sessionData.maklumatPegawai.tarikhPengesahan) : 'Belum disahkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Diluluskan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kelulusan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ sessionData.maklumatPegawai.tarikhKelulusan ? formatDate(sessionData.maklumatPegawai.tarikhKelulusan) : 'Belum diluluskan' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";

const route = useRoute();

definePageMeta({
  title: "Paparan Terperinci Sesi Penolong Amil",
});

// Breadcrumb
const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Sesi', path: '/BF-PA/KF/KS' },
  { name: 'Paparan Terperinci', path: null }
];

// Current user role removed - not needed for view-only screen

// Category data
const categoryData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF", 
  status: "Aktif",
      tarikhKuatkuasa: "01-01-2024"
});

// Enhanced session data matching our new structure
const sessionData = ref({
  rujukan: "KS-2024-001",
  status: "Aktif", // Current overall status
  maklumatSesi: [
    {
      sesi: 'SESI 2025-2027',
      mula: '2025-01-01',
      tamat: '2027-12-31',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    },
    {
      sesi: 'SESI 2024-2026',
      mula: '2024-01-01',
      tamat: '2026-12-31',
      status: 'TIDAK AKTIF',
      tarikh: '2024-01-01'
    }
  ],
  maklumatPegawai: {
    diciptaOleh: 'Ahmad Bin Abdullah',
    tarikhCipta: '2024-01-15',
    dikemaskiniBoleh: 'Ahmad Bin Abdullah',
    tarikhKemaskini: '2024-01-20',
    disahkanOleh: 'Siti Aminah Binti Omar',
    tarikhPengesahan: '2024-01-21',
    diluluskanOleh: 'Dato\' Muhammad Hassan Bin Abdul Rahman',
    tarikhKelulusan: '2024-01-22'
  }
});

// Role-based access control removed - not needed for view-only screen

// Enhanced Workflow Helper Functions
const getWorkflowStepClass = (step) => {
  const status = sessionData.value.status;
  
  switch (step) {
    case 1: // Eksekutif
      return 'bg-green-500'; // Always completed if we can see the data
    case 2: // Ketua Jabatan  
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'bg-green-500'; // Completed
      } else if (status === 'Menunggu Pengesahan') {
        return 'bg-yellow-500'; // In progress
      } else {
        return 'bg-gray-300'; // Not started
      }
    case 3: // Ketua Divisyen
      if (status === 'Aktif') {
        return 'bg-green-500'; // Completed
      } else if (status === 'Menunggu Kelulusan') {
        return 'bg-blue-500'; // In progress
      } else if (status === 'Tidak Aktif') {
        return 'bg-red-500'; // Rejected
      } else {
        return 'bg-gray-300'; // Not started
      }
    default:
      return 'bg-gray-300';
  }
};

const getWorkflowStepIcon = (step) => {
  const status = sessionData.value.status;
  
  switch (step) {
    case 1:
      return 'ph:check';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'ph:check';
      } else if (status === 'Menunggu Pengesahan') {
        return 'ph:clock';
      } else {
        return 'ph:minus';
      }
    case 3:
      if (status === 'Aktif') {
        return 'ph:check';
      } else if (status === 'Menunggu Kelulusan') {
        return 'ph:clock';
      } else if (status === 'Tidak Aktif') {
        return 'ph:x';
      } else {
        return 'ph:minus';
      }
    default:
      return 'ph:minus';
  }
};

const getWorkflowStepStatus = (step) => {
  const status = sessionData.value.status;
  
  switch (step) {
    case 1:
      return 'Selesai';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'Selesai';
      } else if (status === 'Menunggu Pengesahan') {
        return 'Dalam Proses';
      } else {
        return 'Belum Mula';
      }
    case 3:
      if (status === 'Aktif') {
        return 'Diluluskan';
      } else if (status === 'Menunggu Kelulusan') {
        return 'Dalam Proses';
      } else if (status === 'Tidak Aktif') {
        return 'Ditolak';
      } else {
        return 'Belum Mula';
      }
    default:
      return 'Tidak Diketahui';
  }
};

const getWorkflowStepBadge = (step) => {
  const status = sessionData.value.status;
  
  switch (step) {
    case 1:
      return 'success';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'success';
      } else if (status === 'Menunggu Pengesahan') {
        return 'warning';
      } else {
        return 'secondary';
      }
    case 3:
      if (status === 'Aktif') {
        return 'success';
      } else if (status === 'Menunggu Kelulusan') {
        return 'info';
      } else if (status === 'Tidak Aktif') {
        return 'danger';
      } else {
        return 'secondary';
      }
    default:
      return 'secondary';
  }
};

const getWorkflowStepDescription = (step) => {
  const status = sessionData.value.status;
  
  switch (step) {
    case 1:
      return 'Data telah disokong dan dihantar untuk pengesahan';
    case 2:
      if (['Menunggu Kelulusan', 'Aktif'].includes(status)) {
        return 'Telah disahkan dan dihantar untuk kelulusan';
      } else if (status === 'Menunggu Pengesahan') {
        return 'Menunggu pengesahan dari Ketua Jabatan';
      } else {
        return 'Belum disahkan';
      }
    case 3:
      if (status === 'Aktif') {
        return 'Telah diluluskan dan berkuatkuasa dalam sistem';
      } else if (status === 'Menunggu Kelulusan') {
        return 'Menunggu kelulusan dari Ketua Divisyen';
      } else if (status === 'Tidak Aktif') {
        return 'Telah ditolak oleh Ketua Divisyen';
      } else {
        return 'Belum sampai tahap kelulusan';
      }
    default:
      return '';
  }
};

const getCurrentStatusDescription = () => {
  const status = sessionData.value.status;
  const descriptions = {
    'Aktif': 'Sesi telah diluluskan sepenuhnya dan berkuatkuasa dalam sistem',
    'Menunggu Pengesahan': 'Sesi sedang menunggu pengesahan dari Ketua Jabatan',
    'Menunggu Kelulusan': 'Sesi sedang menunggu kelulusan akhir dari Ketua Divisyen',
    'Tidak Aktif': 'Sesi telah ditolak atau dinyahaktifkan'
  };
  return descriptions[status] || 'Status tidak diketahui';
};

// Action methods removed - not needed for view-only screen

onMounted(() => {
  // Fetch session data from API in real app
      // Loading detailed session data
});
</script> 