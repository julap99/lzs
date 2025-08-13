<!-- 
  RTMF SCREEN: PA-KF-KJ-01_01 (Category List)
  PURPOSE: Senarai kategori penolong amil dengan workflow kelulusan
  DESCRIPTION: Category list with approval workflow for Penolong Amil categories
  ROUTE: /BF-PA/KF/KJ
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

    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Kategori Penolong Amil</h2>
            <p class="text-sm text-gray-600 mt-1">{{ getRoleSpecificDescription() }}</p>
          </div>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/KF/KJ/create')"
            v-if="canCreateCategory"
          >
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Kategori Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari kategori, kod singkatan..."
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.status"
              type="select"
              :options="statusOptions"
              placeholder="Status"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.kategori"
              type="select"
              :options="kategoriOptions"
              placeholder="Kategori"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Tabbed Table Section -->
        <!-- PT and Eksekutif Tabs -->
        <div v-if="['pt', 'eksekutif'].includes(currentRole)">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai kategori yang sedang dalam proses
                </h3>
                <rs-table
                  :key="`table-${tableKey}-process`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        v-if="canEditCategory(data.text)"
                        variant="secondary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="editCategory(data.text)"
                      >
                        Kemaskini
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai kategori yang aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        v-if="canEditCategory(data.text)"
                        variant="secondary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="editCategory(data.text)"
                      >
                        Kemaskini
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai kategori yang tidak aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        v-if="canEditCategory(data.text)"
                        variant="secondary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="editCategory(data.text)"
                      >
                        Kemaskini
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Ketua Jabatan Tabs -->
        <div v-if="currentRole === 'ketua-jabatan'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Pengesahan">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-yellow-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai kategori yang menunggu pengesahan
                </h3>
                <rs-table
                  :key="`table-${tableKey}-verify`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        variant="warning"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="navigateToVerification(data.text, 'verify')"
                      >
                        Sahkan
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai kategori yang aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai kategori yang tidak aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Ketua Divisyen Tabs -->
        <div v-if="currentRole === 'ketua-divisyen'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Kelulusan">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai kategori yang menunggu kelulusan
                </h3>
                <rs-table
                  :key="`table-${tableKey}-approve`"
                  :data="getTableDataByStatus(['Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        variant="success"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="navigateToVerification(data.text, 'approve')"
                      >
                        Luluskan
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai kategori yang aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai kategori yang tidak aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
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
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Senarai Kategori Penolong Amil",
});

const breadcrumb = ref([
  {
    name: "Utama",
    type: "link",
    path: "/"
  },
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA"
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF/KJ"
  },
  {
    name: "Kategori Penolong Amil",
    type: "current",
    path: "/BF-PA/KF/KJ"
  }
]);

// Role Simulator State
const currentRole = ref("pt"); // Default role
const showRoleInfo = ref(false);

