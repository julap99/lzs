<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-6 space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Laporan Teknikal</h1>
            <p class="mt-1 text-sm text-gray-600">Laporan teknikal siasatan lapangan untuk semakan kelulusan</p>
          </div>
          <div class="flex items-center space-x-4">
            <rs-badge variant="success" class="px-3 py-1">
              <span class="text-sm">Siap Disediakan</span>
            </rs-badge>
          </div>
        </div>
      </div>

      <!-- Report Information -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Maklumat Laporan</h2>
              <p class="text-sm text-gray-500">Butiran asas laporan teknikal</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">No Rujukan Laporan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm font-mono text-gray-900">{{ reportData.noRujukan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Siasatan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ reportData.tarikhSiasatan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Petugas Siasatan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ reportData.petugasSiasatan }}</span>
              </div>
            </div>

            <div class="space-y-1 md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Lokasi Siasatan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ reportData.lokasiSiasatan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Status Laporan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <rs-badge variant="success" class="text-sm">
                  {{ reportData.statusLaporan }}
                </rs-badge>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Technical Report Content -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:clipboard-text" class="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">LAPORAN TEKNIKAL SIASATAN LAPANGAN</h2>
                <p class="text-sm text-gray-500">Kandungan penuh laporan teknikal</p>
              </div>
            </div>
            <rs-button variant="secondary-outline" size="sm" @click="handlePrintReport">
              <Icon name="ph:printer" class="w-4 h-4 mr-1" />
              Cetak Laporan
            </rs-button>
          </div>
        </template>

        <template #body>
          <div class="space-y-8">
            <!-- 1. Latar Belakang -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                1. LATAR BELAKANG
              </h3>
              <div class="prose prose-sm max-w-none">
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <p class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ reportContent.latarBelakang }}</p>
                </div>
              </div>
            </div>

            <!-- 2. Keperluan -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                2. KEPERLUAN
              </h3>
              <div class="prose prose-sm max-w-none">
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <p class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ reportContent.keperluan }}</p>
                </div>
              </div>
            </div>

            <!-- 3. Penemuan Siasatan -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                3. PENEMUAN SIASATAN
              </h3>
              <div class="prose prose-sm max-w-none">
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <p class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ reportContent.penemuanSiasatan }}</p>
                </div>
              </div>
            </div>

            <!-- 4. Cadangan -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                4. CADANGAN
              </h3>
              <div class="prose prose-sm max-w-none">
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <p class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ reportContent.cadangan }}</p>
                </div>
              </div>
            </div>

            <!-- 5. Anggaran Kos -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                5. ANGGARAN KOS
              </h3>
              <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-700">Nilai Kerja Dicadangkan</p>
                    <p class="text-xs text-gray-500 mt-1">Berdasarkan Bill of Quantities (BQ)</p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-green-600">RM {{ reportContent.nilaiKerja.toLocaleString() }}</p>
                    <p class="text-xs text-gray-500">Termasuk GST</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 6. Kesimpulan dan Cadangan -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                6. KESIMPULAN DAN CADANGAN
              </h3>
              <div class="prose prose-sm max-w-none">
                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ reportContent.kesimpulan }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Report Verification -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:stamp" class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Pengesahan Laporan</h2>
              <p class="text-sm text-gray-500">Maklumat pengesahan dan tandatangan</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Disediakan Oleh</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.disediakanOleh }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Disediakan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.tarikhDisediakan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Disemak Oleh</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.disemakOleh }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Disemak</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.tarikhDisemak }}</span>
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Laporan Teknikal - Semakan Kelulusan",
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
    name: "Laporan Teknikal",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}/laporan-teknikal`,
  },
]);

// Report Data
const reportData = ref({
  noRujukan: "",
  tarikhSiasatan: "",
  petugasSiasatan: "",
  lokasiSiasatan: "",
  statusLaporan: "",
});

const reportContent = ref({
  latarBelakang: "",
  keperluan: "",
  penemuanSiasatan: "",
  cadangan: "",
  nilaiKerja: 0,
  kesimpulan: "",
});

const verification = ref({
  disediakanOleh: "",
  tarikhDisediakan: "",
  disemakOleh: "",
  tarikhDisemak: "",
});

// Methods
const handlePrintReport = () => {
  window.print();
};

const handleBack = () => {
  router.push(`/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}`);
};

// Load data on mount
onMounted(async () => {
  try {
    // Mock data - replace with actual API call
    reportData.value = {
      noRujukan: "LT-2024-INF-001",
      tarikhSiasatan: "10 November 2024",
      petugasSiasatan: "Encik Mohd Faris bin Ahmad (Pegawai Teknikal)",
      lokasiSiasatan: "Kampung Seri Damai, 43000 Kajang, Selangor",
      statusLaporan: "Selesai Disediakan",
    };

    reportContent.value = {
      latarBelakang: `Permohonan bantuan infrastruktur telah diterima daripada Syarikat ABC Sdn Bhd untuk pembinaan kemudahan awam di Kampung Seri Damai.

