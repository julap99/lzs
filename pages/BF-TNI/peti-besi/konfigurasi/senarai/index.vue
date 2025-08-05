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
    
    <!-- Pentadbir Sistem Content -->
    <div v-if="currentRole === 'pentadbir-sistem'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Tabung Utama</h2>
            <rs-button variant="primary" @click="navigateTo(`/BF-TNI/peti-besi/konfigurasi/tambah`)">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Baharu
            </rs-button>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari tabung..."
              outer-class="mb-0"
            />
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredSafeBoxes"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:namaAkaun="data">
              <div>
                <div class="font-medium">{{ data.text.nama }}</div>
                <div class="text-sm text-gray-500">{{ data.text.lokasi }}</div>
              </div>
            </template>

            <template v-slot:jenisAkaun="data">
              {{ data.text }}
            </template>

            <template v-slot:nilaiAsas="data">
              RM {{ formatNumber(data.text) }}
            </template>

            <template v-slot:hadMinimumBaki="data">
              RM {{ formatNumber(data.text) }}
            </template>

            <template v-slot:kaedahPemindahan="data">
              <rs-badge variant="outline">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:bakiSemasa="data">
              RM {{ formatNumber(data.text) }}
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
                  @click="updateSafeBox(data.text)"
                >
                  <Icon name="material-symbols:edit" size="15" class="mr-1" />
                  Kemaskini Tabung
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
            <h2 class="text-xl font-semibold">Senarai Permohonan Tabung Baharu</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari permohonan tabung..."
              outer-class="mb-0"
            />
          </div>

          <!-- Applications Table -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredApplications"
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
                  @click="handleReviewApplication(data.text)"
                >
                  <Icon name="ph:eye" size="15" class="mr-1" />
                  Sokong / Tolak
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Pelulus Content -->
    <div v-else-if="currentRole === 'pelulus'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Permohonan Untuk Kelulusan</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari permohonan untuk kelulusan..."
              outer-class="mb-0"
            />
          </div>

          <!-- Applications Table -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredApprovalApplications"
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
                  @click="handleApproveApplication(data.text)"
                >
                  <Icon name="ph:eye" size="15" class="mr-1" />
                  Semak & Lulus
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
            <h2 class="text-xl font-semibold">Senarai Tabung</h2>
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
  title: "Senarai Tabung",
});

// Role Simulator State
const currentRole = ref("pentadbir-sistem");
const showRoleInfo = ref(false);

