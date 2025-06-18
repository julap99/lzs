<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan Penolong Amil
          </h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PA/PP/PD/PA_Login')"
          >
            Login as Penolong Amil
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
                placeholder="Cari nombor rujukan, nama calon..."
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
                placeholder="Pilih Status"
                :classes="{
                  input: '!py-2',
                }"
              />
              <!-- <rs-button
                variant="secondary-outline"
                @click="toggleSelectAll"
              >
                <Icon name="material-symbols:checklist" class="mr-2" />
                {{ selectAll ? 'Batal Pilih Semua' : 'Pilih Semua' }}
              </rs-button> -->
              <rs-button
                variant="primary"
                @click="navigateTo('/BF-PA/PP/pra-daftar/daftar-baharu')"
              >
                <Icon name="material-symbols:add-circle" class="mr-2" />
                Tambah Baru
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div
          v-if="selectedRows.length > 0"
          class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm text-blue-700">
              {{ selectedRows.length }} baris dipilih
            </span>
            <div class="flex gap-2">
              <rs-button variant="danger" size="sm" @click="handleBulkReject">
                <Icon name="material-symbols:close" class="w-4 h-4 mr-1" />
                Tolak
              </rs-button>
              <rs-button variant="primary" size="sm" @click="handleBulkApprove">
                <Icon name="material-symbols:check" class="w-4 h-4 mr-1" />
                Sahkan
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="filteredApplications"
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
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleAction(text)"
              >
                <Icon name="ph:check" class="w-4 h-4 mr-1" />
                {{ getActionButtonText(text.status) }}
              </rs-button>
            </div>
          </template>

          <template v-slot:pilih="{ text }">
            <div class="flex justify-center">
              <FormKit
                v-model="selectedRows"
                type="checkbox"
                :value="text.noRef"
                :classes="{
                  wrapper: 'm-0',
                  outer: 'm-0',
                  input: 'rounded',
                }"
              />
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
    name: "Senarai Permohonan",
    type: "current",
    path: "/BF-PA/PP/PD",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "pilih",
    label: "Pilih",
    sortable: false,
    width: "60px",
  },
  {
    key: "noRef",
    label: "No. Rujukan",
    sortable: true,
  },
  {
    key: "candidateName",
    label: "Nama Calon",
    sortable: true,
  },
  {
    key: "masjidName",
    label: "Masjid",
    sortable: true,
  },
  {
    key: "categoryLabel",
    label: "Kategori",
    sortable: true,
  },
  {
    key: "applicationDate",
    label: "Tarikh Mohon",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
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
  { label: "Belum Disemak", value: "Belum Disemak" },
  {
    label: "Menunggu Sokongan JPPA",
    value: "Menunggu Sokongan JPPA",
  },
  {
    label: "Menunggu Kelulusan Ketua JPPA",
    value: "Menunggu Kelulusan Ketua JPPA",
  },
  {
    label: "Menunggu Kelulusan Ketua Divisyen",
    value: "Menunggu Kelulusan Ketua Divisyen",
  },
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRows = ref([]);
const selectAll = ref(false);

// Mock data for applications
const applications = ref([
  {
    noRef: "PA-2024-001",
    namaCalon: "Ahmad bin Abdullah",
    namaMasjid: "Masjid Wilayah Persekutuan",
    kategoriLabel: "Fitrah",
    tarikhPermohonan: "01/03/2024",
    status: "Belum Disemak",
    tindakan: { status: "Belum Disemak", noRef: "PA-2024-001" },
    pilih: false,
  },
  {
    noRef: "PA-2024-002",
    namaCalonPenolongAmil: "Siti binti Mohamed",
    namaMasjid: "Masjid Al-Khairiyah",
    kategoriLabel: "Kariah",
    tarikhPermohonan: "02/03/2024",
    status: "Menunggu Sokongan JPPA",
    tindakan: { status: "Menunggu Sokongan JPPA", noRef: "PA-2024-002" },
    pilih: false,
  },
  {
    noRef: "PA-2024-003",
    namaCalonPenolongAmil: "Mohd Razak bin Ibrahim",
    namaMasjid: "Masjid Bandar Utama",
    kategoriLabel: "Komuniti",
    tarikhPermohonan: "03/03/2024",
    status: "Menunggu Kelulusan Ketua JPPA",
    tindakan: { status: "Menunggu Kelulusan Ketua JPPA", noRef: "PA-2024-003" },
    pilih: false,
  },
  {
    noRef: "PA-2024-004",
    namaCalonPenolongAmil: "Nurul Huda binti Ali",
    namaMasjid: "Masjid Damansara Perdana",
    kategoriLabel: "Padi",
    tarikhPermohonan: "04/03/2024",
    status: "Menunggu Kelulusan Ketua Divisyen",
    tindakan: {
      status: "Menunggu Kelulusan Ketua Divisyen",
      noRef: "PA-2024-004",
    },
    pilih: false,
  },
  {
    noRef: "PA-2024-005",
    namaCalonPenolongAmil: "Abdul Rahman bin Hassan",
    namaMasjid: "Masjid Kg Delek",
    kategoriLabel: "Fitrah",
    tarikhPermohonan: "05/03/2024",
    status: "Lulus",
    tindakan: { status: "Lulus", noRef: "PA-2024-005" },
    pilih: false,
  },
  {
    noRef: "PA-2024-006",
    namaCalonPenolongAmil: "Fatimah binti Ismail",
    namaMasjid: "Masjid Al-Hidayah",
    kategoriLabel: "Komuniti",
    tarikhPermohonan: "06/03/2024",
    status: "Tidak Lulus",
    tindakan: { status: "Tidak Lulus", noRef: "PA-2024-006" },
    pilih: false,
  },
]);

// Computed properties
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRef.toLowerCase().includes(query) ||
        app.namaCalon.toLowerCase().includes(query) ||
        app.namaMasjid.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
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
const getStatusVariant = (status) => {
  const statusVariants = {
    "Belum Disemak": "warning",
    "Menunggu Sokongan JPPA": "info",
    "Menunggu Kelulusan Ketua JPPA": "primary",
    "Menunggu Kelulusan Ketua Divisyen": "secondary",
    Lulus: "success",
    "Tidak Lulus": "danger",
  };
  return statusVariants[status] || "default";
};

const getActionButtonText = (status) => {
  const actionTexts = {
    "Belum Disemak": "Semakan & Tapisan",
    "Menunggu Sokongan JPPA": "Semakan & Sokongan",
    "Menunggu Kelulusan Ketua JPPA": "Semakan & Kelulusan",
    "Menunggu Kelulusan Ketua Divisyen": "Semakan & Kelulusan",
    Lulus: "Kemaskini",
    "Tidak Lulus": "Hantar Semula",
  };
  return actionTexts[status] || "Semakan & Kelulusan";
};

const getNextPage = (status) => {
  const statusPages = {
    "Belum Disemak": "02",
    "Menunggu Sokongan JPPA": "03",
    "Menunggu Kelulusan Ketua JPPA": "04",
    "Menunggu Kelulusan Ketua Divisyen": "05",
    Lulus: "06",
    "Tidak Lulus": "01",
  };
  return statusPages[status] || "01";
};

// Action handlers
const handleAction = (actionData) => {
  const nextPage = getNextPage(actionData.status);
  navigateTo(`/BF-PA/PP/pra-daftar/tapisan-lantikan`);
};

// Bulk action handlers
const handleBulkApprove = () => {
  if (selectedRows.value.length === 0) return;

  // Show confirmation dialog
  if (
    confirm(
      `Adakah anda pasti untuk sahkan ${selectedRows.value.length} permohonan yang dipilih?`
    )
  ) {
    // Here you would normally make API calls to approve the selected applications
    console.log("Approving applications:", selectedRows.value);

    // For demo purposes, update the status of selected items
    applications.value.forEach((app) => {
      if (selectedRows.value.includes(app.noRef)) {
        app.status = "Lulus";
      }
    });

    // Clear selection
    selectedRows.value = [];
    selectAll.value = false;

    // Show success message (you can replace this with your notification system)
    alert("Permohonan telah berjaya disahkan.");
  }
};

const handleBulkReject = () => {
  if (selectedRows.value.length === 0) return;

  // Show confirmation dialog
  if (
    confirm(
      `Adakah anda pasti untuk tolak ${selectedRows.value.length} permohonan yang dipilih?`
    )
  ) {
    // Here you would normally make API calls to reject the selected applications
    console.log("Rejecting applications:", selectedRows.value);

    // For demo purposes, update the status of selected items
    applications.value.forEach((app) => {
      if (selectedRows.value.includes(app.noRef)) {
        app.status = "Tidak Lulus";
      }
    });

    // Clear selection
    selectedRows.value = [];
    selectAll.value = false;

    // Show success message (you can replace this with your notification system)
    alert("Permohonan telah berjaya ditolak.");
  }
};

// Select all functionality
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedRows.value = filteredApplications.value.map((app) => app.noRef);
  } else {
    selectedRows.value = [];
  }
};

// Watch for changes in selected rows to update select all state
watch(
  selectedRows,
  (newVal) => {
    if (newVal.length === 0) {
      selectAll.value = false;
    } else if (newVal.length === filteredApplications.value.length) {
      selectAll.value = true;
    } else {
      selectAll.value = false;
    }
  },
  { deep: true }
);

// Watch for changes in filtered applications to update selection
watch(filteredApplications, (newVal) => {
  // Remove selected items that are no longer in the filtered results
  selectedRows.value = selectedRows.value.filter((refNo) =>
    newVal.some((app) => app.noRef === refNo)
  );
});

// Watch for page size changes to reset current page
watch(pageSize, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
