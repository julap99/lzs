<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-6 space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Bill of Quantities (BQ)</h1>
            <p class="mt-1 text-sm text-gray-600">Paparan BQ untuk semakan kelulusan</p>
          </div>
          <div class="flex items-center space-x-4">
            <rs-badge variant="info" class="px-3 py-1">
              <span class="text-sm">{{ bqData.items.length }} Item</span>
            </rs-badge>
            <rs-badge variant="success" class="px-3 py-1">
              <span class="text-sm">Disokong Panel</span>
            </rs-badge>
          </div>
        </div>
      </div>

      <!-- BQ Information -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Maklumat BQ</h2>
              <p class="text-sm text-gray-500">Butiran asas dokumen BQ</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">No Borang BQ</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm font-mono text-gray-900">{{ bqData.noBQ }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh BQ</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ bqData.tarikhBQ }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Status Sokongan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <rs-badge variant="success" class="text-sm">
                  {{ bqData.statusSokongan }}
                </rs-badge>
              </div>
            </div>

            <div class="space-y-1 md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Ringkasan Kerja</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ bqData.ringkasanKerja }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Jumlah Anggaran</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-lg font-semibold text-green-600">
                  RM {{ bqData.jumlahAnggaran.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- BQ Items Table -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:list" class="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Senarai Item Kerja</h2>
                <p class="text-sm text-gray-500">Butiran lengkap item dalam BQ</p>
              </div>
            </div>
            <rs-button variant="secondary-outline" size="sm" @click="handleExportPDF">
              <Icon name="ph:file-pdf" class="w-4 h-4 mr-1" />
              Export PDF
            </rs-button>
          </div>
        </template>

        <template #body>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    Bil
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Butiran Kerja
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Unit
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Kuantiti
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Harga Unit (RM)
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Jumlah (RM)
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in bqData.items" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="max-w-md">
                      <p class="font-medium">{{ item.perkara }}</p>
                      <p v-if="item.spesifikasi" class="text-xs text-gray-500 mt-1">{{ item.spesifikasi }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {{ item.unit }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {{ item.kuantiti.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {{ item.hargaUnit.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {{ item.jumlah.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="5" class="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    JUMLAH KESELURUHAN:
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-600 text-right">
                    RM {{ totalBQ.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </rs-card>

      <!-- Sokongan Information -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:stamp" class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Maklumat Sokongan</h2>
              <p class="text-sm text-gray-500">Rekod pengesahan dan sokongan</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Disokong Oleh</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ sokonganData.namaPenyokong }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Sokongan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ sokonganData.tarikhSokongan }}</span>
              </div>
            </div>

            <div class="space-y-1 md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Catatan Sokongan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ sokonganData.catatanSokongan }}</span>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <rs-button variant="secondary-outline" @click="handleBack">
          <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
          Kembali
        </rs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "BQ - Semakan Kelulusan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Semakan Kelulusan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-semakan-kelulusan",
  },
  {
    name: "Keputusan Kelulusan",
    type: "link",
    path: `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}`,
  },
  {
    name: "BQ",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}/bq`,
  },
]);

// BQ Data
const bqData = ref({
  noBQ: "",
  tarikhBQ: "",
  ringkasanKerja: "",
  statusSokongan: "",
  jumlahAnggaran: 0,
  items: [],
});

// Sokongan Data
const sokonganData = ref({
  namaPenyokong: "",
  tarikhSokongan: "",
  catatanSokongan: "",
});

// Computed total
const totalBQ = computed(() => {
  return bqData.value.items.reduce((sum, item) => sum + item.jumlah, 0);
});

// Methods
const handleExportPDF = () => {
  toast.info("Fungsi export PDF sedang dalam pembangunan");
  // Implement PDF export functionality
};

const handleBack = () => {
  router.push(`/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}`);
};

// Load data on mount
onMounted(async () => {
  try {
    // Mock data - replace with actual API call
    bqData.value = {
      noBQ: "BQ-2024-INF-001",
      tarikhBQ: "12 November 2024",
      ringkasanKerja: "Pembinaan infrastruktur asas untuk kemudahan awam",
      statusSokongan: "Disokong Panel Hartanah",
      jumlahAnggaran: 150000,
      items: [
        {
          perkara: "Kerja-kerja galian tanah",
          spesifikasi: "Galian tanah biasa untuk asas konkrit",
          unit: "m³",
          kuantiti: 50,
          hargaUnit: 25.00,
          jumlah: 1250.00,
        },
        {
          perkara: "Penyediaan dan penuangan konkrit",
          spesifikasi: "Konkrit gred 25 untuk asas",
          unit: "m³",
          kuantiti: 30,
          hargaUnit: 280.00,
          jumlah: 8400.00,
        },
        {
          perkara: "Kerja-kerja besi dan keluli",
          spesifikasi: "Bar besi bertulang Y16",
          unit: "kg",
          kuantiti: 2500,
          hargaUnit: 4.50,
          jumlah: 11250.00,
        },
        {
          perkara: "Kerja-kerja pembinaan dinding",
          spesifikasi: "Dinding blok konkrit 6 inci",
          unit: "m²",
          kuantiti: 200,
          hargaUnit: 45.00,
          jumlah: 9000.00,
        },
        {
          perkara: "Kerja-kerja bumbung dan penutup atap",
          spesifikasi: "Bumbung seng galvalum",
          unit: "m²",
          kuantiti: 150,
          hargaUnit: 35.00,
          jumlah: 5250.00,
        },
        {
          perkara: "Kerja-kerja elektrik",
          spesifikasi: "Pemasangan kabel dan fitting elektrik",
          unit: "titik",
          kuantiti: 25,
          hargaUnit: 120.00,
          jumlah: 3000.00,
        },
        {
          perkara: "Kerja-kerja paip dan sistem air",
          spesifikasi: "Sistem saliran dan bekalan air",
          unit: "set",
          kuantiti: 1,
          hargaUnit: 8500.00,
          jumlah: 8500.00,
        },
        {
          perkara: "Kerja-kerja penyelesaian",
          spesifikasi: "Cat dan kemasan akhir",
          unit: "m²",
          kuantiti: 400,
          hargaUnit: 12.00,
          jumlah: 4800.00,
        },
      ],
    };

    sokonganData.value = {
      namaPenyokong: "Panel Hartanah - Encik Ahmad bin Razak",
      tarikhSokongan: "15 November 2024",
      catatanSokongan: "BQ telah disemak dan anggaran kos adalah munasabah berdasarkan harga pasaran semasa. Panel Hartanah menyokong permohonan ini untuk diluluskan.",
    };

    // Update jumlah anggaran from calculated total
    bqData.value.jumlahAnggaran = totalBQ.value;

  } catch (error) {
    toast.error("Ralat semasa memuatkan data BQ");
    console.error("Error loading BQ data:", error);
  }
});
</script>

<style lang="scss" scoped>
// Table styling
.min-w-full {
  min-width: 100%;
}

.divide-y > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
}

.divide-gray-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: #e5e7eb;
}

// Hover effects
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

// Text alignment utilities
.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}
</style> 