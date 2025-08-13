<!-- 
  RTMF SCREEN: PA-PE-MP-01_01
  PURPOSE: Unified Dashboard - Pengurusan Elaun bagi Mesyuarat/Program
  DESCRIPTION: Dynamic dashboard with role-based content for Meeting/Program allowance management
  ROUTE: /BF-PA/PE/MP
-->
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

    <!-- Dynamic Content Based on Role -->
    <div v-if="currentRole === 'eksekutif'">
      <!-- Eksekutif Content -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Icon name="ic:outline-assignment" class="mr-2" />
            <h2 class="text-xl font-semibold">
              Senarai Elaun Penolong Amil (Eksekutif) - Mesyuarat/Program
            </h2>
          </div>
        </div>
      </template>

      <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari Kod Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="eksekutifStatusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />

            </div>
          </div>

          <!-- Single Table Section -->
          <div class="p-4">
            <!-- <h3 class="text-lg font-semibold mb-4 text-yellow-700 flex items-center">
              <Icon name="heroicons:clock" class="mr-2" size="20" />
              Senarai aktiviti dengan pelbagai status
            </h3> -->
            <rs-table
              :data="filteredEksekutifActivities"
              :columns="eksekutifColumns"
              :pageSize="pageSize"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              :options-advanced="{
                sortable: true,
                filterable: true,
              }"
              advanced
            >
              <template v-slot:status="{ text }">
                <rs-badge :variant="getStatusVariant(text)">
                  {{ getStatusLabel(text) }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="{ text }">
                <div class="flex justify-center items-center gap-1">
                  <Icon 
                    name="ic:outline-remove-red-eye" 
                    class="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" 
                    @click="handleView(text)"
                    title="Lihat Butiran"
                  />
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>


    </div>

    <!-- Ketua Jabatan Content -->
    <div v-else-if="currentRole === 'ketua-jabatan'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <Icon name="ic:outline-admin-panel-settings" class="mr-2" />
              <h2 class="text-xl font-semibold">
                Senarai Elaun Penolong Amil (Ketua Jabatan) - Mesyuarat/Program
              </h2>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
            <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                  type="text"
                  placeholder="Cari Kod Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="ketuaJabatanStatusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            </div>

          <!-- Single Table Section -->
          <div class="p-4">
            <!-- <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
              <Icon name="heroicons:clock" class="mr-2" size="20" />
              Senarai aktiviti dengan pelbagai status
            </h3> -->
            <rs-table
              :data="filteredKetuaJabatanActivities"
              :columns="ketuaJabatanColumns"
              :pageSize="pageSize"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              :options-advanced="{
                sortable: true,
                filterable: true,
              }"
              advanced
            >
              <template v-slot:status="{ text }">
                <rs-badge :variant="getStatusVariant(text)">
                  {{ getStatusLabel(text) }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="{ text }">
                <div class="flex justify-center items-center gap-1">
                  <Icon 
                    name="ic:outline-remove-red-eye" 
                    class="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" 
                    @click="handleView(text)"
                    title="Lihat Butiran"
                  />
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>


    </div>

    <!-- Ketua Divisyen Dashboard Content -->
    <div v-if="currentRole === 'ketua-divisyen'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <Icon name="ic:outline-verified-user" class="mr-2" />
              <h2 class="text-xl font-semibold">
                Senarai Elaun Penolong Amil (Ketua Divisyen) - Mesyuarat/Program
              </h2>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
            <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                  type="text"
                  placeholder="Cari Kod Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="ketuaDivisyenStatusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            </div>

          <!-- Single Table Section -->
          <div class="p-4">
            <!-- <h3 class="text-lg font-semibold mb-4 text-yellow-700 flex items-center">
              <Icon name="heroicons:clock" class="mr-2" size="20" />
              Senarai aktiviti dengan pelbagai status
            </h3> -->
            <rs-table
              :data="filteredKetuaDivisyenActivities"
              :columns="ketuaDivisyenColumns"
              :pageSize="pageSize"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              :options-advanced="{
                sortable: true,
                filterable: true,
              }"
              advanced
            >
              <template v-slot:status="{ text }">
                <rs-badge :variant="getStatusVariant(text)">
                  {{ getStatusLabel(text) }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="{ text }">
                <div class="flex justify-center items-center gap-1">
                  <Icon 
                    name="ic:outline-remove-red-eye" 
                    class="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800" 
                    @click="handleView(text)"
                    title="Lihat Butiran"
                  />
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>


    </div>

    <!-- Modals -->
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
            Aktiviti ini akan dihantar kepada Ketua Jabatan untuk kelulusan seterusnya.
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

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Sahkan Kelulusan"
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
            Adakah anda pasti untuk meluluskan aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan diluluskan dan Payment Advice akan dijana secara automatik.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showApproveModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmApprove">
            Ya, Lulus
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
  title: "Pengurusan Elaun bagi Mesyuarat/Program",
  description: "Senarai aktiviti mesyuarat dan program untuk pengurusan elaun",
});

