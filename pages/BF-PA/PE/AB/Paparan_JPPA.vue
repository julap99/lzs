<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Elaun Penolong Amil (JPPA)
          </h2>
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
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Batch
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institusi
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarikh
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="batch in filteredBatches" :key="batch.id">
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
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Senarai Elaun Penolong Amil (JPPA)",
  description: "Senarai permohonan bantuan asnaf untuk semakan dan sokongan JPPA",
});

const breadcrumb = ref([
  {
    name: "Bancian/Asnaf",
    type: "link",
    path: "/BF-PA/PE/AB",
  },
  {
    name: "Senarai Elaun Penolong Amil (JPPA)",
    type: "current",
    path: "/BF-PA/PE/AB/Paparan_JPPA",
  },
]);

// Mock data for batches - only "Menunggu Sokongan JPPA" status
const batches = ref([
  {
    id: 1,
    batchNo: 'BATCH/2024/001',
    institution: 'Masjid Al-Hidayah',
    category: 'Kariah',
    status: 'Menunggu Sokongan JPPA',
    createdAt: '2024-03-15'
  },
  {
    id: 2,
    batchNo: 'BATCH/2024/005',
    institution: 'Masjid Al-Ikhlas',
    category: 'Kariah',
    status: 'Menunggu Sokongan JPPA',
    createdAt: '2024-03-17'
  },
  {
    id: 3,
    batchNo: 'BATCH/2024/008',
    institution: 'Masjid Al-Amin',
    category: 'Kariah',
    status: 'Menunggu Sokongan JPPA',
    createdAt: '2024-03-18'
  },
  {
    id: 4,
    batchNo: 'BATCH/2024/010',
    institution: 'Masjid Al-Falah',
    category: 'Kariah',
    status: 'Menunggu Sokongan JPPA',
    createdAt: '2024-03-19'
  }
]);

// Status options for filter
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu sokongan JPPA', value: 'Menunggu Sokongan JPPA' },
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

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return 'Menunggu Sokongan JPPA'
    default:
      return status
  }
}

const getActionRoute = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return '/BF-PA/PE/AB/02'
    default:
      return '#'
  }
}

const getActionButtonText = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return 'Semak'
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