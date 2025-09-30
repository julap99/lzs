<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tuntutan</h2>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <!-- <div class="mb-6">
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
        -->

        <!-- Tabs for different statuses -->
        <RsTab variant="primary" type="default">
          <RsTabItem title="Draf">
            <rs-table
                :data="filteredTuntutan('Draf')"
                :field="['noTuntutan', 'noGL', 'namaPemohon', 'maklumatBantuan', 'tarikhTuntutan', 'amaunTuntutan', 'statusPermohonan', 'tindakan']"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="false"
                :show-filter="true"
                :show-search="true"
                :autoFields="false"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                advanced
              >

              <template v-slot:noTuntutan="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewDetails(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhTuntutan="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:amaunTuntutan="data">
                <div class="font-medium text-left">
                  RM {{ formatNumber(data.text) }}
                </div>
              </template>

              <template v-slot:statusPermohonan="data">
                <rs-badge :variant="getStatusVariant(data.text)">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="data">
                <div class="flex justify-center items-center gap-2">
                  <!-- Edit -->
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    @click="handleEdit(data.text.id)"
                    title="Edit"
                    aria-label="Edit"
                  >
                    <Icon name="material-symbols:edit" class="w-5 h-5" />
                  </rs-button>

                  <!-- Hapus -->
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-red-600 hover:text-red-800"
                    @click="handleDelete(data.text.id)"
                    title="Hapus"
                    aria-label="Hapus"
                  >
                    <Icon name="material-symbols:delete" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>

            </rs-table>
          </RsTabItem>

          <RsTabItem title="Dalam Semakan">
            <rs-table
              :data="filteredTuntutan('Dalam Semakan')"
              :field="['noTuntutan', 'noGL', 'namaPemohon', 'maklumatBantuan', 'tarikhTuntutan', 'amaunTuntutan', 'statusPermohonan', 'tindakan']"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="false"
              :show-filter="true"
              :show-search="true"
              :autoFields="false"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              advanced
            >

              <template v-slot:noTuntutan="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewDetails(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhTuntutan="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:amaunTuntutan="data">
                <div class="font-medium text-left">
                  RM {{ formatNumber(data.text) }}
                </div>
              </template>

              <template v-slot:statusPermohonan="data">
                <rs-badge variant="warning">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="data">
                <div class="flex justify-center items-center gap-2">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    :title="`Lihat ${data.row?.noTuntutan || ''}`"
                    title="Lihat"
                    aria-label="Lihat"
                    @click="handleViewDalamSemakan(data.row?.id || data.text)"
                  >
                    <Icon name="material-symbols:visibility" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>

            </rs-table>
          </RsTabItem>

          <RsTabItem title="Lulus">
                <rs-table
              :data="filteredTuntutan('Lulus')"
              :field="['noTuntutan', 'noGL', 'namaPemohon', 'maklumatBantuan', 'tarikhTuntutan', 'amaunTuntutan', 'statusPermohonan', 'tindakan']"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="false"
              :show-filter="true"
              :show-search="true"
              :autoFields="false"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
              advanced
            >

              <template v-slot:noTuntutan="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewDetails(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhTuntutan="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:amaunTuntutan="data">
                <div class="font-medium text-left">
                  RM {{ formatNumber(data.text) }}
                </div>
              </template>

              <template v-slot:statusPermohonan="data">
                <rs-badge variant="success">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="data">
                <div class="flex justify-center items-center gap-2">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    :title="`Lihat ${data.row?.noTuntutan || ''}`"
                    aria-label="Lihat"
                    title="Lihat"
                    @click="handleViewLulus(data.row?.id || data.text)"
                  >
                    <Icon name="material-symbols:visibility" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>

            </rs-table>
          </RsTabItem>

          <RsTabItem title="Ditolak">
            <rs-table
              :data="filteredTuntutan('Ditolak')"
              :field="['noTuntutan', 'noGL', 'namaPemohon', 'maklumatBantuan', 'tarikhTuntutan', 'amaunTuntutan', 'statusPermohonan', 'tindakan']"
              :columns="columnsDitolak"
              :pageSize="pageSizeDitolak"
              :showNoColumn="false"
              :show-filter="true"
              :show-search="true"
              :autoFields="false"
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
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewDetails(data.text)">
                  {{ data.text }}
                </a>
              </template>

              <template v-slot:tarikhTuntutan="data">
                {{ formatDate(data.text) }}
              </template>

              <template v-slot:amaunTuntutan="data">
                <div class="font-medium text-left">
                  RM {{ formatNumber(data.text) }}
                </div>
              </template>

              <template v-slot:statusPermohonan="data">
                <rs-badge variant="danger">
                  {{ data.text }}
                </rs-badge>
              </template>

              <template v-slot:tindakan="data">
                <div class="flex justify-center items-center gap-2">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    :title="`Lihat ${data.row?.noTuntutan || ''}`"
                    aria-label="Lihat"
                    @click="handleViewDitolak(data.row?.id || data.text)"
                  >
                    <Icon name="material-symbols:visibility" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>

            </rs-table>
          </RsTabItem>
        </RsTab>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Tuntutan (Vendor)",
});