const toast = useToast();

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

// Role Management
const currentRole = ref('ketua-divisyen');
const showRoleInfo = ref(false);

const roleOptions = [
{ label: 'Eksekutif', value: 'eksekutif' },
{ label: 'Ketua Jabatan', value: 'ketua-jabatan' },
  { label: 'Ketua Divisyen', value: 'ketua-divisyen' },
];

const getRoleVariant = (role) => {
  const variants = {
    'pt': 'default',
    'eksekutif': 'warning',
    'ketua-jabatan': 'primary',
  };
  return variants[role] || 'default';
};

const getRoleLabel = (role) => {
  const labels = {
    'ketua-divisyen': 'Ketua Divisyen',
    'eksekutif': 'Eksekutif',
    'ketua-jabatan': 'Ketua Jabatan',
  };
  return labels[role] || 'Unknown';
};

const getRoleDescription = (role) => {
  const descriptions = {
    'ketua-divisyen': 'Menyemak dan memilih aktiviti untuk pembayaran elaun',
    'eksekutif': 'Menyokong aktiviti elaun untuk kelulusan seterusnya',
    'ketua-jabatan': 'Meluluskan aktiviti elaun dan menjana Payment Advice',
  };
  return descriptions[role] || '';
};

const getRoleCapabilities = (role) => {
  const capabilities = {
    'ketua-divisyen': ['Lihat Semua Aktiviti', 'Semak Aktiviti', 'Pilih Aktiviti', 'Bulk Semak'],
    'eksekutif': ['Lihat Aktiviti', 'Sokong Aktiviti', 'Tolak Aktiviti', 'Bulk Support'],
    'ketua-jabatan': ['Lihat Aktiviti', 'Lulus Aktiviti', 'Tolak Aktiviti', 'Bulk Approval', 'Jana Payment Advice'],
  };
  return capabilities[role] || [];
};

