<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Proses Keluar Asnaf</h2>
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
                placeholder="Cari Nama, No. Telefon, Pengenalan ID, Kariah atau Daerah..."
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
                placeholder="Kategori"
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
            filterable: false,
          }"
          advanced
        >
          <!-- Custom slot for kategori -->
          <template v-slot:kategori="data">
            {{ data.text }}
          </template>

          <!-- Custom slot for tarikhTamatProgram -->
          <template v-slot:tarikhTamatProgram="data">
            {{ formatDate(data.text) }}
          </template>

          <!-- Custom slot for tarikhAkhirKemaskini -->
          <template v-slot:tarikhAkhirKemaskini="data">
            {{ formatDate(data.text) }}
          </template>

          <!-- Custom slot for peratusHadkifayah -->
          <template v-slot:peratusHadkifayah="data">
            <div class="flex items-center">
              <!-- <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full" 
                  :style="{ width: data.text + '%' }"
                ></div>
              </div> -->
              <span class="text-sm font-medium">{{ data.text }}%</span>
            </div>
          </template>

          <!-- Custom slot for tindakan -->
          <template v-slot:tindakan="data">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                v-if="!data.value.isProcessed"
                variant="success"
                size="sm"
                class="!px-2 !py-1"
                @click="prosesKeluarSingle(data.value)"
              >
                <Icon name="material-symbols:check-circle" class="w-4 h-4 mr-1" />
                Proses Penentuan Keluar Asnaf
              </rs-button>
              <span 
                v-else
                class="text-sm text-gray-500 font-medium"
              >
                Sudah Dikeluarkan
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
    <rs-modal v-model="showConfirmModal" title="Sahkan Proses Keluar">
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk memproses keluar asnaf ini?
        </p>
        <p class="text-sm text-gray-600 mb-4">
          Tindakan ini akan memproses keluar asnaf untuk menentukan status terkini asnaf
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmProsesKeluar">
            Teruskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';

definePageMeta({
  title: "Proses Keluar Asnaf",
});

const breadcrumb = ref([
  // {
  //   name: "BF-PRF",
  //   type: "link",
  //   path: "/BF-PRF",
  // },
  // {
  //   name: "AS",
  //   type: "link",
  //   path: "/BF-PRF/AS",
  // },
  // {
  //   name: "KA",
  //   type: "link",
  //   path: "/BF-PRF/AS/KA",
  // },
  {
    name: "Proses Keluar",
    type: "current",
    path: "/BF-PRF/AS/KA/proses-keluar",
  },
]);

// Table fields configuration
const tableFields = [
  "jenisPengenalanId",
  "pengenalanId", 
  "namaAsnaf",
  "kategori",
  "tarikhTamatProgram",
  "noTelefon",
  "kariah",
  "daerah",
  "tarikhAkhirKemaskini",
  "peratusHadkifayah",
  "tindakan"
];

// Options for filters
const kategoriOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Miskin", value: "Miskin" },
  { label: "Fakir", value: "Fakir" },
];

// State
const searchQuery = ref("");
const filters = ref({
  kategori: "",
});
const pageSize = ref(10);
const currentPage = ref(1);
const showConfirmModal = ref(false);
const selectedAsnafId = ref(null);
const router = useRouter();