const breadcrumb = ref([
  { name: "Pengurusan Bantuan", type: "link", path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/vendor" },
  { name: "Tuntutan", type: "link", path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/vendor" },
  { name: "Senarai Tuntutan", type: "current", path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/vendor" },
]);

// Table columns configuration
const columns = [
  { key: "noTuntutan", label: "No. Tuntutan", sortable: true },
  { key: "noGL", label: "No. GL", sortable: true },
  { key: "namaPemohon", label: "Nama Pemohon / Institusi", sortable: true },
  { key: "maklumatBantuan", label: "Maklumat Bantuan", sortable: true },
  { key: "tarikhTuntutan", label: "Tarikh Tuntutan", sortable: true },
  { key: "amaunTuntutan", label: "Amaun Tuntutan (RM)", sortable: true },
  { key: "statusPermohonan", label: "Status Permohonan", sortable: true },
  { key: "tindakan", label: "Tindakan", sortable: false },
];

// Columns for Lulus table
const columnsLulus = [
  { key: "noTuntutan", label: "No. Tuntutan", sortable: true },
  { key: "noGL", label: "No. GL", sortable: true },
  { key: "namaPemohon", label: "Nama Pemohon / Institusi", sortable: true },
  { key: "maklumatBantuan", label: "Maklumat Bantuan", sortable: true },
  { key: "tarikhTuntutan", label: "Tarikh Tuntutan", sortable: true },
  { key: "amaunTuntutan", label: "Amaun Tuntutan (RM)", sortable: true },
  { key: "statusPermohonan", label: "Status Permohonan", sortable: true },
  { key: "tindakan", label: "Tindakan", sortable: false },
];

// Columns for Ditolak table
const columnsDitolak = [
  { key: "noTuntutan", label: "No. Tuntutan", sortable: true },
  { key: "noGL", label: "No. GL", sortable: true },
  { key: "namaPemohon", label: "Nama Pemohon / Institusi", sortable: true },
  { key: "maklumatBantuan", label: "Maklumat Bantuan", sortable: true },
  { key: "tarikhTuntutan", label: "Tarikh Tuntutan", sortable: true },
  { key: "amaunTuntutan", label: "Amaun Tuntutan (RM)", sortable: true },
  { key: "statusPermohonan", label: "Status Permohonan", sortable: true },
  { key: "tindakan", label: "Tindakan", sortable: false },
];

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Draf", value: "Draf" },
  { label: "Dalam Semakan", value: "Dalam Semakan" },
  { label: "Lulus", value: "Lulus" },
  { label: "Ditolak", value: "Ditolak" },
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

// ⚠️ Replace all four sample arrays with this single one:
const allTuntutan = ref([
  // Draf
  {
    id: "TUN-2024-001",
    noTuntutan: "TUN-2024-001",
    noGL: "GL-001",
    namaPemohon: "Ahmad bin Abdullah",
    maklumatBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)",
    amaunTuntutan: 5000.0,
    tarikhTuntutan: "2024-03-20",
    statusPermohonan: "Draf",
    tindakan: "TUN-2024-001",
  },
  {
    id: "TUN-2024-002",
    noTuntutan: "TUN-2024-002",
    noGL: "GL-002",
    namaPemohon: "Masjid Al-Hidayah",
    maklumatBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)",
    amaunTuntutan: 8000.0,
    tarikhTuntutan: "2024-03-18",
    statusPermohonan: "Draf",
    tindakan: "TUN-2024-002",
  },

  // Dalam Semakan
  {
    id: "TUN-2024-003",
    noTuntutan: "TUN-2024-003",
    noGL: "GL-003",
    namaPemohon: "PUSAT HEMODIALISIS PERMATA SDN. BHD.",
    maklumatBantuan: "(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR) (B103)",
    amaunTuntutan: 12000.0,
    tarikhTuntutan: "2024-03-15",
    statusPermohonan: "Dalam Semakan",
    tindakan: "TUN-2024-003",
  },
  {
    id: "TUN-2024-004",
    noTuntutan: "TUN-2024-004",
    noGL: "GL-004",
    namaPemohon: "Surau Kampung Baru",
    maklumatBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)",
    amaunTuntutan: 3500.0,
    tarikhTuntutan: "2024-03-12",
    statusPermohonan: "Dalam Semakan",
    tindakan: "TUN-2024-004",
  },

  // Lulus
  {
    id: "TUN-2024-005",
    noTuntutan: "TUN-2024-005",
    noGL: "GL-005",
    namaPemohon: "Pusat Tahfiz Al-Quran",
    maklumatBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)",
    amaunTuntutan: 15000.0,
    tarikhTuntutan: "2024-03-10",
    statusPermohonan: "Lulus",
    tindakan: "TUN-2024-005",
  },

  // Ditolak
  {
    id: "TUN-2024-006",
    noTuntutan: "TUN-2024-006",
    noGL: "GL-006",
    namaPemohon: "Kumpulan Belia Islam",
    maklumatBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)",
    amaunTuntutan: 25000.0,
    tarikhTuntutan: "2024-03-22",
    statusPermohonan: "Ditolak",
    tindakan: "TUN-2024-006",
  },
  {
    id: "TUN-2024-007",
    noTuntutan: "TUN-2024-007",
    noGL: "GL-007",
    namaPemohon: "Persatuan Islam Kampung Melayu",
    maklumatBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)",
    amaunTuntutan: 18000.0,
    tarikhTuntutan: "2024-03-19",
    statusPermohonan: "Ditolak",
    tindakan: "TUN-2024-007",
  },
  {
    id: "TUN-2024-008",
    noTuntutan: "TUN-2024-008",
    noGL: "GL-008",
    namaPemohon: "KLINIK DIALISIS NUR HIDAYAH",
    maklumatBantuan: "(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR) (B103)",
    amaunTuntutan: 15000.0,
    tarikhTuntutan: "2024-03-25",
    statusPermohonan: "Lulus",
    tindakan: "TUN-2024-008",
  },
]);


// Computed properties
const filteredTuntutan = (status) => {
  let filtered = [...allTuntutan.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) =>
      item.noTuntutan.toLowerCase().includes(q) ||
      item.namaPemohon.toLowerCase().includes(q) ||
      item.noGL.toLowerCase().includes(q)
    );
  }

  if (status) {
    filtered = filtered.filter((item) => item.statusPermohonan === status);
  }

  return filtered;
};


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
    'Ditolak': 'danger',
    'Perlu Penambahbaikan': 'warning'
  };
  return variants[status] || 'default';
};

// Action handlers
const handleView = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor/${id}`);
};

const handleEdit = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor/${id}`);
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
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor/${id}`);
};

// New handlers for Lulus and Ditolak tables
const handleViewLulus = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor/${id}`);
};

const handleViewDitolak = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor/${id}`);
};

const handleViewDalamSemakan = (id) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor/${id}`);
};
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>
