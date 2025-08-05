<template>
  <div>
    <!-- Page screen: TNI-KO-PB-04_1 -->
    <!-- Actor: Eksekutif, Kewangan Pegawai, Ketua Jabatan -->
    <!-- Roles: Eksekutif, Kewangan Pegawai, Ketua Jabatan -->
    
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
            <h2 class="text-xl font-semibold">Senarai Pengesahan Tabung (Eksekutif)</h2>
          </div>
        </template>

        <template #body>
          <!-- Filter Panel -->
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Kod Cawangan / Peti Besi -->
              <FormKit
                type="text"
                name="kodCawangan"
                label="Kod Cawangan / Peti Besi"
                placeholder="Cari kod cawangan..."
              />

              <!-- Status Terimaan -->
              <FormKit
                type="select"
                name="statusTerimaan"
                label="Status Terimaan"
                :options="[
                  { label: 'Diterima', value: 'diterima' },
                  { label: 'Gagal', value: 'gagal' },
                  { label: 'Ditangguh', value: 'ditangguh' },
                  { label: 'Belum Diterima', value: 'belum_diterima' }
                ]"
              />

              <!-- Tarikh Pindahan -->
              <FormKit
                type="date"
                name="tarikhPindahan"
                label="Tarikh Pindahan"
                range
              />

              <!-- Action Buttons -->
              <div class="flex items-end space-x-2">
                <rs-button variant="primary" @click="handleSearch">
                  <Icon name="material-symbols:search" class="mr-1" /> Cari
                </rs-button>
                <rs-button variant="secondary" @click="handleReset">
                  <Icon name="material-symbols:refresh" class="mr-1" /> Reset
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredEksekutifInstructions"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:kodCawangan="data">
              {{ data.text }}
            </template>

            <template v-slot:jenisAkaun="data">
              {{ data.text }}
            </template>

            <template v-slot:jumlahTunai="data">
              <div class="font-medium text-right">
                RM {{ formatNumber(data.text) }}
              </div>
            </template>

            <template v-slot:namaPegawai="data">
              {{ data.text }}
            </template>

            <template v-slot:tarikhMasaPindahan="data">
              <div>
                <div class="font-medium">{{ formatDate(data.text) }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
              </div>
            </template>

            <template v-slot:rujukan="data">
              <a 
                href="#" 
                class="text-primary-600 hover:text-primary-800"
                @click.prevent="viewReference(data.text)"
              >
                {{ data.text }}
              </a>
            </template>

            <template v-slot:statusTerimaan="data">
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
                  :disabled="data.text.isConfirmed"
                  @click="confirmReceipt(data.text.id)"
                >
                  <Icon name="material-symbols:check-circle" size="15" class="mr-1" />
                  Semak & Lulus
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Kewangan Pegawai Content -->
    <div v-else-if="currentRole === 'kewangan-pegawai'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Pengesahan Tabung (Kewangan Pegawai)</h2>
          </div>
        </template>

        <template #body>
          <!-- Filter Panel -->
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Kod Cawangan / Peti Besi -->
              <FormKit
                type="text"
                name="kodCawangan"
                label="Kod Cawangan / Peti Besi"
                placeholder="Cari kod cawangan..."
              />

              <!-- Status Terimaan -->
              <FormKit
                type="select"
                name="statusTerimaan"
                label="Status Terimaan"
                :options="[
                  { label: 'Diterima', value: 'diterima' },
                  { label: 'Gagal', value: 'gagal' },
                  { label: 'Ditangguh', value: 'ditangguh' },
                  { label: 'Belum Diterima', value: 'belum_diterima' }
                ]"
              />

              <!-- Tarikh Pindahan -->
              <FormKit
                type="date"
                name="tarikhPindahan"
                label="Tarikh Pindahan"
                range
              />

              <!-- Action Buttons -->
              <div class="flex items-end space-x-2">
                <rs-button variant="primary" @click="handleSearch">
                  <Icon name="material-symbols:search" class="mr-1" /> Cari
                </rs-button>
                <rs-button variant="secondary" @click="handleReset">
                  <Icon name="material-symbols:refresh" class="mr-1" /> Reset
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredKewanganInstructions"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:kodCawangan="data">
              {{ data.text }}
            </template>

            <template v-slot:jenisAkaun="data">
              {{ data.text }}
            </template>

            <template v-slot:jumlahTunai="data">
              <div class="font-medium text-right">
                RM {{ formatNumber(data.text) }}
              </div>
            </template>

            <template v-slot:namaPegawai="data">
              {{ data.text }}
            </template>

            <template v-slot:tarikhMasaPindahan="data">
              <div>
                <div class="font-medium">{{ formatDate(data.text) }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
              </div>
            </template>

            <template v-slot:rujukan="data">
              <a 
                href="#" 
                class="text-primary-600 hover:text-primary-800"
                @click.prevent="viewReference(data.text)"
              >
                {{ data.text }}
              </a>
            </template>

            <template v-slot:statusTerimaan="data">
              <rs-badge :variant="getStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="data">
              <div class="flex space-x-2">
                <rs-button
                  variant="secondary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="viewReceiptDetails(data.text.id)"
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

    <!-- Ketua Jabatan Content -->
    <div v-else-if="currentRole === 'ketua-jabatan'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Pengesahan Tabung (Ketua Jabatan)</h2>
          </div>
        </template>

        <template #body>
          <!-- Filter Panel -->
          <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Kod Cawangan / Peti Besi -->
              <FormKit
                type="text"
                name="kodCawangan"
                label="Kod Cawangan / Peti Besi"
                placeholder="Cari kod cawangan..."
              />

              <!-- Status Terimaan -->
              <FormKit
                type="select"
                name="statusTerimaan"
                label="Status Terimaan"
                :options="[
                  { label: 'Diterima', value: 'diterima' },
                  { label: 'Gagal', value: 'gagal' },
                  { label: 'Ditangguh', value: 'ditangguh' },
                  { label: 'Belum Diterima', value: 'belum_diterima' }
                ]"
              />

              <!-- Tarikh Pindahan -->
              <FormKit
                type="date"
                name="tarikhPindahan"
                label="Tarikh Pindahan"
                range
              />

              <!-- Action Buttons -->
              <div class="flex items-end space-x-2">
                <rs-button variant="primary" @click="handleSearch">
                  <Icon name="material-symbols:search" class="mr-1" /> Cari
                </rs-button>
                <rs-button variant="secondary" @click="handleReset">
                  <Icon name="material-symbols:refresh" class="mr-1" /> Reset
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Table Section -->
          <rs-table
            class="mt-4"
            :key="tableKey"
            :data="filteredKJInstructions"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:kodCawangan="data">
              {{ data.text }}
            </template>

            <template v-slot:jenisAkaun="data">
              {{ data.text }}
            </template>

            <template v-slot:jumlahTunai="data">
              <div class="font-medium text-right">
                RM {{ formatNumber(data.text) }}
              </div>
            </template>

            <template v-slot:namaPegawai="data">
              {{ data.text }}
            </template>

            <template v-slot:tarikhMasaPindahan="data">
              <div>
                <div class="font-medium">{{ formatDate(data.text) }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
              </div>
            </template>

            <template v-slot:rujukan="data">
              <a 
                href="#" 
                class="text-primary-600 hover:text-primary-800"
                @click.prevent="viewReference(data.text)"
              >
                {{ data.text }}
              </a>
            </template>

            <template v-slot:statusTerimaan="data">
              <rs-badge :variant="getStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="data">
              <div class="flex space-x-2">
                <rs-button
                  variant="info"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="viewReceiptReport(data.text.id)"
                >
                  <Icon name="ph:file-text" size="15" class="mr-1" />
                  Laporan
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
            <h2 class="text-xl font-semibold">Senarai Pengesahan Tabung</h2>
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
  title: "Senarai Arahan Aktif - Terima & Sahkan Penerimaan Tunai",
});

