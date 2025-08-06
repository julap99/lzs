<template>
  <div>
    <!-- Page screen: TNI-TD-Kelulusan -->
    <!-- Actor: Ketua Jabatan, Ketua Divisyen -->
    <!-- Roles: Ketua Jabatan, Ketua Divisyen -->
    
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
    
    <!-- Ketua Jabatan Content -->
    <div v-if="currentRole === 'ketua-jabatan'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Permohonan Menunggu Kelulusan (Ketua Jabatan)</h2>
          </div>
        </template>

        <template #body>
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
          <FormKit
            type="text"
            label="ID Permohonan"
            v-model="filters.idPermohonan"
            placeholder="Cari ID Permohonan..."
            class="w-full md:w-48"
          />
          <FormKit
            type="text"
            label="Nama EOAD Pemohon"
            v-model="filters.namaEoad"
            placeholder="Cari nama pemohon..."
            class="w-full md:w-64"
          />
          <FormKit
            type="text"
            label="Lokasi Lapangan"
            v-model="filters.lokasiLapangan"
            placeholder="Cari lokasi..."
            class="w-full md:w-64"
          />
          <div class="flex items-end space-x-2">
            <rs-button variant="primary" @click="handleSearch">
              <Icon name="material-symbols:search" class="mr-1" /> Cari
            </rs-button>
            <rs-button variant="secondary" @click="handleReset">
              <Icon name="material-symbols:refresh" class="mr-1" /> Reset
            </rs-button>
          </div>
        </div>

                    <!-- Table -->
            <rs-table
              class="mt-4"
              :key="tableKey"
              :data="filteredKJPermohonanList"
              :pageSize="10"
              :showNoColumn="true"
              :options="{
                variant: 'default',
                hover: true,
              }"
            >
          <template v-slot:idPermohonan="data">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewPermohonan(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:tarikhPermohonan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:namaEoad="data">
            {{ data.text }}
          </template>

          <template v-slot:lokasiLapangan="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:status="data">
            <rs-badge variant="warning">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="viewAndProcess(data.text)"
              >
                <Icon name="material-symbols:visibility" size="15" class="mr-1" />
                View & Lulus/Tolak
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>

  <!-- Ketua Divisyen Content -->
  <div v-else-if="currentRole === 'ketua-divisyen'">
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Menunggu Kelulusan (Ketua Divisyen)</h2>
        </div>
      </template>

      <template #body>
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
          <FormKit
            type="text"
            label="ID Permohonan"
            v-model="filters.idPermohonan"
            placeholder="Cari ID Permohonan..."
            class="w-full md:w-48"
          />
          <FormKit
            type="text"
            label="Nama EOAD Pemohon"
            v-model="filters.namaEoad"
            placeholder="Cari nama pemohon..."
            class="w-full md:w-64"
          />
          <FormKit
            type="text"
            label="Lokasi Lapangan"
            v-model="filters.lokasiLapangan"
            placeholder="Cari lokasi..."
            class="w-full md:w-64"
          />
          <div class="flex items-end space-x-2">
            <rs-button variant="primary" @click="handleSearch">
              <Icon name="material-symbols:search" class="mr-1" /> Cari
            </rs-button>
            <rs-button variant="secondary" @click="handleReset">
              <Icon name="material-symbols:refresh" class="mr-1" /> Reset
            </rs-button>
          </div>
        </div>

        <!-- Table -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredKDPermohonanList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:idPermohonan="data">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewPermohonan(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:tarikhPermohonan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:namaEoad="data">
            {{ data.text }}
          </template>

          <template v-slot:lokasiLapangan="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:status="data">
            <rs-badge variant="warning">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="approvePermohonan(data.text)"
              >
                <Icon name="material-symbols:check" size="15" class="mr-1" />
                Lulus
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="rejectPermohonan(data.text)"
              >
                <Icon name="material-symbols:close" size="15" class="mr-1" />
                Tolak
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
          <h2 class="text-xl font-semibold">Senarai Permohonan Menunggu Kelulusan</h2>
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
  title: "Senarai Permohonan Menunggu Kelulusan",
  middleware: ["auth"],
  requiresAuth: true,
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/tunai-dilapangan",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-TNI/tunai-dilapangan/kelulusan",
  },
]);

