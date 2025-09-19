<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="loading" class="mt-4 text-center">
      <Icon name="mdi:loading" class="animate-spin text-blue-500 mb-2" size="32px" />
      <p class="text-gray-600">Memuatkan maklumat...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-4">
      <rs-card>
        <template #body>
          <div class="text-center py-8">
            <Icon name="mdi:alert-circle" class="text-red-500 mb-4" size="48px" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ralat</h3>
            <p class="text-gray-600">{{ error }}</p>
            <rs-button variant="primary" @click="goBack" class="mt-4">
              <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Paparan Maklumat</h2>
            <rs-button variant="secondary" @click="goBack">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>

      <!-- Paparan Maklumat (Info) -->
      <rs-card>
        <template #body>
          <div class="divide-y divide-gray-100">
            <div class="flex items-center py-2">
              <span class="text-sm font-medium text-gray-600 w-40">Kod</span>
              <span class="text-sm text-gray-900">{{ info.kod }}</span>
            </div>
            <div class="flex items-center py-2">
              <span class="text-sm font-medium text-gray-600 w-40">Kategori Maklumat</span>
              <span class="text-sm text-gray-900">{{ info.kategori }}</span>
            </div>
            <div class="flex items-center py-2">
              <span class="text-sm font-medium text-gray-600 w-40">Status</span>
              <rs-badge :variant="info.status === 'Aktif' ? 'success' : 'danger'">{{ info.status }}</rs-badge>
            </div>
            <div class="flex items-center py-2">
              <span class="text-sm font-medium text-gray-600 w-40">Status data</span>
              <span class="text-sm text-gray-900">{{ info.statusData }}</span>
            </div>
            <div class="flex items-center py-2">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Mula</span>
              <span class="text-sm text-gray-900">{{ formatDate(info.tarikhMula) }}</span>
            </div>
            <div class="flex items-center py-2">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Tamat</span>
              <span class="text-sm text-gray-900">{{ info.tarikhTamat ? formatDate(info.tarikhTamat) : '' }}</span>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Kelulusan Data (RUU) -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Maklumat Kelulusan Data (RUU)</h3>
        </template>
        <template #body>
          <!-- Show table if data exists -->
          <rs-table
            v-if="ruuData.length > 0"
            class="mt-2"
            :data="ruuData"
            :field="['namaRuuField','namaNasField','kaedahKemaskini','status','statusData','tarikhMula','tarikhTamat']"
            :pageSize="10"
            :showNoColumn="true"
            :options="{ variant: 'default', hover: true }"
          >
            <template v-slot:namaRuuField="data">{{ data.value.namaRuuField }}</template>
            <template v-slot:namaNasField="data">{{ data.value.namaNasField }}</template>
            <template v-slot:kaedahKemaskini="data">{{ data.value.kaedahKemaskini }}</template>
            <template v-slot:status="data">
              <rs-badge :variant="data.value.status === 'Aktif' ? 'success' : 'danger'">{{ data.value.status }}</rs-badge>
            </template>
            <template v-slot:statusData="data">{{ data.value.statusData }}</template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tarikhTamat="data">{{ data.value.tarikhTamat ? formatDate(data.value.tarikhTamat) : '' }}</template>
          </rs-table>
          
          <!-- Show message when no data available -->
          <div v-else class="text-center py-8">
            <Icon name="mdi:database-off" class="text-gray-400 mb-4" size="48px" />
            <h4 class="text-lg font-medium text-gray-900 mb-2">Tiada Data Tersedia</h4>
            <p class="text-gray-600">Tiada maklumat kelulusan data (RUU) untuk kategori <strong>{{ info.kategori }}</strong> pada masa ini.</p>
          </div>
        </template>
      </rs-card>

      <!-- Actions -->
      <rs-card>
        <template #body>
          <div class="flex justify-end">
            <rs-button variant="secondary" @click="goBack">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Paparan Maklumat RUU",
});

const route = useRoute();

const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/RUU/admin" },
  { name: "Konfigurasi Kelulusan Data (RUU)", type: "link", path: "/BF-PRF/KF/RUU/01_01" },
  { name: "Paparan Maklumat", type: "current", path: "/BF-PRF/KF/RUU/01_02/01_02_lihat" },
]);

const loading = ref(true);
const error = ref(null);

// Top info section
const info = ref({
  kod: "",
  kategori: "",
  status: "Tidak Aktif",
  statusData: "Draf",
  tarikhMula: "2026-01-01",
  tarikhTamat: "",
});

// Table data - will be populated based on kod parameter
const ruuData = ref([]);

// Kategori mapping data (based on BF-PRF/KF/RUU/01_01)
const kategoriMapping = [
  { kod: "1", kategori: "Peribadi" },
  { kod: "2", kategori: "Alamat" },
  { kod: "3", kategori: "Pendidikan" },
  { kod: "4", kategori: "Pengislaman" },
  { kod: "5", kategori: "Perbankan" },
  { kod: "6", kategori: "Kesihatan" },
  { kod: "7", kategori: "Kemahiran" },
  { kod: "8", kategori: "Kediaman/Tempat Tinggal" },
  { kod: "9", kategori: "Pinjaman Harta" },
  { kod: "10", kategori: "Pemilikan Aset" },
  { kod: "11", kategori: "Pekerjaan" },
  { kod: "12", kategori: "Pendapatan dan Perbelanjaan Seisi Rumah" },
  { kod: "13", kategori: "Peribadi Tanggungan" },
  { kod: "14", kategori: "Pengislaman Tanggungan" },
  { kod: "15", kategori: "Perbankan Tanggungan" },
  { kod: "16", kategori: "Pendidikan Tanggungan" },
  { kod: "17", kategori: "Kesihatan Tanggungan" },
  { kod: "18", kategori: "Kemahiran Tanggungan" },
  { kod: "19", kategori: "Pekerjaan Tanggungan" },
];

// Function to get kategori description by kod
const getKategoriByKod = (kod) => {
  const mapping = kategoriMapping.find(item => item.kod === kod);
  return mapping ? mapping.kategori : "Peribadi"; // Default to Peribadi if not found
};

// Default data for different categories
const getDefaultDataByKod = (kod) => {
  // Only Peribadi has data currently
  if (kod === "1" || kod === "Peribadi") {
    return [
      {
        namaRuuField: "Identification Type",
        namaNasField: "Jenis ID",
        kaedahKemaskini: "Update asnaf with approval/verify",
        status: "Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: "",
      },
      {
        namaRuuField: "Passport No",
        namaNasField: "Pengenalan ID",
        kaedahKemaskini: "Asnaf Review",
        status: "Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: "",
      },
      {
        namaRuuField: "MyKad",
        namaNasField: "Pengenalan ID",
        kaedahKemaskini: "Asnaf Review",
        status: "Aktif",
        statusData: "Draf",
        tarikhMula: "2026-01-01",
        tarikhTamat: "",
      },
    ];
  }
  
  // For all other categories, return empty array (no data available)
  return [];
};

onMounted(() => {
  try {
    const kod = route.query.kod ? String(route.query.kod) : "1";
    info.value.kod = kod;
    
    // Get kategori description based on kod using mapping
    info.value.kategori = getKategoriByKod(kod);
    
    // Load data based on kod parameter
    ruuData.value = getDefaultDataByKod(kod);
    
  } catch (e) {
    error.value = "Ralat memuatkan maklumat.";
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  navigateTo('/BF-PRF/KF/RUU/01_01');
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return date.toLocaleDateString("ms-MY", options);
};
</script>