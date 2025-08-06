<template>
  <div>
    <!-- Page screen: TNI-KO-KT-07 -->
    <!-- Actor: Kewangan -->
    <!-- Roles: Kewangan Pegawai -->
    
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
    
    <!-- Kewangan Pegawai Content -->
    <div v-if="currentRole === 'kewangan-pegawai'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Untuk Arahan Pindahan</h2>
            <rs-button variant="primary" @click="refreshList">
              <Icon name="material-symbols:refresh" class="mr-1" />
              Refresh List
            </rs-button>
          </div>
        </template>

        <template #body>
          <!-- Filter Panel -->
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Status Filter -->
              <FormKit
                type="select"
                name="statusFilter"
                label="Status Permohonan"
                :options="statusOptions"
                v-model="filters.status"
              />

              <!-- Date Range Filter -->
              <FormKit
                type="date"
                name="dateFrom"
                label="Tarikh Dari"
                v-model="filters.dateFrom"
              />

              <FormKit
                type="date"
                name="dateTo"
                label="Tarikh Hingga"
                v-model="filters.dateTo"
              />

              <!-- Action Buttons -->
              <div class="flex items-end space-x-2">
                <rs-button variant="primary" @click="applyFilters">
                  <Icon name="material-symbols:search" class="mr-1" />
                  Cari
                </rs-button>
                <rs-button variant="secondary" @click="resetFilters">
                  <Icon name="material-symbols:refresh" class="mr-1" />
                  Reset
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredTransferOrders"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:kaedah="data">
              <rs-badge variant="outline">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:jumlah="data">
              <div class="font-medium text-right">
                RM {{ formatNumber(data.text) }}
              </div>
            </template>

            <template v-slot:status="data">
              <rs-badge :variant="getStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="data">
              <div class="flex space-x-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="issueTransferOrder(data.text)"
                >
                  <Icon name="ph:file-text" size="15" class="mr-1" />
                  Arahkan Pindahan
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Default Content (for other roles) -->
    <div v-else>
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Untuk Arahan Pindahan</h2>
          </div>
        </template>

        <template #body>
          <div class="text-center py-8">
            <Icon name="ph:info" class="text-gray-400 mx-auto mb-4" size="48" />
            <p class="text-gray-600">Tiada akses untuk peranan ini</p>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Untuk Arahan Pindahan",
});

// Role Simulator State
const currentRole = ref("kewangan-pegawai");
const showRoleInfo = ref(false);

// Page-specific role options for TNI-KO-KT-07
const roleOptions = [
  { label: "Kewangan Pegawai", value: "kewangan-pegawai" },
];

// Role data for TNI-KO-KT-07
const roleData = {
  "kewangan-pegawai": {
    label: "Kewangan Pegawai",
    description: "Senarai Untuk Arahan Pindahan",
    capabilities: ["Lihat Permohonan", "Arahkan Pindahan", "Kelola Arahan"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    "kewangan-pegawai": "success",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role) => {
  return roleData[role]?.label || role;
};

const getRoleDescription = (role) => {
  return roleData[role]?.description || "";
};

const getRoleCapabilities = (role) => {
  return roleData[role]?.capabilities || [];
};

const handleRoleChange = () => {
  console.log("Role changed to:", currentRole.value);
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI",
  },
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Senarai Untuk Arahan Pindahan",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai/senarai-arahan",
  },
]);

// Table data and filters
const tableKey = ref(0);
const filters = ref({
  status: "",
  dateFrom: "",
  dateTo: "",
});

// Status options for filter
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Lulus Semakan – Menunggu Pindahan", value: "Lulus Semakan – Menunggu Pindahan" },
  { label: "Telah Diarahkan", value: "Telah Diarahkan" },
  { label: "Sah & Siap", value: "Sah & Siap" },
  { label: "Ditolak", value: "Ditolak" },
];

// Transfer orders data (approved requests waiting for transfer order)
const transferOrders = ref([
  {
    id: "KT-2024-010",
    tarikh: "2024-03-16",
    lokasi: "Cawangan Perak",
    kaedah: "Tunai",
    jumlah: 60000,
    status: "Lulus Semakan – Menunggu Pindahan",
    tindakan: { id: "KT-2024-010", status: "Lulus Semakan – Menunggu Pindahan" }
  },
  {
    id: "KT-2024-011",
    tarikh: "2024-03-15",
    lokasi: "Cawangan Kedah",
    kaedah: "eWallet",
    jumlah: 35000,
    status: "Lulus Semakan – Menunggu Pindahan",
    tindakan: { id: "KT-2024-011", status: "Lulus Semakan – Menunggu Pindahan" }
  },
  {
    id: "KT-2024-012",
    tarikh: "2024-03-14",
    lokasi: "Cawangan Terengganu",
    kaedah: "Tunai",
    jumlah: 45000,
    status: "Lulus Semakan – Menunggu Pindahan",
    tindakan: { id: "KT-2024-012", status: "Lulus Semakan – Menunggu Pindahan" }
  }
]);

// Computed properties
const filteredTransferOrders = computed(() => {
  let filtered = transferOrders.value;
  
  // Filter by status
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status);
  }
  
  // Filter by date range
  if (filters.value.dateFrom) {
    filtered = filtered.filter(order => new Date(order.tarikh) >= new Date(filters.value.dateFrom));
  }
  
  if (filters.value.dateTo) {
    filtered = filtered.filter(order => new Date(order.tarikh) <= new Date(filters.value.dateTo));
  }
  
  return filtered;
});

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Lulus Semakan – Menunggu Pindahan':
      return 'info';
    case 'Telah Diarahkan':
      return 'success';
    case 'Sah & Siap':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const refreshList = () => {
  tableKey.value++;
  console.log("TNI-KO-KT-07: Senarai Untuk Arahan Pindahan - Refresh list");
};

const applyFilters = () => {
  console.log("TNI-KO-KT-07: Senarai Untuk Arahan Pindahan - Apply filters");
  console.log("Filters:", filters.value);
};

const resetFilters = () => {
  filters.value = {
    status: "",
    dateFrom: "",
    dateTo: "",
  };
  console.log("TNI-KO-KT-07: Senarai Untuk Arahan Pindahan - Reset filters");
};

const issueTransferOrder = (request) => {
  console.log("TNI-KO-KT-07: Senarai Untuk Arahan Pindahan - Issue transfer order");
  console.log("Request ID:", request.id);
  navigateTo(`/BF-TNI/tambah-nilai-tunai/keluarkan-arahan/${request.id}`);
};
</script> 