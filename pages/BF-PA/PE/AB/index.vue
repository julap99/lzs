<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Elaun Tugasan
          </h2>
          <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/AB/01')">Tambah Baru</rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Search and Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="search"
                placeholder="Cari Batch No atau Institusi"
                :value="searchQuery"
                @input="handleSearch"
              />
              <FormKit
                type="select"
                name="status"
                placeholder="Status"
                :options="statusOptions"
                :value="selectedStatus"
                @input="handleStatusChange"
              />
            </div>
          </div>

          <!-- Table Section -->
          <div class="space-y-8">
            <!-- Approved Items Table -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                <Icon name="heroicons:check-circle" class="mr-2" size="20" />
                Senarai elaun yang telah diluluskan
              </h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-green-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        No. Batch
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Institusi
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Tarikh
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="batch in approvedBatches" :key="batch.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          class="text-blue-600 hover:text-blue-800"
                          @click.prevent="navigateTo('/BF-PA/PE/AB/02/PA')"
                        >
                          {{ batch.batchNo }}
                        </a>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ batch.institution }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ batch.category }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ batch.createdAt }}
                      </td>
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
                          @click="navigateTo(getActionRoute(batch.status, batch.batchNo))"
                        >
                          {{ getActionButtonText(batch.status) }}
                        </rs-button>
                      </td>
                    </tr>
                    <tr v-if="approvedBatches.length === 0">
                      <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        Tiada data yang diluluskan
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Rejected Items Table -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                <Icon name="heroicons:x-circle" class="mr-2" size="20" />
                Senarai elaun yang telah ditolak
              </h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-red-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        No. Batch
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Institusi
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Tarikh
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="batch in rejectedBatches" :key="batch.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          class="text-blue-600 hover:text-blue-800"
                          @click.prevent="navigateTo('/BF-PA/PE/AB/02/PA')"
                        >
                          {{ batch.batchNo }}
                        </a>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ batch.institution }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ batch.category }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        {{ batch.createdAt }}
                      </td>
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
                          @click="navigateTo(getActionRoute(batch.status, batch.batchNo))"
                        >
                          {{ getActionButtonText(batch.status) }}
                        </rs-button>
                      </td>
                    </tr>
                    <tr v-if="rejectedBatches.length === 0">
                      <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        Tiada data yang ditolak
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Bancian/Asnaf Review/Bantuan",
  description: "Senarai permohonan bantuan asnaf untuk semakan dan kelulusan",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Review/Bantuan",
    type: "current",
    path: "/BF-PA/PE/AB",
  },
]);

// Mock data for batches
const batches = ref([
  {
    id: 1,
    batchNo: 'BATCH/2024/003',
    institution: 'Masjid Al-Amin',
    category: 'Kariah',
    status: 'Diluluskan',
    createdAt: '10-03-2024'
  },
  {
    id: 2,
    batchNo: 'BATCH/2024/004',
    institution: 'Masjid Al-Falah',
    category: 'Kariah',
    status: 'Ditolak',
    createdAt: '12-03-2024'
  },
  {
    id: 3,
    batchNo: 'BATCH/2024/007',
    institution: 'Masjid Kg Delek',
    category: 'Kariah',
    status: 'Diluluskan',
    createdAt: '14-03-2024'
  },
  {
    id: 4,
    batchNo: 'BATCH/2024/012',
    institution: 'Masjid Bandar Utama',
    category: 'Kariah',
    status: 'Ditolak',
    createdAt: '21-03-2024'
  }
]);

// Status options for filter
const statusOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

// Search and filter state
const searchQuery = ref('');
const selectedStatus = ref('');

// Computed filtered batches
const filteredBatches = computed(() => {
  return batches.value.filter(batch => {
    const matchesSearch = !searchQuery.value || 
      batch.batchNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      batch.institution.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || batch.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});

// Computed properties for separated tables
const approvedBatches = computed(() => {
  return filteredBatches.value.filter(batch => batch.status === 'Diluluskan');
});

const rejectedBatches = computed(() => {
  return filteredBatches.value.filter(batch => batch.status === 'Ditolak');
});

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return 'bg-yellow-100 text-yellow-800'
    case 'Menunggu Kelulusan Ketua JPPA':
      return 'bg-blue-100 text-blue-800'
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
    case 'Menunggu Sokongan JPPA':
      return 'Menunggu Sokongan JPPA'
    case 'Menunggu Kelulusan Ketua JPPA':
      return 'Menunggu Kelulusan Ketua JPPA'
    case 'Diluluskan':
      return 'Diluluskan'
    case 'Ditolak':
      return 'Ditolak'
    default:
      return status
  }
}

const getActionRoute = (status, batchNo) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return '/BF-PA/PE/AB/02'
    case 'Menunggu Kelulusan Ketua JPPA':
      return '/BF-PA/PE/AB/03'
    case 'Diluluskan':
      return `/BF-PA/PE/AB/view-lulus?id=${encodeURIComponent(batchNo)}`
    case 'Ditolak':
      return `/BF-PA/PE/AB/view-tolak?id=${encodeURIComponent(batchNo)}`
    default:
      return '#'
  }
}

const getActionButtonText = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
    case 'Menunggu Kelulusan Ketua JPPA':
      return 'Semak'
    case 'Diluluskan':
    case 'Ditolak':
      return 'Lihat'
    default:
      return 'Lihat'
  }
}

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