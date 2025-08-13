<!-- 
  RTMF SCREEN: PA-KF-KJ-01_02 (Detail View)
  PURPOSE: Paparan terperinci maklumat kategori penolong amil
  DESCRIPTION: Read-only detailed view of a Penolong Amil category with tabbed interface
  ROUTE: /BF-PA/KF/KJ/detail/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:info-fill" class="w-6 h-6 mr-3 text-primary" />
            Maklumat Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Paparan terperinci maklumat kategori penolong amil</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="secondary-outline"
            @click="navigateTo('/BF-PA/KF/KJ')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Tabbed Interface -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Paparan Terperinci</h3>
          <div class="text-sm text-gray-500">
            <Icon name="ph:info-fill" class="w-4 h-4 inline mr-1" />
            {{ categoryData.kategoriPenolongAmil }} - {{ categoryData.kodSingkatan }}
          </div>
        </div>
      </template>
      
      <template #body>
        <rs-tab v-model="activeTab">
          <!-- Maklumat Kategori Tab -->
          <rs-tab-item title="Maklumat Kategori">
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Penolong Amil</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.kategoriPenolongAmil }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kod Singkatan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.kodSingkatan }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div class="mt-1">
                    <rs-badge :variant="getStatusVariant(categoryData.status)">
                      {{ categoryData.status }}
                    </rs-badge>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kuatkuasa</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ formatDate(categoryData.tarikhKuatkuasa) }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Penerangan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.penerangan || 'Tiada penerangan' }}
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <!-- Maklumat Jawatan Tab -->
          <rs-tab-item title="Maklumat Jawatan">
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Jawatan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatJawatan.namaJawatan }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kod Jawatan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatJawatan.kodJawatan }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Jawatan</label>
                  <div class="mt-1">
                    <rs-badge :variant="getStatusVariant(categoryData.maklumatJawatan.status)">
                      {{ categoryData.maklumatJawatan.status }}
                    </rs-badge>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kuatkuasa Jawatan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ formatDate(categoryData.maklumatJawatan.tarikhKuatkuasa) }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tanggungjawab Jawatan</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatJawatan.tanggungjawab || 'Tiada maklumat tanggungjawab' }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kelayakan Minimum</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatJawatan.kelayakan || 'Tiada maklumat kelayakan' }}
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <!-- Maklumat Elaun Tab -->
          <rs-tab-item title="Maklumat Elaun">
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Elaun</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatElaun.jenisElaun }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Amaun</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    RM {{ categoryData.maklumatElaun.amaun }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kod Bajet</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatElaun.kodBajet }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Elaun</label>
                  <div class="mt-1">
                    <rs-badge :variant="getStatusVariant(categoryData.maklumatElaun.status)">
                      {{ categoryData.maklumatElaun.status }}
                    </rs-badge>
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Elaun</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatElaun.catatanElaun || 'Tiada catatan' }}
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <!-- Maklumat Sesi Tab -->
          <rs-tab-item title="Maklumat Sesi">
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Sesi</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatSesi.jenisSesi || 'Tiada maklumat sesi' }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tempoh Sesi</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatSesi.tempohSesi || 'Tiada maklumat tempoh' }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Sesi</label>
                  <div class="mt-1">
                    <rs-badge :variant="getStatusVariant(categoryData.maklumatSesi.status)">
                      {{ categoryData.maklumatSesi.status || 'Tiada status' }}
                    </rs-badge>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Sesi</label>
                  <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {{ categoryData.maklumatSesi.catatanSesi || 'Tiada catatan sesi' }}
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>

    <!-- Maklumat Pegawai Section (Separate from tabs) -->
    <rs-card class="mt-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:user" class="w-5 h-5 mr-2" />
          Maklumat Pegawai (Audit Trail)
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dicipta Oleh</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ categoryData.maklumatPegawai.diciptaOleh }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Cipta</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ formatDate(categoryData.maklumatPegawai.tarikhCipta) }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Diluluskan Oleh</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ categoryData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Lulus</label>
              <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {{ formatDate(categoryData.maklumatPegawai.tarikhLulus ? categoryData.maklumatPegawai.tarikhLulus : 'Belum diluluskan') }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Maklumat Kategori Penolong Amil",
});

const breadcrumb = ref([
  {
    name: "Utama",
    type: "link",
    path: "/"
  },
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA"
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF/KJ"
  },
  {
    name: "Paparan Terperinci",
    type: "current",
    path: "/BF-PA/KF/KJ/detail"
  }
]);

// Active tab state
const activeTab = ref('kategori');

// Mock category data
const categoryData = ref({
  id: route.params.id,
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Diluluskan Ketua Jabatan",
  tarikhKuatkuasa: "2024-01-01",
  penerangan: "Kategori untuk menguruskan zakat fitrah",
  maklumatJawatan: {
    namaJawatan: "Penolong Amil Fitrah",
    kodJawatan: "PAF001",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
    tanggungjawab: "Menguruskan kutipan dan pengagihan zakat fitrah",
    kelayakan: "Sijil SPM, pengalaman dalam kerja sosial",
  },
  maklumatElaun: {
    jenisElaun: "Elaun Bulanan",
    amaun: "500.00",
    kodBajet: "B001",
    status: "Aktif",
    catatanElaun: "Elaun bulanan termasuk elaun perjalanan",
  },
  maklumatSesi: {
    jenisSesi: "Sesi Pengajian",
    tempohSesi: "1 jam",
    status: "Selesai",
    catatanSesi: "Pengajian berjaya dilaksanakan",
  },
  maklumatPegawai: {
    diciptaOleh: "Ahmad bin Abdullah",
    tarikhCipta: "2024-01-01",
    diluluskanOleh: "Ketua Jabatan Zakat",
    tarikhLulus: "2024-01-15",
  },
});

const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Pengesahan":
      return "warning";
    case "Disahkan Ketua Jabatan":
      return "info";
    case "Diluluskan Ketua Divisyen":
      return "success";
    default:
      return "disabled";
  }
};

const getDifficultyVariant = (tahap) => {
  switch (tahap) {
    case "Mudah":
      return "success";
    case "Sederhana":
      return "warning";
    case "Sukar":
      return "danger";
    case "Sangat Sukar":
      return "danger";
    default:
      return "disabled";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

onMounted(() => {
  // In real app, fetch category data based on route.params.id
  console.log("Loading category data for ID:", route.params.id);
});
</script> 