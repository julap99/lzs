<!-- 
  RTMF SCREEN: PA-KF-KE-01_02 (Detail View)
  PURPOSE: Paparan terperinci maklumat elaun penolong amil dengan konteks kategori
  DESCRIPTION: Enhanced detail view for Penolong Amil allowance with category context and workflow
  ROUTE: /BF-PA/KF/KE/detail/[id]
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
            Paparan Terperinci Elaun Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Maklumat lengkap elaun untuk kategori: <span class="font-medium text-gray-800">{{ categoryData.kategoriPenolongAmil }}</span></p>
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
                {{ allowanceData.rujukan }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Allowance Tables Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:table" class="w-5 h-5 mr-2" />
          Maklumat Elaun Dalam Kategori
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <!-- Elaun dalam Kategori -->
          <div class="mb-8">
            <h4 class="text-md font-semibold text-gray-900 mb-4">Elaun dalam Kategori</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Jenis Elaun</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Amaun (RM)</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Bajet</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(elaun, index) in allowanceData.maklumatElaun" :key="index">
                    <td class="p-3 border text-sm text-gray-900">{{ elaun.jenis }}</td>
                    <td class="p-3 border text-sm text-gray-900 font-semibold">RM {{ elaun.amaun }}</td>
                    <td class="p-3 border text-sm text-gray-900 font-mono">{{ elaun.kod }}</td>
                    <td class="p-3 border">
                      <rs-badge :variant="elaun.status === 'AKTIF' ? 'success' : 'secondary'" size="sm">
                        {{ elaun.status }}
                      </rs-badge>
                    </td>
                    <td class="p-3 border text-sm text-gray-900">{{ elaun.tarikh ? formatDate(elaun.tarikh) : 'Belum ditetapkan' }}</td>
                  </tr>
                  <tr v-if="!allowanceData.maklumatElaun || allowanceData.maklumatElaun.length === 0">
                    <td colspan="5" class="p-6 text-center text-gray-500">Tiada elaun ditetapkan untuk kategori ini</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Elaun Khas -->
          <div v-if="allowanceData.maklumatElaunKhas && allowanceData.maklumatElaunKhas.length > 0">
            <h4 class="text-md font-semibold text-gray-900 mb-4">Elaun Khas</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Jenis Elaun</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Kategori PA</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Amaun (RM)</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Bajet</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Target KPI</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                    <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(elaunKhas, index) in allowanceData.maklumatElaunKhas" :key="index">
                    <td class="p-3 border text-sm text-gray-900">{{ elaunKhas.jenis }}</td>
                    <td class="p-3 border text-sm text-gray-900">{{ elaunKhas.kategoriPA }}</td>
                    <td class="p-3 border text-sm text-gray-900 font-semibold">RM {{ elaunKhas.amaun }}</td>
                    <td class="p-3 border text-sm text-gray-900 font-mono">{{ elaunKhas.kod }}</td>
                    <td class="p-3 border text-sm text-gray-900">{{ elaunKhas.targetKPI }}</td>
                    <td class="p-3 border">
                      <rs-badge :variant="elaunKhas.status === 'AKTIF' ? 'success' : 'secondary'" size="sm">
                        {{ elaunKhas.status }}
                      </rs-badge>
                    </td>
                    <td class="p-3 border text-sm text-gray-900">{{ elaunKhas.tarikh ? formatDate(elaunKhas.tarikh) : 'Belum ditetapkan' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

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
                    <p><strong>Catatan:</strong> Sokongan diberikan untuk elaun penolong amil kategori {{ categoryData.kategoriPenolongAmil }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ketua Jabatan Review -->
            <div class="flex items-start justify-between p-4">
              <div class="flex items-start">
                <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-900">Ketua Jabatan</h4>
                    <rs-badge variant="success">Selesai</rs-badge>
                  </div>
                  <p class="text-sm text-gray-700 mb-2">Pengesahan ketua jabatan</p>
                  <div class="text-xs text-gray-600 space-y-1">
                    <p><strong>Disemak oleh:</strong> Prof. Dr. Ismail bin Ahmad (Ketua Jabatan)</p>
                    <p><strong>Tarikh:</strong> 20-01-2024 14:15</p>
                    <p><strong>Catatan:</strong> Elaun disahkan dan layak untuk kelulusan ketua divisyen</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ketua Divisyen Review (Current) -->
            <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div class="flex items-start">
                <Icon name="ph:star" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-orange-900">Ketua Divisyen</h4>
                    <rs-badge variant="warning">Dalam Proses</rs-badge>
                  </div>
                  <p class="text-sm text-orange-700 mb-2">Kelulusan akhir ketua divisyen</p>
                  <div class="text-xs text-orange-600 space-y-1">
                    <p><strong>Disemak oleh:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
                    <p><strong>Tarikh:</strong> {{ currentDate }}</p>
                    <p><strong>Status:</strong> Menunggu keputusan kelulusan akhir</p>
                  </div>
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
        @click="navigateTo('/BF-PA/KF/KE')"
        class="flex items-center"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
      
      <!-- Action buttons removed - this is a view-only screen -->
    </div>

    <!-- Jejak Audit (Disabled)
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
                {{ allowanceData.maklumatPegawai.diciptaOleh }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Cipta</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ formatDate(allowanceData.maklumatPegawai.tarikhCipta) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Dikemaskini Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ allowanceData.maklumatPegawai.dikemaskiniBoleh || 'Belum dikemaskini' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kemaskini</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ allowanceData.maklumatPegawai.tarikhKemaskini ? formatDate(allowanceData.maklumatPegawai.tarikhKemaskini) : 'Belum dikemaskini' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Disahkan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ allowanceData.maklumatPegawai.disahkanOleh || 'Belum disahkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Pengesahan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ allowanceData.maklumatPegawai.tarikhPengesahan ? formatDate(allowanceData.maklumatPegawai.tarikhPengesahan) : 'Belum disahkan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Diluluskan Oleh</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ allowanceData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">Tarikh Kelulusan</label>
              <div class="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600">
                {{ allowanceData.maklumatPegawai.tarikhKelulusan ? formatDate(allowanceData.maklumatPegawai.tarikhKelulusan) : 'Belum diluluskan' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
    -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";

const route = useRoute();

definePageMeta({
  title: "Paparan Terperinci Elaun Penolong Amil",
});

// Breadcrumb
const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Elaun', path: '/BF-PA/KF/KE' },
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

// Enhanced allowance data matching our new structure
const allowanceData = ref({
  rujukan: "KE-2024-001",
  status: "Aktif", // Current overall status
  maklumatElaun: [
    {
      jenis: 'Elaun Bancian Baru : per borang permohonan',
      amaun: 30,
      kod: 'B34106',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    },
    {
      jenis: 'Elaun Kemaskini/permohonan bantuan : per borang',
      amaun: 20,
      kod: 'B34106',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    },
    {
      jenis: 'Elaun Tahunan KPAK',
      amaun: 500,
      kod: 'B34107',
      status: 'AKTIF',
      tarikh: '2025-01-01'
    }
  ],
  maklumatElaunKhas: [
    {
      jenis: 'KHAS - 48 AKTIVITI/TAHUN',
      kategoriPA: 'PAF',
      amaun: 400,
      kod: 'B31702',
      status: 'AKTIF',
      tarikh: '2025-01-01',
      targetKPI: 48
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
  const status = allowanceData.value.status;
  
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
  const status = allowanceData.value.status;
  
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
  const status = allowanceData.value.status;
  
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
  const status = allowanceData.value.status;
  
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
  const status = allowanceData.value.status;
  
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
  const status = allowanceData.value.status;
  const descriptions = {
    'Aktif': 'Elaun telah diluluskan sepenuhnya dan berkuatkuasa dalam sistem',
    'Menunggu Pengesahan': 'Elaun sedang menunggu pengesahan dari Ketua Jabatan',
    'Menunggu Kelulusan': 'Elaun sedang menunggu kelulusan akhir dari Ketua Divisyen',
    'Tidak Aktif': 'Elaun telah ditolak atau dinyahaktifkan'
  };
  return descriptions[status] || 'Status tidak diketahui';
};

// Action methods removed - not needed for view-only screen

onMounted(() => {
  // Fetch allowance data from API in real app
      // Loading detailed allowance data
});
</script> 