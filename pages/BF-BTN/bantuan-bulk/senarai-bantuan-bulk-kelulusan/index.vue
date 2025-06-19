<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Bantuan Bulk (Kelulusan)
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
                placeholder="Cari Kod BP, Tajuk Bantuan..."
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

        <!-- Bantuan Bulk Table -->
        <rs-table
          :data="filteredBantuanBulk"
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
                @click="handleProses(text)"
              >
                <Icon name="ph:eye" class="w-4 h-4" />
                Lebih
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
              {{ paginationEnd }} daripada {{ totalBantuanBulk }} entri
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
  title: "Senarai Bantuan Bulk - Sokongan",
});

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Bantuan Bulk",
    type: "link", 
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-kelulusan",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "kodBP",
    label: "Kod BP",
    sortable: true,
  },
  {
    key: "tajukBantuan",
    label: "Tajuk Bantuan",
    sortable: true,
  },
  {
    key: "bantuan",
    label: "Bantuan (Aid)",
    sortable: true,
  },
  {
    key: "produkBantuan",
    label: "Produk Bantuan (Product Aid)",
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
  { label: "Dalam Tindakan", value: "Dalam Tindakan" },
  { label: "Selesai", value: "Selesai" },
  { label: "Ditolak", value: "Ditolak" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - would be replaced with API call
const bantuanBulkList = ref([
  {
    kodBP: "BP-2025-00001",
    tajukBantuan: "Wang Saku Fakir Jan 2025",
    bantuan: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    produkBantuan: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    status: "Dalam Tindakan",
    tindakan: "BP-2025-00001",
  },
  {
    kodBP: "BP-2025-00002",
    tajukBantuan: "Wang Saku Fakir Feb 2025",
    bantuan: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    produkBantuan: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    status: "Dalam Tindakan",
    tindakan: "BP-2025-00002",
  },
  {
    kodBP: "BP-2025-00004",
    tajukBantuan: "Wang Saku Fakir Mac 2025",
    bantuan: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    produkBantuan: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    status: "Dalam Tindakan",
    tindakan: "BP-2025-00004",
  },
]);

// Computed properties
const filteredBantuanBulk = computed(() => {
  let result = [...bantuanBulkList.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.kodBP.toLowerCase().includes(query) ||
        item.tajukBantuan.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((item) => item.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalBantuanBulk = computed(() => {
  return bantuanBulkList.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalBantuanBulk.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalBantuanBulk.value);
});

// Methods
const handleProses = (kodBP) => {
  navigateTo(`/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-kelulusan/${kodBP}`);
};

const getStatusVariant = (status) => {
  const variants = {
    "Dalam Tindakan": "warning",
    "Selesai": "success",
    "Ditolak": "danger",
  };
  return variants[status] || "default";
};
</script>

<style lang="scss" scoped></style>
