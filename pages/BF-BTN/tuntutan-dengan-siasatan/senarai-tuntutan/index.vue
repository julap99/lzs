<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tuntutan</h2>
          <rs-button variant="primary" @click="navigateTo('/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan')">
            <Icon name="material-symbols:add" class="w-5 h-5 mr-1" />
            Mohon Tuntutan
          </rs-button>
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
  :columns="columns"
  :pageSize="pageSize"
  :showNoColumn="true"
  :options="{
    variant: 'default',
    hover: true,
    striped: true,
  }"
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
                <div class="font-medium text-right">
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
                  <rs-button variant="primary" size="sm" @click="handleEdit(data.text.id)">
                    <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                    Edit
                  </rs-button>
                  <rs-button variant="danger" size="sm" @click="handleDelete(data.text.id)">
                    <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                    Hapus
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </RsTabItem>

          <RsTabItem title="Dalam Semakan">
            <rs-table
              :data="filteredTuntutan('Dalam Semakan')"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="true"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
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
                <div class="font-medium text-right">
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
                  <rs-button variant="primary" size="sm" @click="handleViewDalamSemakan(data.text.id)">
                    <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </RsTabItem>

          <RsTabItem title="Lulus">
                <rs-table
              :data="filteredTuntutan('Lulus')"
              :columns="columns"
              :pageSize="pageSize"
              :showNoColumn="true"
              :options="{
                variant: 'default',
                hover: true,
                striped: true,
              }"
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
                <div class="font-medium text-right">
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
                  <rs-button variant="primary" size="sm" @click="handleViewLulus(data.text.id)">
                    <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </RsTabItem>

          <RsTabItem title="Ditolak">
            <rs-table
              :data="filteredTuntutan('Tidak Lulus')"
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
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewDetails(data.text)">
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

              <template v-slot:tindakan="data">
                <div class="flex justify-center items-center gap-2">
                  <rs-button variant="primary" size="sm" @click="handleViewDitolak(data.text.id)">
                    <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                    Lihat
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
  title: "Senarai Tuntutan",
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
  { key: "noTuntutan", label: "No. Tuntutan", sortable: true },
  { key: "noGL", label: "No. GL", sortable: true },
  { key: "namaPemohon", label: "Nama Pemohon / Institusi", sortable: true },
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

// Sample data for Draf
const tuntutanList = ref([
  {
    noTuntutan: "TUN-2024-001",
    noGL: "GL-001",
    namaPemohon: "Ahmad bin Abdullah",
    amaunTuntutan: 5000.00,
    tarikhTuntutan: "2024-03-20",
    statusPermohonan: "Draf",
    tindakan: { noTuntutan: "TUN-2024-001", status: "Draf" }
  },
  {
    noTuntutan: "TUN-2024-002",
    noGL: "GL-002",
    namaPemohon: "Masjid Al-Hidayah",
    amaunTuntutan: 8000.00,
    tarikhTuntutan: "2024-03-18",
    statusPermohonan: "Draf",
    tindakan: { noTuntutan: "TUN-2024-002", status: "Draf" }
  },
]);

// Sample data for Dalam Semakan
const tuntutanDalamSemakan = ref([
  {
    noTuntutan: "TUN-2024-003",
    noGL: "GL-003",
    namaPemohon: "Sekolah Agama Rakyat Al-Amin",
    amaunTuntutan: 12000.00,
    tarikhTuntutan: "2024-03-15",
    statusPermohonan: "Dalam Semakan",
    tindakan: { noTuntutan: "TUN-2024-003", status: "Dalam Semakan" }
  },
  {
    noTuntutan: "TUN-2024-004",
    noGL: "GL-004",
    namaPemohon: "Surau Kampung Baru",
    amaunTuntutan: 3500.00,
    tarikhTuntutan: "2024-03-12",
    statusPermohonan: "Dalam Semakan",
    tindakan: { noTuntutan: "TUN-2024-004", status: "Dalam Semakan" }
  },
]);

// Sample data for Lulus
const tuntutanLulus = ref([
  {
    noTuntutan: "TUN-2024-005",
    noGL: "GL-005",
    namaPemohon: "Pusat Tahfiz Al-Quran",
    amaunTuntutan: 15000.00,
    tarikhTuntutan: "2024-03-10",
    statusPermohonan: "Lulus",
    tindakan: { noTuntutan: "TUN-2024-005", status: "Lulus" }
  },
]);

// Sample data for Ditolak
const tuntutanDitolak = ref([
  {
    noTuntutan: "TUN-2024-006",
    noGL: "GL-006",
    namaPemohon: "Kumpulan Belia Islam",
    amaunTuntutan: 25000.00,
    tarikhTuntutan: "2024-03-22",
    statusPermohonan: "Tidak Lulus",
    tindakan: { noTuntutan: "TUN-2024-006", status: "Tidak Lulus" }
  },
  {
    noTuntutan: "TUN-2024-007",
    noGL: "GL-007",
    namaPemohon: "Persatuan Islam Kampung Melayu",
    amaunTuntutan: 18000.00,
    tarikhTuntutan: "2024-03-19",
    statusPermohonan: "Tidak Lulus",
    tindakan: { noTuntutan: "TUN-2024-007", status: "Tidak Lulus" }
  },
]);

// Computed properties
const filteredTuntutan = (status) => {
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
  if (status) {
    filtered = filtered.filter(item => 
      item.statusPermohonan === status
    );
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