<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pengurusan Elaun bagi Mesyuarat/Program
          </h2>
          <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/MP/01')">Tambah Aktiviti</rs-button>
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
                        ID Aktiviti
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Nama Aktiviti
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Tarikh
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        Jenis
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
                    <tr v-for="activity in approvedActivities" :key="activity.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          class="text-blue-600 hover:text-blue-800"
                          @click.prevent="navigateTo(getActionRoute(activity.status, activity.id))"
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
                          @click="navigateTo(getActionRoute(activity.status, activity.id))"
                        >
                          {{ getActionButtonText(activity.status) }}
                        </rs-button>
                      </td>
                    </tr>
                    <tr v-if="approvedActivities.length === 0">
                      <td colspan="7" class="px-6 py-8 text-center text-gray-500">
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
                        ID Aktiviti
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Nama Aktiviti
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Tarikh
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        Jenis
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
                    <tr v-for="activity in rejectedActivities" :key="activity.id">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          class="text-blue-600 hover:text-blue-800"
                          @click.prevent="navigateTo(getActionRoute(activity.status, activity.id))"
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
                          @click="navigateTo(getActionRoute(activity.status, activity.id))"
                        >
                          {{ getActionButtonText(activity.status) }}
                        </rs-button>
                      </td>
                    </tr>
                    <tr v-if="rejectedActivities.length === 0">
                      <td colspan="7" class="px-6 py-8 text-center text-gray-500">
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
  title: "Pengurusan Elaun bagi Mesyuarat/Program",
  description: "Senarai aktiviti mesyuarat dan program untuk pengurusan elaun",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Mesyuarat/Program",
    type: "current",
    path: "/BF-PA/PE/MP",
  },
]);

// Mock data for activities
const activities = ref([
  {
    id: 'MP/2024/003',
    name: 'Latihan Pengurusan Zakat',
    date: '2024-03-10',
    location: 'Dewan Latihan',
    type: 'Latihan',
    status: 'Diluluskan'
  },
  {
    id: 'MP/2024/004',
    name: 'Mesyuarat Agung Tahunan',
    date: '2024-03-12',
    location: 'Dewan Utama',
    type: 'Mesyuarat',
    status: 'Ditolak'
  },
  {
    id: 'MP/2024/007',
    name: 'Program Khidmat Masyarakat',
    date: '2024-03-18',
    location: 'Masjid Al-Amin',
    type: 'Program',
    status: 'Diluluskan'
  },
  {
    id: 'MP/2024/012',
    name: 'Mesyuarat Koordinasi',
    date: '2024-03-30',
    location: 'Pejabat Zakat',
    type: 'Mesyuarat',
    status: 'Ditolak'
  }
]);

// Status options for filter
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
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

// Computed properties for separated tables
const approvedActivities = computed(() => {
  return filteredActivities.value.filter(activity => activity.status === 'Diluluskan');
});

const rejectedActivities = computed(() => {
  return filteredActivities.value.filter(activity => activity.status === 'Ditolak');
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

const getActionRoute = (status, activityId) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return '/BF-PA/PE/MP/03'
    case 'Menunggu Kelulusan Ketua JPPA':
      return '/BF-PA/PE/MP/04'
    case 'Diluluskan':
      return `/BF-PA/PE/MP/view-lulus?id=${encodeURIComponent(activityId)}`
    case 'Ditolak':
      return `/BF-PA/PE/MP/view-tolak?id=${encodeURIComponent(activityId)}`
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

const handleJenisAktivitiChange = (event) => {
  selectedJenisAktiviti.value = event.target.value;
};
</script>

<style scoped>
/* Add any additional styles here */
</style>