<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kelulusan Asnaf</h2>
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
                v-model="filters.kategoriSebelum"
                type="select"
                :options="kategoriSebelumOptions"
                placeholder="Kategori Sebelum"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.kategoriSelepas"
                type="select"
                :options="kategoriSelepasOptions"
                placeholder="Kategori Selepas"
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
          <!-- Custom slot for kategori sebelum -->
          <template v-slot:kategoriSebelum="data">
            {{ data.text }}
          </template>

          <!-- Custom slot for kategori selepas -->
          <template v-slot:kategoriSelepas="data">
            {{ data.text }}
          </template>

          <!-- Custom slot for tindakan -->
          <template v-slot:tindakan="data">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                v-if="!data.value.isProcessed"
                variant="success"
                size="sm"
                class="!px-2 !py-1"
                @click="luluskanAsnaf(data.value)"
              >
                <Icon name="material-symbols:check-circle" class="w-4 h-4 mr-1" />
                Luluskan
              </rs-button>
              <span 
                v-else
                class="text-sm text-gray-500 font-medium"
              >
                Sudah Diluluskan
              </span>
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
              {{ paginationEnd }} daripada {{ totalAsnaf }} entri
            </span>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showConfirmModal" title="Sahkan Kelulusan">
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk meluluskan permohonan asnaf ini?
        </p>
        <p class="text-sm text-gray-600 mb-4">
          Tindakan kelulusan keluar asnaf tanpa mengubah kategori.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmLuluskan">
            Luluskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Kelulusan Asnaf",
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
    name: "Senarai Kelulusan",
    type: "current",
    path: "/BF-PRF/AS/KA/senarai-kelulusan",
  },
]);

// Table fields configuration
const tableFields = [
  "namaAsnaf",
  "kategoriSebelum",
  "kategoriSelepas",
  "statusAsnaf",
  "tarikhTamatPembangunan",
  "noTelefon",
  "tindakan"
];

// Options for filters
const kategoriSebelumOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Miskin", value: "Miskin" },
  { label: "Fakir", value: "Fakir" },
  { label: "Non Fakir", value: "Non Fakir" },
  { label: "Non Miskin", value: "Non Miskin" },
];

const kategoriSelepasOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Miskin", value: "Miskin" },
  { label: "Fakir", value: "Fakir" },
  { label: "Non Fakir", value: "Non Fakir" },
  { label: "Non Miskin", value: "Non Miskin" },
];

// State
const searchQuery = ref("");
const filters = ref({
  kategoriSebelum: "",
  kategoriSelepas: "",
});
const pageSize = ref(10);
const currentPage = ref(1);
const showConfirmModal = ref(false);
const selectedAsnafId = ref(null);

// Sample data - Replace with actual API call
const asnafList = ref([
  {
    namaAsnaf: "Ahmad bin Abdullah",
    kategoriSebelum: "Fakir",
    kategoriSelepas: "Non Fakir",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-01-15",
    noTelefon: "0123456789",
    tindakan: { id: "ASN-2025-001" },
    isProcessed: false
  },
  {
    namaAsnaf: "Siti binti Ali",
    kategoriSebelum: "Miskin",
    kategoriSelepas: "Non Miskin",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-03-20",
    noTelefon: "0123456788",
    tindakan: { id: "ASN-2025-002" },
    isProcessed: false
  },
  {
    namaAsnaf: "Mohammad bin Hassan",
    kategoriSebelum: "Non Fakir",
    kategoriSelepas: "Fakir",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-06-10",
    noTelefon: "0123456787",
    tindakan: { id: "ASN-2025-003" },
    isProcessed: false
  },
  {
    namaAsnaf: "Fatimah binti Omar",
    kategoriSebelum: "Non Miskin",
    kategoriSelepas: "Miskin",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-08-25",
    noTelefon: "0123456786",
    tindakan: { id: "ASN-2025-004" },
    isProcessed: false
  },
  {
    namaAsnaf: "Abdul Rahman bin Ismail",
    kategoriSebelum: "Fakir",
    kategoriSelepas: "Non Fakir",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-02-14",
    noTelefon: "0123456785",
    tindakan: { id: "ASN-2025-005" },
    isProcessed: false
  },
  {
    namaAsnaf: "Zainab binti Ahmad",
    kategoriSebelum: "Miskin",
    kategoriSelepas: "Non Miskin",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-11-30",
    noTelefon: "0123456784",
    tindakan: { id: "ASN-2025-006" },
    isProcessed: false
  },
  {
    namaAsnaf: "Ibrahim bin Yusof",
    kategoriSebelum: "Non Fakir",
    kategoriSelepas: "Fakir",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-09-05",
    noTelefon: "0123456783",
    tindakan: { id: "ASN-2025-007" },
    isProcessed: false
  },
  {
    namaAsnaf: "Aminah binti Khalid",
    kategoriSebelum: "Non Miskin",
    kategoriSelepas: "Miskin",
    statusAsnaf: "Dalam Pembangunan Asnaf",
    tarikhTamatPembangunan: "2025-05-12",
    noTelefon: "0123456782",
    tindakan: { id: "ASN-2025-008" },
    isProcessed: false
  },
]);

// Computed properties
const filteredAsnafList = computed(() => {
  return asnafList.value.filter((asnaf) => {
    const matchesSearch = searchQuery.value === "" || 
      asnaf.namaAsnaf.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (asnaf.noTelefon && asnaf.noTelefon.includes(searchQuery.value));
    
    const matchesKategoriSebelum = filters.value.kategoriSebelum === "" || 
      asnaf.kategoriSebelum === filters.value.kategoriSebelum;
    
    const matchesKategoriSelepas = filters.value.kategoriSelepas === "" || 
      asnaf.kategoriSelepas === filters.value.kategoriSelepas;
    
    return matchesSearch && matchesKategoriSebelum && matchesKategoriSelepas;
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
const getKategoriVariant = (kategori) => {
  const variants = {
    'Miskin': 'info',
    'Fakir': 'danger',
    'Non Fakir': 'success',
    'Non Miskin': 'success',
  };
  return variants[kategori] || 'default';
};

const getKategoriSelepasVariant = (kategori) => {
  if (kategori === '-') return 'default';
  return getKategoriVariant(kategori);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY');
};

// Event handlers
const viewDetails = (asnaf) => {
  // Navigate to detail page or show modal
  console.log('View details for:', asnaf);
};

const luluskanAsnaf = (asnaf) => {
  selectedAsnafId.value = asnaf.tindakan.id;
  showConfirmModal.value = true;
};

const confirmLuluskan = () => {
  // Process the selected asnaf
  if (selectedAsnafId.value) {
    const asnaf = asnafList.value.find(a => a.tindakan.id === selectedAsnafId.value);
    if (asnaf) {
      // Mark as processed
      asnaf.isProcessed = true;
      console.log('Asnaf processed:', asnaf.namaAsnaf);
    }
  }
  
  // Clear selection
  selectedAsnafId.value = null;
  showConfirmModal.value = false;
  
  // Show success message
  // You can use SweetAlert2 or any notification system here
  console.log('Kelulusan berjaya');
};

const refreshData = () => {
  // Refresh data from API
  console.log('Refreshing data...');
  // Reset filters
  searchQuery.value = "";
  filters.value = {
    kategoriSebelum: "",
    kategoriSelepas: "",
  };
  selectedAsnafId.value = null;
};
</script>