const handleRoleChange = () => {
  // Reset filters when role changes
  filters.value.searchQuery = '';
  filters.value.status = '';
  selectedRows.value = [];
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Mock data for activities
const activities = ref([
    // PT specific activities - Belum Disemak
  {
    id: 'MP2024-001',
    NamaAktiviti: 'Program Khidmat Masyarakat',
    Tarikh: '15/04/2024',
    Lokasi: 'Dewan Serbaguna Masjid Kg Delek, Daerah Klang',
    status: 'Diluluskan'
  },
  {
    id: 'MP2024-002',
    NamaAktiviti: 'Mesyuarat Perancangan Bulanan',
    Tarikh: '18/04/2024',
    Lokasi: 'Dewan Mesyuarat Eksekutif, Daerah Petaling Jaya',
    status: 'Belum Disemak'
  },
  {
    id: 'MP2024-003',
    NamaAktiviti: 'Latihan Pengurusan Zakat',
    Tarikh: '20/04/2024',
    Lokasi: 'Dewan Latihan LZS, Daerah Shah Alam',
    status: 'Belum Disemak'
  },
    // Activities with various statuses for Eksekutif role
  {
    id: 'MP2024-004',
    NamaAktiviti: 'Mesyuarat Eksekutif Bulanan',
    Tarikh: '15/03/2024',
    Lokasi: 'Dewan Mesyuarat Eksekutif, Daerah Petaling Jaya',
    status: 'Belum Disemak'
  },
  {
    id: 'MP2024-005',
    NamaAktiviti: 'Latihan Pengurusan Zakat dan Fitrah',
    Tarikh: '20/03/2024',
    Lokasi: 'Dewan Latihan LZS, Kompleks Zakat Selangor, Daerah Shah Alam',
    status: 'Diluluskan'
  },
  {
    id: 'MP2024-006',
    NamaAktiviti: 'Latihan Sistem e-Zakat',
    Tarikh: '02/04/2024',
    Lokasi: 'Bilik Latihan IT, Pejabat Zakat Petaling Jaya, Daerah Petaling Jaya',
    status: 'Ditolak'
  },
  // Activities with various statuses for Ketua Jabatan role
  {
    id: 'MP2024-007',
     NamaAktiviti: 'Program Khidmat Masyarakat',
    Tarikh: '20/03/2024',
    Lokasi: 'Masjid Al-Hidayah, Daerah Gombak',
    status: 'Diluluskan'
  },
  {
    id: 'MP2024-008',
     NamaAktiviti: 'Latihan Pengurusan Aduan',
    Tarikh: '12/04/2024',
    Lokasi: 'Bilik Latihan, Pejabat Zakat Gombak, Daerah Gombak',
    status: 'Diluluskan'
  },
  // Additional activities with various statuses for all roles
  {
    id: 'MP2024-009',
     NamaAktiviti: 'Latihan Pengurusan Zakat',
    Tarikh: '25/03/2024',
    Lokasi: 'Dewan Latihan, Daerah Shah Alam',
    status: 'Belum Disemak'
  },
  {
    id: 'MP2024-010',
     NamaAktiviti: 'Mesyuarat Koordinasi',
    Tarikh: '30/03/2024',
    Lokasi: 'Pejabat Zakat, Daerah Petaling Jaya',
    status: 'Diluluskan'
  },
]);

const eksekutifStatusOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Belum Disemak', value: 'Belum Disemak' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

const ketuaDivisyenStatusOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Belum Disemak', value: 'Belum Disemak' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

const ketuaJabatanStatusOptions = [
  { label: 'Sila pilih...', value: '' },
  { label: 'Belum Disemak', value: 'Belum Disemak' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

// Search and filter state
const selectedRows = ref([]);
const processing = ref(false);
const showSupportModal = ref(false);
const showRejectModal = ref(false);
const showApproveModal = ref(false);
const selectedActivity = ref(null);

// Computed filtered activities based on role
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

// Handler functions for table actions
const handleView = (activityId) => {
  navigateTo(`/BF-PA/PE/MP/${activityId}?role=${currentRole.value}`);
};

const handleSupport = (activityId) => {
  // Update activity status to supported
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'Diluluskan';
    toast.success('Aktiviti berjaya disokong');
  }
};

const handleApprove = (activityId) => {
  // Update activity status to approved
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'Diluluskan';
    toast.success('Aktiviti berjaya diluluskan');
  }
};

const handleReject = (activityId) => {
  // Update activity status to rejected
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'Ditolak';
    toast.success('Aktiviti telah ditolak');
  }
};

const handleLulusManualKuasa = (activityId) => {
  // Navigate to activity review page for Ketua Divisyen role
  navigateTo(`/BF-PA/PE/MP/01?id=${activityId}`);
};

// Update computed properties to work with rs-table
const filteredEksekutifActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    // Eksekutif can see activities with all three statuses
    return matchesSearch && matchesStatus;
  }).map(activity => ({
    ...activity,
    tindakan: activity.id // Pass activity ID for action buttons
  }));
});

const eksekutifApprovedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    return matchesSearch && matchesStatus && activity.status === 'Diluluskan';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const eksekutifRejectedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    return matchesSearch && matchesStatus && activity.status === 'Ditolak';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

// Computed properties for separated tables
const approvedActivities = computed(() => {
  return filteredActivities.value.filter(activity => activity.status === 'Diluluskan');
});

const rejectedActivities = computed(() => {
  return filteredActivities.value.filter(activity => activity.status === 'Ditolak');
});

// Ketua Jabatan specific computed properties
const filteredKetuaJabatanActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    // Ketua Jabatan can see activities with all three statuses
    return matchesSearch && matchesStatus;
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const ketuaJabatanApprovedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    return matchesSearch && matchesStatus && matchesJenis && activity.status === 'Diluluskan';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const ketuaJabatanRejectedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    return matchesSearch && matchesStatus && matchesJenis && activity.status === 'Ditolak';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

// Ketua Divisyen specific computed properties
const filteredKetuaDivisyenActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    // Ketua Divisyen can see activities with all three statuses
    return matchesSearch && matchesStatus;
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const pendingKetuaDivisyenActivities = computed(() => {
  return filteredKetuaDivisyenActivities.value.filter(activity => 
    activity.status === 'Belum Disemak'
  ).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const ketuaDivisyenApprovedActivities = computed(() => {
  return filteredKetuaDivisyenActivities.value.filter(activity => activity.status === 'Diluluskan')
    .map(activity => ({
      ...activity,
      tindakan: activity.id
    }));
});

const ketuaDivisyenRejectedActivities = computed(() => {
  return filteredKetuaDivisyenActivities.value.filter(activity => activity.status === 'Ditolak')
    .map(activity => ({
      ...activity,
      tindakan: activity.id
    }));
});

// Computed properties for bulk selection
const isAllSelected = computed(() => {
  if (currentRole.value === 'ketua-divisyen') {
    return filteredKetuaDivisyenActivities.value.length > 0 && selectedRows.value.length === filteredKetuaDivisyenActivities.value.length;
  } else if (currentRole.value === 'eksekutif') {
    return filteredEksekutifActivities.value.length > 0 && selectedRows.value.length === filteredEksekutifActivities.value.length;
  } else if (currentRole.value === 'ketua-jabatan') {
    return filteredKetuaJabatanActivities.value.length > 0 && selectedRows.value.length === filteredKetuaJabatanActivities.value.length;
  }
  return false;
});

// Helper functions
const getActivityStatus = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId);
  return activity ? activity.status : '';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Belum Disemak':
      return 'bg-gray-100 text-gray-800'
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
    case 'Belum Disemak':
      return 'Belum Disemak'
    case 'Diluluskan':
      return 'Diluluskan'
    case 'Ditolak':
      return 'Ditolak'
    default:
      return status
  }
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'Belum Disemak':
      return 'warning'
    case 'Diluluskan':
      return 'success'
    case 'Ditolak':
      return 'danger'
    default:
      return 'secondary'  // Use secondary instead of default
  }
}

const getActionRoute = (status, activityId) => {
  switch (status) {
    case 'Belum Disemak':
      return '/BF-PA/PE/MP/01'
    case 'Diluluskan':
      return `/BF-PA/PE/MP/view-lulus`
    case 'Ditolak':
      return `/BF-PA/PE/MP/07`
    default:
      return '#'
  }
}

const getActionButtonText = (status) => {
  switch (status) {
    case 'Belum Disemak':
      return 'Semak'
    case 'Diluluskan':
      return 'Lihat'
    case 'Ditolak':
      return 'Semak Semula'
    default:
      return 'Lihat'
  }
}

