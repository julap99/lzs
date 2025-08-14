<!-- 
  RTMF SCREEN: PA-PP-KP-01_01 (Main Listing)
  PURPOSE: Kemaskini Maklumat Perkhidmatan Penolong Amil - Main listing page
  DESCRIPTION: Main page for viewing and managing Penolong Amil service update requests
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
            Kemaskini Maklumat Perkhidmatan Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">
            {{ getRoleSpecificDescription(currentRole) }} - {{ filteredRequests.length }} permintaan menunggu tindakan
          </p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PP/KP/kemaskini/new')"
            v-if="canCreateRequest"
            class="flex items-center"
          >
            <Icon name="ph:plus" class="w-4 h-4 mr-2" />
            Kemaskini Maklumat
          </rs-button>
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
              placeholder="Rujukan, nama, no. KP..."
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
          <h3 class="text-lg font-semibold text-gray-900">Senarai Permintaan Kemaskini</h3>
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
                  Rujukan
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penolong Amil
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
                  Tarikh Permintaan
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
                  <div class="text-sm font-medium text-gray-900">{{ request.rujukan }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ request.penolongAmil.nama }}</div>
                    <div class="text-sm text-gray-500">{{ request.penolongAmil.noKP }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ request.newKategori }}</div>
                  <div class="text-xs text-gray-500">{{ request.currentKategori }} → {{ request.newKategori }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ request.newInstitusi }}</div>
                  <div class="text-xs text-gray-500">{{ request.currentInstitusi }} → {{ request.newInstitusi }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <rs-badge :variant="getStatusVariant(request.status)">
                    {{ getStatusLabel(request.status) }}
                  </rs-badge>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(request.tarikhPermintaan) }}</div>
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
                    <rs-button
                      v-if="canPerformAction(request)"
                      :variant="getActionButtonVariant(currentRole)"
                      size="sm"
                      @click="performAction(request)"
                      class="flex items-center"
                    >
                      <Icon :name="getActionIcon(currentRole)" class="w-3 h-3 mr-1" />
                      {{ getActionLabel(currentRole) }}
                    </rs-button>
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
import { ref, computed, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";

definePageMeta({
  title: "Kemaskini Maklumat Perkhidmatan",
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
      name: "Kemaskini Maklumat Perkhidmatan",
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
    name: "Kemaskini Maklumat Perkhidmatan",
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

// Enhanced notifications
const showNotification = ref(false);
const notificationTitle = ref("");
const notificationMessage = ref("");

// Enhanced options
const statusOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Menunggu Semakan", value: "pending" },
  { label: "Disemak PT", value: "pt_reviewed" },
  { label: "Disokong Eksekutif", value: "executive_supported" },
  { label: "Disahkan Jabatan", value: "department_confirmed" },
  { label: "Diluluskan", value: "approved" },
  { label: "Ditolak", value: "rejected" },
  { label: "Perlu Maklumat Tambahan", value: "need_more_info" },
  { label: "Dihantar Semula", value: "resubmitted" },
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

// Enhanced mock data with role-specific filtering
const requests = ref([
  {
    id: "KP001",
    rujukan: "KP-2024-001",
    penolongAmil: {
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
    },
    currentKategori: "Penolong Amil Fitrah",
    newKategori: "Penolong Amil Kariah",
    currentInstitusi: "Masjid Al-Hidayah",
    newInstitusi: "Surau Al-Amin",
    status: "pending",
    tarikhPermintaan: "15-01-2024",
  },
  {
    id: "KP002",
    rujukan: "KP-2024-002",
    penolongAmil: {
      nama: "Mohd Ali bin Hassan",
      noKP: "850315045678",
    },
    currentKategori: "Penolong Amil Padi",
    newKategori: "Penolong Amil Komuniti",
    currentInstitusi: "Surau Al-Amin",
    newInstitusi: "Kompleks Islam",
    status: "pt_reviewed",
    tarikhPermintaan: "14-01-2024",
  },
  {
    id: "KP003",
    rujukan: "KP-2024-003",
    penolongAmil: {
      nama: "Fatimah binti Omar",
      noKP: "920512078901",
    },
    currentKategori: "Penolong Amil Kariah",
    newKategori: "Penolong Amil Fitrah",
    currentInstitusi: "Kompleks Islam",
    newInstitusi: "Masjid Al-Hidayah",
    status: "executive_supported",
    tarikhPermintaan: "13-01-2024",
  },
  {
    id: "KP004",
    rujukan: "KP-2024-004",
    penolongAmil: {
      nama: "Siti Aminah binti Ismail",
      noKP: "880723123456",
    },
    currentKategori: "Penolong Amil Komuniti",
    newKategori: "Penolong Amil Padi",
    currentInstitusi: "Masjid Al-Hidayah",
    newInstitusi: "Surau Al-Amin",
    status: "department_confirmed",
    tarikhPermintaan: "12-01-2024",
  },
  {
    id: "KP005",
    rujukan: "KP-2024-005",
    penolongAmil: {
      nama: "Zainal bin Ibrahim",
      noKP: "870415234567",
    },
    currentKategori: "Penolong Amil Fitrah",
    newKategori: "Penolong Amil Kariah",
    currentInstitusi: "Surau Al-Amin",
    newInstitusi: "Kompleks Islam",
    status: "need_more_info",
    tarikhPermintaan: "11-01-2024",
  },
  {
    id: "KP006",
    rujukan: "KP-2024-006",
    penolongAmil: {
      nama: "Nurul Huda binti Ahmad",
      noKP: "930625345678",
    },
    currentKategori: "Penolong Amil Padi",
    newKategori: "Penolong Amil Komuniti",
    currentInstitusi: "Kompleks Islam",
    newInstitusi: "Masjid Al-Hidayah",
    status: "resubmitted",
    tarikhPermintaan: "10-01-2024",
  },
  {
    id: "KP007",
    rujukan: "KP-2024-007",
    penolongAmil: {
      nama: "Abdul Rahman bin Hassan",
      noKP: "890715456789",
    },
    currentKategori: "Penolong Amil Kariah",
    newKategori: "Penolong Amil Fitrah",
    currentInstitusi: "Masjid Al-Hidayah",
    newInstitusi: "Surau Al-Amin",
    status: "pending",
    tarikhPermintaan: "09-01-2024",
  },
  {
    id: "KP008",
    rujukan: "KP-2024-008",
    penolongAmil: {
      nama: "Noraini binti Abdullah",
      noKP: "910825567890",
    },
    currentKategori: "Penolong Amil Komuniti",
    newKategori: "Penolong Amil Padi",
    currentInstitusi: "Surau Al-Amin",
    newInstitusi: "Kompleks Islam",
    status: "pt_reviewed",
    tarikhPermintaan: "08-01-2024",
  },
  {
    id: "KP009",
    rujukan: "KP-2024-009",
    penolongAmil: {
      nama: "Ismail bin Hassan",
      noKP: "870925678901",
    },
    currentKategori: "Penolong Amil Fitrah",
    newKategori: "Penolong Amil Kariah",
    currentInstitusi: "Kompleks Islam",
    newInstitusi: "Masjid Al-Hidayah",
    status: "executive_supported",
    tarikhPermintaan: "07-01-2024",
  },
  {
    id: "KP010",
    rujukan: "KP-2024-010",
    penolongAmil: {
      nama: "Aminah binti Mohamed",
      noKP: "920103789012",
    },
    currentKategori: "Penolong Amil Padi",
    newKategori: "Penolong Amil Komuniti",
    currentInstitusi: "Masjid Al-Hidayah",
    newInstitusi: "Surau Al-Amin",
    status: "department_confirmed",
    tarikhPermintaan: "06-01-2024",
  },
]);

// Enhanced computed properties with role-specific filtering
const filteredRequests = computed(() => {
  let result = [...requests.value];
  
  // Role-specific filtering
  const role = currentRole.value;
  
  // PT can only see pending requests (waiting for PT review)
  if (role === "pt") {
    result = result.filter(request => request.status === "pending");
  }
  
  // Eksekutif can only see pt_reviewed requests (waiting for executive support)
  else if (role === "eksekutif") {
    result = result.filter(request => request.status === "pt_reviewed");
  }
  
  // Ketua Jabatan can only see executive_supported requests (waiting for department confirmation)
  else if (role === "ketua-jabatan") {
    result = result.filter(request => request.status === "executive_supported");
  }
  
  // Ketua Divisyen can only see department_confirmed requests (waiting for final approval)
  else if (role === "ketua-divisyen") {
    result = result.filter(request => request.status === "department_confirmed");
  }
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(request => 
      request.rujukan.toLowerCase().includes(query) ||
      request.penolongAmil.nama.toLowerCase().includes(query) ||
      request.penolongAmil.noKP.includes(query)
    );
  }
  
  // Apply status filter (only if not role-specific)
  if (filters.value.status && role === "pt") {
    result = result.filter(request => request.status === filters.value.status);
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(request => 
      request.newKategori.toLowerCase().includes(filters.value.kategori.toLowerCase())
    );
  }
  
  // Apply institusi filter
  if (filters.value.institusi) {
    result = result.filter(request => 
      request.newInstitusi.toLowerCase().includes(filters.value.institusi.toLowerCase())
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

const stats = computed(() => {
  const role = currentRole.value;
  let relevantRequests = [];
  
  // Get relevant requests for current role
  if (role === "pt") {
    relevantRequests = requests.value.filter(r => r.status === "pending");
  } else if (role === "eksekutif") {
    relevantRequests = requests.value.filter(r => r.status === "pt_reviewed");
  } else if (role === "ketua-jabatan") {
    relevantRequests = requests.value.filter(r => r.status === "executive_supported");
  } else if (role === "ketua-divisyen") {
    relevantRequests = requests.value.filter(r => r.status === "department_confirmed");
  } else {
    relevantRequests = requests.value;
  }

  const total = relevantRequests.length;
  const pending = relevantRequests.filter((r) => r.status === "pending").length;
  const approved = relevantRequests.filter((r) => r.status === "approved").length;
  const rejected = relevantRequests.filter((r) => r.status === "rejected").length;
  const needMoreInfo = relevantRequests.filter((r) => r.status === "need_more_info").length;
  const resubmitted = relevantRequests.filter((r) => r.status === "resubmitted").length;

  return {
    totalRequests: total,
    pendingRequests: pending + needMoreInfo + resubmitted,
    approvedRequests: approved,
    rejectedRequests: rejected,
  };
});

// Enhanced helper functions
const getStatusVariant = (status) => {
  const variants = {
    pending: "warning",
    pt_reviewed: "info",
    executive_supported: "info",
    department_confirmed: "info",
    approved: "success",
    rejected: "danger",
    need_more_info: "warning",
    resubmitted: "info",
  };
  return variants[status] || "disabled"; // Use disabled for proper grey color
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Menunggu Semakan",
    pt_reviewed: "Disemak PT",
    executive_supported: "Disokong Eksekutif",
    department_confirmed: "Disahkan Jabatan",
    approved: "Diluluskan",
    rejected: "Ditolak",
    need_more_info: "Perlu Maklumat Tambahan",
    resubmitted: "Dihantar Semula",
  };
  return labels[status] || status;
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
  navigateTo(`/BF-PA/PP/KP/${role}/detail/${request.rujukan}`);
};

const editRequest = (request) => {
  navigateTo(`/BF-PA/PP/KP/kemaskini/${request.rujukan}`);
};

const exportData = () => {
  // Simulate export functionality
  showNotificationMessage("Muat Turun Berjaya", "Data telah dieksport ke fail Excel.");
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
const canCreateRequest = computed(() => {
  // Mock user role - in real app, get from auth context
  const userRole = "eksekutif"; // or "Ketua Jabatan"
  return userRole === "eksekutif" || userRole === "Ketua Jabatan";
});

const canEditRequest = (request) => {
  // Only allow editing if status is pending or need_more_info
  return request.status === "pending" || request.status === "need_more_info";
};

// Role-based action control
const canPerformAction = (request) => {
  const role = currentRole.value;
  
  // PT can act on pending requests
  if (role === "pt" && request.status === "pending") {
    return true;
  }
  
  // Eksekutif can act on pt_reviewed requests
  if (role === "eksekutif" && request.status === "pt_reviewed") {
    return true;
  }
  
  // Ketua Jabatan can act on executive_supported requests
  if (role === "ketua-jabatan" && request.status === "executive_supported") {
    return true;
  }
  
  // Ketua Divisyen can act on department_confirmed requests
  if (role === "ketua-divisyen" && request.status === "department_confirmed") {
    return true;
  }
  
  return false;
};

const getActionLabel = (role) => {
  const labels = {
    "pt": "Semak",
    "eksekutif": "Sokong",
    "ketua-jabatan": "Sahkan",
    "ketua-divisyen": "Luluskan",
  };
  return labels[role] || "Tindakan";
};

const getActionIcon = (role) => {
  const icons = {
    "pt": "ph:check-circle",
    "eksekutif": "ph:handshake",
    "ketua-jabatan": "ph:shield-check",
    "ketua-divisyen": "ph:crown",
  };
  return icons[role] || "ph:gear";
};

const getActionButtonVariant = (role) => {
  const variants = {
    "pt": "info",
    "eksekutif": "success",
    "ketua-jabatan": "warning",
    "ketua-divisyen": "danger",
  };
  return variants[role] || "primary";
};

const getRoleSpecificDescription = (role) => {
  const descriptions = {
    "pt": "Semakan kemaskini maklumat Perkhidmatan Penolong Amil oleh PT",
    "eksekutif": "Sokongan kemaskini maklumat Perkhidmatan Penolong Amil oleh Eksekutif",
    "ketua-jabatan": "Pengesahan kemaskini maklumat Perkhidmatan Penolong Amil oleh Ketua Jabatan",
    "ketua-divisyen": "Kelulusan kemaskini maklumat Perkhidmatan Penolong Amil oleh Ketua Divisyen",
  };
  return descriptions[role] || "Peranan ini mempunyai kebolehan yang berbeza.";
};

const performAction = (request) => {
  const role = currentRole.value;
  const actionLabel = getActionLabel(role);
  
  showNotificationMessage(
    "Tindakan Berjaya", 
    `Permintaan ${request.rujukan} telah ${actionLabel.toLowerCase()} oleh ${getRoleLabel(role)}.`
  );
  
  // Navigate to appropriate detail page for the action
  navigateTo(`/BF-PA/PP/KP/${role}/detail/${request.rujukan}`);
};

// Role Switcher State
const currentRole = ref("pt"); // Default role
const roleOptions = [
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];
const showRoleInfo = ref(false);

const getRoleVariant = (role) => {
  const variants = {
    "pt": "info",
    "eksekutif": "success",
    "ketua-jabatan": "warning",
    "ketua-divisyen": "danger",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role) => {
  const labels = {
    "pt": "PT",
    "eksekutif": "Eksekutif",
    "ketua-jabatan": "Ketua Jabatan",
    "ketua-divisyen": "Ketua Divisyen",
  };
  return labels[role] || role;
};

const getRoleDescription = (role) => {
  const descriptions = {
    "pt": "Semakan kemaskini maklumat Perkhidmatan Penolong Amil oleh PT",
    "eksekutif": "Sokongan kemaskini maklumat Perkhidmatan Penolong Amil oleh Eksekutif",
    "ketua-jabatan": "Pengesahan kemaskini maklumat Perkhidmatan Penolong Amil oleh Ketua Jabatan",
    "ketua-divisyen": "Kelulusan kemaskini maklumat Perkhidmatan Penolong Amil oleh Ketua Divisyen",
  };
  return descriptions[role] || "Peranan ini mempunyai kebolehan yang berbeza.";
};

const getRoleCapabilities = (role) => {
  const capabilities = {
    "pt": ["Semak Permintaan", "Lulus/Sahkan", "Tolak", "Hantar ke Eksekutif"],
    "eksekutif": ["Sokong Permintaan", "Sokong", "Tolak", "Hantar ke Ketua Jabatan"],
    "ketua-jabatan": ["Sahkan Permintaan", "Sahkan", "Tolak", "Hantar ke Ketua Divisyen"],
    "ketua-divisyen": ["Luluskan Permintaan", "Lulus", "Tolak", "Kelulusan Akhir"],
  };
  return capabilities[role] || ["Tidak ada kebolehan spesifik."];
};

const handleRoleChange = () => {
  showNotificationMessage("Peranan Berubah", `User sekarang adalah "${getRoleLabel(currentRole.value)}".`);
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

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