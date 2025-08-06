<template>
  <div>
    <!-- Page screen: TNI-KO-KT-01 -->
    <!-- Actor: KC/KB/Eksekutif/KOAD -->
    <!-- Roles: Eksekutif, Kewangan Pemeriksa, Kewangan Pegawai -->
    
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
    
    <!-- Eksekutif Content -->
    <div v-if="currentRole === 'eksekutif'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Permohonan Tambah Nilai Tunai</h2>
            <rs-button variant="primary" @click="navigateTo(`/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/form`)">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah Permohonan
            </rs-button>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari permohonan..."
              outer-class="mb-0"
            />
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredEksekutifRequests"
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
                  @click="viewRequest(data.text)"
                >
                  <Icon name="ph:eye" size="15" class="mr-1" />
                  Lihat
                </rs-button>
                
                <!-- Conditional Actions -->
                <rs-button
                  v-if="data.text.status === 'Surat Arahan Disahkan'"
                  variant="success"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="downloadLetter(data.text.id)"
                >
                  <Icon name="ph:download" size="15" class="mr-1" />
                  Muat Turun Surat Arahan Pindahan
                </rs-button>
                
                <rs-button
                  v-if="data.text.status === 'Tunai Diterima – Menunggu Pengesahan'"
                  variant="warning"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="confirmReceipt(data.text.id)"
                >
                  <Icon name="ph:check-circle" size="15" class="mr-1" />
                  Sahkan Penerimaan
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Kewangan (Pemeriksa/Ketua Jabatan) Content -->
    <div v-else-if="currentRole === 'kewangan-pemeriksa'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Untuk Semakan Tambah Nilai</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari permohonan untuk semakan..."
              outer-class="mb-0"
            />
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredKewanganRequests"
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
                  @click="reviewRequest(data.text)"
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

    <!-- Kewangan - Pegawai Kewangan Content -->
    <div v-else-if="currentRole === 'kewangan-pegawai'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Permohonan Untuk Arah Pindahan</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari permohonan untuk arahan pindahan..."
              outer-class="mb-0"
            />
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredPegawaiRequests"
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
                  Keluarkan Arahan
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
            <h2 class="text-xl font-semibold">Senarai Permohonan Tambah Nilai Tunai</h2>
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
  title: "Senarai Permohonan Tambah Nilai Tunai",
});

// Role Simulator State
const currentRole = ref("eksekutif");
const showRoleInfo = ref(false);

// Page-specific role options for TNI-KO-KT
const roleOptions = [
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Kewangan (Pemeriksa/KJ)", value: "kewangan-pemeriksa" },
  { label: "Kewangan - Pegawai Kewangan", value: "kewangan-pegawai" },
];

// Role data for TNI-KO-KT
const roleData = {
  "eksekutif": {
    label: "Eksekutif",
    description: "Permohonan Tambah Nilai Tunai",
    capabilities: ["Tambah Permohonan", "Lihat Permohonan", "Sahkan Penerimaan", "Muat Turun Surat"],
  },
  "kewangan-pemeriksa": {
    label: "Kewangan (Pemeriksa/Ketua Jabatan)",
    description: "Semakan Permohonan Tambah Nilai",
    capabilities: ["Semak Permohonan", "Sokong/Tolak", "Pengesahan Jumlah"],
  },
  "kewangan-pegawai": {
    label: "Kewangan - Pegawai Kewangan",
    description: "Arahan Pindahan Tunai",
    capabilities: ["Keluarkan Arahan", "Arahan Pindahan", "Surat Arahan"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    "eksekutif": "primary",
    "kewangan-pemeriksa": "warning",
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
    name: "Senarai Permohonan",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai",
  },
]);

// Table data and search
const tableKey = ref(0);
const searchQuery = ref("");

// Eksekutif Data (All requests by Eksekutif)
const eksekutifRequests = ref([
  {
    id: "KT-2024-001",
    tarikh: "2024-03-20",
    lokasiTabung: "Cawangan Kuala Lumpur",
    kaedah: "Tunai",
    jumlah: 50000,
    status: "Draft",
    tindakan: { id: "KT-2024-001", status: "Draft" }
  },
  {
    id: "KT-2024-002",
    tarikh: "2024-03-19",
    lokasiTabung: "Cawangan Johor Bahru",
    kaedah: "eWallet",
    jumlah: 30000,
    status: "Menunggu Semakan",
    tindakan: { id: "KT-2024-002", status: "Menunggu Semakan" }
  },
  {
    id: "KT-2024-003",
    tarikh: "2024-03-18",
    lokasiTabung: "Cawangan Pulau Pinang",
    kaedah: "Tunai",
    jumlah: 75000,
    status: "Surat Arahan Disahkan",
    tindakan: { id: "KT-2024-003", status: "Surat Arahan Disahkan" }
  },
  {
    id: "KT-2024-004",
    tarikh: "2024-03-17",
    lokasiTabung: "Cawangan Melaka",
    kaedah: "eWallet",
    jumlah: 25000,
    status: "Tunai Diterima – Menunggu Pengesahan",
    tindakan: { id: "KT-2024-004", status: "Tunai Diterima – Menunggu Pengesahan" }
  }
]);

