<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Elaun Penolong Amil (JPPA) - Mesyuarat/Program
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Search and Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                type="text"
                name="search"
                placeholder="Cari ID Aktiviti atau Nama Aktiviti"
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
              <FormKit
                type="select"
                name="jenisAktiviti"
                placeholder="Jenis Aktiviti"
                :options="jenisAktivitiOptions"
                :value="selectedJenisAktiviti"
                @input="handleJenisAktivitiChange"
              />
            </div>
          </div>

          <!-- Table Section -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Aktiviti
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Aktiviti
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarikh
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
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
                <tr v-for="activity in filteredActivities" :key="activity.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <a 
                      href="#" 
                      class="text-blue-600 hover:text-blue-800"
                      @click.prevent="navigateTo(getActionRoute(activity.status))"
                    >
                      {{ activity.id }}
                    </a>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.location }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.type }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusColor(activity.status)"
                    >
                      {{ getStatusLabel(activity.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <rs-button
                      variant="primary"
                      size="sm"
                      @click="navigateTo(getActionRoute(activity.status))"
                    >
                      {{ getActionButtonText(activity.status) }}
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
  title: "Senarai Elaun Penolong Amil (JPPA) - Mesyuarat/Program",
  description: "Senarai aktiviti mesyuarat dan program untuk semakan dan sokongan JPPA",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Senarai Elaun Penolong Amil (JPPA)",
    type: "current",
    path: "/BF-PA/PE/MP/Paparan_JPPA",
  },
]);

// Mock data for activities - only "Menunggu Sokongan JPPA" status
const activities = ref([
  {
    id: 'MP/2024/001',
    name: 'Mesyuarat JPPA Bulanan',
    date: '2024-03-15',
    location: 'Dewan Mesyuarat JPPA',
    type: 'Mesyuarat',
    status: 'Menunggu Sokongan JPPA'
  },
  {
    id: 'MP/2024/005',
    name: 'Program Khidmat Masyarakat',
    date: '2024-03-20',
    location: 'Masjid Al-Hidayah',
    type: 'Program',
    status: 'Menunggu Sokongan JPPA'
  },
  {
    id: 'MP/2024/008',
    name: 'Latihan Pengurusan Zakat',
    date: '2024-03-25',
    location: 'Dewan Latihan',
    type: 'Latihan',
    status: 'Menunggu Sokongan JPPA'
  },
  {
    id: 'MP/2024/010',
    name: 'Mesyuarat Koordinasi',
    date: '2024-03-28',
    location: 'Pejabat Zakat',
    type: 'Mesyuarat',
    status: 'Menunggu Sokongan JPPA'
  }
]);

// Status options for filter
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu Sokongan JPPA', value: 'Menunggu Sokongan JPPA' },
];

// Jenis Aktiviti options
const jenisAktivitiOptions = [
  { label: 'Semua', value: '' },
  { label: 'Mesyuarat', value: 'Mesyuarat' },
  { label: 'Program', value: 'Program' },
  { label: 'Latihan', value: 'Latihan' },
];

// Search and filter state
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedJenisAktiviti = ref('');

// Computed filtered activities
const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !searchQuery.value || 
      activity.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || activity.status === selectedStatus.value;
    const matchesJenis = !selectedJenisAktiviti.value || activity.type === selectedJenisAktiviti.value;
    return matchesSearch && matchesStatus && matchesJenis;
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
      return '/BF-PA/PE/MP/03'
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

const handleJenisAktivitiChange = (event) => {
  selectedJenisAktiviti.value = event.target.value;
};
</script>

<style scoped>
/* Add any additional styles here */
</style>