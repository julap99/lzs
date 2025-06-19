<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        Kelulusan Pemulangan Tunai
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Senarai permohonan pemulangan tunai yang menunggu kelulusan
      </p>
    </div>

    <rs-card class="py-5">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h5 class="font-semibold">Senarai Permohonan</h5>
            <span class="text-sm text-gray-500">
              Paparkan semua permohonan dengan status "Menunggu Kelulusan"
            </span>
          </div>

          <div class="flex gap-3">
            <rs-button variant="primary-outline" @click="handleRefresh">
              <Icon name="ic:outline-refresh" class="mr-1" size="1rem" />
              Segar Semula
            </rs-button>
          </div>
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
                placeholder="Cari ID permohonan, nama pemohon..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <rs-button
                variant="primary-outline"
                class="!px-3"
                @click="isFilterOpen = !isFilterOpen"
              >
                <Icon name="ic:outline-filter-alt" class="mr-1" size="1rem" />
                <span>Penapis</span>
              </rs-button>
            </div>
          </div>

          <!-- Filter Panel -->
          <div
            v-if="isFilterOpen"
            class="mt-4 bg-white rounded-lg border border-gray-200 p-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormKit
                type="select"
                name="lokasi"
                label="Cawangan / Lokasi"
                :options="lokasiOptions"
                v-model="filters.lokasi"
              />

              <FormKit
                type="date"
                name="tarikhMula"
                label="Tarikh Mula"
                v-model="filters.tarikhMula"
              />

              <FormKit
                type="date"
                name="tarikhTamat"
                label="Tarikh Tamat"
                v-model="filters.tarikhTamat"
              />

              <div class="flex items-end space-x-2">
                <rs-button variant="primary-outline" @click="handleReset">
                  <Icon name="ic:outline-refresh" class="mr-1" size="1rem" />
                  Reset
                </rs-button>
                <rs-button variant="primary" @click="applyFilters">
                  <Icon name="ic:outline-search" class="mr-1" size="1rem" />
                  Tapis
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="hasActiveFilters" class="mt-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-gray-500">Penapis Aktif:</span>

              <div
                v-for="(value, key) in filters"
                :key="key"
                v-if="value"
                class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
              >
                <span class="mr-1">{{ getFilterLabel(key, value) }}</span>
                <button
                  @click="removeFilter(key)"
                  class="text-blue-800 hover:text-blue-900"
                >
                  <Icon name="ic:baseline-close" size="16" />
                </button>
              </div>

              <button
                @click="handleReset"
                class="text-sm text-gray-500 hover:text-gray-700 ml-2"
              >
                Padam Semua
              </button>
            </div>
          </div>
        </div>

        <!-- Table Section -->
        <rs-table
          :data="filteredApplications"
          :columns="columns"
          :pageSize="10"
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
          <template v-slot:idPermohonan="data">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewApplication(data.value)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:status="data">
            <rs-badge variant="warning">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="viewApplication(data.value)"
              >
                <Icon name="ic:outline-check-circle" class="mr-1" size="1rem" />
                Lihat
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Kelulusan Pemulangan Tunai",
  description: "Senarai permohonan pemulangan tunai yang menunggu kelulusan",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-TNI/pemulangan-tunai/kelulusan",
  },
]);

// Table columns
const columns = [
  {
    key: "idPermohonan",
    label: "ID Permohonan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "lokasi",
    label: "Lokasi / Unit Peti Besi",
    sortable: true,
  },
  {
    key: "tarikhPermohonan",
    label: "Tarikh & Masa Permohonan",
    sortable: true,
  },
  {
    key: "jumlahDipulangkan",
    label: "Jumlah Dipulangkan (RM)",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// State
const searchQuery = ref("");
const isFilterOpen = ref(false);
const filters = ref({
  lokasi: "",
  tarikhMula: "",
  tarikhTamat: "",
});

// Mock data - would be replaced with API call
const applications = ref([
  {
    id: 1,
    idPermohonan: "PT-2024-001",
    namaPemohon: "Ahmad bin Abdullah",
    lokasi: "Cawangan Kuala Lumpur",
    tarikhPermohonan: "2024-03-20 14:30",
    jumlahDipulangkan: "1,500.00",
    status: "Menunggu Kelulusan",
    tindakan: 1,
  },
  {
    id: 2,
    idPermohonan: "PT-2024-002",
    namaPemohon: "Siti binti Mohamed",
    lokasi: "Cawangan Johor Bahru",
    tarikhPermohonan: "2024-03-20 15:45",
    jumlahDipulangkan: "2,000.00",
    status: "Menunggu Kelulusan",
    tindakan: 2,
  },
]);

// Mock location options - would be replaced with API call
const lokasiOptions = [
  { label: "Semua Lokasi", value: "" },
  { label: "Cawangan Kuala Lumpur", value: "KL" },
  { label: "Cawangan Johor Bahru", value: "JB" },
  { label: "Cawangan Pulau Pinang", value: "PP" },
];

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some((value) => value !== "");
});

const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.idPermohonan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.lokasi) {
    result = result.filter((app) => app.lokasi === filters.value.lokasi);
  }

  if (filters.value.tarikhMula) {
    const tarikhMula = new Date(filters.value.tarikhMula);
    result = result.filter(
      (app) => new Date(app.tarikhPermohonan) >= tarikhMula
    );
  }

  if (filters.value.tarikhTamat) {
    const tarikhTamat = new Date(filters.value.tarikhTamat);
    result = result.filter(
      (app) => new Date(app.tarikhPermohonan) <= tarikhTamat
    );
  }

  return result;
});

// Methods
const viewApplication = (id) => {
  navigateTo(`/BF-TNI/pemulangan-tunai/kelulusan/${id}`);
};

const handleLulus = (id) => {
  // Implement lulus logic
  console.log("Lulus application:", id);
};

const handleTolak = (id) => {
  // Implement tolak logic
  console.log("Tolak application:", id);
};

const handleRefresh = () => {
  // Implement refresh logic
  searchQuery.value = "";
  handleReset();
};

const handleReset = () => {
  filters.value = {
    lokasi: "",
    tarikhMula: "",
    tarikhTamat: "",
  };
};

const applyFilters = () => {
  isFilterOpen.value = false;
};

const removeFilter = (key) => {
  filters.value[key] = "";
};

const getFilterLabel = (key, value) => {
  switch (key) {
    case "lokasi":
      return lokasiOptions.find((opt) => opt.value === value)?.label || value;
    case "tarikhMula":
      return `Tarikh Mula: ${value}`;
    case "tarikhTamat":
      return `Tarikh Tamat: ${value}`;
    default:
      return value;
  }
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
