<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Bancian/Asnaf Review/Bantuan
          </h2>
          <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/AB/01')">Tambah Baru</rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Key Metrics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-600">Jumlah Penolong Amil</p>
                  <h3 class="text-2xl text-centerfont-bold text-blue-700">1,234</h3>
                </div>
                <Icon name="heroicons:users" class="text-blue-500" size="24" />
              </div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border border-green-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-600">Jumlah Elaun Yang Sudah Dibayar</p>
                  <h3 class="text-2xl font-bold text-green-700">856</h3>
                </div>
                <Icon name="heroicons:check-circle" class="text-green-500" size="24" />
              </div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-yellow-600">Jumlah Elaun Yang Masih Diproses</p>
                  <h3 class="text-2xl font-bold text-yellow-700">245</h3>
                </div>
                <Icon name="heroicons:clock" class="text-yellow-500" size="24" />
              </div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg border border-red-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-red-600">Jumlah Elaun Yang Sudah Ditolak</p>
                  <h3 class="text-2xl font-bold text-red-700">133</h3>
                </div>
                <Icon name="heroicons:x-circle" class="text-red-500" size="24" />
              </div>
            </div>
          </div>

          <!-- Search and Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Batch No
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
                      @click.prevent="navigateTo(`/BF-PA/PE/AB/02/PA?id=${batch.id}`)"
                    >
                      {{ batch.id }}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ batch.institution }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ batch.category }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ batch.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(batch.status)"
                    >
                      {{ batch.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <rs-button
                      variant="primary"
                      size="sm"
                      @click="navigateTo(`/BF-PA/PE/AB/02`)"
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
    id: 'BATCH-2024-001',
    institution: 'Masjid Al-Hidayah',
    category: 'Kariah',
    date: '01/03/2024',
    status: 'Dalam Semakan',
  },
  {
    id: 'BATCH-2024-002',
    institution: 'Masjid Al-Ikhlas',
    category: 'Komuniti',
    date: '02/03/2024',
    status: 'Diluluskan',
  },
  {
    id: 'BATCH-2024-003',
    institution: 'Masjid Al-Amin',
    category: 'Kariah',
    date: '03/03/2024',
    status: 'Tidak Layak',
  },
]);

// Status options for filter
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Dalam Semakan', value: 'Dalam Semakan' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Tidak Layak', value: 'Tidak Layak' },
];

// Search and filter state
const searchQuery = ref('');
const selectedStatus = ref('');

// Computed filtered batches
const filteredBatches = computed(() => {
  return batches.value.filter(batch => {
    const matchesSearch = !searchQuery.value || 
      batch.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      batch.institution.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || batch.status === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
    'Dalam Semakan': 'bg-yellow-100 text-yellow-800',
    'Diluluskan': 'bg-green-100 text-green-800',
    'Tidak Layak': 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getActionButtonText = (status) => {
  const actionTexts = {
    'Dalam Semakan': 'Semak',
    'Diluluskan': 'Lihat',
    'Tidak Layak': 'Lihat',
  };
  return actionTexts[status] || 'Lihat';
};

const getNextPage = (status) => {
  const nextPages = {
    'Dalam Semakan': '02',
    'Diluluskan': '03',
    'Tidak Layak': '03',
  };
  return nextPages[status] || '02';
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