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
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Baru
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

        <!-- Updated Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredCategories"
          :pageSize="10"
          :showNoColumn="false"
          :columns="[
            {
              key: 'rujukan',
              label: 'Rujukan',
              sortable: true,
            },
            {
              key: 'nama',
              label: 'Nama',
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
          ]"
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
              <rs-button
                v-if="canDeleteCategory(data.text)"
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(data.text)"
              >
                Padam
              </rs-button>
              <rs-button
                v-if="canSupportCategory(data.text) && getCategoryStatus(data.text) === 'Menunggu Sokongan'"
                variant="success"
                size="sm"
                class="!px-2 !py-1"
                @click="supportCategory(data.text)"
              >
                Sokong
              </rs-button>
              <rs-button
                v-if="canVerifyCategory(data.text) && getCategoryStatus(data.text) === 'Disokong Eksekutif'"
                variant="info"
                size="sm"
                class="!px-2 !py-1"
                @click="verifyCategory(data.text)"
              >
                Sahkan
              </rs-button>
              <rs-button
                v-if="canApproveCategory(data.text) && getCategoryStatus(data.text) === 'Disahkan Ketua Jabatan'"
                variant="success"
                size="sm"
                class="!px-2 !py-1"
                @click="approveCategory(data.text)"
              >
                Lulus
              </rs-button>
              <rs-button
                v-if="canApproveCategory(data.text) && getCategoryStatus(data.text) === 'Disahkan Ketua Jabatan'"
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="rejectCategory(data.text)"
              >
                Tolak
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti ingin memadam kategori penolong amil ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteCategory">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Senarai Kategori Penolong Amil",
});

const breadcrumb = ref([
  {
    title: "Utama",
    path: "/"
  },
  {
    title: "BF-PA",
    path: "/BF-PA"
  },
  {
    title: "Konfigurasi",
    path: "/BF-PA/KF/KJ"
  },
  {
    title: "Kategori Penolong Amil",
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
    description: "Pengurusan Kategori Penolong Amil (Administrative)",
    capabilities: ["Lihat Senarai", "Kemaskini Kategori", "Semak Progress"],
  },
  eksekutif: {
    label: "Eksekutif",
    description: "Sokong dan Sokongan Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Sokong Kategori", "Semak Kategori"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Pengesahan dan Sahkan Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan Kategori", "Semak Kategori"],
  },
  "ketua-divisyen": {
    label: "Ketua Divisyen",
    description: "Kelulusan Akhir Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Lulus Kategori", "Tolak Kategori", "Kelulusan Akhir"],
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
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Sokongan", value: "Menunggu Sokongan" },
  { label: "Disokong Eksekutif", value: "Disokong Eksekutif" },
  { label: "Disahkan Ketua Jabatan", value: "Disahkan Ketua Jabatan" },
];

const kategoriOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
];

// Table data and reactivity control
const tableKey = ref(0);
const categoriesList = ref([
  {
    rujukan: "KJ-2024-001",
    nama: "Ahmad bin Abdullah",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    kodSingkatan: "PAF",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 1
  },
  {
    rujukan: "KJ-2024-002",
    nama: "Siti Aminah binti Omar",
    kategoriPenolongAmil: "Penolong Amil Padi",
    kodSingkatan: "PAP",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 2
  },
  {
    rujukan: "KJ-2024-003",
    nama: "Mohammed Ismail bin Hassan",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    kodSingkatan: "PAK",
    status: "Menunggu Sokongan",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 3
  },
  {
    rujukan: "KJ-2024-004",
    nama: "Fatimah binti Ahmad",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    kodSingkatan: "PAKO",
    status: "Disokong Eksekutif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 4
  },
  {
    rujukan: "KJ-2024-005",
    nama: "Abdul Rahman bin Ali",
    kategoriPenolongAmil: "Penolong Amil Zakat",
    kodSingkatan: "PAZ",
    status: "Disahkan Ketua Jabatan",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 5
  },
  {
    rujukan: "KJ-2024-006",
    nama: "Nor Azizah binti Ibrahim",
    kategoriPenolongAmil: "Penolong Amil Wakaf",
    kodSingkatan: "PAW",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 6
  }
]);

