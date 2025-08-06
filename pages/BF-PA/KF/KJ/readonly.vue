<!-- 
  RTMF SCREEN: PA-KF-KJ-01_05 (Read-Only List)
  PURPOSE: Paparan senarai kategori penolong amil (read-only)
  DESCRIPTION: Read-only category list for Ketua Jabatan (no edit/add capabilities)
  ROUTE: /BF-PA/KF/KJ/readonly
-->
<template>
  <div>
    <LayoutsBreadcrumb :breadcrumb="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:eye" class="w-6 h-6 mr-3 text-primary" />
            Senarai Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Paparan senarai kategori penolong amil (read-only)</p>
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kategori Penolong Amil</h2>
          <div class="text-sm text-gray-500">
            <Icon name="ph:info-fill" class="w-4 h-4 inline mr-1" />
            Paparan sahaja - tiada kemudahan edit
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
              placeholder="Cari kategori, kod singkatan..."
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.status"
              type="select"
              :options="statusOptions"
              placeholder="Status"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.kategori"
              type="select"
              :options="kategoriOptions"
              placeholder="Kategori"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Read-Only Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredCategories"
          :pageSize="10"
          :showNoColumn="true"
          :columns="[
            {
              key: 'kategoriPenolongAmil',
              label: 'Kategori Penolong Amil',
              sortable: true,
            },
            {
              key: 'kodSingkatan',
              label: 'Kod Singkatan',
              sortable: true,
            },
            {
              key: 'status',
              label: 'Status',
              sortable: true,
            },
            {
              key: 'tindakan',
              label: 'Tindakan',
              sortable: false,
            },
          ]"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="viewCategory(data.text)"
              >
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
import { ref, nextTick, computed } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Senarai Kategori Penolong Amil (Read-Only)",
});

const breadcrumb = ref([
  {
    title: "Utama",
    path: "/"
  },
  {
    title: "BF-PA",
    path: "/BF-PA"
  },
  {
    title: "Konfigurasi",
    path: "/BF-PA/KF/KJ"
  },
  {
    title: "Kategori Penolong Amil (Read-Only)",
    path: "/BF-PA/KF/KJ/readonly"
  }
]);

// Filters
const filters = ref({
  searchQuery: "",
  status: "",
  kategori: "",
});

// Filter options
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
  { label: "Diluluskan Ketua Jabatan", value: "Diluluskan Ketua Jabatan" },
];

const kategoriOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
];

// Table data and reactivity control
const tableKey = ref(0);
const categoriesList = ref([
  {
    id: 1,
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    kodSingkatan: "PAF",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 1
  },
  {
    id: 2,
    kategoriPenolongAmil: "Penolong Amil Padi",
    kodSingkatan: "PAP",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 2
  },
  {
    id: 3,
    kategoriPenolongAmil: "Penolong Amil Kariah",
    kodSingkatan: "PAK",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 3
  },
  {
    id: 4,
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    kodSingkatan: "PAKO",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tindakan: 4
  }
]);

// Computed properties
const filteredCategories = computed(() => {
  let result = [...categoriesList.value];
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(category => 
      category.kategoriPenolongAmil.toLowerCase().includes(query) ||
      category.kodSingkatan.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(category => category.status === filters.value.status);
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(category => 
      category.kategoriPenolongAmil === filters.value.kategori
    );
  }
  
  return result;
});

// Methods
const viewCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KJ/detail/${categoryId}`);
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};



// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    case "Diluluskan Ketua Jabatan":
      return "info";
    default:
      return "default";
  }
};
</script> 