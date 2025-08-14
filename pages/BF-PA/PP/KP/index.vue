<!-- 
  RTMF SCREEN: PA-PP-KP-01_01 (Main Listing)
  PURPOSE: Perkhidmatan Penolong Amil - Main listing page
  DESCRIPTION: Main page for viewing and managing Penolong Amil service records
  ROUTE: /BF-PA/PP/KP
-->
<template>
  <div>
    <!-- Page-specific Role Switcher -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Peranan Pengguna:</span>
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

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:gear" class="w-6 h-6 mr-3 text-primary" />
            Penamatan Jawatan
          </h1>
          <p class="text-gray-600 mt-1">
            {{ getRoleSpecificDescription(currentRole) }} - {{ filteredRequests.length }} rekod perkhidmatan
          </p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PP/KP/kemaskini/new')"
            v-if="canCreateRequest(currentRole)"
            class="flex items-center"
          >
            <Icon name="ph:plus" class="w-4 h-4 mr-2" />
            Tambah Perkhidmatan
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Status Dashboard Tabs -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:chart-bar" class="w-5 h-5 mr-2" />
          Dashboard Status
        </h3>
      </div>
      <div class="p-6">
        <!-- Simple Tab Navigation -->
        <div class="border-b border-gray-200 mb-4">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              @click="activeStatusTab = tab.value"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeStatusTab === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
        
        <!-- Tab Content -->
        <div class="p-4">
          <div v-if="activeStatusTab === 'aktif'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-success">{{ getStatusCount('aktif') }}</div>
              <div class="text-sm text-gray-600">Perkhidmatan Aktif</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-warning">{{ getStatusCount('suspended') }}</div>
              <div class="text-sm text-gray-600">Dalam Pemerhatian</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-danger">{{ getStatusCount('terminated') }}</div>
              <div class="text-sm text-gray-600">Telah Ditamatkan</div>
            </div>
          </div>
          
          <div v-else-if="activeStatusTab === 'suspended'" class="text-center">
            <div class="text-2xl font-bold text-warning">{{ getStatusCount('suspended') }}</div>
            <div class="text-sm text-gray-600">Perkhidmatan Dalam Pemerhatian</div>
          </div>
          
          <div v-else-if="activeStatusTab === 'terminated'" class="text-center">
            <div class="text-2xl font-bold text-danger">{{ getStatusCount('terminated') }}</div>
            <div class="text-sm text-gray-600">Perkhidmatan Telah Ditamatkan</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simplified Filters Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:funnel" class="w-5 h-5 mr-2" />
          Penapis
        </h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cari</label>
            <FormKit
              type="text"
              v-model="filters.searchQuery"
              placeholder="No Rujukan, nama, ID Pengenalan..."
              outer-class="mb-0"
            >
              <template #prefixIcon>
                <Icon name="ph:magnifying-glass" class="w-4 h-4 text-gray-500" />
              </template>
            </FormKit>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <FormKit
              type="select"
              v-model="filters.status"
              :options="statusOptions"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <FormKit
              type="select"
              v-model="filters.kategori"
              :options="kategoriOptions"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Institusi</label>
            <FormKit
              type="select"
              v-model="filters.institusi"
              :options="institusiOptions"
              outer-class="mb-0"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <rs-button 
            variant="secondary-outline" 
            @click="clearFilters"
            class="flex items-center"
          >
            <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-1" />
            Set Semula
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="applyFilters"
            class="flex items-center"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-1" />
            Guna Penapis
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Enhanced Data Table -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Senarai Perkhidmatan Penolong Amil</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">{{ filteredRequests.length }} daripada {{ requests.length }} rekod</span>
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="exportData"
              class="flex items-center"
            >
              <Icon name="ph:download" class="w-4 h-4 mr-1" />
              Muat Turun
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No Rujukan
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pengenalan
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institusi
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="request in paginatedRequests" 
                :key="request.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ request.noRujukan || request.rujukan }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ request.nama || request.penolongAmil?.nama }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ request.idPengenalan || request.penolongAmil?.noKP }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ request.kategori || request.newKategori }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ request.institusi || request.newInstitusi }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <rs-badge :variant="getStatusVariant(request.status)">
                    {{ getStatusLabel(request.status) }}
                  </rs-badge>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <rs-button
                      variant="primary"
                      size="sm"
                      @click="viewRequest(request)"
                      class="flex items-center"
                    >
                      <Icon name="ph:eye" class="w-3 h-3 mr-1" />
                      Lihat
                    </rs-button>
                    <!-- PYB Institusi specific actions -->
                    <template v-if="currentRole === 'pyb-institusi'">
                      <rs-button
                        v-if="request.status === 'aktif'"
                        variant="danger"
                        size="sm"
                        @click="terminateService(request)"
                        class="flex items-center"
                      >
                        <Icon name="ph:stop-circle" class="w-3 h-3 mr-1" />
                        Tamatkan
                      </rs-button>
                      <rs-button
                        variant="warning"
                        size="sm"
                        @click="sendWarningLetter(request)"
                        class="flex items-center"
                      >
                        <Icon name="ph:envelope" class="w-3 h-3 mr-1" />
                        Surat Amaran
                      </rs-button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Simple Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              {{ startIndex + 1 }}-{{ endIndex }} daripada {{ filteredRequests.length }}
            </span>
          </div>
          
          <div class="flex items-center gap-1">
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
            >
              <Icon name="ph:caret-double-left" class="w-4 h-4" />
            </rs-button>
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <Icon name="ph:caret-left" class="w-4 h-4" />
            </rs-button>
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <Icon name="ph:caret-right" class="w-4 h-4" />
            </rs-button>
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              <Icon name="ph:caret-double-right" class="w-4 h-4" />
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Enhanced Notifications -->
    <div v-if="showNotification" class="fixed top-4 right-4 z-50">
      <rs-card class="shadow-lg border-l-4 border-success">
        <template #body>
          <div class="flex items-center">
            <Icon name="ph:check-circle" class="w-5 h-5 text-success mr-3" />
            <div>
              <div class="font-medium text-gray-900">{{ notificationTitle }}</div>
              <div class="text-sm text-gray-600">{{ notificationMessage }}</div>
            </div>
            <button @click="hideNotification" class="ml-4 text-gray-400 hover:text-gray-600">
              <Icon name="ph:x" class="w-4 h-4" />
            </button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { formatDate } from "~/utils/dateFormatter";

