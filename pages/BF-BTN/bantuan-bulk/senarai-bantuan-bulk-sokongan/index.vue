<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Bulk Processing
          </h2>
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

          <template v-slot:tindakan="{ text, index}">
            <div class="relative flex items-center justify-center" @mouseenter="tooltips['view'+index] = true" @mouseleave="tooltips['view'+index] = false">
              <rs-button 
                variant="info-text" 
                class="p-1 w-8 h-8"
                @click="handleProses(text)"
              >
                <Icon name="ic:outline-visibility" size="18" />
              </rs-button>
              <transition name="tooltip">
                <span v-if="tooltips['view'+index]" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-max">
                  Lihat
                </span>
              </transition>
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
    name: "Sokongan",
    type: "current",
    path: "/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-sokongan",
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
    key: "Aid",
    label: "Aid",
    sortable: true,
  },
  {
    key: "aidProduct",
    label: "Aid Product",
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
  { label: "Dalam Proses", value: "Dalam Proses" },
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
    kodBP: "BP-2025-00001",
    tajuk: "Wang Saku Fakir Jan 2025",
    aid: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    aidProduct: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    jumlahAmaun: 'RM20,000.00',
    tarikhHantar: '03/03/2025',
    status: "Dalam Proses",
    tindakan: "BP-2025-00001",
  },
  {
    kodBP: "BP-2025-00002",
    tajuk: "Wang Saku Fakir Feb 2025",
    aid: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    aidProduct: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    jumlahAmaun: 'RM23,000.00',
    tarikhHantar: '02/03/2025',
    status: "Dalam Proses",
    tindakan: "BP-2025-00002",
  },
  {
    kodBP: "BP-2025-00004",
    tajuk: "Wang Saku Fakir Mac 2025",
    aid: "B314 - Bantuan Keperluan Pendidikan IPT (Fakir)",
    aidProduct: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
    jumlahAmaun: 'RM30,000.00',
    tarikhHantar: '01/03/2025',
    status: "Dalam Proses",
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
        item.tajuk.toLowerCase().includes(query)
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
  navigateTo(`/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-sokongan/${kodBP}`);
};

const getStatusVariant = (status) => {
  const variants = {
    "Dalam Proses": "warning",
    "Selesai": "success",
    "Ditolak": "danger",
  };
  return variants[status] || "default";
};
</script>

<style lang="scss" scoped></style>
