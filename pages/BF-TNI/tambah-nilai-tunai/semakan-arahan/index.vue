<template>
  <div>
    <!-- Page screen: TNI-KO-KT-05 -->
    <!-- Actor: Kewangan -->
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
            <h2 class="text-xl font-semibold">Semakan Arahan Pindahan (Ketua Jabatan)</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari arahan pindahan..."
              outer-class="mb-0"
            />
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredKJRequests"
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
                  @click="reviewTransferOrder(data.text)"
                >
                  <Icon name="ph:eye" size="15" class="mr-1" />
                  Semak
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
            <h2 class="text-xl font-semibold">Semakan Arahan Pindahan (Ketua Divisyen)</h2>
          </div>
        </template>

        <template #body>
          <!-- Search Input -->
          <div class="mb-4">
            <FormKit
              type="text"
              v-model="searchQuery"
              placeholder="Cari arahan pindahan..."
              outer-class="mb-0"
            />
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredKDRequests"
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
                  @click="reviewTransferOrder(data.text)"
                >
                  <Icon name="ph:eye" size="15" class="mr-1" />
                  Semak
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
            <h2 class="text-xl font-semibold">Semakan Arahan Pindahan</h2>
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
  title: "Semakan Arahan Pindahan",
});

// Role Simulator State
const currentRole = ref("ketua-jabatan");
const showRoleInfo = ref(false);

// Page-specific role options for TNI-KO-KT-05
const roleOptions = [
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for TNI-KO-KT-05
const roleData = {
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Semakan Arahan Pindahan",
    capabilities: ["Semak Arahan", "Lulus/Tolak", "Pengesahan Akhir"],
  },
  "ketua-divisyen": {
    label: "Ketua Divisyen",
    description: "Semakan Arahan Pindahan",
    capabilities: ["Semak Arahan", "Lulus/Tolak", "Pengesahan Akhir"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    "ketua-jabatan": "warning",
    "ketua-divisyen": "success",
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
    name: "Semakan Arahan Pindahan",
    type: "current",
    path: "/BF-TNI/tambah-nilai-tunai/semakan-arahan",
  },
]);

// Table data and search
const tableKey = ref(0);
const searchQuery = ref("");

// Ketua Jabatan Data (Transfer orders for KJ review)
const kjRequests = ref([
  {
    id: "KT-2024-006",
    tarikh: "2024-03-15",
    lokasiTabung: "Cawangan Perak",
    kaedah: "Tunai",
    jumlah: 60000,
    status: "Telah Diarahkan",
    tindakan: { id: "KT-2024-006", status: "Telah Diarahkan" }
  },
  {
    id: "KT-2024-007",
    tarikh: "2024-03-14",
    lokasiTabung: "Cawangan Kedah",
    kaedah: "eWallet",
    jumlah: 35000,
    status: "Telah Diarahkan",
    tindakan: { id: "KT-2024-007", status: "Telah Diarahkan" }
  }
]);

// Ketua Divisyen Data (Transfer orders for KD review)
const kdRequests = ref([
  {
    id: "KT-2024-008",
    tarikh: "2024-03-13",
    lokasiTabung: "Cawangan Terengganu",
    kaedah: "Tunai",
    jumlah: 45000,
    status: "Telah Diarahkan",
    tindakan: { id: "KT-2024-008", status: "Telah Diarahkan" }
  },
  {
    id: "KT-2024-009",
    tarikh: "2024-03-12",
    lokasiTabung: "Cawangan Kelantan",
    kaedah: "eWallet",
    jumlah: 28000,
    status: "Telah Diarahkan",
    tindakan: { id: "KT-2024-009", status: "Telah Diarahkan" }
  }
]);

// Computed properties
const filteredKJRequests = computed(() => {
  if (!searchQuery.value) return kjRequests.value;
  
  const query = searchQuery.value.toLowerCase();
  return kjRequests.value.filter(req => 
    req.id.toLowerCase().includes(query) ||
    req.lokasiTabung.toLowerCase().includes(query)
  );
});

const filteredKDRequests = computed(() => {
  if (!searchQuery.value) return kdRequests.value;
  
  const query = searchQuery.value.toLowerCase();
  return kdRequests.value.filter(req => 
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
    case 'Telah Diarahkan':
      return 'info';
    case 'Lulus Semakan':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const reviewTransferOrder = (request) => {
  console.log("TNI-KO-KT-05: Semakan Arahan Pindahan - Navigasi ke semakan detail");
  console.log("Request ID:", request.id);
  console.log("Current Role:", currentRole.value);
  
  // Navigate to review detail page (to be implemented)
  navigateTo(`/BF-TNI/tambah-nilai-tunai/semakan-arahan/review/${request.id}`);
};
</script> 