Pemohon memerlukan bantuan untuk membina kemudahan asas yang akan memberi manfaat kepada masyarakat setempat, khususnya dalam aspek kemudahan awam yang diperlukan.

Siasatan lapangan telah dijalankan untuk menilai keperluan sebenar dan kesesuaian lokasi yang dicadangkan.`,

      keperluan: `Berdasarkan siasatan awal dan permohonan yang diterima, keperluan utama adalah:

1. Pembinaan struktur asas yang kukuh dan tahan lasak
2. Kemudahan yang memenuhi piawaian keselamatan
3. Infrastruktur yang sesuai dengan keperluan masyarakat setempat
4. Sistem utiliti yang lengkap (elektrik, air)
5. Akses yang mudah dan selamat untuk pengguna`,

      penemuanSiasatan: `Siasatan lapangan yang dijalankan pada 10 November 2024 mendapati:

ASPEK POSITIF:
• Lokasi yang dicadangkan adalah strategik dan mudah diakses
• Tanah adalah stabil dan sesuai untuk pembinaan
• Terdapat akses kepada kemudahan utiliti asas
• Sokongan penuh dari masyarakat setempat
• Tiada halangan undang-undang atau teknikal yang ketara

ASPEK PERLU DIAMBIL PERHATIAN:
• Keperluan kerja tanah tambahan untuk perataan
• Sistem saliran perlu diperbaiki
• Akses jalan perlu dinaik taraf sedikit`,

      cadangan: `Berdasarkan penemuan siasatan, adalah dicadangkan:

1. KERJA UTAMA:
   • Meneruskan projek seperti yang dicadangkan dalam BQ
   • Melaksanakan kerja mengikut spesifikasi teknikal yang ditetapkan

2. KERJA TAMBAHAN YANG DISYORKAN:
   • Penambahbaikan sistem saliran di sekitar kawasan
   • Kerja landscaping asas untuk keindahan

3. PELAKSANAAN:
   • Tempoh pelaksanaan: 3-4 bulan
   • Pengawasan teknikal yang ketat diperlukan
   • Pemantauan berkala semasa pelaksanaan`,

      nilaiKerja: 150000,

      kesimpulan: `KESIMPULAN:
Projek ini adalah wajar untuk diluluskan kerana:
• Memenuhi kriteria kelayakan bantuan infrastruktur
• Akan memberi manfaat langsung kepada masyarakat
• Anggaran kos adalah munasabah dan realistik
• Tiada halangan teknikal yang ketara

CADANGAN AKHIR:
Adalah dicadangkan permohonan ini DILULUSKAN dengan syarat:
1. Pelaksanaan mengikut spesifikasi yang ditetapkan
2. Pengawasan teknikal yang ketat
3. Pemantauan kemajuan berkala
4. Pematuhan kepada piawaian keselamatan`,
    };

    verification.value = {
      disediakanOleh: "Encik Mohd Faris bin Ahmad - Pegawai Teknikal Gred 41",
      tarikhDisediakan: "12 November 2024",
      disemakOleh: "Puan Siti Aminah binti Razak - Ketua Pegawai Teknikal",
      tarikhDisemak: "14 November 2024",
    };

  } catch (error) {
    toast.error("Ralat semasa memuatkan laporan teknikal");
    console.error("Error loading technical report:", error);
  }
});
</script>

<style lang="scss" scoped>
// Print styles
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-break {
    page-break-after: always;
  }
}

// Content formatting
.prose {
  max-width: none;
}

.whitespace-pre-line {
  white-space: pre-line;
}

// Border styles
.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

// Background gradients
.from-green-50 {
  --tw-gradient-from: #f0fdf4;
}

.to-blue-50 {
  --tw-gradient-to: #eff6ff;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
</style> 