// Role Simulator State
const currentRole = ref("ketua-jabatan");
const showRoleInfo = ref(false);

// Page-specific role options for Tunai Dilapangan Kelulusan
const roleOptions = [
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for Tunai Dilapangan Kelulusan
const roleData = {
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Kelulusan Permohonan dalam Jurisdiction",
    capabilities: ["Lulus Permohonan", "Tolak Permohonan", "Lihat Butiran", "Kelulusan"],
  },
  "ketua-divisyen": {
    label: "Ketua Divisyen",
    description: "Kelulusan Permohonan Keseluruhan Divisyen",
    capabilities: ["Lulus Permohonan", "Tolak Permohonan", "Lihat Butiran", "Kelulusan Divisyen"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
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
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Table data and reactivity control
const tableKey = ref(0);
const filters = ref({
  idPermohonan: "",
  namaEoad: "",
  lokasiLapangan: "",
});

// Ketua Jabatan Data (Permohonan dalam jurisdiction)
const kjPermohonanList = ref([
  {
    idPermohonan: "TD-2024-001",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Ahmad bin Abdullah",
    lokasiLapangan: "Lokasi A",
    jumlahTunai: 5000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-001"
  },
  {
    idPermohonan: "TD-2024-002",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Siti binti Ali",
    lokasiLapangan: "Lokasi B",
    jumlahTunai: 3000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-002"
  }
]);

// Ketua Divisyen Data (All permohonan in divisyen)
const kdPermohonanList = ref([
  {
    idPermohonan: "TD-2024-001",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Ahmad bin Abdullah",
    lokasiLapangan: "Lokasi A",
    jumlahTunai: 5000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-001"
  },
  {
    idPermohonan: "TD-2024-002",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Siti binti Ali",
    lokasiLapangan: "Lokasi B",
    jumlahTunai: 3000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-002"
  },
  {
    idPermohonan: "TD-2024-003",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Mohd bin Hassan",
    lokasiLapangan: "Lokasi C",
    jumlahTunai: 7500,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-003"
  }
]);

// Computed properties
const filteredKJPermohonanList = computed(() => {
  return kjPermohonanList.value;
});

const filteredKDPermohonanList = computed(() => {
  return kdPermohonanList.value;
});

// Sample data - in a real app, this would come from an API
const permohonanList = ref([
  {
    idPermohonan: "TD-2024-001",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Ahmad bin Abdullah",
    lokasiLapangan: "Lokasi A",
    jumlahTunai: 5000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-001"
  },
  {
    idPermohonan: "TD-2024-002",
    tarikhPermohonan: new Date().toISOString(),
    namaEoad: "Siti binti Ali",
    lokasiLapangan: "Lokasi B",
    jumlahTunai: 3000,
    status: "Menunggu Kelulusan",
    tindakan: "TD-2024-002"
  }
]);

// Methods
const handleSearch = () => {
  // Implement search logic
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  // Reset form fields
  filters.value = {
    idPermohonan: "",
    namaEoad: "",
    lokasiLapangan: "",
  };
  tableKey.value++; // Force table refresh
};

const viewPermohonan = (id) => {
  navigateTo(`/BF-TNI/tunai-dilapangan/kelulusan/form/${id}`);
};

const viewAndProcess = (id) => {
  navigateTo(`/BF-TNI/tunai-dilapangan/kelulusan/form/${id}`);
};

const approvePermohonan = (id) => {
  console.log("TNI-TD-Kelulusan: Approve permohonan for ID:", id);
  // In a real app, this would update the status to approved
};

const rejectPermohonan = (id) => {
  console.log("TNI-TD-Kelulusan: Reject permohonan for ID:", id);
  // In a real app, this would update the status to rejected
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style lang="scss" scoped></style>
