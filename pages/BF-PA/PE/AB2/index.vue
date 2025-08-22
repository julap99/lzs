<template>
  <div>
    <!-- Page-specific Role Switcher -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
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
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="toggleRoleInfo"
            :class="{ 'bg-blue-100 text-blue-700 border-blue-300': showRoleInfo }"
            class="!px-3 !py-1.5 !text-sm !whitespace-nowrap"
          >
            <Icon name="ph:eye" class="w-3 h-3 mr-1" />
            {{ showRoleInfo ? 'Sembunyi' : 'Tunjuk' }}
          </rs-button>
        </div>
      </div>
      
      <div v-if="showRoleInfo" class="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Peranan Semasa:</h4>
            <div class="flex items-center space-x-3">
              <rs-badge :variant="getRoleVariant(currentRole)" class="!text-xs">
                {{ getRoleLabel(currentRole) }}
              </rs-badge>
              <span class="text-xs text-gray-600">{{ getRoleDescription(currentRole) }}</span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Kebolehan:</h4>
            <div class="flex flex-wrap gap-2">
              <rs-badge
                v-for="capability in getRoleCapabilities(currentRole)"
                :key="capability"
                variant="secondary"
                size="sm"
                class="!text-xs"
              >
                {{ capability }}
              </rs-badge>
            </div>
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
          <!-- Search and Filter Section -->
          <div class="mb-6">
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari Batch No atau Institusi"
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
                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
              <rs-button
                variant="secondary-outline"
                @click="clearSearch"
                class="flex items-center whitespace-nowrap"
              >
                <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
                Set Semula
              </rs-button>
            </div>
          </div>

          <!-- Tabbed Table Section -->
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai elaun yang sedang dalam proses (Menunggu Pengesahan & Kelulusan)
                </h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch No</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
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
                            {{ batch.batchNo }}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.institution }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.category }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusColor(batch.status)"
                          >
                            {{ getStatusLabel(batch.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <rs-button
                            variant="primary"
                            size="sm"
                            @click="navigateTo(getActionRoute(batch.status))"
                          >
                            {{ getActionButtonText(batch.status) }}
                          </rs-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>



            <rs-tab-item title="Diluluskan">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah diluluskan
                </h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch No</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
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
                            {{ batch.batchNo }}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.institution }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.category }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusColor(batch.status)"
                          >
                            {{ getStatusLabel(batch.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <rs-button
                            variant="primary"
                            size="sm"
                            @click="navigateTo(getActionRoute(batch.status))"
                          >
                            {{ getActionButtonText(batch.status) }}
                          </rs-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Ditolak">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah ditolak
                </h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch No</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
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
                            {{ batch.batchNo }}
                          </a>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.institution }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ batch.category }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="getStatusColor(batch.status)"
                          >
                            {{ getStatusLabel(batch.status) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <rs-button
                            variant="primary"
                            size="sm"
                            @click="navigateTo(getActionRoute(batch.status))"
                          >
                            {{ getActionButtonText(batch.status) }}
                          </rs-button>
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

// Role simulation
const currentRole = ref('eksekutif');
const showRoleInfo = ref(false);

// Tab management
const activeTab = ref("Sedang Proses");
const tableKey = ref(0);

// Search and filter state
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

// Mock data for batches with complete workflow statuses
const batches = ref([
  {
    id: 1,
    batchNo: 'BATCH/2024/001',
    institution: 'Masjid Al-Hidayah',
    category: 'Kariah',
    status: 'Menunggu Pengesahan',
    createdAt: '2024-03-15'
  },
  {
    id: 2,
    batchNo: 'BATCH/2024/002',
    institution: 'Masjid Al-Ikhlas',
    category: 'Kariah',
    status: 'Menunggu Pengesahan',
    createdAt: '2024-03-16'
  },
  {
    id: 3,
    batchNo: 'BATCH/2024/003',
    institution: 'Masjid Al-Amin',
    category: 'Kariah',
    status: 'Menunggu Kelulusan',
    createdAt: '2024-03-10'
  },
  {
    id: 4,
    batchNo: 'BATCH/2024/004',
    institution: 'Masjid Al-Falah',
    category: 'Kariah',
    status: 'Diluluskan',
    createdAt: '2024-03-12'
  },
  {
    id: 5,
    batchNo: 'BATCH/2024/005',
    institution: 'Masjid Al-Muttaqin',
    category: 'Kariah',
    status: 'Ditolak',
    createdAt: '2024-03-18'
  }
]);

// Complete status options for the verification workflow
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu Pengesahan', value: 'Menunggu Pengesahan' },
  { label: 'Menunggu Kelulusan', value: 'Menunggu Kelulusan' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];



// Role-based functions
const getRoleLabel = (role) => {
  return roleData[role]?.name || role;
};

const getRoleDescription = (role) => {
  return roleData[role]?.description || '';
};

const getRoleCapabilities = (role) => {
  return roleData[role]?.capabilities || [];
};

const getRoleVariant = (role) => {
  return roleData[role]?.variant || 'secondary';
};

const handleRoleChange = () => {
  // Reset filters when role changes
  selectedStatus.value = '';
  showRoleInfo.value = false;
  refreshTable();
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
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
      batch.batchNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      batch.institution.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || batch.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });

  // Role-based filtering
  if (currentRole.value === 'eksekutif') {
    // Eksekutif can see all batches
    return filtered;
  } else if (currentRole.value === 'ketua-jabatan') {
    // Ketua Jabatan can see batches that need their attention or have passed their level
    return filtered.filter(batch => 
      ['Menunggu Pengesahan', 'Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(batch.status)
    );
  } else if (currentRole.value === 'ketua-divisyen') {
    // Ketua Divisyen can only see batches that need final approval or have been processed
    return filtered.filter(batch => 
      ['Menunggu Kelulusan', 'Diluluskan', 'Ditolak'].includes(batch.status)
    );
  }

  return filtered;
};

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = getFilteredBatches().filter(batch => 
    statuses.includes(batch.status)
  );
  
  // Only apply filters if search has been performed
  if (isSearchPerformed.value) {
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(batch => 
        batch.batchNo.toLowerCase().includes(query) ||
        batch.institution.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (selectedStatus.value) {
      result = result.filter(batch => 
        batch.status === selectedStatus.value
      );
    }
  }
  
  return result;
};

// Computed filtered batches
const filteredBatches = computed(() => {
  return getFilteredBatches();
});

// Helper functions
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

// Search functionality
const performSearch = () => {
  if (!searchQuery.value && !selectedStatus.value) {
    // You can add toast notification here if needed
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
    tableKey.value++; // Force table to re-render
  });
};

// Event handlers
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