<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Dalam Pembangunan</h2>
          <div class="flex gap-2">
            <!-- <rs-button variant="primary" @click="refreshData">
              <Icon name="material-symbols:refresh" class="w-5 h-5 mr-1" />
              Muat Semula
            </rs-button> -->
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
                placeholder="Cari Nama Asnaf atau No. Telefon..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.kategori"
                type="select"
                :options="kategoriOptions"
                placeholder="Kategori Asnaf"
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
            </div>
          </div>
        </div>

        <!-- Main Table -->
        <rs-table
          :data="filteredAsnafList"
          :field="tableFields"
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
          <!-- Custom slot for status pembangunan -->
          <template v-slot:statusReview="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
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
              {{ paginationEnd }} daripada {{ totalAsnaf }} entri
            </span>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Dalam Pembangunan",
});

const breadcrumb = ref([
  {
    name: "BF-PRF",
    type: "link",
    path: "/BF-PRF",
  },
  {
    name: "AS",
    type: "link",
    path: "/BF-PRF/AS",
  },
  {
    name: "KA",
    type: "link",
    path: "/BF-PRF/AS/KA",
  },
  {
    name: "Senarai Dalam Pembangunan",
    type: "current",
    path: "/BF-PRF/AS/KA/senarai-dalam-pembangunan",
  },
]);

// Table fields configuration
const tableFields = [
  "namaAsnaf",
  "kategoriAsnaf", 
  "statusReview",
  "tarikhAkhir",
  "noTelefon"
];

// Options for filters
const kategoriOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Fakir", value: "Fakir" },
  { label: "Miskin", value: "Miskin" },
  { label: "Non Fakir", value: "Non Fakir" },
  { label: "Non Miskin", value: "Non Miskin" },
];

const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Sedang Review", value: "Sedang Review" },
  { label: "Selesai Review", value: "Selesai Review" },
  { label: "Ditangguhkan", value: "Ditangguhkan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  kategori: "",
  status: "",
});
const pageSize = ref(10);
const currentPage = ref(1);

// Sample data - Replace with actual API call
const asnafList = ref([
  {
    namaAsnaf: "Ahmad bin Abdullah",
    kategoriAsnaf: "Fakir",
    statusReview: "Selesai Review",
    tarikhAkhir: "2024-01-15",
    noTelefon: "0123456789",
    tindakan: { id: "ASN-2024-001" }
  },
  {
    namaAsnaf: "Siti binti Ali",
    kategoriAsnaf: "Miskin",
    statusReview: "Selesai Review",
    tarikhAkhir: "2024-02-20",
    noTelefon: "0123456788",
    tindakan: { id: "ASN-2024-002" }
  },
  {
    namaAsnaf: "Mohammad bin Hassan",
    kategoriAsnaf: "Non Fakir",
    statusReview: "Selesai Review",
    tarikhAkhir: "2024-01-10",
    noTelefon: "0123456787",
    tindakan: { id: "ASN-2024-003" }
  },
  {
    namaAsnaf: "Fatimah binti Omar",
    kategoriAsnaf: "Non Miskin",
    statusReview: "Selesai Review",
    tarikhAkhir: "2024-03-05",
    noTelefon: "0123456786",
    tindakan: { id: "ASN-2024-004" }
  },
  {
    namaAsnaf: "Abdul Rahman bin Ismail",
    kategoriAsnaf: "Fakir",
    statusReview: "Ditangguhkan",
    tarikhAkhir: "2024-02-14",
    noTelefon: "0123456785",
    tindakan: { id: "ASN-2024-005" }
  },
  {
    namaAsnaf: "Zainab binti Ahmad",
    kategoriAsnaf: "Miskin",
    statusReview: "Sedang Review",
    tarikhAkhir: "2024-01-30",
    noTelefon: "0123456784",
    tindakan: { id: "ASN-2024-006" }
  },
  {
    namaAsnaf: "Ibrahim bin Yusof",
    kategoriAsnaf: "Non Fakir",
    statusReview: "Sedang Review",
    tarikhAkhir: "2024-01-05",
    noTelefon: "0123456783",
    tindakan: { id: "ASN-2024-007" }
  },
]);

// Computed properties
const filteredAsnafList = computed(() => {
  return asnafList.value.filter((asnaf) => {
    const matchesSearch = searchQuery.value === "" || 
      asnaf.namaAsnaf.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (asnaf.noTelefon && asnaf.noTelefon.includes(searchQuery.value));
    
    const matchesKategori = filters.value.kategori === "" || 
      asnaf.kategoriAsnaf === filters.value.kategori;
    
    const matchesStatus = filters.value.status === "" || 
      asnaf.statusReview === filters.value.status;
    
    return matchesSearch && matchesKategori && matchesStatus;
  });
});

const totalAsnaf = computed(() => filteredAsnafList.value.length);

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalAsnaf.value);
});

// Utility functions
const getStatusVariant = (status) => {
  const variants = {
    'Sedang Review': 'warning',
    'Selesai Review': 'success',
    'Ditangguhkan': 'danger',
  };
  return variants[status] || 'default';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY');
};

// Event handlers
const refreshData = () => {
  // Refresh data from API
  console.log('Refreshing data...');
  // Reset filters
  searchQuery.value = "";
  filters.value = {
    kategori: "",
    status: "",
  };
};
</script>

<style lang="scss" scoped>

</style>