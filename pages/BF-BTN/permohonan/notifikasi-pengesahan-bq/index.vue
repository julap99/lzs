<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan untuk Pengesahan BQ
          </h2>
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
                placeholder="Cari No KP, Nama, atau No Rujukan..."
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
                class="p-1 flex gap-2"
                @click="handleViewDetails(text)"
              >
                <Icon name="ph:check" class="w-4 h-4" />
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
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan - Untuk Siasatan",
});

const breadcrumb = ref([
  {
    name: "Notifikasi",
    type: "link",
    path: "/BF-BTN/permohonan/notifikasi-pengesahan-bq",
  },
  {
    name: "Permohonan Saya",
    type: "current",
    path: "/BF-BTN/permohonan/notifikasi-pengesahan-bq",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "noRujukan",
    label: "No Rujukan Permohonan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "tarikhTerima",
    label: "Tarikh Terima Permohonan",
    sortable: true,
  },
  {
    key: "namaPegawai",
    label: "Nama Pegawai EOAD",
    sortable: true,
  },
  {
    key: "tarikhSemakan",
    label: "Tarikh Semakan Terakhir",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Aksi",
    sortable: false,
  },
];

// Options for filters
const statusOptions = [{ label: "Untuk Semakan", value: "untuk_pengesahan" }];

// State
const searchQuery = ref("");
const filters = ref({
  status: "untuk_pengesahan", // Default to "Untuk Siasatan"
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - would be replaced with API call
const applications = ref([
  {
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tarikhSemakan: "2024-03-21",
    status: "untuk_pengesahan",
    tindakan: "NAS-2025-0001",
  },
]);

// Computed properties
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
    result = result.filter(
      (app) => app.status.toLowerCase() === filters.value.status.toLowerCase()
    );
  }

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
  navigateTo(`/BF-BTN/permohonan/notifikasi-pengesahan-bq/${noRujukan}`);
};

const getStatusVariant = (status) => {
  const variants = {
    untuk_pengesahan: "warning",
  };
  return variants[status.toLowerCase()] || "default";
};
</script>

<style lang="scss" scoped></style>
