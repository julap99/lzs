<template>
  <div>
    <!-- Penukar Peranan Halaman Khusus -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ic:baseline-account-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="min-w-[200px]">
            <FormKit
              type="select"
              v-model="currentRole"
              :options="roleOptions"
              :classes="{ 
                input: '!py-1.5 !px-3 text-sm !rounded-md !border-gray-300',
                wrapper: '!min-w-0'
              }"
              @change="handleRoleChange"
            />
          </div>
        </div>
      </div>
    </div>
    
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Elaun Tugasan
          </h2>
          <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/AB2/01')">Tambah Baru</rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Bahagian Carian dan Penapis -->
          <div class="mb-6">
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No. Batch atau Institusi"
                :classes="{
                  input: '!py-2',
                }"
                class="flex-1"
              />
              <FormKit
                v-model="selectedStatus"
                type="select"
                :options="getFilteredStatusOptions()"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
                class="min-w-[200px]"
              />
              <rs-button
                variant="primary"
                @click="performSearch"
                class="flex items-center whitespace-nowrap"
              >
                <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
              <rs-button
                variant="secondary-outline"
                @click="clearSearch"
                class="flex items-center whitespace-nowrap"
              >
                <Icon name="ic:baseline-refresh" class="w-4 h-4 mr-2" />
                Set Semula
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Batch</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="batch in getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan'])" :key="batch.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.id }}</td>
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Batch</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="batch in getTableDataByStatus(['Diluluskan'])" :key="batch.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.id }}</td>
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Batch</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="batch in getTableDataByStatus(['Ditolak'])" :key="batch.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.id }}</td>
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
const selectedStatus = ref('');
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
    status: 'Diluluskan',
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

// Pilihan status lengkap untuk aliran kerja pengesahan
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' },
  { label: 'Menunggu Kelulusan', value: 'Menunggu Kelulusan' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];



// Fungsi berasaskan peranan
const getRoleLabel = (role) => {
  return roleData[role]?.name || role;
};



const getRoleVariant = (role) => {
  return roleData[role]?.variant || 'secondary';
};

const handleRoleChange = () => {
  // Set semula penapis apabila peranan berubah
  selectedStatus.value = '';
  refreshTable();
};



// Role-based filtering
const getFilteredStatusOptions = () => {
  if (currentRole.value === 'eksekutif') {
    return statusOptions.filter(option => 
      ['Menunggu Pengesahan', 'Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(option.value)
    );
  } else if (currentRole.value === 'ketua-jabatan') {
    return statusOptions.filter(option => 
      ['Menunggu Pengesahan', 'Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(option.value)
    );
  } else if (currentRole.value === 'ketua-divisyen') {
    return statusOptions.filter(option => 
      ['Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(option.value)
    );
  }
  return statusOptions;
};

const getFilteredBatches = () => {
  let filtered = batches.value.filter(batch => {
    const matchesSearch = !searchQuery.value || 
      batch.noBatch.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      batch.institusi.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || batch.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });

  // Penapisan berasaskan peranan
  if (currentRole.value === 'eksekutif') {
    // Eksekutif boleh melihat semua batch
    return filtered;
  } else if (currentRole.value === 'ketua-jabatan') {
    // Ketua Jabatan boleh melihat batch yang memerlukan perhatian mereka atau telah melalui tahap mereka
    return filtered.filter(batch => 
      ['Menunggu Pengesahan', 'Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(batch.status)
    );
  } else if (currentRole.value === 'ketua-divisyen') {
    // Ketua Divisyen hanya boleh melihat batch yang memerlukan kelulusan akhir atau telah diproses
    return filtered.filter(batch => 
      ['Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(batch.status)
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
    
    // Gunakan penapis status
    if (selectedStatus.value) {
      result = result.filter(batch => 
        batch.status === selectedStatus.value
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
    case 'Diluluskan':
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
    case 'Diluluskan':
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
    case 'Diluluskan':
      return 'Diluluskan'
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
    case 'Diluluskan':
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
    case 'Diluluskan':
    case 'Ditolak':
      return 'Lihat'
    default:
      return 'Lihat'
  }
}

// Fungsi carian
const performSearch = () => {
  if (!searchQuery.value && !selectedStatus.value) {
    // Anda boleh menambah notifikasi toast di sini jika diperlukan
    return;
  }
  
  isSearchPerformed.value = true;
  refreshTable();
};

const clearSearch = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  isSearchPerformed.value = false;
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

const handleStatusChange = (event) => {
  selectedStatus.value = event.target.value;
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 