definePageMeta({
  title: "Perkhidmatan Penolong Amil",
  breadcrumb: [
    {
      name: "BF-PA",
      type: "link",
      path: "/BF-PA",
    },
    {
      name: "PP",
      type: "link",
      path: "/BF-PA/PP",
    },
    {
      name: "Perkhidmatan Penolong Amil",
      type: "current",
      path: "/BF-PA/PP/KP",
    },
  ],
});

// Enhanced reactive data
const breadcrumb = ref([
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA",
  },
  {
    name: "PP",
    type: "link",
    path: "/BF-PA/PP",
  },
  {
    name: "Perkhidmatan Penolong Amil",
    type: "current",
    path: "/BF-PA/PP/KP",
  },
]);

// Simplified filters
const filters = ref({
  searchQuery: "",
  status: "",
  kategori: "",
  institusi: "",
});

// Enhanced pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Status tab dashboard
const activeStatusTab = ref("aktif");

// Status tabs configuration
const statusTabs = [
  { value: "aktif", label: "Aktif" },
  { value: "suspended", label: "Dalam Pemerhatian" },
  { value: "terminated", label: "Telah Ditamatkan" },
];

// Enhanced notifications
const showNotification = ref(false);
const notificationTitle = ref("");
const notificationMessage = ref("");

// Enhanced options
const statusOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Aktif", value: "aktif" },
  { label: "Dalam Pemerhatian", value: "suspended" },
  { label: "Telah Ditamatkan", value: "terminated" },
];

const kategoriOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Penolong Amil Fitrah", value: "fitrah" },
  { label: "Penolong Amil Padi", value: "padi" },
  { label: "Penolong Amil Kariah", value: "kariah" },
  { label: "Penolong Amil Komuniti", value: "komuniti" },
];

const institusiOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Masjid Al-Hidayah", value: "masjid_al_hidayah" },
  { label: "Surau Al-Amin", value: "surau_al_amin" },
  { label: "Kompleks Islam", value: "kompleks_islam" },
];