// Page-specific role options for Tabung Konfigurasi
const roleOptions = [
  { label: "Pentadbir Sistem", value: "pentadbir-sistem" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Pelulus", value: "pelulus" },
];

// Role data for Tabung Konfigurasi
const roleData = {
  "pentadbir-sistem": {
    label: "Pentadbir Sistem",
    description: "Pengurusan Konfigurasi Tabung Utama",
    capabilities: ["Tambah Tabung", "Kemaskini Tabung", "Lihat Senarai", "Daftar Tabung Baharu"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Semakan Permohonan Tabung Baharu",
    capabilities: ["Semak Permohonan", "Sokong Permohonan", "Tolak Permohonan", "Ulasan"],
  },
  "pelulus": {
    label: "Pelulus",
    description: "Kelulusan Akhir Permohonan Tabung",
    capabilities: ["Kelulusan Akhir", "Pelulusan", "Penolakan", "Pengesahan"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    "pentadbir-sistem": "primary",
    "ketua-jabatan": "warning",
    "pelulus": "danger",
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
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
]);

// Table data and search
const tableKey = ref(0);
const searchQuery = ref("");

// Pentadbir Sistem Data (Tabung Utama)
const safeBoxes = ref([
  {
    namaAkaun: { nama: "Tabung Utama", lokasi: "Pejabat Pusat" },
    jenisAkaun: "Cawangan",
    nilaiAsas: 10000,
    hadMinimumBaki: 5000,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 15000,
    status: "Aktif",
    tindakan: "SB001"
  },
  {
    namaAkaun: { nama: "Tabung Cawangan Johor", lokasi: "Johor Bahru" },
    jenisAkaun: "Cawangan",
    nilaiAsas: 8000,
    hadMinimumBaki: 4000,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 12000,
    status: "Aktif",
    tindakan: "SB002"
  },
  {
    namaAkaun: { nama: "Tabung Amil Pusat", lokasi: "Pejabat Pusat" },
    jenisAkaun: "Amil",
    nilaiAsas: 15000,
    hadMinimumBaki: 7500,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 20000,
    status: "Aktif",
    tindakan: "SB003"
  },
  {
    namaAkaun: { nama: "Tabung Operasi Daerah", lokasi: "Kuala Lumpur" },
    jenisAkaun: "Operasi Daerah",
    nilaiAsas: 12000,
    hadMinimumBaki: 6000,
    kaedahPemindahan: "eWallet",
    bakiSemasa: 18000,
    status: "Aktif",
    tindakan: "SB004"
  },
  {
    namaAkaun: { nama: "Tabung Baitul Mal", lokasi: "Shah Alam" },
    jenisAkaun: "Baitul",
    nilaiAsas: 20000,
    hadMinimumBaki: 10000,
    kaedahPemindahan: "Tunai",
    bakiSemasa: 25000,
    status: "Aktif",
    tindakan: "SB005"
  }
]);

// Ketua Jabatan Data (Permohonan Tabung Baharu)
const applications = ref([
  {
    id: "TB-2024-001",
    tarikhMohon: "2024-03-20",
    namaTabung: "Tabung Bantuan Kecemasan",
    status: "Menunggu Semakan KJ",
    tindakan: "TB-2024-001"
  },
  {
    id: "TB-2024-002",
    tarikhMohon: "2024-03-19",
    namaTabung: "Tabung Operasi Khas",
    status: "Menunggu Semakan KJ",
    tindakan: "TB-2024-002"
  },
  {
    id: "TB-2024-003",
    tarikhMohon: "2024-03-18",
    namaTabung: "Tabung Amil Daerah",
    status: "Lulus KJ",
    tindakan: "TB-2024-003"
  }
]);

// Pelulus Data (Permohonan Untuk Kelulusan)
const approvalApplications = ref([
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
    status: "Didaftarkan",
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
const filteredSafeBoxes = computed(() => {
  if (!searchQuery.value) return safeBoxes.value;
  
  const query = searchQuery.value.toLowerCase();
  return safeBoxes.value.filter(box => 
    box.namaAkaun.nama.toLowerCase().includes(query) ||
    box.namaAkaun.lokasi.toLowerCase().includes(query) ||
    box.jenisAkaun.toLowerCase().includes(query)
  );
});

const filteredApplications = computed(() => {
  if (!searchQuery.value) return applications.value;
  
  const query = searchQuery.value.toLowerCase();
  return applications.value.filter(app => 
    app.id.toLowerCase().includes(query) ||
    app.namaTabung.toLowerCase().includes(query)
  );
});

const filteredApprovalApplications = computed(() => {
  if (!searchQuery.value) return approvalApplications.value;
  
  const query = searchQuery.value.toLowerCase();
  return approvalApplications.value.filter(app => 
    app.id.toLowerCase().includes(query) ||
    app.namaTabung.toLowerCase().includes(query)
  );
});

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'aktif':
      return 'success';
    case 'tidak aktif':
      return 'danger';
    default:
      return 'default';
  }
};

const getApplicationStatusVariant = (status) => {
  switch (status) {
    case 'Menunggu Semakan KJ':
      return 'warning';
    case 'Lulus KJ':
      return 'success';
    case 'Sokong KJ':
      return 'info';
    case 'Disokong KJ':
      return 'success';
    case 'Didaftarkan':
      return 'info';
    case 'Lulus Pelulus':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const updateSafeBox = (id) => {
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/kemaskini/${id}`);
};

const handleReviewApplication = (id) => {
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/semakan/${id}`);
};

const handleApproveApplication = (id) => {
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/kelulusan/${id}`);
};

const handleRejectApplication = (id) => {
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/penolakan/${id}`);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
