<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Penolong Amil untuk Sokongan Eksekutif
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                variant="secondary"
                size="sm"
                @click="handleSupport(text)"
              >
                <Icon name="ph:hand-thumbs-up" class="w-4 h-4 mr-1" />
                Sokong
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Pagination -->
        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalApplications }} rekod
          </div>
          <div class="flex items-center gap-2">
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage = currentPage - 1"
            >
              Sebelum
            </rs-button>
            <span class="text-sm text-gray-700">
              Halaman {{ currentPage }} daripada {{ totalPages }}
            </span>
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage = currentPage + 1"
            >
              Seterus
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Senarai Penolong Amil untuk Sokongan Eksekutif",
  description: "Senarai penolong amil untuk sokongan oleh Eksekutif",
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
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Sokongan Eksekutif",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3/eksekutif",
  },
]);

// RTMF Required Table Columns for Executive Support
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
  { label: "PT Reviewed", value: "PT Reviewed" },
  { label: "Under Review", value: "Under Review" },
  { label: "Executive Supported", value: "Executive Supported" },
  { label: "Executive Rejected", value: "Executive Rejected" },
];

const statusLantikanOptions = [
  { label: "Semua Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Under Review", value: "Under Review" },
  { label: "Supported", value: "Supported" },
  { label: "Rejected", value: "Rejected" },
];

// State
const filters = ref({
  searchQuery: "",
  statusPendaftaran: "",
  statusLantikan: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// RTMF Compliant Mock Data for Executive Support
const applications = ref([
  {
    no: 1,
    rujukan: "PA-2024-001",
    nama: "Ahmad bin Abdullah",
    noKP: "901231012345",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Wilayah Persekutuan",
    statusPendaftaran: "PT Reviewed",
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Under Review",
    tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "PT Reviewed" },
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
    statusLantikan: "Under Review",
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
    statusPendaftaran: "PT Reviewed",
    sesiPerkhidmatan: "Sesi 3",
    statusLantikan: "Pending",
    tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "PT Reviewed" },
  },
  {
    no: 4,
    rujukan: "PA-2024-004",
    nama: "Nurul Huda binti Ali",
    noKP: "920415098765",
    kategoriPenolongAmil: "Padi",
    jawatan: "Penolong Amil Padi",
    institusiKariah: "Masjid Damansara Perdana",
    statusPendaftaran: "Executive Supported",
    sesiPerkhidmatan: "Sesi 4",
    statusLantikan: "Supported",
    tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Executive Supported" },
  },
  {
    no: 5,
    rujukan: "PA-2024-005",
    nama: "Abdul Rahman bin Hassan",
    noKP: "870625045678",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Kg Delek",
    statusPendaftaran: "Executive Rejected",
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Rejected",
    tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Executive Rejected" },
  },
]);

// Computed properties
const filteredApplications = computed(() => {
  let filtered = applications.value;

  // Search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.rujukan.toLowerCase().includes(query) ||
        app.nama.toLowerCase().includes(query) ||
        app.noKP.includes(query)
    );
  }

  // Status filters
  if (filters.value.statusPendaftaran) {
    filtered = filtered.filter(
      (app) => app.statusPendaftaran === filters.value.statusPendaftaran
    );
  }

  if (filters.value.statusLantikan) {
    filtered = filtered.filter(
      (app) => app.statusLantikan === filters.value.statusLantikan
    );
  }

  return filtered;
});

const totalApplications = computed(() => filteredApplications.value.length);

const totalPages = computed(() => Math.ceil(totalApplications.value / pageSize.value));

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
    "PT Reviewed": "success",
    "Under Review": "info",
    "Executive Supported": "success",
    "Executive Rejected": "danger",
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    Pending: "warning",
    "Under Review": "info",
    Supported: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

// Action handlers
const handleView = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/detail/${actionData.rujukan}`);
};

const handleSupport = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/eksekutif/detail/${actionData.rujukan}`);
};

// Watch for page size changes to reset current page
watch(pageSize, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 