// Enhanced mock data with new structure
const requests = ref([
  {
    id: "KP001",
    noRujukan: "KP-2024-001",
    nama: "Ahmad bin Abdullah",
    idPengenalan: "901231012345",
    kategori: "Penolong Amil Kariah",
    institusi: "Surau Al-Amin",
    status: "aktif",
  },
  {
    id: "KP002",
    noRujukan: "KP-2024-002",
    nama: "Mohd Ali bin Hassan",
    idPengenalan: "850315045678",
    kategori: "Penolong Amil Komuniti",
    institusi: "Kompleks Islam",
    status: "aktif",
  },
  {
    id: "KP003",
    noRujukan: "KP-2024-003",
    nama: "Fatimah binti Omar",
    idPengenalan: "920512078901",
    kategori: "Penolong Amil Fitrah",
    institusi: "Masjid Al-Hidayah",
    status: "suspended",
  },
  {
    id: "KP004",
    noRujukan: "KP-2024-004",
    nama: "Siti Aminah binti Ismail",
    idPengenalan: "880723123456",
    kategori: "Penolong Amil Padi",
    institusi: "Surau Al-Amin",
    status: "aktif",
  },
  {
    id: "KP005",
    noRujukan: "KP-2024-005",
    nama: "Zainal bin Ibrahim",
    idPengenalan: "870415234567",
    kategori: "Penolong Amil Kariah",
    institusi: "Kompleks Islam",
    status: "terminated",
  },
  {
    id: "KP006",
    noRujukan: "KP-2024-006",
    nama: "Nurul Huda binti Ahmad",
    idPengenalan: "930625345678",
    kategori: "Penolong Amil Komuniti",
    institusi: "Masjid Al-Hidayah",
    status: "aktif",
  },
  {
    id: "KP007",
    noRujukan: "KP-2024-007",
    nama: "Abdul Rahman bin Hassan",
    idPengenalan: "890715456789",
    kategori: "Penolong Amil Fitrah",
    institusi: "Surau Al-Amin",
    status: "suspended",
  },
  {
    id: "KP008",
    noRujukan: "KP-2024-008",
    nama: "Noraini binti Mohamed",
    idPengenalan: "910318567890",
    kategori: "Penolong Amil Padi",
    institusi: "Kompleks Islam",
    status: "aktif",
  },
  {
    id: "KP009",
    noRujukan: "KP-2024-009",
    nama: "Ismail bin Yusof",
    idPengenalan: "860420678901",
    kategori: "Penolong Amil Kariah",
    institusi: "Masjid Al-Hidayah",
    status: "terminated",
  },
  {
    id: "KP010",
    noRujukan: "KP-2024-010",
    nama: "Rohana binti Sulaiman",
    idPengenalan: "940712789012",
    kategori: "Penolong Amil Komuniti",
    institusi: "Surau Al-Amin",
    status: "aktif",
  },
]);

// Enhanced computed properties with role-specific filtering
const filteredRequests = computed(() => {
  let result = [...requests.value];
  
  // Filter by active status tab
  if (activeStatusTab.value && activeStatusTab.value !== "aktif") {
    result = result.filter(request => request.status === activeStatusTab.value);
  }
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(request => 
      (request.noRujukan || request.rujukan)?.toLowerCase().includes(query) ||
      (request.nama || request.penolongAmil?.nama)?.toLowerCase().includes(query) ||
      (request.idPengenalan || request.penolongAmil?.noKP)?.includes(query)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(request => request.status === filters.value.status);
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(request => 
      (request.kategori || request.newKategori)?.toLowerCase().includes(filters.value.kategori.toLowerCase())
    );
  }
  
  // Apply institusi filter
  if (filters.value.institusi) {
    result = result.filter(request => 
      (request.institusi || request.newInstitusi)?.toLowerCase().includes(filters.value.institusi.toLowerCase())
    );
  }
  
  return result;
});

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRequests.value.length));
const paginatedRequests = computed(() => {
  return filteredRequests.value.slice(startIndex.value, endIndex.value);
});

// Enhanced helper functions
const getStatusVariant = (status) => {
  const variants = {
    aktif: "success",
    terminated: "danger",
    suspended: "warning",
  };
  return variants[status] || "disabled";
};

const getStatusLabel = (status) => {
  const labels = {
    aktif: "Aktif",
    terminated: "Telah Ditamatkan",
    suspended: "Dalam Pemerhatian",
  };
  return labels[status] || status;
};

// Helper method for status dashboard
const getStatusCount = (status) => {
  return requests.value.filter(request => request.status === status).length;
};

// Enhanced methods
const clearFilters = () => {
  filters.value = {
    searchQuery: "",
    status: "",
    kategori: "",
    institusi: "",
  };
  currentPage.value = 1;
  showNotificationMessage("Penapis telah dikosongkan", "Semua penapis telah dikosongkan dan senarai telah dikemaskini.");
};

const applyFilters = () => {
  currentPage.value = 1;
  showNotificationMessage("Penapis telah digunakan", `${filteredRequests.value.length} rekod ditemui berdasarkan penapis yang dipilih.`);
};

const viewRequest = (request) => {
  // Navigate to role-specific detail page based on current role
  const role = currentRole.value;
  if (role === "pyb-institusi") {
    navigateTo(`/BF-PA/PP/KP/pyb-institusi/detail/${request.noRujukan || request.rujukan}`);
  } else {
    navigateTo(`/BF-PA/PP/KP/${role}/detail/${request.noRujukan || request.rujukan}`);
  }
};

