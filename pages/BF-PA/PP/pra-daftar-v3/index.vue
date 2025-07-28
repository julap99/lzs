<template>
  <div>
    <RoleSimulator :initial-role="currentRole" @role-change="handleRoleChange" />
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan Penolong Amil
          </h2>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/PP/pra-daftar-v3/daftar-baharu')"
          >
            <Icon name="material-symbols:add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari nombor rujukan, nama calon..."
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusPendaftaran"
              type="select"
              :options="statusPendaftaranOptions"
              placeholder="Status Pendaftaran"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.sesiPerkhidmatan"
              type="select"
              :options="sesiPerkhidmatanOptions"
              placeholder="Sesi Perkhidmatan"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusLantikan"
              type="select"
              :options="statusLantikanOptions"
              placeholder="Status Lantikan"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="filteredApplications"
          :columns="columns"
          :pageSize="pageSize"
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
          <template v-slot:statusPendaftaran="{ text }">
            <rs-badge :variant="getStatusPendaftaranVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:statusLantikan="{ text }">
            <rs-badge :variant="getStatusLantikanVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleView(text)"
              >
                <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <rs-button
                v-if="canEdit(text.statusPendaftaran)"
                variant="secondary"
                size="sm"
                @click="handleEdit(text)"
              >
                <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
                Kemaskini
              </rs-button>
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
              {{ paginationEnd }} daripada {{ totalApplications }} entri
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
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Senarai Permohonan Penolong Amil",
  description: "Senarai permohonan penolong amil untuk semakan dan kelulusan",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Senarai Permohonan V3",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
]);

// RTMF Required Table Columns
const columns = [
  {
    key: "no",
    label: "No",
    sortable: true,
    width: "60px",
  },
  {
    key: "rujukan",
    label: "Rujukan",
    sortable: true,
  },
  {
    key: "nama",
    label: "Nama",
    sortable: true,
  },
  {
    key: "noKP",
    label: "No KP",
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori Penolong Amil",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi/Kariah",
    sortable: true,
  },
  {
    key: "statusPendaftaran",
    label: "Status Pendaftaran",
    sortable: true,
  },
  {
    key: "sesiPerkhidmatan",
    label: "Sesi Perkhidmatan",
    sortable: true,
  },
  {
    key: "statusLantikan",
    label: "Status Lantikan/Perkhidmatan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// RTMF Required Filter Options
const statusPendaftaranOptions = [
  { label: "Semua Status", value: "" },
  { label: "Draft", value: "Draft" },
  { label: "Submitted", value: "Submitted" },
  { label: "Under Review", value: "Under Review" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const sesiPerkhidmatanOptions = [
  { label: "Semua Sesi", value: "" },
  { label: "Sesi 1 - Januari-Mac", value: "Sesi 1" },
  { label: "Sesi 2 - April-Jun", value: "Sesi 2" },
  { label: "Sesi 3 - Julai-September", value: "Sesi 3" },
  { label: "Sesi 4 - Oktober-Disember", value: "Sesi 4" },
];

const statusLantikanOptions = [
  { label: "Semua Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Appointed", value: "Appointed" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Terminated", value: "Terminated" },
];

// State
const filters = ref({
  searchQuery: "",
  statusPendaftaran: "",
  sesiPerkhidmatan: "",
  statusLantikan: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const currentRole = ref("pyb");

// RTMF Compliant Mock Data
const applications = ref([
  {
    no: 1,
    rujukan: "PA-2024-001",
    nama: "Ahmad bin Abdullah",
    noKP: "901231012345",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Wilayah Persekutuan",
    statusPendaftaran: "Submitted",
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Pending",
    tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Submitted" },
  },
  {
    no: 2,
    rujukan: "PA-2024-002",
    nama: "Siti binti Mohamed",
    noKP: "850515087654",
    kategoriPenolongAmil: "Kariah",
    jawatan: "Penolong Amil Kariah",
    institusiKariah: "Masjid Al-Khairiyah",
    statusPendaftaran: "Under Review",
    sesiPerkhidmatan: "Sesi 2",
    statusLantikan: "Pending",
    tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Under Review" },
  },
  {
    no: 3,
    rujukan: "PA-2024-003",
    nama: "Mohd Razak bin Ibrahim",
    noKP: "880320056789",
    kategoriPenolongAmil: "Komuniti",
    jawatan: "Penolong Amil Komuniti",
    institusiKariah: "Masjid Bandar Utama",
    statusPendaftaran: "Approved",
    sesiPerkhidmatan: "Sesi 3",
    statusLantikan: "Appointed",
    tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Approved" },
  },
  {
    no: 4,
    rujukan: "PA-2024-004",
    nama: "Nurul Huda binti Ali",
    noKP: "920810034567",
    kategoriPenolongAmil: "Padi",
    jawatan: "Penolong Amil Padi",
    institusiKariah: "Masjid Damansara Perdana",
    statusPendaftaran: "Rejected",
    sesiPerkhidmatan: "Sesi 4",
    statusLantikan: "Terminated",
    tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Rejected" },
  },
  {
    no: 5,
    rujukan: "PA-2024-005",
    nama: "Abdul Rahman bin Hassan",
    noKP: "870625098765",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Kg Delek",
    statusPendaftaran: "Approved",
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Active",
    tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Approved" },
  },
]);

// Computed properties
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(
      (app) =>
        app.rujukan.toLowerCase().includes(query) ||
        app.nama.toLowerCase().includes(query) ||
        app.noKP.toLowerCase().includes(query)
    );
  }

  // Apply status filters
  if (filters.value.statusPendaftaran) {
    result = result.filter((app) => app.statusPendaftaran === filters.value.statusPendaftaran);
  }

  if (filters.value.sesiPerkhidmatan) {
    result = result.filter((app) => app.sesiPerkhidmatan === filters.value.sesiPerkhidmatan);
  }

  if (filters.value.statusLantikan) {
    result = result.filter((app) => app.statusLantikan === filters.value.statusLantikan);
  }

  return result;
});

const totalApplications = computed(() => filteredApplications.value.length);

const totalPages = computed(() =>
  Math.ceil(totalApplications.value / pageSize.value)
);

const paginationStart = computed(() => {
  return totalApplications.value > 0
    ? (currentPage.value - 1) * pageSize.value + 1
    : 0;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalApplications.value);
});

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "default",
    Submitted: "warning",
    "Under Review": "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    Pending: "warning",
    Appointed: "info",
    Active: "success",
    Inactive: "secondary",
    Terminated: "danger",
  };
  return statusVariants[status] || "default";
};

const canEdit = (statusPendaftaran) => {
  return ["Draft", "Submitted"].includes(statusPendaftaran);
};

// Action handlers
const handleView = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/detail/${actionData.rujukan}`);
};

const handleEdit = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/edit/${actionData.rujukan}`);
};

// Watch for page size changes to reset current page
watch(pageSize, () => {
  currentPage.value = 1;
});

const handleRoleChange = (newRole) => {
  currentRole.value = newRole;
};
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 