// Page-specific role options for KF/KJ module
const roleOptions = [
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for KF/KJ module
const roleData = {
  pt: {
    label: "PT",
    description: "Pengurusan Kategori Penolong Amil (View Only)",
    capabilities: ["Lihat Senarai", "Monitor Progress", "Tidak Boleh Edit"],
  },
  eksekutif: {
    label: "Eksekutif",
    description: "Tambah dan Kemaskini Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Tambah Kategori", "Kemaskini Kategori", "Edit Penuh"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Pengesahan Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan Kategori", "Monitor Progress"],
  },
  "ketua-divisyen": {
    label: "Ketua Divisyen",
    description: "Kelulusan Akhir Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Luluskan Kategori", "Tolak Kategori", "Kelulusan Akhir"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    pt: "info",
    eksekutif: "success",
    "ketua-jabatan": "warning",
    "ketua-divisyen": "danger",
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
  
  // Show role change notification
  const roleLabel = getRoleLabel(currentRole.value);
  toast.info(`Peranan berubah kepada: ${roleLabel}`);
  
  // Refresh table to show role-specific data
  refreshTable();
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Filters
const filters = ref({
  searchQuery: "",
  status: "",
  kategori: "",
});

// Filter options
const statusOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Pengesahan", value: "Menunggu Pengesahan" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

const kategoriOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
];

// Table data and reactivity control - Now shows CATEGORIES, not people
const tableKey = ref(0);
const categoriesList = ref([
  {
    rujukan: "KJ-2024-001",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    kodSingkatan: "PAF",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 1
  },
  {
    rujukan: "KJ-2024-002",
    kategoriPenolongAmil: "Penolong Amil Padi",
    kodSingkatan: "PAP",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 2
  },
  {
    rujukan: "KJ-2024-003",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    kodSingkatan: "PAK",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 3
  },
  {
    rujukan: "KJ-2024-004",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    kodSingkatan: "PK+",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 4
  },
  {
    rujukan: "KJ-2024-005",
    kategoriPenolongAmil: "Penolong Amil Wakaf",
    kodSingkatan: "PAW",
    status: "Menunggu Pengesahan",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 5
  },
  {
    rujukan: "KJ-2024-006",
    kategoriPenolongAmil: "Penolong Amil Zakat Perniagaan",
    kodSingkatan: "PAZP",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 6
  },
  {
    rujukan: "KJ-2024-007",
    kategoriPenolongAmil: "Penolong Amil Zakat Emas",
    kodSingkatan: "PAZE",
    status: "Tidak Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 7
  }
]);

// Computed properties
const filteredCategories = computed(() => {
  let result = [...categoriesList.value];
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(category => 
      category.rujukan.toLowerCase().includes(query) ||
      category.kategoriPenolongAmil.toLowerCase().includes(query) ||
      category.kodSingkatan.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(category => category.status === filters.value.status);
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(category => 
      category.kategoriPenolongAmil === filters.value.kategori
    );
  }
  
  return result;
});

// Role-based access control
const canCreateCategory = computed(() => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can create
});

const canEditCategory = (categoryId) => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can edit
};

const canVerifyCategory = (categoryId) => {
  return currentRole.value === "ketua-jabatan";
};

const canApproveCategory = (categoryId) => {
  return currentRole.value === "ketua-divisyen";
};

// Methods
const viewCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KJ/detail/${categoryId}`);
};

const editCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KJ/edit/${categoryId}`);
};

const verifyCategory = (categoryId) => {
  // Update status to "Menunggu Kelulusan"
  const category = categoriesList.value.find(c => c.tindakan === categoryId);
  if (category) {
    category.status = "Menunggu Kelulusan";
    refreshTable();
    toast.success("Kategori penolong amil berjaya disahkan oleh Ketua Jabatan");
  }
};

const approveCategory = (categoryId) => {
  // Update status to "Aktif"
  const category = categoriesList.value.find(c => c.tindakan === categoryId);
  if (category) {
    category.status = "Aktif";
    refreshTable();
    toast.success("Kategori penolong amil berjaya diluluskan oleh Ketua Divisyen");
  }
};

const rejectCategory = (categoryId) => {
  // Update status to "Tidak Aktif"
  const category = categoriesList.value.find(c => c.tindakan === categoryId);
  if (category) {
    category.status = "Tidak Aktif";
    refreshTable();
    toast.success("Kategori penolong amil berjaya ditolak");
  }
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info',
  };
  return variants[status] || 'secondary'; // Use secondary instead of default
};

const getCategoryStatus = (categoryId) => {
  const category = categoriesList.value.find(c => c.tindakan === categoryId);
  return category ? category.status : "Tidak Diketahui";
};

const getRoleSpecificDescription = () => {
  const roleData = {
    pt: "Pengurusan Kategori Penolong Amil (View Only) - Lihat dan Monitor Progress",
    eksekutif: "Tambah dan Kemaskini Kategori Penolong Amil - Edit Penuh",
    "ketua-jabatan": "Pengesahan Kategori Penolong Amil - Sahkan Kategori",
    "ketua-divisyen": "Kelulusan Akhir Kategori Penolong Amil - Lulus/Tolak Kategori",
  };
  return roleData[currentRole.value] || "Tidak Diketahui";
};

