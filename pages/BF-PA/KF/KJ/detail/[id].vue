<!-- 
  RTMF SCREEN: PA-KF-KJ-04_01 (Position Detail)
  PURPOSE: Paparan terperinci maklumat jawatan penolong amil
  DESCRIPTION: Read-only detailed view of a Penolong Amil position
  ROUTE: /BF-PA/KF/KJ/detail/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold flex items-center">
              <Icon name="ph:file-text" class="mr-2" size="24" />
              Paparan Terperinci Jawatan Penolong Amil
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Maklumat lengkap jawatan untuk kategori: {{ categoryData.kategoriPenolongAmil }}
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Category Context Section -->
        <rs-card class="mb-6 bg-gray-50 border-gray-300">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:tag" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Maklumat Kategori</h3>
            </div>
          </template>
          
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Penolong Amil</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ categoryData.kategoriPenolongAmil }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kod Singkatan Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ categoryData.kodSingkatan }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  <rs-badge :variant="getStatusVariant(categoryData.status)">
                    {{ categoryData.status }}
                  </rs-badge>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kuatkuasa Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ formatDate(categoryData.tarikhKuatkuasa) }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rujukan Jawatan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ positionData.rujukan }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Position Details Section -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:identification-card" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Maklumat Jawatan</h3>
            </div>
          </template>
          
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Jawatan</label>
                <div class="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 font-medium">
                  {{ positionData.namaJawatan }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kod Singkatan Jawatan</label>
                <div class="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 font-medium">
                  {{ positionData.kodSingkatan }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Jawatan</label>
                <div class="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900">
                  <rs-badge :variant="getStatusVariant(positionData.status)">
                    {{ positionData.status }}
                  </rs-badge>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kuatkuasa Jawatan</label>
                <div class="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900">
                  {{ formatDate(positionData.tarikhKuatkuasa) || 'Belum ditetapkan' }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Enhanced Workflow Status -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:flow-arrow" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Status Aliran Kerja Kelulusan</h3>
            </div>
          </template>
          
          <template #body>
            <div class="space-y-4">
              <!-- Workflow Steps -->
              <div class="flex items-center justify-between space-x-4">
                <!-- Step 1: Eksekutif -->
                <div class="flex flex-col items-center flex-1">
                  <div :class="getWorkflowStepClass('eksekutif')" class="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <Icon :name="getWorkflowStepIcon('eksekutif')" class="w-6 h-6 text-white" />
                  </div>
                  <div class="text-sm font-medium text-gray-900">Eksekutif</div>
                  <div class="text-xs text-gray-500 text-center">{{ getWorkflowStepStatus('eksekutif') }}</div>
                  <div class="text-xs text-gray-400 mt-1 text-center">{{ getWorkflowStepDescription('eksekutif') }}</div>
                </div>

                <!-- Arrow 1 -->
                <div class="flex-shrink-0">
                  <Icon name="ph:arrow-right" class="w-5 h-5 text-gray-400" />
                </div>

                <!-- Step 2: Ketua Jabatan -->
                <div class="flex flex-col items-center flex-1">
                  <div :class="getWorkflowStepClass('ketua-jabatan')" class="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <Icon :name="getWorkflowStepIcon('ketua-jabatan')" class="w-6 h-6 text-white" />
                  </div>
                  <div class="text-sm font-medium text-gray-900">Ketua Jabatan</div>
                  <div class="text-xs text-gray-500 text-center">{{ getWorkflowStepStatus('ketua-jabatan') }}</div>
                  <div class="text-xs text-gray-400 mt-1 text-center">{{ getWorkflowStepDescription('ketua-jabatan') }}</div>
                </div>

                <!-- Arrow 2 -->
                <div class="flex-shrink-0">
                  <Icon name="ph:arrow-right" class="w-5 h-5 text-gray-400" />
                </div>

                <!-- Step 3: Ketua Divisyen -->
                <div class="flex flex-col items-center flex-1">
                  <div :class="getWorkflowStepClass('ketua-divisyen')" class="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                    <Icon :name="getWorkflowStepIcon('ketua-divisyen')" class="w-6 h-6 text-white" />
                  </div>
                  <div class="text-sm font-medium text-gray-900">Ketua Divisyen</div>
                  <div class="text-xs text-gray-500 text-center">{{ getWorkflowStepStatus('ketua-divisyen') }}</div>
                  <div class="text-xs text-gray-400 mt-1 text-center">{{ getWorkflowStepDescription('ketua-divisyen') }}</div>
                </div>
              </div>

              <!-- Current Status Summary -->
              <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <div class="text-sm font-medium text-blue-900">Status Semasa: {{ positionData.status }}</div>
                    <div class="text-xs text-blue-700 mt-1">{{ getCurrentStatusDescription() }}</div>
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
          
          <div class="flex space-x-3">
            <!-- Eksekutif: Edit if active or inactive -->
            <rs-button
              v-if="canEditPosition()"
              variant="secondary"
              @click="editPosition()"
              class="flex items-center"
            >
              <Icon name="ph:pencil" class="w-4 h-4 mr-2" />
              Kemaskini
            </rs-button>

            <!-- Ketua Jabatan: Verify if pending verification -->
            <rs-button
              v-if="canVerifyPosition()"
              variant="warning"
              @click="verifyPosition()"
              class="flex items-center"
            >
              <Icon name="ph:clipboard-text" class="w-4 h-4 mr-2" />
              Sahkan
            </rs-button>

            <!-- Ketua Divisyen: Approve if pending approval -->
            <rs-button
              v-if="canApprovePosition()"
              variant="success"
              @click="approvePosition()"
              class="flex items-center"
            >
              <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
              Luluskan
            </rs-button>
          </div>
        </div>

        <!-- Audit Trail Section (Positioned at bottom) -->
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
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { formatDate } from "~/utils/dateFormatter";

definePageMeta({
  title: "Paparan Terperinci Jawatan Penolong Amil",
});

const route = useRoute();
const positionId = route.params.id;

const breadcrumb = [
  { label: 'Laman Utama', to: '/' },
  { label: 'Modul BF-PA', to: '/BF-PA' },
  { label: 'Konfigurasi', to: '/BF-PA/KF' },
  { label: 'Maklumat Jawatan', to: '/BF-PA/KF/KJ' },
  { label: 'Paparan Terperinci', to: null }
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

// Mock current user role
const currentRole = ref("eksekutif"); // This would come from auth system

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
const getWorkflowStepClass = (role) => {
  const status = positionData.value.status;
  
  if (role === 'eksekutif') {
    return 'bg-green-500'; // Always completed for created items
  } else if (role === 'ketua-jabatan') {
    if (status === 'Menunggu Pengesahan') return 'bg-yellow-500'; // In progress
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'bg-green-500'; // Completed
    if (status === 'Tidak Aktif') return 'bg-red-500'; // Rejected
    return 'bg-gray-300'; // Not started
  } else if (role === 'ketua-divisyen') {
    if (status === 'Menunggu Kelulusan') return 'bg-blue-500'; // In progress
    if (status === 'Aktif') return 'bg-green-500'; // Completed (approved)
    if (status === 'Tidak Aktif') return 'bg-red-500'; // Rejected
    return 'bg-gray-300'; // Not started
  }
  return 'bg-gray-300';
};

const getWorkflowStepIcon = (role) => {
  const status = positionData.value.status;
  
  if (role === 'eksekutif') {
    return 'ph:check';
  } else if (role === 'ketua-jabatan') {
    if (status === 'Menunggu Pengesahan') return 'ph:clock';
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'ph:check';
    if (status === 'Tidak Aktif') return 'ph:x';
    return 'ph:minus';
  } else if (role === 'ketua-divisyen') {
    if (status === 'Menunggu Kelulusan') return 'ph:clock';
    if (status === 'Aktif') return 'ph:check';
    if (status === 'Tidak Aktif') return 'ph:x';
    return 'ph:minus';
  }
  return 'ph:minus';
};

const getWorkflowStepStatus = (role) => {
  const status = positionData.value.status;
  
  if (role === 'eksekutif') {
    return 'Selesai';
  } else if (role === 'ketua-jabatan') {
    if (status === 'Menunggu Pengesahan') return 'Dalam Proses';
    if (status === 'Menunggu Kelulusan' || status === 'Aktif') return 'Selesai';
    if (status === 'Tidak Aktif') return 'Ditolak';
    return 'Belum Mula';
  } else if (role === 'ketua-divisyen') {
    if (status === 'Menunggu Kelulusan') return 'Dalam Proses';
    if (status === 'Aktif') return 'Diluluskan';
    if (status === 'Tidak Aktif') return 'Ditolak';
    return 'Belum Mula';
  }
  return 'Belum Mula';
};

const getWorkflowStepDescription = (role) => {
  if (role === 'eksekutif') {
    return 'Jawatan dicipta dan disokong';
  } else if (role === 'ketua-jabatan') {
    return 'Pengesahan jawatan';
  } else if (role === 'ketua-divisyen') {
    return 'Kelulusan akhir jawatan';
  }
  return '';
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

// Role-based action permissions
const canEditPosition = () => {
  return currentRole.value === "eksekutif" && 
         (positionData.value.status === "Aktif" || positionData.value.status === "Tidak Aktif");
};

const canVerifyPosition = () => {
  return currentRole.value === "ketua-jabatan" && 
         positionData.value.status === "Menunggu Pengesahan";
};

const canApprovePosition = () => {
  return currentRole.value === "ketua-divisyen" && 
         positionData.value.status === "Menunggu Kelulusan";
};

// Navigation methods
const editPosition = () => {
  navigateTo(`/BF-PA/KF/KJ/edit/${positionId}`);
};

const verifyPosition = () => {
  navigateTo(`/BF-PA/KF/KJ/verify/${positionId}`);
};

const approvePosition = () => {
  navigateTo(`/BF-PA/KF/KJ/approve/${positionId}`);
};
</script> 