const editRequest = (request) => {
  navigateTo(`/BF-PA/PP/KP/kemaskini/${request.rujukan}`);
};

const exportData = () => {
  // Simulate export functionality
  showNotificationMessage("Muat Turun Berjaya", "Data telah dieksport ke fail Excel.");
};

// PYB Institusi specific actions
const terminateService = (request) => {
  showNotificationMessage(
    "Perkhidmatan Ditamatkan", 
    `Perkhidmatan ${request.noRujukan || request.rujukan} untuk ${request.nama || request.penolongAmil?.nama} telah ditamatkan.`
  );
  
  // In real app, this would update the status to 'terminated'
  // For now, just show notification
};

const sendWarningLetter = (request) => {
  showNotificationMessage(
    "Surat Amaran Dihantar", 
    `Surat amaran telah dihantar kepada ${request.nama || request.penolongAmil?.nama} untuk ${request.noRujukan || request.rujukan}.`
  );
  
  // In real app, this would trigger warning letter generation
  // For now, just show notification
};

const showNotificationMessage = (title, message) => {
  notificationTitle.value = title;
  notificationMessage.value = message;
  showNotification.value = true;
  
  setTimeout(() => {
    hideNotification();
  }, 5000);
};

const hideNotification = () => {
  showNotification.value = false;
};

// Role-based access control
const canCreateRequest = (role) => {
  // Only PYB Institusi can create new services
  return role === "pyb-institusi";
};

const canEditRequest = (request) => {
  // Only allow editing if status is pending or need_more_info
  return request.status === "pending" || request.status === "need_more_info";
};

// Role-based action control
const canPerformAction = (request) => {
  // Only PYB Institusi can perform actions (terminate, warning letter)
  return currentRole.value === "pyb-institusi";
};

// Enhanced helper functions
const getRoleSpecificDescription = (role) => {
  const descriptions = {
    "pt": "Lihat maklumat Perkhidmatan Penolong Amil",
    "eksekutif": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-jabatan": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-divisyen": "Lihat maklumat Perkhidmatan Penolong Amil",
    "pyb-institusi": "Pengurusan maklumat Perkhidmatan Penolong Amil oleh PYB Institusi",
  };
  return descriptions[role] || "Peranan ini mempunyai kebolehan yang berbeza.";
};

// Role Switcher State
const currentRole = ref("pyb-institusi"); // Default role changed to PYB Institusi
const roleOptions = [
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
  { label: "PYB Institusi", value: "pyb-institusi" },
];
const showRoleInfo = ref(false);

const getRoleVariant = (role) => {
  const variants = {
    "pt": "info",
    "eksekutif": "success",
    "ketua-jabatan": "warning",
    "ketua-divisyen": "danger",
    "pyb-institusi": "primary",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role) => {
  const labels = {
    "pt": "PT",
    "eksekutif": "Eksekutif",
    "ketua-jabatan": "Ketua Jabatan",
    "ketua-divisyen": "Ketua Divisyen",
    "pyb-institusi": "PYB Institusi",
  };
  return labels[role] || role;
};

const getRoleDescription = (role) => {
  const descriptions = {
    "pt": "Lihat maklumat Perkhidmatan Penolong Amil",
    "eksekutif": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-jabatan": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-divisyen": "Lihat maklumat Perkhidmatan Penolong Amil",
    "pyb-institusi": "Pengurusan maklumat Perkhidmatan Penolong Amil oleh PYB Institusi",
  };
  return descriptions[role] || "Peranan ini mempunyai kebolehan yang berbeza.";
};

const getRoleCapabilities = (role) => {
  const capabilities = {
    "pt": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "eksekutif": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "ketua-jabatan": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "ketua-divisyen": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "pyb-institusi": ["Lihat Maklumat", "Terminate Perkhidmatan", "Surat Amaran", "Pengurusan Status"],
  };
  return capabilities[role] || ["Tidak ada kebolehan spesifik."];
};

const handleRoleChange = () => {
  showNotificationMessage("Peranan Berubah", `User sekarang adalah "${getRoleLabel(currentRole.value)}".`);
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Watch for status tab changes to reset pagination
watch(activeStatusTab, () => {
  currentPage.value = 1;
});

// Watch for filter changes to update applied filters
watch(filters, () => {
  // Auto-apply filters after a delay
  clearTimeout(window.filterTimeout);
  window.filterTimeout = setTimeout(() => {
    if (filters.value.searchQuery || filters.value.status || filters.value.kategori || filters.value.institusi) {
      applyFilters();
    }
  }, 500);
}, { deep: true });
</script>

<style scoped>
/* Enhanced styling */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 