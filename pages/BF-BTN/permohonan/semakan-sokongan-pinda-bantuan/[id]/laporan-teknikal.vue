<template>
  <div class="min-h-screen">
    <LayoutsBreadcrumb :items="breadcrumb" />
    
    <div class="mt-6 mb-8">
      <h1 class="text-2xl font-bold">Laporan Teknikal</h1>
      <p class="text-gray-600">Laporan teknikal lengkap untuk permohonan bantuan</p>
    </div>

    <div class="space-y-6">
      <!-- Report Header -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Maklumat Laporan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium">No Rujukan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded border">
                <span class="text-sm">{{ reportData.noRujukan }}</span>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium">Tarikh Laporan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded border">
                <span class="text-sm">{{ reportData.tarikhLaporan }}</span>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium">Disediakan Oleh</label>
              <div class="mt-1 p-3 bg-gray-50 rounded border">
                <span class="text-sm">{{ reportData.disediakanOleh }}</span>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium">Nilai Kerja Dicadangkan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded border">
                <span class="text-sm font-semibold text-blue-600">{{ reportData.nilaiKerja }}</span>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Latar Belakang -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Latar Belakang</h2>
        </template>
        <template #body>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">Sejarah Bangunan</h4>
              <p class="text-gray-700">{{ reportData.latarBelakang.sejarah }}</p>
            </div>
            <div>
              <h4 class="font-medium mb-2">Keadaan Semasa</h4>
              <p class="text-gray-700">{{ reportData.latarBelakang.keadaanSemasa }}</p>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Keperluan -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Keperluan</h2>
        </template>
        <template #body>
          <div class="space-y-4">
            <div v-for="kategori in reportData.keperluan" :key="kategori.nama">
              <h4 class="font-medium mb-2">{{ kategori.nama }}</h4>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="item in kategori.items" :key="item" class="text-gray-700">{{ item }}</li>
              </ul>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Cadangan -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Cadangan</h2>
        </template>
        <template #body>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">Cadangan Utama</h4>
              <p class="text-gray-700">{{ reportData.cadangan.utama }}</p>
            </div>
            <div>
              <h4 class="font-medium mb-3">Fasa Pelaksanaan</h4>
              <div class="space-y-3">
                <div v-for="(fasa, index) in reportData.cadangan.fasa" :key="index" class="border rounded p-3">
                  <h5 class="font-medium">Fasa {{ index + 1 }}: {{ fasa.nama }}</h5>
                  <p class="text-sm text-gray-600 mt-1">{{ fasa.penerangan }}</p>
                  <div class="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Tempoh: {{ fasa.tempoh }}</span>
                    <span>Kos: {{ fasa.kos }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Back Button -->
      <div class="flex justify-center">
        <rs-button variant="primary-outline" @click="goBack">
          <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
          Kembali
        </rs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const breadcrumb = ref([
  { name: "Senarai Permohonan", type: "link", path: "/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan" },
  { name: "Semak Permohonan", type: "link", path: `/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}` },
  { name: "Laporan Teknikal", type: "current", path: "" },
]);

const reportData = ref({
  noRujukan: "LT-2024-001",
  tarikhLaporan: "20 November 2024",
  disediakanOleh: "Ir. Ahmad Hasan bin Mohd Ali",
  nilaiKerja: "RM 165,000.00",
  latarBelakang: {
    sejarah: "Masjid Al-Hidayah dibina pada tahun 1985 dan telah berkhidmat kepada masyarakat tempatan selama hampir 40 tahun.",
    keadaanSemasa: "Pemeriksaan menunjukkan beberapa isu struktur dan kemudahan yang memerlukan perhatian segera."
  },
  keperluan: [
    {
      nama: "Kerja Struktur",
      items: ["Pembaikan keretakan dinding utama", "Pengukuhan asas bangunan", "Gantian bumbung yang bocor"]
    },
    {
      nama: "Sistem Elektrik", 
      items: ["Pemasangan sistem elektrik baharu", "Lampu LED untuk jimat tenaga", "Sistem bunyi dan mikrofon"]
    }
  ],
  cadangan: {
    utama: "Melaksanakan kerja pembaikan dan naik taraf secara berperingkat untuk meminimumkan gangguan kepada aktiviti harian masjid.",
    fasa: [
      {
        nama: "Kerja Struktur Kritikal",
        penerangan: "Pembaikan keretakan dinding, pengukuhan asas, dan gantian bumbung",
        tempoh: "3 bulan",
        kos: "RM 80,000"
      },
      {
        nama: "Sistem Utiliti",
        penerangan: "Pemasangan sistem elektrik dan mekanikal baharu", 
        tempoh: "2 bulan",
        kos: "RM 45,000"
      }
    ]
  }
});

const goBack = () => {
  router.push(`/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}`);
};
</script> 