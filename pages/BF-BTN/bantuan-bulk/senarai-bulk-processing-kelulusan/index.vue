<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:check-circle" class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Senarai Bulk Processing</h2>
              <p class="text-sm text-gray-500">Kelulusan bantuan bulk processing</p>
            </div>
          </div>
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
                placeholder="Cari Kod BP, Tajuk..."
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

        <!-- Bulk Processing Table -->
        <rs-table
          :data="filteredBantuanBulk"
          :columns="columns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :showSearch="true"
          :showFilter="true"
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
              <center> {{ text }} </center>
            </rs-badge>
          </template>

          <template v-slot:amaun="{ text }">
            {{ formatCurrency(text) }}
          </template>

          
          <template v-slot:tindakan="{ text}">
            <div class="flex justify-center items-center">
              <rs-button
                variant="info"
                size="sm"
                class="p-1 w-8 h-8"
                @click="handleProses(text)"
                title="Lihat"
              >
                <Icon name="ic:outline-visibility" class="ic:outline-visibility" size="18" />
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Total Amount -->
        <div class="flex justify-end text-sm text-gray-700 mt-2">
          <div class="font-medium">Jumlah Amaun:&nbsp;</div>
          <div>{{ formatCurrency(totalAmount) }}</div>
        </div>

        <!-- Pagination -->
        <!-- <div class="flex items-center justify-between px-5 mt-4">
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
        </div> -->
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Bulk Processing",
});

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Bulk Processing",
    type: "link", 
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: "/BF-BTN/bantuan-bulk/senarai-bulk-processing-kelulusan",
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
    key: "tajuk",
    label: "Tajuk",
    sortable: true,
  },
  {
    key: "aid",
    label: "Aid",
    sortable: true,
  },
  {
    key: "aidProduct",
    label: "Aid Product",
    sortable: true,
  },
  {
    key: "amaun",
    label: "Amaun",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: 'peringkatSemakan',
    label: 'Peringkat Semakan',
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
  { label: "Dalam Proses", value: "Dalam Proses" },
  { label: "Lulus", value: "Lulus" },
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
const tooltips = ref({});

// Mock data - would be replaced with API call
const bantuanBulkList = ref([
  {
    kodBP: "BP-2025-01617",
    tajuk: "TUNTUTAN KFAM APRIL 2025 - PELAJAR",
    aid: "(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)",
    aidProduct: "(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)",
    amaun: 44390.00,
    tarikhHantar: '04/05/2025',
    status: "Lulus",
    peringkatSemasa:'',
    tindakan: "BP-2025-01617",
  },
  {
    kodBP: "BP-2025-01589",
    tajuk: "TUNTUTAN KFAM APRIL 2025 - GURU",
    aid: "(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)",
    aidProduct: "(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)",
    amaun: 54710.00,
    tarikhHantar: '30/04/2025',
    status: "Lulus",
    peringkatSemasa:'',
    tindakan: "BP-2025-01589",
  },
  {
    kodBP: "BP-2025-00001",
    tajuk: "Wang Saku Fakir Jan 2025",
    aid: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    aidProduct: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    amaun: 20000.00,
    tarikhHantar: '03/03/2025',
    status: "Lulus",
    peringkatSemasa:'',
    tindakan: "BP-2025-00001",
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

const totalAmount = computed(() => {
  return bantuanBulkList.value.reduce(
    (sum, item) => sum + (parseFloat(item.amaun) || 0),
    0
  );
});

// Methods
const handleProses = (kodBP) => {
  navigateTo(`/BF-BTN/bantuan-bulk/senarai-bulk-processing-kelulusan/${kodBP}`);
};

const getStatusVariant = (status) => {
  const variants = {
    "Dalam Proses": "warning",
    "Lulus": "success",
    "Selesai": "success",
    "Ditolak": "danger",
  };
  return variants[status] || "default";
};

// Currency display helper
const formatCurrency = (n) => {
  const num = parseFloat(n);
  if (isNaN(num) || num === null || num === undefined) return 'RM0.00';
  return new Intl.NumberFormat("ms-MY", {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
  }).format(num);
};
</script>

<style lang="scss" scoped></style>
