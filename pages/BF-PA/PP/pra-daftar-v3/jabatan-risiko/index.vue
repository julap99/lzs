<!-- 
  RTMF SCREEN: PA-PP-PD-02_01
  PURPOSE: Screening List - Senarai Semakan & Saringan (JPPA)
  DESCRIPTION: Senarai calon penolong amil untuk saringan oleh Jabatan Pengurusan Risiko
  ROUTE: /BF-PA/PP/pra-daftar-v3/jabatan-risiko
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Penolong Amil untuk Saringan
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleUploadScreening"
            >
              <Icon name="ph:upload" class="w-4 h-4 mr-1" />
              Muat Naik Saringan
            </rs-button>
          </div>
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
              v-model="filters.sesiPerkhidmatan"
              type="select"
              :options="sesiPerkhidmatanOptions"
              placeholder="Sesi Perkhidmatan"
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
                variant="warning"
                size="sm"
                @click="handleScreening(text)"
              >
                <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
                Saringan
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

    <!-- Upload Screening Modal -->
    <rs-modal
      v-model="showUploadModal"
      title="Muat Naik Fail Saringan"
      size="lg"
    >
      <div class="p-6">
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-4">
            Sila muat naik fail saringan dalam format Excel (.xlsx) atau CSV (.csv).
            Fail mesti mengandungi maklumat saringan untuk calon penolong amil.
          </p>
        </div>

        <FormKit
          type="file"
          name="screeningFile"
          label="Fail Saringan"
          accept=".xlsx,.csv"
          validation="required"
          :validation-messages="{
            required: 'Fail saringan diperlukan',
          }"
          help="Format: XLSX, CSV. Saiz maksimum: 10MB"
          v-model="uploadData.screeningFile"
        />

        <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex">
            <Icon name="ph:info" class="w-5 h-5 text-blue-400 mt-0.5" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Format Fail Saringan
              </h3>
              <ul class="mt-1 text-sm text-blue-700 list-disc list-inside">
                <li>Rujukan - Nombor rujukan calon</li>
                <li>Status Saringan - Lulus/Tidak Lulus</li>
                <li>Catatan - Catatan saringan (pilihan)</li>
                <li>Tarikh Saringan - Tarikh saringan dijalankan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="secondary-outline"
            @click="showUploadModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            :disabled="!uploadData.screeningFile"
            @click="handleUploadSubmit"
          >
            <Icon
              v-if="isUploading"
              name="ph:spinner"
              class="w-4 h-4 mr-2 animate-spin"
            />
            {{ isUploading ? 'Memuat Naik...' : 'Muat Naik' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Saringan Penolong Amil",
  description: "Senarai penolong amil untuk saringan oleh Eksekutif Jabatan Pengurusan Risiko",
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
    name: "Jabatan Risiko",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3/jabatan-risiko",
  },
]);

// RTMF Required Table Columns for Screening
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
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// RTMF Required Filter Options
const statusPendaftaranOptions = [
  { label: "Semua Status", value: "" },
  { label: "Submitted", value: "Submitted" },
  { label: "Under Review", value: "Under Review" },
  { label: "Screened", value: "Screened" },
  { label: "Screening Failed", value: "Screening Failed" },
];

const sesiPerkhidmatanOptions = [
  { label: "Semua Sesi", value: "" },
  { label: "Sesi 1 - Januari-Mac", value: "Sesi 1" },
  { label: "Sesi 2 - April-Jun", value: "Sesi 2" },
  { label: "Sesi 3 - Julai-September", value: "Sesi 3" },
  { label: "Sesi 4 - Oktober-Disember", value: "Sesi 4" },
];

// State
const filters = ref({
  searchQuery: "",
  statusPendaftaran: "",
  sesiPerkhidmatan: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const showUploadModal = ref(false);
const isUploading = ref(false);

const uploadData = ref({
  screeningFile: null,
});

// RTMF Compliant Mock Data for Screening
const applications = ref([
  {
    no: 1,
    rujukan: "PA-2024-001",
    nama: "Ahmad bin Abdullah",
    noKP: "901231012345",
    kategoriPenolongAmil: "Fitrah",
    institusiKariah: "Masjid Wilayah Persekutuan",
    statusPendaftaran: "Submitted",
    sesiPerkhidmatan: "Sesi 1",
    tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Submitted" },
  },
  {
    no: 2,
    rujukan: "PA-2024-002",
    nama: "Siti binti Mohamed",
    noKP: "850515087654",
    kategoriPenolongAmil: "Kariah",
    institusiKariah: "Masjid Al-Khairiyah",
    statusPendaftaran: "Under Review",
    sesiPerkhidmatan: "Sesi 2",
    tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Under Review" },
  },
  {
    no: 3,
    rujukan: "PA-2024-003",
    nama: "Mohd Razak bin Ibrahim",
    noKP: "880320056789",
    kategoriPenolongAmil: "Komuniti",
    institusiKariah: "Masjid Bandar Utama",
    statusPendaftaran: "Screened",
    sesiPerkhidmatan: "Sesi 3",
    tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Screened" },
  },
  {
    no: 4,
    rujukan: "PA-2024-004",
    nama: "Nurul Huda binti Ali",
    noKP: "920810034567",
    kategoriPenolongAmil: "Padi",
    institusiKariah: "Masjid Damansara Perdana",
    statusPendaftaran: "Screening Failed",
    sesiPerkhidmatan: "Sesi 4",
    tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Screening Failed" },
  },
  {
    no: 5,
    rujukan: "PA-2024-005",
    nama: "Abdul Rahman bin Hassan",
    noKP: "870625098765",
    kategoriPenolongAmil: "Fitrah",
    institusiKariah: "Masjid Kg Delek",
    statusPendaftaran: "Submitted",
    sesiPerkhidmatan: "Sesi 1",
    tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Submitted" },
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
    Submitted: "warning",
    "Under Review": "info",
    Screened: "success",
    "Screening Failed": "danger",
  };
  return statusVariants[status] || "default";
};

// Action handlers
const handleView = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/detail/${actionData.rujukan}`);
};

const handleScreening = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/jabatan-risiko/detail/${actionData.rujukan}`);
};

const handleUploadScreening = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3/jabatan-risiko/upload");
};



// Watch for page size changes to reset current page
watch(pageSize, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 