// Kewangan Pemeriksa Data (Requests awaiting review)
const kewanganRequests = ref([
  {
    id: "KT-2024-002",
    tarikh: "2024-03-19",
    lokasiTabung: "Cawangan Johor Bahru",
    kaedah: "eWallet",
    jumlah: 30000,
    status: "Menunggu Semakan",
    tindakan: { id: "KT-2024-002", status: "Menunggu Semakan" }
  },
  {
    id: "KT-2024-005",
    tarikh: "2024-03-16",
    lokasiTabung: "Cawangan Negeri Sembilan",
    kaedah: "Tunai",
    jumlah: 45000,
    status: "Menunggu Semakan",
    tindakan: { id: "KT-2024-005", status: "Menunggu Semakan" }
  }
]);

// Kewangan Pegawai Data (Approved requests awaiting transfer order)
const pegawaiRequests = ref([
  {
    id: "KT-2024-006",
    tarikh: "2024-03-15",
    lokasiTabung: "Cawangan Perak",
    kaedah: "Tunai",
    jumlah: 60000,
    status: "Lulus Semakan – Menunggu Pindahan",
    tindakan: { id: "KT-2024-006", status: "Lulus Semakan – Menunggu Pindahan" }
  },
  {
    id: "KT-2024-007",
    tarikh: "2024-03-14",
    lokasiTabung: "Cawangan Kedah",
    kaedah: "eWallet",
    jumlah: 35000,
    status: "Lulus Semakan – Menunggu Pindahan",
    tindakan: { id: "KT-2024-007", status: "Lulus Semakan – Menunggu Pindahan" }
  }
]);

// Computed properties
const filteredEksekutifRequests = computed(() => {
  if (!searchQuery.value) return eksekutifRequests.value;
  
  const query = searchQuery.value.toLowerCase();
  return eksekutifRequests.value.filter(req => 
    req.id.toLowerCase().includes(query) ||
    req.lokasiTabung.toLowerCase().includes(query)
  );
});

const filteredKewanganRequests = computed(() => {
  if (!searchQuery.value) return kewanganRequests.value;
  
  const query = searchQuery.value.toLowerCase();
  return kewanganRequests.value.filter(req => 
    req.id.toLowerCase().includes(query) ||
    req.lokasiTabung.toLowerCase().includes(query)
  );
});

const filteredPegawaiRequests = computed(() => {
  if (!searchQuery.value) return pegawaiRequests.value;
  
  const query = searchQuery.value.toLowerCase();
  return pegawaiRequests.value.filter(req => 
    req.id.toLowerCase().includes(query) ||
    req.lokasiTabung.toLowerCase().includes(query)
  );
});

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Draft':
      return 'default';
    case 'Menunggu Semakan':
      return 'warning';
    case 'Lulus Semakan – Menunggu Pindahan':
      return 'info';
    case 'Surat Arahan Disahkan':
      return 'success';
    case 'Tunai Diterima – Menunggu Pengesahan':
      return 'warning';
    case 'Disahkan':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const viewRequest = (request) => {
  if (request.status === 'Draft') {
    navigateTo(`/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view-draft/${request.id}`);
  } else {
    navigateTo(`/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view/${request.id}`);
  }
};

const reviewRequest = (request) => {
  navigateTo(`/BF-TNI/tambah-nilai-tunai/semak/${request.id}`);
};

const issueTransferOrder = (request) => {
  navigateTo(`/BF-TNI/tambah-nilai-tunai/keluarkan-arahan/${request.id}`);
};

const downloadLetter = (id) => {
  console.log("TNI-KO-KT-01: Muat Turun Surat Arahan Pindahan untuk ID:", id);
  alert("Surat Arahan Pindahan berjaya dimuat turun");
};

const confirmReceipt = (id) => {
  navigateTo(`/BF-TNI/tambah-nilai-tunai/sahkan-penerimaan/${id}`);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
