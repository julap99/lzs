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
          <!-- Show table when kod=1 -->
          <rs-table
            v-if="info.kod === '1'"
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
          
          <!-- Show "No Data" message when kod is not 1 -->
          <div v-else class="text-center py-8">
            <Icon name="mdi:database-off" class="text-gray-400 mb-4" size="64px" />
            <h4 class="text-lg font-semibold text-gray-700 mb-2">Tiada Data Tersedia</h4>
            <p class="text-gray-500">
              Tiada maklumat kelulusan data (RUU) untuk kategori {{ info.kategori }} pada masa ini.
            </p>
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
  { name: "Profiling", type: "link", path: "/BF-PRF/KF/RUU/pelulus" },
  { name: "Konfigurasi Kelulusan Data (RUU)", type: "link", path: "/BF-PRF/KF/RUU/02_01" },
  { name: "Paparan Maklumat", type: "current", path: "/BF-PRF/KF/RUU/02_01/lihat" },
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

// Table mock data
const ruuData = ref([
  {
    namaRuuField: "Identification Type",
    namaNasField: "Jenis ID",
    kaedahKemaskini: "Update asnaf with approval/verify",
    status: "Tidak Aktif",
    statusData: "Draf",
    tarikhMula: "2026-01-01",
    tarikhTamat: "",
  },
  {
    namaRuuField: "Passport No",
    namaNasField: "Pengenalan ID",
    kaedahKemaskini: "Asnaf Review",
    status: "Tidak Aktif",
    statusData: "Draf",
    tarikhMula: "2026-01-01",
    tarikhTamat: "",
  },
  {
    namaRuuField: "MyKad",
    namaNasField: "Pengenalan ID",
    kaedahKemaskini: "Asnaf Review",
    status: "Tidak Aktif",
    statusData: "Draf",
    tarikhMula: "2026-01-01",
    tarikhTamat: "",
  },
]);

onMounted(() => {
  try {
    const kod = route.query.kod ? String(route.query.kod) : "";
    info.value.kod = kod;
    
    // Map kod values to kategori names
    const kodMapping = {
      "1": "Peribadi",
      "2": "Alamat",
      "3": "Pendidikan",
      "4": "Pengislaman",
      "5": "Perbankan",
      "6": "Kesihatan",
      "7": "Kemahiran",
      "8": "Kediaman/Tempat Tinggal",
      "9": "Pinjaman Harta",
      "10": "Pemilikan Aset",
      "11": "Pekerjaan",
      "12": "Pendapatan dan Perbelanjaan Seisi Rumah",
      "13": "Peribadi Tanggungan",
      "14": "Pengislaman Tanggungan",
      "15": "Perbankan Tanggungan",
      "16": "Pendidikan Tanggungan",
      "17": "Kesihatan Tanggungan",
      "18": "Kemahiran Tanggungan",
      "19": "Pekerjaan Tanggungan"
    };
    
    if (kodMapping[kod]) {
      info.value.kategori = kodMapping[kod];
    } else if (kod) {
      // If kod is not in mapping, use the kod value as kategori
      info.value.kategori = kod;
    } else {
      info.value.kategori = "Peribadi";
    }
  } catch (e) {
    error.value = "Ralat memuatkan maklumat.";
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  navigateTo('/BF-PRF/KF/RUU/02_01');
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return date.toLocaleDateString("ms-MY", options);
};
</script>