// Sample data - Replace with actual API call
const asnafList = ref([
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900101-01-0001",
    namaAsnaf: "Ahmad bin Abdullah",
    kategori: "Fakir",
    tarikhTamatProgram: "2025-05-15",
    noTelefon: "0123456789",
    kariah: "Masjid Al-Ikhlas",
    daerah: "Kuala Lumpur",
    tarikhAkhirKemaskini: "2024-12-15",
    peratusHadkifayah: 85,
    tindakan: { id: "ASN-2024-001" },
    isProcessed: false
  },
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900202-02-0002",
    namaAsnaf: "Siti binti Ali",
    kategori: "Miskin",
    tarikhTamatProgram: "2025-06-20",
    noTelefon: "0123456788",
    kariah: "Masjid Al-Amin",
    daerah: "Selangor",
    tarikhAkhirKemaskini: "2024-12-10",
    peratusHadkifayah: 92,
    tindakan: { id: "ASN-2024-002" },
    isProcessed: false
  },
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900303-03-0003",
    namaAsnaf: "Mohammad bin Hassan",
    kategori: "Fakir",
    tarikhTamatProgram: "2025-06-10",
    noTelefon: "0123456787",
    kariah: "Masjid Al-Falah",
    daerah: "Johor",
    tarikhAkhirKemaskini: "2024-12-05",
    peratusHadkifayah: 78,
    tindakan: { id: "ASN-2024-003" },
    isProcessed: false
  },
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900404-04-0004",
    namaAsnaf: "Fatimah binti Omar",
    kategori: "Miskin",
    tarikhTamatProgram: "2025-04-25",
    noTelefon: "0123456786",
    kariah: "Masjid Al-Hidayah",
    daerah: "Penang",
    tarikhAkhirKemaskini: "2024-12-01",
    peratusHadkifayah: 88,
    tindakan: { id: "ASN-2024-004" },
    isProcessed: false
  },
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900505-05-0005",
    namaAsnaf: "Abdul Rahman bin Ismail",
    kategori: "Fakir",
    tarikhTamatProgram: "2025-06-14",
    noTelefon: "0123456785",
    kariah: "Masjid Al-Muttaqin",
    daerah: "Perak",
    tarikhAkhirKemaskini: "2024-11-28",
    peratusHadkifayah: 95,
    tindakan: { id: "ASN-2024-005" },
    isProcessed: false
  },
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900606-06-0006",
    namaAsnaf: "Zainab binti Ahmad",
    kategori: "Miskin",
    tarikhTamatProgram: "2025-05-30",
    noTelefon: "0123456784",
    kariah: "Masjid Al-Mujahidin",
    daerah: "Kedah",
    tarikhAkhirKemaskini: "2024-11-25",
    peratusHadkifayah: 82,
    tindakan: { id: "ASN-2024-006" },
    isProcessed: false
  },
  {
    jenisPengenalanId: "Kad Pengenalan",
    pengenalanId: "900707-07-0007",
    namaAsnaf: "Ibrahim bin Yusof",
    kategori: "Fakir",
    tarikhTamatProgram: "2025-09-05",
    noTelefon: "0123456783",
    kariah: "Masjid Al-Mustaqim",
    daerah: "Kelantan",
    tarikhAkhirKemaskini: "2024-11-20",
    peratusHadkifayah: 90,
    tindakan: { id: "ASN-2024-007" },
    isProcessed: false
  },
]);

// Computed properties
const filteredAsnafList = computed(() => {
  return asnafList.value.filter((asnaf) => {
    const searchTerm = searchQuery.value.toLowerCase();
    const matchesSearch = searchQuery.value === "" || 
      asnaf.namaAsnaf.toLowerCase().includes(searchTerm) ||
      (asnaf.noTelefon && asnaf.noTelefon.includes(searchQuery.value)) ||
      (asnaf.pengenalanId && asnaf.pengenalanId.toLowerCase().includes(searchTerm)) ||
      (asnaf.kariah && asnaf.kariah.toLowerCase().includes(searchTerm)) ||
      (asnaf.daerah && asnaf.daerah.toLowerCase().includes(searchTerm));
    
    const matchesKategori = filters.value.kategori === "" || 
      asnaf.kategori === filters.value.kategori;
    
    return matchesSearch && matchesKategori;
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

const prosesKeluarSingle = (asnaf) => {
  selectedAsnafId.value = asnaf.tindakan.id;
  showConfirmModal.value = true;
};

const confirmProsesKeluar = () => {
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
  console.log('Proses keluar berjaya');

  // Redirect to /BF-PRF/AS/KA/proses-keluar/hadkifayah
  router.push('/BF-PRF/AS/KA/proses-keluar/hadkifayah');
};

const refreshData = () => {
  // Refresh data from API
  console.log('Refreshing data...');
  // Reset filters
  searchQuery.value = "";
  filters.value = {
    kategori: "",
  };
  selectedAsnafId.value = null;
};
</script>