const navigateToVerification = (categoryId, action) => {
  if (action === 'verify') {
    navigateTo(`/BF-PA/KF/KJ/verify/${categoryId}`);
  } else if (action === 'approve') {
    navigateTo(`/BF-PA/KF/KJ/approve/${categoryId}`);
  }
};

// New computed property for table data based on status
const getTableDataByStatus = (statuses) => {
  return filteredCategories.value.filter(category => statuses.includes(category.status));
};

// Default active tab based on role to prevent empty screen
const activeTab = ref("Sedang Proses");

// Get the best available tab for the current role
const getBestAvailableTabForRole = computed(() => {
  const role = currentRole.value;
  
  if (role === 'ketua-jabatan') {
    // Ketua Jabatan can see: "Menunggu Pengesahan", "Aktif", "Tidak Aktif"
    // Priority: Menunggu Pengesahan > Aktif > Tidak Aktif
    if (getTableDataByStatus(['Menunggu Pengesahan']).length > 0) {
      return "Menunggu Pengesahan";
    } else if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else {
      return "Tidak Aktif";
    }
  } else if (role === 'ketua-divisyen') {
    // Ketua Divisyen can see: "Menunggu Kelulusan", "Aktif", "Tidak Aktif"
    // Priority: Menunggu Kelulusan > Aktif > Tidak Aktif
    if (getTableDataByStatus(['Menunggu Kelulusan']).length > 0) {
      return "Menunggu Kelulusan";
    } else if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else {
      return "Tidak Aktif";
    }
  } else {
    // PT and Eksekutif can see: "Sedang Proses", "Aktif", "Tidak Aktif"
    // Priority: Sedang Proses > Aktif > Tidak Aktif
    if (getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan']).length > 0) {
      return "Sedang Proses";
    } else if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else {
      return "Tidak Aktif";
    }
  }
});

// Set default tab when role changes - ensures no empty screen
watch(currentRole, (newRole) => {
  // Get the best available tab for the new role
  const bestTab = getBestAvailableTabForRole.value;
  
  // Only change if the current tab is not available for the new role
  const currentTabIsAvailable = (() => {
    switch (activeTab.value) {
      case "Sedang Proses":
        return ['pt', 'eksekutif'].includes(newRole);
      case "Menunggu Pengesahan":
        return newRole === 'ketua-jabatan';
      case "Menunggu Kelulusan":
        return newRole === 'ketua-divisyen';
      case "Aktif":
      case "Tidak Aktif":
        return true; // These tabs are always available
      default:
        return false;
    }
  })();
  
  if (!currentTabIsAvailable) {
    activeTab.value = bestTab;
  }
}, { immediate: true });

// Additional safety check: ensure activeTab is always valid for current role
watch(activeTab, (newTab) => {
  const role = currentRole.value;
  let tabIsValid = false;
  
  switch (newTab) {
    case "Sedang Proses":
      tabIsValid = ['pt', 'eksekutif'].includes(role);
      break;
    case "Menunggu Pengesahan":
      tabIsValid = role === 'ketua-jabatan';
      break;
    case "Menunggu Kelulusan":
      tabIsValid = role === 'ketua-divisyen';
      break;
    case "Aktif":
    case "Tidak Aktif":
      tabIsValid = true; // Always valid
      break;
    default:
      tabIsValid = false;
  }
  
  if (!tabIsValid) {
    // Switch to a valid tab immediately
    activeTab.value = getBestAvailableTabForRole.value;
  }
});

// Table columns definition
const tableColumns = [
  {
    key: 'rujukan',
    label: 'Rujukan',
    sortable: true,
  },
  {
    key: 'kategoriPenolongAmil',
    label: 'Kategori Penolong Amil',
    sortable: true,
  },
  {
    key: 'kodSingkatan',
    label: 'Kod Singkatan',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'tindakan',
    label: 'Tindakan',
    sortable: false,
  },
];
</script> 