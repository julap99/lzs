<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tugasan</h2>
        </div>
      </template>

      <template #body>
        <!-- Profiling Content -->
        <div>
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
                  filterable: false,
                }"
                advanced
              >
                <template #header-tindakan>
                  <div class="text-center w-full">Aksi</div>
                </template>
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      class="p-1 flex gap-2"
                      @click="handleReview(text)"
                    >
                      Semak
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
                  <!-- <div class="flex gap-1">
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
                  </div> -->
                </div>
              </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan untuk Disemak",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/senarai",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/senarai",
  },
]);

// Table columns configuration for Profiling tab
const columns = [
  {
    key: "noRujukan",
    label: "No ID Pengenalan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Aksi",
    sortable: false,
  },
];


// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Baru", value: "baru" },
  { label: "Dalam Semakan", value: "dalam_semakan" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "Untuk Siasatan", value: "untuk_siasatan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data for Profiling tab - would be replaced with API call
const applications = ref([
  {
    noRujukan: "770319035991",
    namaPemohon: "ADNAN BIN ABU",
    status: "Menunggu Siasatan",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tindakan: "NAS-2025-0001",
  }
]);


// Computed properties for Profiling tab
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Strip hidden fields so table won't render their columns
  result = result.map(({ noRujukan, namaPemohon, status, tindakan }) => ({
    noRujukan,
    namaPemohon,
    status,
    tindakan,
  }));

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalApplications = computed(() => {
  return applications.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalApplications.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalApplications.value);
});

// Methods
const handleViewDetails = (noRujukan) => {
  navigateTo(`/BF-BTN/PB/senarai/${noRujukan}`);
};

const handleReview = (noRujukan) => {
  console.log(noRujukan);
  navigateTo(`/BF-PRF/AS/FR/09`);
};

const handleAssignTask = (noRujukan) => {
  // Handle task assignment - would be replaced with actual implementation
  console.log(`Assigning task for: ${noRujukan}`);
  // You can add navigation or modal logic here
};

const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    "dalam semakan": "warning",
    "tidak lengkap": "danger",
    "untuk siasatan": "secondary",
    "dalam siasatan": "warning",
    "selesai siasatan": "success",
    "menunggu siasatan": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

</script>

<style lang="scss" scoped></style>