// Event handlers
const onCheckboxChange = (event, activity) => {
  if (event.target.checked) {
    selectedRows.value.push(activity.id);
  } else {
    selectedRows.value = selectedRows.value.filter(id => id !== activity.id);
  }
};

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    if (currentRole.value === 'ketua-divisyen') {
      selectedRows.value = filteredKetuaDivisyenActivities.value.map(activity => activity.id);
    } else if (currentRole.value === 'eksekutif') {
      selectedRows.value = filteredEksekutifActivities.value.map(activity => activity.id);
    } else if (currentRole.value === 'ketua-jabatan') {
      selectedRows.value = filteredKetuaJabatanActivities.value.map(activity => activity.id);
    }
  } else {
    selectedRows.value = [];
  }
};

// Bulk action handlers
const handleBulkLulusManualKuasa = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih aktiviti untuk diluluskan manual kuasa');
    return;
  }

  processing.value = true;
  
  try {
    // Navigate to activity selection for Ketua Divisyen role
    navigateTo('/BF-PA/PE/MP/01');
  } catch (error) {
    toast.error('Ralat semasa memproses aktiviti');
    console.error('Error in bulk lulus manual kuasa:', error);
  } finally {
    processing.value = false;
  }
};

const handleBulkSupport = async () => {
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
        activity.status = 'Diluluskan';
      }
    }
    
    toast.success(`${selectedRows.value.length} aktiviti berjaya disokong dan diluluskan`);
    selectedRows.value = [];
  } catch (error) {
    toast.error('Ralat semasa menyokong aktiviti');
    console.error('Error in bulk support:', error);
  } finally {
    processing.value = false;
  }
};

const handleBulkApproval = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih aktiviti untuk diluluskan');
    return;
  }

  processing.value = true;
  
  try {
    // Update status for selected activities
    for (const activityId of selectedRows.value) {
      const activity = activities.value.find(a => a.id === activityId);
      if (activity) {
        activity.status = 'Lulus';
      }
    }
    
    toast.success(`${selectedRows.value.length} aktiviti berjaya diluluskan`);
    selectedRows.value = [];
  } catch (error) {
    toast.error('Ralat semasa meluluskan aktiviti');
    console.error('Error in bulk approval:', error);
  } finally {
    processing.value = false;
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

const openApproveModal = (activityId) => {
  selectedActivity.value = activityId;
  showApproveModal.value = true;
};

const confirmSupport = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Diluluskan';
    }
    showSupportModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti berjaya disokong dan diluluskan');
  } catch (error) {
    toast.error('Ralat semasa menyokong aktiviti');
    console.error('Error supporting activity:', error);
  }
};

const confirmReject = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Ditolak';
    }
    showRejectModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti telah ditolak dan dikembalikan kepada pemohon');
  } catch (error) {
    toast.error('Ralat semasa menolak aktiviti');
    console.error('Error rejecting activity:', error);
  }
};

const confirmApprove = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Lulus';
    }
    showApproveModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti berjaya diluluskan dan Payment Advice akan dijana');
  } catch (error) {
    toast.error('Ralat semasa meluluskan aktiviti');
    console.error('Error approving activity:', error);
  }
};

// Table column definitions
const eksekutifColumns = [
  {
    key: "id",
    label: "Kod Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "200px",
  },
];

const eksekutifApprovedColumns = [
  {
    key: "id",
    label: "Kod Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "140px",
  },
];

const ketuaJabatanColumns = [
  {
    key: "id",
    label: "Kod Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "200px",
  },
];

const ketuaJabatanApprovedColumns = [
  {
    key: "id",
    label: "Kod Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "140px",
  },
];

const ketuaDivisyenColumns = [
  {
    key: "id",
    label: "Kod Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "200px",
  },
];

const ketuaDivisyenApprovedColumns = [
  {
    key: "id",
    label: "Kod Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "140px",
  },
];

// Filters state
const filters = ref({
  searchQuery: "",
  status: "",
});

const pageSize = ref(10);
</script>

<style scoped>
/* Add any additional styles here */
</style>