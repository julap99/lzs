<!-- 
  RTMF SCREEN: PA-PP-PD-01_02
  PURPOSE: Detail View - Maklumat Penolong Amil Terperinci
  DESCRIPTION: Detailed information view for Penolong Amil applications
  ROUTE: /BF-PA/PP/pra-daftar-v3/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Terperinci Penolong Amil
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
            <rs-button
              v-if="canEdit"
              variant="primary"
              @click="handleEdit"
            >
              <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
              Kemaskini
            </rs-button>
            <rs-button
              variant="info"
              @click="handleViewProcessTrace"
              title="PA-PP-PD-01_04: Jejak Proses"
            >
              <Icon name="ph:timeline" class="w-4 h-4 mr-1" />
              Jejak Proses
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Status Permohonan
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ application.statusPendaftaran }}
                </rs-badge>
                <rs-badge :variant="getStatusLantikanVariant(application.statusLantikan)">
                  {{ application.statusLantikan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Peribadi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Kad Pengenalan
                </label>
                <p class="text-gray-900">{{ application.noKP }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penuh
                </label>
                <p class="text-gray-900">{{ application.nama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jantina
                </label>
                <p class="text-gray-900">{{ application.jantina }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bangsa
                </label>
                <p class="text-gray-900">{{ application.bangsa }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Agama
                </label>
                <p class="text-gray-900">{{ application.agama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Emel
                </label>
                <p class="text-gray-900">{{ application.emel }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Telefon
                </label>
                <p class="text-gray-900">{{ application.telefon }}</p>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Alamat
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Rumah
                </label>
                <p class="text-gray-900">{{ application.alamatRumah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Poskod
                </label>
                <p class="text-gray-900">{{ application.poskod }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bandar
                </label>
                <p class="text-gray-900">{{ application.bandar }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Negeri
                </label>
                <p class="text-gray-900">{{ application.negeri }}</p>
              </div>
            </div>
          </div>

          <!-- Service Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Perkhidmatan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Penolong Amil
                </label>
                <p class="text-gray-900">{{ application.kategoriPenolongAmil }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jawatan
                </label>
                <p class="text-gray-900">{{ application.jawatan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Institusi/Kariah
                </label>
                <p class="text-gray-900">{{ application.institusiKariah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sesi Perkhidmatan
                </label>
                <p class="text-gray-900">{{ application.sesiPerkhidmatan }}</p>
              </div>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Dokumen Sokongan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Salinan Kad Pengenalan -->
              <div>
                <h4 class="font-medium mb-3">Salinan Kad Pengenalan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.salinanKadPengenalan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('salinanKadPengenalan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500">
                    <div class="mb-2">
                      <Icon name="heroicons:document" size="48" class="text-gray-400" />
                    </div>
                    <p class="text-sm">Klik butang "Lihat Dokumen" untuk melihat Salinan Kad Pengenalan</p>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>

              <!-- Gambar Calon -->
              <div>
                <h4 class="font-medium mb-3">Gambar Calon</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:photo" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.gambarCalon }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('gambarCalon')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500">
                    <div class="mb-2">
                      <Icon name="heroicons:photo" size="48" class="text-gray-400" />
                    </div>
                    <p class="text-sm">Klik butang "Lihat Dokumen" untuk melihat Gambar Calon</p>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>

              <!-- Surat Sokongan (if exists) -->
              <div v-if="application.suratSokongan">
                <h4 class="font-medium mb-3">Surat Sokongan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.suratSokongan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('suratSokongan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>

              <!-- Dokumen Lain (if exists) -->
              <div v-if="application.dokumenLain">
                <h4 class="font-medium mb-3">Dokumen Lain</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.dokumenLain }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('dokumenLain')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Application Timeline -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Timeline Permohonan
            </h3>
            
            <div class="space-y-4">
              <div v-for="(timeline, index) in application.timeline" :key="index" class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ timeline.action }}</p>
                  <p class="text-sm text-gray-500">{{ timeline.date }}</p>
                  <p v-if="timeline.notes" class="text-sm text-gray-600 mt-1">{{ timeline.notes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Maklumat Terperinci Penolong Amil",
  description: "Paparan terperinci maklumat penolong amil",
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
    name: "Maklumat Terperinci",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/detail/${route.params.rujukan}`,
  },
]);

// Mock application data based on RTMF requirements
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  jantina: "Lelaki",
  bangsa: "Melayu",
  agama: "Islam",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  alamatRumah: "No. 123, Jalan Utama, Taman Seri Indah",
  poskod: "50000",
  bandar: "Kuala Lumpur",
  negeri: "Kuala Lumpur",
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Under Review",
  statusLantikan: "Pending",
  salinanKadPengenalan: "salinan_kp_ahmad.pdf",
  gambarCalon: "gambar_ahmad.jpg",
  suratSokongan: "surat_sokongan_ahmad.pdf",
  dokumenLain: null,
  uploadDate: "15/03/2024",
  timeline: [
    {
      action: "Permohonan Dihantar",
      date: "15/03/2024 10:30 AM",
      notes: "Permohonan berjaya dihantar untuk semakan"
    },
    {
      action: "Dokumen Disemak",
      date: "16/03/2024 02:15 PM",
      notes: "Semua dokumen lengkap dan sah"
    },
    {
      action: "Menunggu Kelulusan",
      date: "17/03/2024 09:00 AM",
      notes: "Permohonan dalam proses kelulusan"
    }
  ]
});

const canEdit = computed(() => {
  return ["Draft", "Submitted"].includes(application.value.statusPendaftaran);
});

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "default",
    Submitted: "warning",
    "Under Review": "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    Pending: "warning",
    Appointed: "info",
    Active: "success",
    Inactive: "secondary",
    Terminated: "danger",
  };
  return statusVariants[status] || "default";
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

const handleEdit = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/edit/${route.params.rujukan}`);
};

const handleViewProcessTrace = () => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/process-trace/${route.params.rujukan}`);
};

const previewDocument = (documentType) => {
  // Simulate document preview
      // Previewing document
  // In real implementation, this would open a modal or navigate to document viewer
};

onMounted(() => {
  // In real implementation, fetch application data based on rujukan
      // Loading application details
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 