// Role Simulator State
const currentRole = ref("eksekutif");
const showRoleInfo = ref(false);

// Page-specific role options for Terima Sah Penerimaan Tunai
const roleOptions = [
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Kewangan Pegawai", value: "kewangan-pegawai" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
];

// Role data for Terima Sah Penerimaan Tunai
const roleData = {
  "eksekutif": {
    label: "Eksekutif",
    description: "Pengesahan Penerimaan Tunai",
    capabilities: ["Sahkan Penerimaan", "Lihat Senarai", "Kemaskini Status", "Konfirmasi Tunai"],
  },
  "kewangan-pegawai": {
    label: "Kewangan Pegawai",
    description: "Pemantauan Penerimaan Tunai",
    capabilities: ["Lihat Butiran", "Pemantauan", "Lihat Status", "Oversight"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Laporan Penerimaan Tunai",
    capabilities: ["Lihat Laporan", "Pemantauan", "Analisis", "Oversight"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    "eksekutif": "primary",
    "kewangan-pegawai": "info",
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
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Peti Besi",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai",
    type: "current",
    path: "/BF-TNI/peti-besi/terima-sah-penerimaan-tunai",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);

// Eksekutif Data (Active instructions for confirmation)
const eksekutifInstructions = ref([
  {
    kodCawangan: "PB001",
    jenisAkaun: "Amil",
    jumlahTunai: 5000,
    namaPegawai: "Ahmad bin Abdullah",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-001",
    statusTerimaan: "Belum Diterima",
    tindakan: { id: "AR-2024-001", isConfirmed: false }
  },
  {
    kodCawangan: "PB002",
    jenisAkaun: "Operasi Daerah",
    jumlahTunai: 3000,
    namaPegawai: "Siti binti Ali",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-002",
    statusTerimaan: "Diterima",
    tindakan: { id: "AR-2024-002", isConfirmed: true }
  }
]);

// Kewangan Pegawai Data (All instructions for monitoring)
const kewanganInstructions = ref([
  {
    kodCawangan: "PB001",
    jenisAkaun: "Amil",
    jumlahTunai: 5000,
    namaPegawai: "Ahmad bin Abdullah",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-001",
    statusTerimaan: "Belum Diterima",
    tindakan: { id: "AR-2024-001", isConfirmed: false }
  },
  {
    kodCawangan: "PB002",
    jenisAkaun: "Operasi Daerah",
    jumlahTunai: 3000,
    namaPegawai: "Siti binti Ali",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-002",
    statusTerimaan: "Diterima",
    tindakan: { id: "AR-2024-002", isConfirmed: true }
  },
  {
    kodCawangan: "PB003",
    jenisAkaun: "Cawangan",
    jumlahTunai: 7500,
    namaPegawai: "Mohd bin Hassan",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-003",
    statusTerimaan: "Ditangguh",
    tindakan: { id: "AR-2024-003", isConfirmed: false }
  }
]);

// Ketua Jabatan Data (Completed instructions for reporting)
const kjInstructions = ref([
  {
    kodCawangan: "PB002",
    jenisAkaun: "Operasi Daerah",
    jumlahTunai: 3000,
    namaPegawai: "Siti binti Ali",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-002",
    statusTerimaan: "Diterima",
    tindakan: { id: "AR-2024-002", isConfirmed: true }
  },
  {
    kodCawangan: "PB004",
    jenisAkaun: "Baitul",
    jumlahTunai: 10000,
    namaPegawai: "Fatimah binti Omar",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-004",
    statusTerimaan: "Diterima",
    tindakan: { id: "AR-2024-004", isConfirmed: true }
  }
]);

// Computed properties
const filteredEksekutifInstructions = computed(() => {
  return eksekutifInstructions.value;
});

const filteredKewanganInstructions = computed(() => {
  return kewanganInstructions.value;
});

const filteredKJInstructions = computed(() => {
  return kjInstructions.value;
});

// Methods
const handleSearch = () => {
  console.log("TNI-KO-PB-04_1: Terima Sah Penerimaan - Search triggered");
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  console.log("TNI-KO-PB-04_1: Terima Sah Penerimaan - Reset triggered");
  tableKey.value++; // Force table refresh
};

const viewReference = (reference) => {
  console.log("TNI-KO-PB-04_1: Terima Sah Penerimaan - Viewing reference:", reference);
};

const confirmReceipt = (id) => {
  console.log("TNI-KO-PB-04_1: Terima Sah Penerimaan - Confirm receipt for ID:", id);
  navigateTo(`/BF-TNI/peti-besi/terima-sah-penerimaan-tunai/sahkan/${id}`);
};

const viewReceiptDetails = (id) => {
  console.log("TNI-KO-PB-04_1: Terima Sah Penerimaan - View receipt details for ID:", id);
  navigateTo(`/BF-TNI/peti-besi/terima-sah-penerimaan-tunai/butiran/${id}`);
};

const viewReceiptReport = (id) => {
  console.log("TNI-KO-PB-04_1: Terima Sah Penerimaan - View receipt report for ID:", id);
  navigateTo(`/BF-TNI/peti-besi/terima-sah-penerimaan-tunai/laporan/${id}`);
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const formatDate = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatTime = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleTimeString("ms-MY", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getStatusVariant = (status) => {
  // Clean the status string and convert to lowercase
  const cleanStatus = status ? status.trim().toLowerCase() : '';
  
  switch (cleanStatus) {
    case 'diterima':
      return 'success'; // Green badge
    case 'gagal':
      return 'danger'; // Red badge
    case 'ditangguh':
      return 'warning'; // Orange badge
    case 'belum diterima':
      return 'warning'; // Orange badge - should be warning/orange
    case 'belum_diterima':
      return 'warning'; // Orange badge - should be warning/orange
    default:
      return 'default'; // Gray badge
  }
};
</script>

<style lang="scss" scoped></style>
