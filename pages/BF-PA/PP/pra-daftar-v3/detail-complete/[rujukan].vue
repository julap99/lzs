<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Terperinci Penolong Amil Lengkap
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-green-900">
                  Status Penolong Amil
                </h3>
                <p class="text-sm text-green-700">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge variant="success">
                  {{ application.statusLantikan }}
                </rs-badge>
                <rs-badge variant="info">
                  {{ application.sesiPerkhidmatan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Personal Information Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Peribadi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <p class="text-gray-900">{{ application.nama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Pengenalan
                </label>
                <p class="text-gray-900">{{ application.jenisPengenalan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Pengenalan
                </label>
                <p class="text-gray-900">{{ application.noKP }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Lahir
                </label>
                <p class="text-gray-900">{{ application.tarikhLahir }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Umur
                </label>
                <p class="text-gray-900">{{ application.umur }} tahun</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jantina
                </label>
                <p class="text-gray-900">{{ application.jantina }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Taraf Perkahwinan
                </label>
                <p class="text-gray-900">{{ application.tarafPerkahwinan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Warganegara
                </label>
                <p class="text-gray-900">{{ application.warganegara }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Untuk Dihubungi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Emel
                </label>
                <p class="text-gray-900">{{ application.emel }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  No Telefon
                </label>
                <p class="text-gray-900">{{ application.telefon }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat 1
                </label>
                <p class="text-gray-900">{{ application.alamat1 }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat 2
                </label>
                <p class="text-gray-900">{{ application.alamat2 || "-" }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat 3
                </label>
                <p class="text-gray-900">{{ application.alamat3 || "-" }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Daerah
                </label>
                <p class="text-gray-900">{{ application.daerah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bandar
                </label>
                <p class="text-gray-900">{{ application.bandar }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Poskod
                </label>
                <p class="text-gray-900">{{ application.poskod }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Negeri
                </label>
                <p class="text-gray-900">{{ application.negeri }}</p>
              </div>
            </div>
          </div>

          <!-- Registration Information Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Pendaftaran
            </h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori Penolong Amil
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jawatan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institusi / Kariah
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarikh Pendaftaran
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sesi Perkhidmatan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Akhir
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.kategoriPenolongAmil }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.jawatan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.institusiKariah }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.tarikhPendaftaran }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.sesiPerkhidmatan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <rs-badge variant="success">
                        {{ application.statusAkhir }}
                      </rs-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <rs-button
                        variant="primary"
                        size="sm"
                        @click="handleViewRegistrationDetail"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                        Lihat
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Service Information Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Perkhidmatan
            </h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori Penolong Amil
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jawatan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institusi / Kariah
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarikh Lantikan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sesi Perkhidmatan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Lantikan / Perkhidmatan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.kategoriPenolongAmil }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.jawatan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.institusiKariah }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.tarikhLantikan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ application.sesiPerkhidmatan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <rs-badge variant="success">
                        {{ application.statusLantikan }}
                      </rs-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <rs-button
                        variant="primary"
                        size="sm"
                        @click="handleViewServiceDetail"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                        Lihat
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bank Information Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Bank
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bank
                </label>
                <p class="text-gray-900">{{ application.namaBank }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  No Akaun Bank
                </label>
                <p class="text-gray-900">{{ application.noAkaunBank }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Swiftcode
                </label>
                <p class="text-gray-900">{{ application.swiftcode || "-" }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemegang Akaun
                </label>
                <p class="text-gray-900">{{ application.namaPemegangAkaun }}</p>
              </div>
            </div>
          </div>

          <!-- Next-of-Kin Information Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Waris
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Waris
                </label>
                <p class="text-gray-900">{{ application.namaWaris }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Hubungan
                </label>
                <p class="text-gray-900">{{ application.hubunganWaris }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  No Telefon Waris
                </label>
                <p class="text-gray-900">{{ application.telefonWaris }}</p>
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
  title: "Maklumat Terperinci Penolong Amil Lengkap",
  description: "Paparan terperinci maklumat penolong amil yang telah lengkap",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Maklumat Terperinci Lengkap",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/detail-complete/${route.params.rujukan}`,
  },
]);

// Complete application data with all RTMF required fields
const application = ref({
  rujukan: route.params.rujukan,
  nama: "Mohd Zulkifli bin Ahmad",
  jenisPengenalan: "MyKad",
  noKP: "850315071234",
  tarikhLahir: "15/03/1985",
  umur: 39,
  jantina: "Lelaki",
  tarafPerkahwinan: "Berkahwin",
  warganegara: "Malaysia",
  emel: "zulkifli.ahmad@email.com",
  telefon: "0123456789",
  alamat1: "No. 123, Jalan Utama, Taman Seri Indah",
  alamat2: "Tingkat 2, Blok A",
  alamat3: "",
  daerah: "Kuala Lumpur",
  bandar: "Kuala Lumpur",
  poskod: "50000",
  negeri: "Kuala Lumpur",
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  tarikhPendaftaran: "01/01/2023",
  sesiPerkhidmatan: "Sesi 1",
  statusAkhir: "Approved",
  tarikhLantikan: "01/01/2023",
  statusLantikan: "Active",
  namaBank: "Maybank",
  noAkaunBank: "1234567890",
  swiftcode: "MBBEMYKL",
  namaPemegangAkaun: "Mohd Zulkifli bin Ahmad",
  namaWaris: "Siti Aminah binti Hassan",
  hubunganWaris: "Isteri",
  telefonWaris: "0123456789",
});

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

const handleViewRegistrationDetail = () => {
  // Navigate to detailed registration view (EX-PA-PP-PD-01_04)
  navigateTo(`/BF-PA/PP/pra-daftar-v3/registration-detail/${route.params.rujukan}`);
};

const handleViewServiceDetail = () => {
  // Navigate to detailed service view (EX-PA-PP-PD-01_05)
  navigateTo(`/BF-PA/PP/pra-daftar-v3/service-detail/${route.params.rujukan}`);
};

onMounted(() => {
  // In real implementation, fetch complete application data based on rujukan
  console.log("Loading complete application details for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 