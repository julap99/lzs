<template>
  <div>
    <!-- Page screen: TNI-KO-PB-03_1 -->
    <!-- Actor: Pentadbir Sistem -->
    <!-- Roles: Pentadbir Sistem, Ketua Jabatan -->
    
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
    
    <!-- Pentadbir Sistem Content -->
    <div v-if="currentRole === 'pentadbir-sistem'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Permohonan Untuk Daftar Tabung</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari permohonan untuk daftar..."
              outer-class="mb-0"
            />
          </div>

          <!-- Applications Table -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredPentadbirApplications"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:status="data">
              <rs-badge :variant="getApplicationStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="data">
              <div class="flex space-x-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleRegister(data.text)"
                >
                  <Icon name="ph:user-plus" size="15" class="mr-1" />
                  Hantar Untuk Kelulusan
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Ketua Jabatan Content -->
    <div v-else-if="currentRole === 'ketua-jabatan'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Status Pendaftaran Tabung (Ketua Jabatan)</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari status pendaftaran..."
              outer-class="mb-0"
            />
          </div>

          <!-- Status Table -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredKJApplications"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:status="data">
              <rs-badge :variant="getApplicationStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="data">
              <div class="flex space-x-2">
                <rs-button
                  variant="secondary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleViewDetails(data.text)"
                >
                  <Icon name="ph:eye" size="15" class="mr-1" />
                  Lihat Butiran
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
            <h2 class="text-xl font-semibold">Senarai Pendaftaran Tabung</h2>
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
  title: "Senarai Permohonan Untuk Daftar Tabung",
  description: "Pentadbir sistem melihat senarai permohonan yang telah disokong KJ dan perlu didaftarkan",
});

// Role Simulator State
const currentRole = ref("pentadbir-sistem");
const showRoleInfo = ref(false);

// Page-specific role options for Tabung Daftar
const roleOptions = [
  { label: "Pentadbir Sistem", value: "pentadbir-sistem" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
];

// Role data for Tabung Daftar
const roleData = {
  "pentadbir-sistem": {
    label: "Pentadbir Sistem",
    description: "Pendaftaran Tabung Baharu",
    capabilities: ["Daftar Tabung", "Hantar Untuk Kelulusan", "Lihat Senarai", "Kemaskini Status"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Pemantauan Status Pendaftaran",
    capabilities: ["Lihat Status", "Pemantauan", "Lihat Butiran", "Oversight"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    "pentadbir-sistem": "primary",
    "ketua-jabatan": "warning",
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
    name: "Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Daftar Tabung",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/daftar",
  },
]);

// Table data and search
const tableKey = ref(0);
const searchQuery = ref("");

// Pentadbir Sistem Data (Permohonan yang telah "Disokong KJ")
const pentadbirApplications = ref([
  {
    id: "TB-2024-003",
    tarikhMohon: "2024-03-18",
    namaTabung: "Tabung Amil Daerah",
    status: "Disokong KJ",
    tindakan: "TB-2024-003"
  },
  {
    id: "TB-2024-004",
    tarikhMohon: "2024-03-17",
    namaTabung: "Tabung Bantuan Masyarakat",
    status: "Disokong KJ",
    tindakan: "TB-2024-004"
  },
  {
    id: "TB-2024-005",
    tarikhMohon: "2024-03-16",
    namaTabung: "Tabung Operasi Khas",
    status: "Disokong KJ",
    tindakan: "TB-2024-005"
  }
]);

// Ketua Jabatan Data (Status Pendaftaran)
const kjApplications = ref([
  {
    id: "TB-2024-003",
    tarikhMohon: "2024-03-18",
    namaTabung: "Tabung Amil Daerah",
    status: "Didaftarkan",
    tindakan: "TB-2024-003"
  },
  {
    id: "TB-2024-004",
    tarikhMohon: "2024-03-17",
    namaTabung: "Tabung Bantuan Masyarakat",
    status: "Dalam Proses",
    tindakan: "TB-2024-004"
  },
  {
    id: "TB-2024-005",
    tarikhMohon: "2024-03-16",
    namaTabung: "Tabung Operasi Khas",
    status: "Didaftarkan",
    tindakan: "TB-2024-005"
  }
]);

// Computed properties
const filteredPentadbirApplications = computed(() => {
  if (!searchQuery.value) return pentadbirApplications.value;
  
  const query = searchQuery.value.toLowerCase();
  return pentadbirApplications.value.filter(app => 
    app.id.toLowerCase().includes(query) ||
    app.namaTabung.toLowerCase().includes(query)
  );
});

const filteredKJApplications = computed(() => {
  if (!searchQuery.value) return kjApplications.value;
  
  const query = searchQuery.value.toLowerCase();
  return kjApplications.value.filter(app => 
    app.id.toLowerCase().includes(query) ||
    app.namaTabung.toLowerCase().includes(query)
  );
});

// Helper functions
const getApplicationStatusVariant = (status) => {
  switch (status) {
    case 'Disokong KJ':
      return 'success';
    case 'Didaftarkan':
      return 'info';
    case 'Dalam Proses':
      return 'warning';
    default:
      return 'default';
  }
};

// Action handlers
const handleRegister = (id) => {
  console.log("TNI-KO-PB-03_1: Daftar Tabung - Navigasi ke borang pendaftaran untuk ID:", id);
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/daftar/borang/${id}`);
};

const handleViewDetails = (id) => {
  console.log("TNI-KO-PB-03_1: Daftar Tabung - Lihat butiran untuk ID:", id);
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/daftar/butiran/${id}`);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 