// Computed properties
const filteredCategories = computed(() => {
  let result = [...categoriesList.value];
  
  // Role-based data filtering
  if (currentRole.value === "pt") {
    // PT sees all categories for monitoring progress
    result = result;
  } else if (currentRole.value === "eksekutif") {
    // Eksekutif sees categories that need support
    result = result.filter(category => category.status === "Menunggu Sokongan");
  } else if (currentRole.value === "ketua-jabatan") {
    // Ketua Jabatan sees categories that need verification
    result = result.filter(category => category.status === "Disokong Eksekutif");
  } else if (currentRole.value === "ketua-divisyen") {
    // Ketua Divisyen sees categories that need final approval
    result = result.filter(category => category.status === "Disahkan Ketua Jabatan");
  }
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(category => 
      category.rujukan.toLowerCase().includes(query) ||
      category.nama.toLowerCase().includes(query) ||
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
  return currentRole.value === "pt"; // Only PT can edit
};

const canDeleteCategory = (categoryId) => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can delete
};

const canApproveCategory = (categoryId) => {
  return currentRole.value === "ketua-divisyen";
};

const canSupportCategory = (categoryId) => {
  return currentRole.value === "eksekutif";
};

const canVerifyCategory = (categoryId) => {
  return currentRole.value === "ketua-jabatan";
};

// Modal control
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);

// Methods
const viewCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KJ/detail/${categoryId}`);
};

const editCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KJ/edit/${categoryId}`);
};

const supportCategory = (categoryId) => {
  // Placeholder for support logic
  console.log("Supporting category:", categoryId);
  toast.success("Kategori penolong amil berjaya disokong");
};

const verifyCategory = (categoryId) => {
  // Placeholder for verification logic
  console.log("Verifying category:", categoryId);
  toast.success("Kategori penolong amil berjaya disahkan");
};

const approveCategory = (categoryId) => {
  // Placeholder for approval logic
  console.log("Approving category:", categoryId);
  toast.success("Kategori penolong amil berjaya diluluskan");
};

const rejectCategory = (categoryId) => {
  // Placeholder for rejection logic
  console.log("Rejecting category:", categoryId);
  toast.error("Kategori penolong amil berjaya ditolak");
};

const confirmDelete = (categoryId) => {
  categoryToDelete.value = categoryId;
  showDeleteModal.value = true;
};

const deleteCategory = () => {
  const index = categoriesList.value.findIndex(
    (category) => category.tindakan === categoryToDelete.value
  );

  if (index !== -1) {
    categoriesList.value.splice(index, 1);
    refreshTable();
  }
  showDeleteModal.value = false;
  categoryToDelete.value = null;

  toast.success("Kategori penolong amil berjaya dipadamkan");
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Sokongan":
      return "warning";
    case "Disokong Eksekutif":
      return "info";
    case "Disahkan Ketua Jabatan":
      return "primary";
    default:
      return "default";
  }
};

const getCategoryStatus = (categoryId) => {
  const category = categoriesList.value.find(c => c.tindakan === categoryId);
  return category ? category.status : "Tidak Diketahui";
};

const getRoleSpecificDescription = () => {
  const roleData = {
    pt: "Pengurusan Kategori Penolong Amil (Administrative) - Lihat, Kemaskini, Semak Progress",
    eksekutif: "Sokong dan Sokongan Kategori Penolong Amil - Sokong Kategori (Tiada Kemaskini)",
    "ketua-jabatan": "Pengesahan dan Sahkan Kategori Penolong Amil - Sahkan Kategori",
    "ketua-divisyen": "Kelulusan Akhir Kategori Penolong Amil - Lulus/Tolak Kategori",
  };
  return roleData[currentRole.value] || "Tidak Diketahui";
};
</script> 