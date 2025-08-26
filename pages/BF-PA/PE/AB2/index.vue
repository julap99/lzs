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
                      <tr v-for="batch in getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan'])" :key="batch.id">
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
                          <button
                            @click="navigateTo(getActionRoute(batch.status))"
                            :title="getActionButtonText(batch.status)"
                            class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Diluluskan">
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
                      <tr v-for="batch in getTableDataByStatus(['Diluluskan'])" :key="batch.id">
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
                          <button
                            @click="navigateTo(getActionRoute(batch.status))"
                            :title="getActionButtonText(batch.status)"
                            class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                          </button>
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
                          <button
                            @click="navigateTo(getActionRoute(batch.status))"
                            :title="getActionButtonText(batch.status)"
                            class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                          </button>
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
    tarikhCipta: '2024-03-15'
  },
  {
    id: 2,
    noBatch: 'BATCH/2024/002',
    institusi: 'Masjid Al-Ikhlas',
    kategori: 'Kariah',
    status: 'Menunggu Pengesahan',
    tarikhCipta: '2024-03-16'
  },
  {
    id: 3,
    noBatch: 'BATCH/2024/003',
    institusi: 'Masjid Al-Amin',
    kategori: 'Kariah',
    status: 'Menunggu Kelulusan',
    tarikhCipta: '2024-03-10'
  },
  {
    id: 4,
    noBatch: 'BATCH/2024/004',
    institusi: 'Masjid Al-Falah',
    kategori: 'Kariah',
    status: 'Lulus',
    tarikhCipta: '2024-03-12'
  },
  {
    id: 5,
    noBatch: 'BATCH/2024/005',
    institusi: 'Masjid Al-Muttaqin',
    kategori: 'Kariah',
    status: 'Ditolak',
    tarikhCipta: '2024-03-18'
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
      return '/BF-PA/PE/AB2/03'
    case 'Menunggu Kelulusan':
      return '/BF-PA/PE/AB2/06'
    case 'Lulus':
      return '/BF-PA/PE/AB2/04'
    case 'Ditolak':
      return '/BF-PA/PE/AB2/07'
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