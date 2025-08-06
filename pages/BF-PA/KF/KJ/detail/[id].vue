<!-- 
  RTMF SCREEN: PA-KF-KJ-01_02 (Detail View)
  PURPOSE: Paparan terperinci maklumat kategori penolong amil
  DESCRIPTION: Read-only detailed view of a Penolong Amil category
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

    <!-- Maklumat Kategori Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:info-fill" class="w-5 h-5 mr-2" />
          Maklumat Kategori
        </h3>
      </template>
      <template #body>
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
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Jawatan Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:briefcase" class="w-5 h-5 mr-2" />
          Maklumat Jawatan
        </h3>
      </template>
      <template #body>
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
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Sesi Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:calendar" class="w-5 h-5 mr-2" />
          Maklumat Sesi
        </h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sesi</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ categoryData.maklumatSesi.sesi }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status Sesi</label>
            <div class="mt-1">
              <rs-badge :variant="getStatusVariant(categoryData.maklumatSesi.status)">
                {{ categoryData.maklumatSesi.status }}
              </rs-badge>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Mula</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ formatDate(categoryData.maklumatSesi.tarikhMula) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Tamat</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ formatDate(categoryData.maklumatSesi.tarikhTamat) }}
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Elaun Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:money" class="w-5 h-5 mr-2" />
          Maklumat Elaun
        </h3>
      </template>
      <template #body>
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
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Pegawai Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:user" class="w-5 h-5 mr-2" />
          Maklumat Pegawai
        </h3>
      </template>
      <template #body>
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
              {{ categoryData.maklumatPegawai.tarikhLulus ? formatDate(categoryData.maklumatPegawai.tarikhLulus) : 'Belum diluluskan' }}
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
    title: "Maklumat Kategori",
    path: "/BF-PA/KF/KJ/detail"
  }
]);

// Mock category data
const categoryData = ref({
  id: route.params.id,
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Diluluskan Ketua Jabatan", // Changed to test the new status
  tarikhKuatkuasa: "2024-01-01",
  maklumatJawatan: {
    namaJawatan: "Penolong Amil Fitrah",
    kodJawatan: "PAF001",
    status: "Aktif",
    tarikhKuatkuasa: "2024-01-01",
  },
  maklumatSesi: {
    sesi: "Sesi 1 - 2024",
    status: "Aktif",
    tarikhMula: "2024-01-01",
    tarikhTamat: "2024-12-31",
  },
  maklumatElaun: {
    jenisElaun: "Elaun Bulanan",
    amaun: "500.00",
    kodBajet: "B001",
    status: "Aktif",
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
    case "Menunggu Kelulusan":
      return "warning";
    case "Diluluskan Ketua Jabatan":
      return "info";
    default:
      return "default";
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