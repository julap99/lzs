<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Semua Tuntutan</h2>
          <rs-button variant="primary" @click="navigateTo('/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan')">
            <Icon name="material-symbols:add" class="w-5 h-5 mr-1" />
            Tambah Tuntutan
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Tuntutan, Nama Pemohon, atau No GL..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Main Table -->
        <rs-table
          :data="filteredTuntutan"
          :columns="columns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <template v-slot:noTuntutan="data">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewDetails(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:tarikhTuntutan="data">
            {{ formatDate(data.text) }}
          </template>

          <template v-slot:amaunTuntutan="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:statusPermohonan="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tarikhPerkhidmatan="data">
            {{ formatDate(data.text) }}
          </template>

          <template v-slot:tindakan="data">
            <div class="flex justify-center items-center gap-2">
              <template v-if="data.text.status === 'Draf'">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleEdit(data.text.id)"
                >
                  <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                  Edit Tuntutan
                </rs-button>
                <rs-button
                  variant="success"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleSubmit(data.text.id)"
                >
                  <Icon name="material-symbols:send" class="w-4 h-4 mr-1" />
                  Hantar Tuntutan
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleDelete(data.text.id)"
                >
                  <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                  Padam Draf
                </rs-button>
              </template>

              <template v-else-if="data.text.status === 'Dalam Semakan'">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleViewDalamSemakan(data.text.id)"
                >
                  <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                  Lihat Tuntutan
                </rs-button>
              </template>

              <template v-else-if="data.text.status === 'Lulus'">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleView(data.text.id)"
                >
                  <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                  Lihat Tuntutan
                </rs-button>
                <rs-button
                  variant="success"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handlePrintApproval(data.text.id)"
                >
                  <Icon name="material-symbols:print" class="w-4 h-4 mr-1" />
                  Cetak Surat Lulus
                </rs-button>
              </template>

              <template v-else-if="data.text.status === 'Tidak Lulus'">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleView(data.text.id)"
                >
                  <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                  Lihat Tuntutan
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handlePrintRejection(data.text.id)"
                >
                  <Icon name="material-symbols:print" class="w-4 h-4 mr-1" />
                  Cetak Surat Penolakan
                </rs-button>
              </template>

              <template v-else-if="data.text.status === 'Perlu Penambahbaikan'">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleImprove(data.text.id)"
                >
                  <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                  Semak & Buat Penambahbaikan
                </rs-button>
              </template>
            </div>
          </template>
        </rs-table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{
                wrapper: 'w-20',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga
              {{ paginationEnd }} daripada {{ totalTuntutan }} entri
            </span>
            <div class="flex gap-1">
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Permohonan Yang Telah Dilulus Table -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-4 text-success-600">
            <Icon name="material-symbols:check-circle" class="mr-2" />
            Permohonan yang telah diluluskan
          </h3>
          <rs-table
            :data="tuntutanLulus"
            :columns="columnsLulus"
            :pageSize="pageSizeLulus"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:noTuntutan="data">
              <a
                href="#"
                class="text-primary-600 hover:text-primary-800"
                @click.prevent="viewDetails(data.text)"
              >
                {{ data.text }}
              </a>
            </template>

            <template v-slot:tarikhTuntutan="data">
              {{ formatDate(data.text) }}
            </template>

            <template v-slot:amaunTuntutan="data">
              <div class="font-medium text-right">
                RM {{ formatNumber(data.text) }}
              </div>
            </template>

            <template v-slot:statusPermohonan="data">
              <rs-badge variant="success">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tarikhPerkhidmatan="data">
              {{ formatDate(data.text) }}
            </template>

            <template v-slot:tindakan="data">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleViewLulus(data.text.id)"
                >
                  <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
              </div>
            </template>
          </rs-table>
        </div>

        <!-- Permohonan yang Telah Ditolak Table -->
        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-4 text-danger-600">
            <Icon name="material-symbols:cancel" class="mr-2" />
            Permohonan yang telah ditolak
          </h3>
          <rs-table
            :data="tuntutanDitolak"
            :columns="columnsDitolak"
            :pageSize="pageSizeDitolak"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:noTuntutan="data">
              <a
                href="#"
                class="text-primary-600 hover:text-primary-800"
                @click.prevent="viewDetails(data.text)"
              >
                {{ data.text }}
              </a>
            </template>

            <template v-slot:tarikhTuntutan="data">
              {{ formatDate(data.text) }}
            </template>

            <template v-slot:amaunTuntutan="data">
              <div class="font-medium text-right">
                RM {{ formatNumber(data.text) }}
              </div>
            </template>

            <template v-slot:statusPermohonan="data">
              <rs-badge variant="danger">
                {{ data.text }}
              </rs-badge>
            </template>

            <template v-slot:tarikhPerkhidmatan="data">
              {{ formatDate(data.text) }}
            </template>

            <template v-slot:tindakan="data">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleViewDitolak(data.text.id)"
                >
                  <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
              </div>
            </template>
          </rs-table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Semua Tuntutan",
});

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Senarai Tuntutan",
    type: "current",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "noTuntutan",
    label: "No. Tuntutan",
    sortable: true,
  },
  {
    key: "noGL",
    label: "No. GL",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon / Institusi",
    sortable: true,
  },
  {
    key: "tarikhTuntutan",
    label: "Tarikh Tuntutan",
    sortable: true,
  },
  {
    key: "amaunTuntutan",
    label: "Amaun Tuntutan (RM)",
    sortable: true,
  },
  {
    key: "statusPermohonan",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhPerkhidmatan",
    label: "Tarikh Perkhidmatan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Columns for Lulus table
const columnsLulus = [
  {
    key: "noTuntutan",
    label: "No. Tuntutan",
    sortable: true,
  },
  {
    key: "noGL",
    label: "No. GL",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon / Institusi",
    sortable: true,
  },
  {
    key: "tarikhTuntutan",
    label: "Tarikh Tuntutan",
    sortable: true,
  },
  {
    key: "amaunTuntutan",
    label: "Amaun Tuntutan (RM)",
    sortable: true,
  },
  {
    key: "statusPermohonan",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhPerkhidmatan",
    label: "Tarikh Perkhidmatan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Columns for Ditolak table
const columnsDitolak = [
  {
    key: "noTuntutan",
    label: "No. Tuntutan",
    sortable: true,
  },
  {
    key: "noGL",
    label: "No. GL",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon / Institusi",
    sortable: true,
  },
  {
    key: "tarikhTuntutan",
    label: "Tarikh Tuntutan",
    sortable: true,
  },
  {
    key: "amaunTuntutan",
    label: "Amaun Tuntutan (RM)",
    sortable: true,
  },
  {
    key: "statusPermohonan",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhPerkhidmatan",
    label: "Tarikh Perkhidmatan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Draf", value: "Draf" },
  { label: "Dalam Semakan", value: "Dalam Semakan" },
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Perlu Penambahbaikan", value: "Perlu Penambahbaikan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const pageSize = ref(10);
const currentPage = ref(1);
const pageSizeLulus = ref(5);
const pageSizeDitolak = ref(5);

// Sample data - Replace with actual API call
const tuntutanList = ref([
  {
    id: "TUN-2024-001",
    noTuntutan: "TUN-2024-001",
    noGL: "GL-001",
    namaPemohon: "Ahmad bin Abdullah",
    tarikhTuntutan: "2024-03-20",
    amaunTuntutan: 5000.00,
    statusPermohonan: "Draf",
    tarikhPerkhidmatan: "2024-03-15",
    tindakan: { id: "TUN-2024-001", status: "Draf" }
  },
  {
    id: "TUN-2024-012",
    noTuntutan: "TUN-2024-012",
    noGL: "GL-012",
    namaPemohon: "Masjid Al-Rahman",
    tarikhTuntutan: "2024-03-26",
    amaunTuntutan: 7200.00,
    statusPermohonan: "Dalam Semakan",
    tarikhPerkhidmatan: "2024-03-24",
    tindakan: { id: "TUN-2024-012", status: "Dalam Semakan" }
  },
  {
    id: "TUN-2024-013",
    noTuntutan: "TUN-2024-013",
    noGL: "GL-013",
    namaPemohon: "Sekolah Agama Rakyat Al-Hikmah",
    tarikhTuntutan: "2024-03-25",
    amaunTuntutan: 11000.00,
    statusPermohonan: "Dalam Semakan",
    tarikhPerkhidmatan: "2024-03-22",
    tindakan: { id: "TUN-2024-013", status: "Dalam Semakan" }
  },
  {
    id: "TUN-2024-014",
    noTuntutan: "TUN-2024-014",
    noGL: "GL-014",
    namaPemohon: "Surau Taman Damai",
    tarikhTuntutan: "2024-03-24",
    amaunTuntutan: 3800.00,
    statusPermohonan: "Dalam Semakan",
    tarikhPerkhidmatan: "2024-03-21",
    tindakan: { id: "TUN-2024-014", status: "Dalam Semakan" }
  },
  {
    id: "TUN-2024-015",
    noTuntutan: "TUN-2024-015",
    noGL: "GL-015",
    namaPemohon: "Pusat Tahfiz Al-Quran Nurul Iman",
    tarikhTuntutan: "2024-03-23",
    amaunTuntutan: 13500.00,
    statusPermohonan: "Dalam Semakan",
    tarikhPerkhidmatan: "2024-03-20",
    tindakan: { id: "TUN-2024-015", status: "Dalam Semakan" }
  },
  // Add more sample data as needed
]);

// Mock data for Lulus table
const tuntutanLulus = ref([
  {
    id: "TUN-2024-002",
    noTuntutan: "TUN-2024-002",
    noGL: "GL-002",
    namaPemohon: "Masjid Al-Hidayah",
    tarikhTuntutan: "2024-03-18",
    amaunTuntutan: 8000.00,
    statusPermohonan: "Diluluskan",
    tarikhPerkhidmatan: "2024-03-10",
    tindakan: { id: "TUN-2024-002", status: "Diluluskan" }
  },
  {
    id: "TUN-2024-003",
    noTuntutan: "TUN-2024-003",
    noGL: "GL-003",
    namaPemohon: "Sekolah Agama Rakyat Al-Amin",
    tarikhTuntutan: "2024-03-15",
    amaunTuntutan: 12000.00,
    statusPermohonan: "Diluluskan",
    tarikhPerkhidmatan: "2024-03-08",
    tindakan: { id: "TUN-2024-003", status: "Diluluskan" }
  },
  {
    id: "TUN-2024-004",
    noTuntutan: "TUN-2024-004",
    noGL: "GL-004",
    namaPemohon: "Surau Kampung Baru",
    tarikhTuntutan: "2024-03-12",
    amaunTuntutan: 3500.00,
    statusPermohonan: "Diluluskan",
    tarikhPerkhidmatan: "2024-03-05",
    tindakan: { id: "TUN-2024-004", status: "Diluluskan" }
  },
  {
    id: "TUN-2024-005",
    noTuntutan: "TUN-2024-005",
    noGL: "GL-005",
    namaPemohon: "Pusat Tahfiz Al-Quran",
    tarikhTuntutan: "2024-03-10",
    amaunTuntutan: 15000.00,
    statusPermohonan: "Diluluskan",
    tarikhPerkhidmatan: "2024-03-01",
    tindakan: { id: "TUN-2024-005", status: "Diluluskan" }
  },
]);

// Mock data for Ditolak table
const tuntutanDitolak = ref([
  {
    id: "TUN-2024-006",
    noTuntutan: "TUN-2024-006",
    noGL: "GL-006",
    namaPemohon: "Kumpulan Belia Islam",
    tarikhTuntutan: "2024-03-22",
    amaunTuntutan: 25000.00,
    statusPermohonan: "Ditolak",
    tarikhPerkhidmatan: "2024-03-20",
    tindakan: { id: "TUN-2024-006", status: "Ditolak" }
  },
  {
    id: "TUN-2024-007",
    noTuntutan: "TUN-2024-007",
    noGL: "GL-007",
    namaPemohon: "Persatuan Islam Kampung Melayu",
    tarikhTuntutan: "2024-03-19",
    amaunTuntutan: 18000.00,
    statusPermohonan: "Ditolak",
    tarikhPerkhidmatan: "2024-03-15",
    tindakan: { id: "TUN-2024-007", status: "Ditolak" }
  },
  {
    id: "TUN-2024-008",
    noTuntutan: "TUN-2024-008",
    noGL: "GL-008",
    namaPemohon: "Surau Taman Permai",
    tarikhTuntutan: "2024-03-16",
    amaunTuntutan: 7500.00,
    statusPermohonan: "Ditolak",
    tarikhPerkhidmatan: "2024-03-12",
    tindakan: { id: "TUN-2024-008", status: "Ditolak" }
  },
]);

// Computed properties
const filteredTuntutan = computed(() => {
  let filtered = tuntutanList.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.noTuntutan.toLowerCase().includes(query) ||
      item.namaPemohon.toLowerCase().includes(query) ||
      item.noGL.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filters.value.status) {
    filtered = filtered.filter(item => 
      item.statusPermohonan === filters.value.status
    );
  }

  return filtered;
});

const totalTuntutan = computed(() => filteredTuntutan.value.length);
const totalPages = computed(() => Math.ceil(totalTuntutan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalTuntutan.value));

// Helper functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY');
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const getStatusVariant = (status) => {
  const variants = {
    'Draf': 'info',
    'Dalam Semakan': 'warning',
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
    'Perlu Penambahbaikan': 'warning'
  };
  return variants[status] || 'default';
};

// Action handlers
const handleView = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${id}`);
};

const handleEdit = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${id}/view-draf`);
};

const handleSubmit = (id) => {
  // Implement submit logic
  console.log('Submit tuntutan:', id);
};

const handleDelete = (id) => {
  // Implement delete logic
  console.log('Delete tuntutan:', id);
};

const handlePrintApproval = (id) => {
  // Implement print approval letter logic
  console.log('Print approval letter:', id);
};

const handlePrintRejection = (id) => {
  // Implement print rejection letter logic
  console.log('Print rejection letter:', id);
};

const handleImprove = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${id}/improve`);
};

// New handlers for Lulus and Ditolak tables
const handleViewLulus = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${id}/view-lulus`);
};

const handleViewDitolak = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${id}/view-ditolak`);
};

const handleViewDalamSemakan = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${id}/view-dalam-semakan`);
};
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>
