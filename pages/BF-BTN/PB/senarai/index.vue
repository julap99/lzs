<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Bantuan</h2>
          <rs-button variant="primary" @click="navigateTo('/BF-BTN/PB/mohon-bantuan')">
            <Icon name="material-symbols:add" class="mr-1" /> Mohon Bantuan Baru
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
                placeholder="Cari No Rujukan, Jenis Bantuan, Status..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.jenisBantuan"
                type="select"
                :options="jenisBantuanOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
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
                variant="primary-outline"
                class="p-1 w-6 h-6"
                @click="handleViewDetails(text)"
              >
                <Icon name="ph:eye" />
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
  title: "Senarai Permohonan Bantuan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/PB/senarai",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "noRujukan",
    label: "No Rujukan",
    sortable: true,
  },
  {
    key: "jenisBantuan",
    label: "Jenis Bantuan Dipohon",
    sortable: true,
  },
  {
    key: "aidProduct",
    label: "Aid Product",
    sortable: true,
  },
  {
    key: "productPackage",
    label: "Product Package",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhPermohonan",
    label: "Tarikh Permohonan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Aksi",
    sortable: false,
  },
];

// Options for filters
const jenisBantuanOptions = [
  { label: "Semua Jenis Bantuan", value: "" },
  { label: "Bantuan Tunai", value: "tunai" },
  { label: "Bantuan Makanan", value: "makanan" },
  { label: "Bantuan Pendidikan", value: "pendidikan" },
];

const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Diterima", value: "diterima" },
  { label: "Dalam Proses", value: "dalam_proses" },
  { label: "Lulus", value: "lulus" },
  { label: "Tolak", value: "tolak" },
  { label: "Selesai", value: "selesai" },
  { label: "Batal", value: "batal" },
];

// State
const searchQuery = ref("");
const filters = ref({
  jenisBantuan: "",
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - would be replaced with API call
const applications = ref([
  {
    noRujukan: "NAS-2025-0001",
    jenisBantuan: "Bantuan Tunai",
    aidProduct: "Bantuan Bulanan",
    productPackage: "Pakej Asas",
    status: "Diterima",
    tarikhPermohonan: "2024-03-20",
    tindakan: "NAS-2025-0001",
  },
  {
    noRujukan: "NAS-2025-0002",
    jenisBantuan: "Bantuan Makanan",
    aidProduct: "Bantuan Makanan Bulanan",
    productPackage: "Pakej Keluarga",
    status: "Dalam Proses",
    tarikhPermohonan: "2024-03-19",
    tindakan: "NAS-2025-0002",
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
        app.jenisBantuan.toLowerCase().includes(query) ||
        app.status.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.jenisBantuan) {
    result = result.filter(
      (app) => app.jenisBantuan === filters.value.jenisBantuan
    );
  }
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
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
  navigateTo(`/BF-BTN/PB/senarai/${noRujukan}`);
};

const getStatusVariant = (status) => {
  const variants = {
    diterima: "info",
    dalam_proses: "warning",
    lulus: "success",
    tolak: "danger",
    selesai: "success",
    batal: "secondary",
  };
  return variants[status.toLowerCase()] || "default";
};
</script>

<style lang="scss" scoped></style>
