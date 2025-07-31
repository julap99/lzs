<!-- 
  RTMF SCREEN: PA-PP-KP-01_01 (Main Listing)
  PURPOSE: Kemaskini Maklumat Perkhidmatan Penolong Amil - Main listing page
  DESCRIPTION: Main page for viewing and managing Penolong Amil service update requests
  ROUTE: /BF-PA/PP/KP
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:gear" class="w-6 h-6 mr-3 text-primary" />
            Kemaskini Maklumat Perkhidmatan Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Urus permintaan kemaskini maklumat perkhidmatan penolong amil</p>
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

    <!-- Enhanced Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <rs-card class="hover:shadow-lg transition-shadow duration-200">
        <template #body>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-primary">{{ stats.totalRequests }}</div>
              <div class="text-sm text-gray-600">Jumlah Permintaan</div>
            </div>
            <Icon name="ph:file-text" class="w-8 h-8 text-primary opacity-60" />
          </div>
        </template>
      </rs-card>
      
      <rs-card class="hover:shadow-lg transition-shadow duration-200">
        <template #body>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-warning">{{ stats.pendingRequests }}</div>
              <div class="text-sm text-gray-600">Menunggu Semakan</div>
            </div>
            <Icon name="ph:clock" class="w-8 h-8 text-warning opacity-60" />
          </div>
        </template>
      </rs-card>
      
      <rs-card class="hover:shadow-lg transition-shadow duration-200">
        <template #body>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-success">{{ stats.approvedRequests }}</div>
              <div class="text-sm text-gray-600">Diluluskan</div>
            </div>
            <Icon name="ph:check-circle" class="w-8 h-8 text-success opacity-60" />
          </div>
        </template>
      </rs-card>
      
      <rs-card class="hover:shadow-lg transition-shadow duration-200">
        <template #body>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-danger">{{ stats.rejectedRequests }}</div>
              <div class="text-sm text-gray-600">Ditolak</div>
            </div>
            <Icon name="ph:x-circle" class="w-8 h-8 text-danger opacity-60" />
          </div>
        </template>
      </rs-card>
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
            Reset Penapis
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
              Eksport
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
                      v-if="canEditRequest(request)"
                      variant="secondary-outline"
                      size="sm"
                      @click="editRequest(request)"
                      class="flex items-center"
                    >
                      <Icon name="ph:pencil" class="w-3 h-3 mr-1" />
                      Edit
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
  { label: "Semua Status", value: "" },
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
  { label: "Semua Kategori", value: "" },
  { label: "Penolong Amil Fitrah", value: "fitrah" },
  { label: "Penolong Amil Padi", value: "padi" },
  { label: "Penolong Amil Kariah", value: "kariah" },
  { label: "Penolong Amil Komuniti", value: "komuniti" },
];

const institusiOptions = [
  { label: "Semua Institusi", value: "" },
  { label: "Masjid Al-Hidayah", value: "masjid_al_hidayah" },
  { label: "Surau Al-Amin", value: "surau_al_amin" },
  { label: "Kompleks Islam", value: "kompleks_islam" },
];

// Enhanced mock data
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
    tarikhPermintaan: "2024-01-15",
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
    tarikhPermintaan: "2024-01-14",
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
    tarikhPermintaan: "2024-01-13",
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
    status: "approved",
    tarikhPermintaan: "2024-01-12",
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
    tarikhPermintaan: "2024-01-11",
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
    tarikhPermintaan: "2024-01-10",
  },
]);

// Enhanced computed properties
const filteredRequests = computed(() => {
  return requests.value.filter(request => {
    const matchesSearch = !filters.value.searchQuery || 
      request.rujukan.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      request.penolongAmil.nama.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      request.penolongAmil.noKP.includes(filters.value.searchQuery);
    
    const matchesStatus = !filters.value.status || request.status === filters.value.status;
    const matchesKategori = !filters.value.kategori || request.newKategori.toLowerCase().includes(filters.value.kategori.toLowerCase());
    const matchesInstitusi = !filters.value.institusi || request.newInstitusi.toLowerCase().includes(filters.value.institusi.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesKategori && matchesInstitusi;
  });
});

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRequests.value.length));
const paginatedRequests = computed(() => {
  return filteredRequests.value.slice(startIndex.value, endIndex.value);
});

const stats = computed(() => {
  const total = requests.value.length;
  const pending = requests.value.filter((r) => r.status === "pending").length;
  const approved = requests.value.filter((r) => r.status === "approved").length;
  const rejected = requests.value.filter((r) => r.status === "rejected").length;
  const needMoreInfo = requests.value.filter((r) => r.status === "need_more_info").length;
  const resubmitted = requests.value.filter((r) => r.status === "resubmitted").length;

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
  return variants[status] || "default";
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
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
  // Navigate to appropriate detail page based on status and role
  let detailPath = '';
  
  if (request.status === 'pending') {
    detailPath = `/BF-PA/PP/KP/pt/detail/${request.rujukan}`;
  } else if (request.status === 'pt_reviewed') {
    detailPath = `/BF-PA/PP/KP/eksekutif/detail/${request.rujukan}`;
  } else if (request.status === 'executive_supported') {
    detailPath = `/BF-PA/PP/KP/ketua-jabatan/detail/${request.rujukan}`;
  } else if (request.status === 'department_confirmed') {
    detailPath = `/BF-PA/PP/KP/ketua-divisyen/detail/${request.rujukan}`;
  } else {
    detailPath = `/BF-PA/PP/KP/kemaskini/${request.rujukan}`;
  }
  
  navigateTo(detailPath);
};

const editRequest = (request) => {
  navigateTo(`/BF-PA/PP/KP/kemaskini/${request.rujukan}`);
};

const exportData = () => {
  // Simulate export functionality
  showNotificationMessage("Eksport Berjaya", "Data telah dieksport ke fail Excel.");
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
  const userRole = "PYB Institusi"; // or "Eksekutif"
  return userRole === "PYB Institusi" || userRole === "Eksekutif";
});

const canEditRequest = (request) => {
  // Only allow editing if status is pending or need_more_info
  return request.status === "pending" || request.status === "need_more_info";
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