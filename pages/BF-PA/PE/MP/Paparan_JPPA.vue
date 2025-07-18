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
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        class="form-checkbox h-4 w-4 text-primary-600"
                        :checked="isAllSelected"
                        @change="toggleSelectAll"
                      />
                      <span>ID Aktiviti</span>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Aktiviti
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
                <tr v-for="activity in filteredActivities" :key="activity.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        class="form-checkbox h-4 w-4 text-primary-600"
                        :value="activity.id"
                        :checked="selectedRows.includes(activity.id)"
                        @change="onCheckboxChange($event, activity)"
                      />
                      <a 
                        href="#" 
                        class="text-blue-600 hover:text-blue-800"
                        @click.prevent="navigateTo(`/BF-PA/PE/MP/${activity.id}`)"
                      >
                        {{ activity.id }}
                      </a>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ activity.date }}
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
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        @click="navigateTo('/BF-PA/PE/MP/03')"
                      >
                        Lihat Butiran
                      </rs-button>
                      <rs-button
                        variant="success"
                        size="sm"
                        @click="openSupportModal(activity.id)"
                      >
                        Sokong
                      </rs-button>
                      <rs-button
                        variant="danger"
                        size="sm"
                        @click="openRejectModal(activity.id)"
                      >
                        Tolak
                      </rs-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Bulk Approval Button at Bottom -->
    <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
      <rs-button
        variant="success"
        @click="handleBulkApproval"
        :disabled="processing"
      >
        <Icon name="material-symbols:approval" class="w-4 h-4 mr-1" />
        Sokong (Bulk) ({{ selectedRows.length }})
      </rs-button>
    </div>

    <!-- Support Confirmation Modal -->
    <rs-modal
      v-model="showSupportModal"
      title="Sahkan Sokongan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:check-circle-outline"
            class="text-green-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk memberikan sokongan kepada aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan dihantar kepada Ketua JPPA untuk kelulusan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showSupportModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmSupport">
            Ya, Sokong
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Reject Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Sahkan Penolakan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:cancel-outline"
            class="text-red-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menolak aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan dikembalikan kepada pemohon untuk pembetulan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showRejectModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="danger" @click="confirmReject">
            Ya, Tolak
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Senarai Elaun Penolong Amil (JPPA) - Mesyuarat/Program",
  description: "Senarai aktiviti mesyuarat dan program untuk semakan dan sokongan JPPA",
});

const toast = useToast();

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
    id: 'MP2024-002',
    name: 'Latihan Pengurusan Zakat dan Fitrah',
    date: '20/03/2024',
    location: 'Dewan Latihan LZS, Kompleks Zakat Selangor',
    type: 'Latihan',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '50.00',
    jumlahElaun: '200.00'
  },
  {
    id: 'MP2024-005',
    name: 'Latihan Sistem e-Zakat',
    date: '02/04/2024',
    location: 'Bilik Latihan IT, Pejabat Zakat Petaling Jaya',
    type: 'Latihan',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '60.00',
    jumlahElaun: '120.00'
  },
  {
    id: 'MP2024-008',
    name: 'Latihan Pengurusan Aduan',
    date: '12/04/2024',
    location: 'Bilik Latihan, Pejabat Zakat Gombak',
    type: 'Latihan',
    status: 'Menunggu Sokongan JPPA',
    allowanceRate: '55.00',
    jumlahElaun: '110.00'
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
const selectedRows = ref([]);
const processing = ref(false);
const showSupportModal = ref(false);
const showRejectModal = ref(false);
const selectedActivity = ref(null);

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

// Computed properties for bulk selection
const isAllSelected = computed(() => {
  return filteredActivities.value.length > 0 && selectedRows.value.length === filteredActivities.value.length;
});

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

const onCheckboxChange = (event, activity) => {
  if (event.target.checked) {
    selectedRows.value.push(activity.id);
  } else {
    selectedRows.value = selectedRows.value.filter(id => id !== activity.id);
  }
};

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedRows.value = filteredActivities.value.map(activity => activity.id);
  } else {
    selectedRows.value = [];
  }
};

const handleBulkApproval = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih aktiviti untuk disokong');
    return;
  }

  processing.value = true;
  
  try {
    // Update status for selected activities
    for (const activityId of selectedRows.value) {
      const activity = activities.value.find(a => a.id === activityId);
      if (activity) {
        activity.status = 'Menunggu Kelulusan Ketua JPPA';
      }
    }
    
    toast.success(`${selectedRows.value.length} aktiviti berjaya disokong dan dihantar kepada Ketua JPPA`);
    selectedRows.value = [];
  } catch (error) {
    toast.error('Ralat semasa menyokong aktiviti');
    console.error('Error in bulk approval:', error);
  } finally {
    processing.value = false;
  }
};

// Helper functions
const getStatusColor = (status) => {
  const colors = {
    'Menunggu Sokongan JPPA': 'bg-yellow-100 text-yellow-800',
    'Sokongan JPPA': 'bg-green-100 text-green-800',
    'Ditolak JPPA': 'bg-red-100 text-red-800',
    'Menunggu Kelulusan Ketua JPPA': 'bg-blue-100 text-blue-800',
    'Lulus': 'bg-green-100 text-green-800',
    'Di Tolak': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status) => {
  return status;
};

const getActionButtonText = (status) => {
  switch (status) {
    case 'Menunggu Sokongan JPPA':
      return 'Sokong';
    case 'Sokongan JPPA':
      return 'Lihat';
    default:
      return 'Lihat';
  }
};

// Individual action handlers
const openSupportModal = (activityId) => {
  selectedActivity.value = activityId;
  showSupportModal.value = true;
};

const openRejectModal = (activityId) => {
  selectedActivity.value = activityId;
  showRejectModal.value = true;
};

const confirmSupport = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Menunggu Kelulusan Ketua JPPA';
    }
    showSupportModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti berjaya disokong dan dihantar kepada Ketua JPPA');
  } catch (error) {
    toast.error('Ralat semasa menyokong aktiviti');
    console.error('Error supporting activity:', error);
  }
};

const confirmReject = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Di Tolak';
    }
    showRejectModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti telah ditolak dan dikembalikan kepada pemohon');
  } catch (error) {
    toast.error('Ralat semasa menolak aktiviti');
    console.error('Error rejecting activity:', error);
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>