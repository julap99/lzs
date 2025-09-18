<!-- 
  RTMF SCREEN: PA-PP-PD-01_02 (Complete)
  PURPOSE: Complete Detail View - Maklumat Penolong Amil Lengkap
  DESCRIPTION: Complete detailed information view for finished Penolong Amil applications
  ROUTE: /BF-PA/PP/PD/detail-complete/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="isLoading" class="mt-4">
      <rs-card>
        <template #body>
          <div class="flex items-center justify-center py-8">
            <Icon name="ph:spinner" class="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span class="text-gray-600">Memuatkan maklumat terperinci...</span>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-4">
      <rs-card>
        <template #body>
          <div class="flex items-center justify-center py-8">
            <div class="text-center">
              <Icon name="ph:warning" class="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Ralat Memuatkan Data</h3>
              <p class="text-gray-600 mb-4">{{ error }}</p>
              <rs-button variant="primary" @click="retryLoad">
                <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
                Cuba Lagi
              </rs-button>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Content -->
    <rs-card v-else class="mt-4">
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
                <p class="text-gray-900">{{ formatDate(application.tarikhLahir) }}</p>
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
                      {{ formatDate(application.tarikhPendaftaran) }}
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
                        :disabled="isNavigating"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                        {{ isNavigating ? 'Memuatkan...' : 'Lihat' }}
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
                      {{ formatDate(application.tarikhLantikan) }}
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
                        :disabled="isNavigating"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                        {{ isNavigating ? 'Memuatkan...' : 'Lihat' }}
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

    <!-- Navigation Error Modal -->
    <rs-modal
      v-model="showNavigationError"
      title="Ralat Navigasi"
      size="sm"
    >
      <template #body>
        <div class="text-center">
          <Icon name="ph:warning" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Halaman Tidak Tersedia</h3>
          <p class="text-gray-600 mb-4">{{ navigationError }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showNavigationError = false"
          >
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";

const route = useRoute();

definePageMeta({
  title: "Maklumat Terperinci Penolong Amil Lengkap",
  description: "Paparan terperinci maklumat penolong amil yang telah lengkap",
});

// State management
const isLoading = ref(true);
const error = ref(null);
const isNavigating = ref(false);
const showNavigationError = ref(false);
const navigationError = ref("");

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PD",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PD",
  },
  {
    name: "Maklumat Terperinci Lengkap",
    type: "current",
    path: `/BF-PA/PP/PD/detail-complete/${route.params.rujukan}`,
  },
]);

// Complete application data with all RTMF required fields
const application = ref({
  rujukan: route.params.rujukan,
  nama: "Mohd Zulkifli bin Ahmad",
  jenisPengenalan: "MyKad",
  noKP: "850315071234",
  tarikhLahir: "15-03-1985",
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
  tarikhPendaftaran: "01-01-2023",
  sesiPerkhidmatan: "Sesi 1",
  statusAkhir: "Approved",
  tarikhLantikan: "01-01-2023",
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
  navigateTo("/BF-PA/PP/PD");
};

const handleViewRegistrationDetail = async () => {
  try {
    isNavigating.value = true;
    
    // Simulate navigation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if the target route exists (in real implementation, this would be a proper route check)
    const targetRoute = `/BF-PA/PP/PD/registration-detail/${route.params.rujukan}`;
    
    // Simulate route availability check
    const routeExists = Math.random() > 0.1; // 90% chance route exists
    
    if (routeExists) {
      // Navigate to detailed registration view (EX-PA-PP-PD-01_04)
      navigateTo(targetRoute);
    } else {
      throw new Error("Halaman pendaftaran terperinci tidak tersedia pada masa ini");
    }
    
  } catch (err) {
    navigationError.value = err.message || "Ralat berlaku semasa navigasi";
    showNavigationError.value = true;
  } finally {
    isNavigating.value = false;
  }
};

const handleViewServiceDetail = async () => {
  try {
    isNavigating.value = true;
    
    // Simulate navigation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if the target route exists (in real implementation, this would be a proper route check)
    const targetRoute = `/BF-PA/PP/PD/service-detail/${route.params.rujukan}`;
    
    // Simulate route availability check
    const routeExists = Math.random() > 0.1; // 90% chance route exists
    
    if (routeExists) {
      // Navigate to detailed service view (EX-PA-PP-PD-01_05)
      navigateTo(targetRoute);
    } else {
      throw new Error("Halaman perkhidmatan terperinci tidak tersedia pada masa ini");
    }
    
  } catch (err) {
    navigationError.value = err.message || "Ralat berlaku semasa navigasi";
    showNavigationError.value = true;
  } finally {
    isNavigating.value = false;
  }
};

const retryLoad = async () => {
  error.value = null;
  isLoading.value = true;
  await loadData();
};

const loadData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Simulate API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random error (5% chance)
        if (Math.random() < 0.05) {
          reject(new Error("Ralat rangkaian. Sila cuba lagi."));
        } else {
          resolve();
        }
      }, 1000);
    });
    
    // In real implementation, fetch complete application data based on rujukan
    console.log("Loading complete application details for:", route.params.rujukan);
    
  } catch (err) {
    error.value = err.message || "Ralat berlaku semasa memuatkan data";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 