<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Penukar Peranan Halaman Khusus -->
    <div class="px-4 py-2 mt-0">
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <Icon name="ic:baseline-account-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <select
          v-model="currentRole"
          @change="handleRoleChange"
          class="py-1.5 px-3 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option 
            v-for="option in roleOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Elaun Tugasan
          </h2>
          <rs-button 
            variant="primary" 
            @click="navigateTo('/BF-PA/PE/AB2/01')"
          >
            <Icon name="ic:baseline-add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Bahagian Carian dan Penapis -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No. Batch atau Institusi"
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="performSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
          </div>

          <!-- Bahagian Jadual Bertab -->
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="batch in getTableDataByStatus(getSedangProsesStatuses())" :key="batch.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <a 
                            href="#" 
                            class="text-blue-600 hover:text-blue-800"
                            @click.prevent="navigateTo(getActionRoute(batch.status))"
                          >
                            {{ batch.noBatch }}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.institusi }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.kategori }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusColor(batch.status)"
                          >
                            {{ getStatusLabel(batch.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              @click="navigateTo(getActionRoute(batch.status))"
                              :title="getActionButtonText(batch.status)"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                            <button
                              v-if="shouldShowSemakButton(batch.status)"
                              @click="navigateTo(getSemakRoute())"
                              title="Semak"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Advice</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="batch in getTableDataByStatus(['Lulus'])" :key="batch.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <a 
                            href="#" 
                            class="text-blue-600 hover:text-blue-800"
                            @click.prevent="navigateTo(getActionRoute(batch.status))"
                          >
                            {{ batch.noBatch }}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.institusi }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.kategori }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusColor(batch.status)"
                          >
                            {{ getStatusLabel(batch.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div v-if="batch.paymentAdviceStatus" class="space-y-1">
                            <div class="flex items-center space-x-2">
                              <span
                                class="px-2 py-1 text-xs font-medium rounded-full"
                                :class="getPaymentAdviceStatusColor(batch.paymentAdviceStatus)"
                              >
                                {{ batch.paymentAdviceStatus }}
                              </span>
                            </div>
                            <div v-if="batch.paymentAdviceNo" class="text-xs text-gray-600">
                              {{ batch.paymentAdviceNo }}
                            </div>
                            <div v-if="batch.sapStatus" class="text-xs" :class="getSapStatusColor(batch.sapStatus)">
                              {{ batch.sapStatus }}
                            </div>
                          </div>
                          <span v-else class="text-xs text-gray-400">-</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              @click="navigateTo(getActionRoute(batch.status))"
                              :title="getActionButtonText(batch.status)"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                            <button
                              v-if="shouldShowSemakButton(batch.status)"
                              @click="navigateTo(getSemakRoute())"
                              title="Semak"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-primary" />
                            </button>
                            <button
                              v-if="shouldShowRegenerateButton(batch)"
                              @click="regeneratePaymentAdvice(batch)"
                              title="Jana Semula Payment Advice"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-refresh" class="w-5 h-5 text-orange-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Ditolak">
              <div class="p-4">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="batch in getTableDataByStatus(['Ditolak'])" :key="batch.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <a 
                            href="#" 
                            class="text-blue-600 hover:text-blue-800"
                            @click.prevent="navigateTo(getActionRoute(batch.status))"
                          >
                            {{ batch.noBatch }}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.institusi }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.kategori }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusColor(batch.status)"
                          >
                            {{ getStatusLabel(batch.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div class="flex items-center justify-end gap-2">
                            <button
                              @click="navigateTo(getActionRoute(batch.status))"
                              :title="getActionButtonText(batch.status)"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

definePageMeta({
  title: "Elaun Tugasan",
  description: "Pengurusan elaun tugasan untuk penolong amil",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tugasan",
    type: "current",
    path: "/BF-PA/PE/AB2",
  },
]);

// Simulasi peranan
const currentRole = ref('eksekutif');

// Pengurusan tab
const activeTab = ref("Sedang Proses");
const tableKey = ref(0);

// Keadaan carian dan penapis
const searchQuery = ref('');
const isSearchPerformed = ref(false);

const roleOptions = [
  { label: 'Eksekutif', value: 'eksekutif' },
  { label: 'Ketua Jabatan', value: 'ketua-jabatan' },
  { label: 'Ketua Divisyen', value: 'ketua-divisyen' },
];

const roleData = {
  eksekutif: {
    name: 'Eksekutif',
    description: 'Penciptaan dan pengurusan asas elaun',
    capabilities: ['Cipta elaun', 'Semak status', 'Kemaskini maklumat'],
    variant: 'primary'
  },
  'ketua-jabatan': {
    name: 'Ketua Jabatan',
    description: 'Semakan dan kelulusan elaun',
    capabilities: ['Semak elaun', 'Sokong elaun', 'Hantar untuk kelulusan'],
    variant: 'warning'
  },
  'ketua-divisyen': {
    name: 'Ketua Divisyen',
    description: 'Kelulusan akhir dan pengesahan',
    capabilities: ['Kelulusan akhir', 'Pengesahan pembayaran', 'Laporan'],
    variant: 'success'
  }
};

// Data mock untuk batch dengan status aliran kerja lengkap
const batches = ref([
  {
    id: 1,
    noBatch: 'BATCH/2024/001',
    institusi: 'Masjid Al-Hidayah',
    kategori: 'Kariah',
    status: 'Menunggu Pengesahan',
    tarikhCipta: '2024-03-15',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 2,
    noBatch: 'BATCH/2024/002',
    institusi: 'Masjid Al-Ikhlas',
    kategori: 'Kariah',
    status: 'Menunggu Pengesahan',
    tarikhCipta: '2024-03-16',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 3,
    noBatch: 'BATCH/2024/003',
    institusi: 'Masjid Al-Amin',
    kategori: 'Kariah',
    status: 'Menunggu Kelulusan',
    tarikhCipta: '2024-03-10',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 4,
    noBatch: 'BATCH/2024/004',
    institusi: 'Masjid Al-Falah',
    kategori: 'Kariah',
    status: 'Lulus',
    tarikhCipta: '2024-03-12',
    paymentAdviceStatus: 'Berjaya',
    paymentAdviceNo: 'PA/2024/001',
    sapStatus: 'Sudah Dihantar ke SAP'
  },
  {
    id: 5,
    noBatch: 'BATCH/2024/005',
    institusi: 'Masjid Al-Muttaqin',
    kategori: 'Kariah',
    status: 'Ditolak',
    tarikhCipta: '2024-03-18',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  // NEW: Additional batches for better status distribution and variety
  {
    id: 6,
    noBatch: 'BATCH/2024/006',
    institusi: 'Masjid Negeri Selangor',
    kategori: 'Fitrah',
    status: 'Menunggu Pengesahan',
    tarikhCipta: '2024-03-20',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 7,
    noBatch: 'BATCH/2024/007',
    institusi: 'Masjid Kg Delek',
    kategori: 'Komuniti',
    status: 'Menunggu Kelulusan',
    tarikhCipta: '2024-03-22',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 8,
    noBatch: 'BATCH/2024/008',
    institusi: 'Masjid Al-Khairiyah',
    kategori: 'Padi',
    status: 'Lulus',
    tarikhCipta: '2024-03-25',
    paymentAdviceStatus: 'Berjaya',
    paymentAdviceNo: 'PA/2024/002',
    sapStatus: 'Sudah Dihantar ke SAP'
  },
  {
    id: 9,
    noBatch: 'BATCH/2024/009',
    institusi: 'Masjid Al-Rahman',
    kategori: 'Fitrah',
    status: 'Ditolak',
    tarikhCipta: '2024-03-28',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 10,
    noBatch: 'BATCH/2024/010',
    institusi: 'Masjid Al-Mustaqim',
    kategori: 'Kariah',
    status: 'Menunggu Pengesahan',
    tarikhCipta: '2024-04-01',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 11,
    noBatch: 'BATCH/2024/011',
    institusi: 'Masjid Al-Huda',
    kategori: 'Komuniti',
    status: 'Menunggu Kelulusan',
    tarikhCipta: '2024-04-03',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 12,
    noBatch: 'BATCH/2024/012',
    institusi: 'Masjid Al-Iman',
    kategori: 'Padi',
    status: 'Lulus',
    tarikhCipta: '2024-04-05',
    paymentAdviceStatus: 'Gagal',
    paymentAdviceNo: 'PA/2024/003',
    sapStatus: 'Gagal Dihantar ke SAP'
  },
  {
    id: 13,
    noBatch: 'BATCH/2024/013',
    institusi: 'Masjid Al-Taqwa',
    kategori: 'Fitrah',
    status: 'Ditolak',
    tarikhCipta: '2024-04-08',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 14,
    noBatch: 'BATCH/2024/014',
    institusi: 'Masjid Al-Salam',
    kategori: 'Kariah',
    status: 'Menunggu Pengesahan',
    tarikhCipta: '2024-04-10',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  },
  {
    id: 15,
    noBatch: 'BATCH/2024/015',
    institusi: 'Masjid Al-Nur',
    kategori: 'Komuniti',
    status: 'Menunggu Kelulusan',
    tarikhCipta: '2024-04-12',
    paymentAdviceStatus: null,
    paymentAdviceNo: null,
    sapStatus: null
  }
]);





// Fungsi berasaskan peranan
const getRoleLabel = (role) => {
  return roleData[role]?.name || role;
};



const getRoleVariant = (role) => {
  return roleData[role]?.variant || 'secondary';
};







const getFilteredBatches = () => {
  let filtered = batches.value.filter(batch => {
    const matchesSearch = !searchQuery.value || 
      batch.noBatch.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      batch.institusi.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesSearch;
  });

  // Penapisan berasaskan peranan
  if (currentRole.value === 'eksekutif') {
    // Eksekutif boleh melihat semua batch
    return filtered;
  } else if (currentRole.value === 'ketua-jabatan') {
    // Ketua Jabatan boleh melihat batch yang memerlukan perhatian mereka atau telah melalui tahap mereka
    return filtered.filter(batch => 
      ['Menunggu Pengesahan', 'Menunggu Kelulusan', 'Lulus', 'Ditolak'].includes(batch.status)
    );
  } else if (currentRole.value === 'ketua-divisyen') {
    // Ketua Divisyen hanya boleh melihat batch yang memerlukan kelulusan akhir atau telah diproses
    return filtered.filter(batch => 
      ['Menunggu Kelulusan', 'Lulus', 'Ditolak'].includes(batch.status)
    );
  }

  return filtered;
};

// Tapis data jadual berdasarkan status
const getTableDataByStatus = (statuses) => {
  let result = getFilteredBatches().filter(batch => 
    statuses.includes(batch.status)
  );
  
  // Hanya gunakan penapis jika carian telah dilakukan
  if (isSearchPerformed.value) {
    // Gunakan penapis carian
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(batch => 
        batch.noBatch.toLowerCase().includes(query) ||
        batch.institusi.toLowerCase().includes(query)
      );
    }
  }
  
  return result;
};

// Batch yang ditapis dikira
const filteredBatches = computed(() => {
  return getFilteredBatches();
});

// Fungsi pembantu
const getStatusVariant = (status) => {
  switch (status) {
    case 'Menunggu Pengesahan':
      return 'warning'
    case 'Menunggu Kelulusan':
      return 'info'
    case 'Lulus':
      return 'success'
    case 'Ditolak':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Menunggu Pengesahan':
      return 'bg-blue-100 text-blue-800'
    case 'Menunggu Kelulusan':
      return 'bg-purple-100 text-purple-800'
    case 'Lulus':
      return 'bg-green-100 text-green-800'
    case 'Ditolak':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentAdviceStatusColor = (status) => {
  switch (status) {
    case 'Berjaya':
      return 'bg-green-100 text-green-800'
    case 'Gagal':
      return 'bg-red-100 text-red-800'
    case 'Dalam Proses':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getSapStatusColor = (status) => {
  switch (status) {
    case 'Sudah Dihantar ke SAP':
      return 'text-green-600'
    case 'Gagal Dihantar ke SAP':
      return 'text-red-600'
    case 'Menunggu Penghantaran':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'Menunggu Pengesahan':
      return 'Menunggu Pengesahan'
    case 'Menunggu Kelulusan':
      return 'Menunggu Kelulusan'
    case 'Lulus':
      return 'Lulus'
    case 'Ditolak':
      return 'Ditolak'
    default:
      return status
  }
}

const getActionRoute = (status) => {
  switch (status) {
    case 'Menunggu Pengesahan':
      return '/BF-PA/PE/AB2/05?status=Menunggu Pengesahan'  // View page
    case 'Menunggu Kelulusan':
      return '/BF-PA/PE/AB2/05?status=Menunggu Kelulusan'  // View page
    case 'Lulus':
      return '/BF-PA/PE/AB2/04'  // View page
    case 'Ditolak':
      return '/BF-PA/PE/AB2/07'  // View page
    default:
      return '#'
  }
}

const getActionButtonText = (status) => {
  switch (status) {
    case 'Menunggu Pengesahan':
    case 'Menunggu Kelulusan':
      return 'Semak'
    case 'Lulus':
    case 'Ditolak':
      return 'Lihat'
    default:
      return 'Lihat'
  }
}

// New functions for Semak button
const shouldShowSemakButton = (status) => {
  if (currentRole.value === 'ketua-jabatan') {
    return status === 'Menunggu Pengesahan';
  } else if (currentRole.value === 'ketua-divisyen') {
    return status === 'Menunggu Kelulusan';
  }
  return false;
}

const getSemakRoute = () => {
  if (currentRole.value === 'ketua-jabatan') {
    return '/BF-PA/PE/AB2/03';
  } else if (currentRole.value === 'ketua-divisyen') {
    return '/BF-PA/PE/AB2/06';
  }
  return '#';
}

const getSedangProsesStatuses = () => {
  if (currentRole.value === 'ketua-jabatan') {
    return ['Menunggu Pengesahan'];
  } else if (currentRole.value === 'ketua-divisyen') {
    return ['Menunggu Kelulusan'];
  }
  return ['Menunggu Pengesahan', 'Menunggu Kelulusan'];
}

// Payment Advice regeneration functions
const shouldShowRegenerateButton = (batch) => {
  return batch.status === 'Lulus' && batch.paymentAdviceStatus === 'Gagal';
}

const regeneratePaymentAdvice = async (batch) => {
  try {
    // Show loading state
    batch.paymentAdviceStatus = 'Dalam Proses';
    batch.sapStatus = 'Menunggu Penghantaran';
    
    // Mock API call to regenerate Payment Advice
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success/failure (80% success rate for demo)
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      batch.paymentAdviceStatus = 'Berjaya';
      batch.sapStatus = 'Sudah Dihantar ke SAP';
      // Show success notification
      console.log(`Payment Advice regenerated successfully for ${batch.noBatch}`);
    } else {
      batch.paymentAdviceStatus = 'Gagal';
      batch.sapStatus = 'Gagal Dihantar ke SAP';
      // Show error notification
      console.log(`Payment Advice regeneration failed for ${batch.noBatch}`);
    }
  } catch (error) {
    batch.paymentAdviceStatus = 'Gagal';
    batch.sapStatus = 'Gagal Dihantar ke SAP';
    console.error('Error regenerating Payment Advice:', error);
  }
}

// Fungsi carian
const performSearch = () => {
  if (!searchQuery.value) {
    // Anda boleh menambah notifikasi toast di sini jika diperlukan
    return;
  }
  
  isSearchPerformed.value = true;
  refreshTable();
};



const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Paksa jadual untuk di-render semula
  });
};

// Pengendali acara
const handleSearch = (event) => {
  searchQuery.value = event.target.value;
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 