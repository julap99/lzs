<!-- 
  RTMF SCREEN: PA-PP-PD-01_04
  PURPOSE: Process Trace - Paparan Maklumat Pendaftaran
  DESCRIPTION: Complete process trace display for all approval stages with audit trail
  ROUTE: /BF-PA/PP/pra-daftar-v3/process-trace/[rujukan]
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
            <span class="text-gray-600">Memuatkan jejak proses...</span>
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
            Jejak Proses Pendaftaran Penolong Amil
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
          <!-- Application Header -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-blue-900">
                  Maklumat Calon
                </h3>
                <p class="text-sm text-blue-600">
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

          <!-- Process Timeline -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Jejak Proses Pendaftaran
            </h3>
            
            <div class="relative">
              <!-- Timeline Line -->
              <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <!-- Process Steps -->
              <div class="space-y-6">
                <!-- Step 1: Pendaftaran -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-green-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Pendaftaran Calon</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.tarikhPendaftaran || 'Tarikh tidak tersedia' }}</p>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h5 class="font-medium text-green-900 mb-2">Maklumat Pendaftaran</h5>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span class="font-medium">Nama:</span> {{ application.nama || 'Tidak tersedia' }}
                        </div>
                        <div>
                          <span class="font-medium">No. KP:</span> {{ application.noKP || 'Tidak tersedia' }}
                        </div>
                        <div>
                          <span class="font-medium">Kategori:</span> {{ application.kategoriPenolongAmil || 'Tidak tersedia' }}
                        </div>
                        <div>
                          <span class="font-medium">Institusi:</span> {{ application.institusiKariah || 'Tidak tersedia' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Saringan Risiko -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-blue-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Saringan Risiko</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.screeningDate || 'Belum disaring' }}</p>
                    <div v-if="application.screeningNotes" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 class="font-medium text-blue-900 mb-2">Catatan Saringan</h5>
                      <p class="text-sm text-blue-800">{{ application.screeningNotes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Semakan PT -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-yellow-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Semakan Pegawai Tadbir</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.ptReviewDate || 'Belum disemak' }}</p>
                    <div v-if="application.ptNotes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 class="font-medium text-yellow-900 mb-2">Catatan PT</h5>
                      <p class="text-sm text-yellow-800">{{ application.ptNotes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Sokongan Eksekutif -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-purple-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Sokongan Eksekutif</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.executiveDate || 'Belum disokong' }}</p>
                    <div v-if="application.executiveNotes" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 class="font-medium text-purple-900 mb-2">Catatan Eksekutif</h5>
                      <p class="text-sm text-purple-800">{{ application.executiveNotes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 5: Pengesahan Ketua Jabatan -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-indigo-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Pengesahan Ketua Jabatan</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.departmentHeadDate || 'Belum disahkan' }}</p>
                    <div v-if="application.departmentHeadNotes" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h5 class="font-medium text-indigo-900 mb-2">Catatan Ketua Jabatan</h5>
                      <p class="text-sm text-indigo-800">{{ application.departmentHeadNotes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 6: Kelulusan Ketua Divisyen -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-red-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Kelulusan Ketua Divisyen</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.divisionHeadDate || 'Belum diluluskan' }}</p>
                    <div v-if="application.divisionHeadNotes" class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h5 class="font-medium text-red-900 mb-2">Catatan Ketua Divisyen</h5>
                      <p class="text-sm text-red-800">{{ application.divisionHeadNotes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Step 7: Pendaftaran Sistem NAS -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-gray-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">Pendaftaran Sistem NAS</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ application.nasRegistrationDate || 'Belum didaftarkan' }}</p>
                    <div v-if="application.nasAccountId" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h5 class="font-medium text-gray-900 mb-2">Maklumat Akaun NAS</h5>
                      <div class="text-sm text-gray-800">
                        <p><span class="font-medium">ID Akaun:</span> {{ application.nasAccountId }}</p>
                        <p><span class="font-medium">Status:</span> {{ application.nasAccountStatus }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Supporting Documents -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Dokumen Sokongan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Salinan Kad Pengenalan</h4>
                <p class="text-sm text-gray-600">Status: {{ application.icDocument ? 'Dilampirkan' : 'Belum dilampirkan' }}</p>
              </div>
              
              <div class="p-4 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Surat Sokongan</h4>
                <p class="text-sm text-gray-600">Status: {{ application.supportLetter ? 'Dilampirkan' : 'Belum dilampirkan' }}</p>
              </div>
            </div>
          </div>

          <!-- Audit Trail -->
          <div class="p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Audit Trail
            </h3>
            
            <div v-if="application.auditTrail && application.auditTrail.length > 0" class="space-y-3">
              <div v-for="(log, index) in application.auditTrail" :key="index" class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="ph:user" class="text-blue-600" size="16" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ log.action }}</p>
                  <p class="text-xs text-gray-600">{{ log.timestamp }} oleh {{ log.user }}</p>
                  <p v-if="log.notes" class="text-xs text-gray-700 mt-1">{{ log.notes }}</p>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <Icon name="ph:info" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">Tiada audit trail tersedia</p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Jejak Proses Pendaftaran",
  description: "Paparan jejak proses lengkap calon Penolong Amil",
});

const route = useRoute();
const rujukan = route.params.rujukan;

// State management
const isLoading = ref(true);
const error = ref(null);

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
    name: "Jejak Proses",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/process-trace/${rujukan}`,
  },
]);

// Mock application data with process trace
const application = ref({
  rujukan: rujukan,
  nama: "Ahmad Bin Abdullah",
  noKP: "901231012345",
  kategoriPenolongAmil: "PAK",
  institusiKariah: "Masjid Negeri Selangor",
  statusPendaftaran: "Diluluskan",
  statusLantikan: "Aktif",
  tarikhPendaftaran: "2024-01-15",
  screeningDate: "2024-01-20",
  screeningNotes: "Calon telah lulus saringan risiko. Tiada rekod jenayah atau masalah kewangan.",
  ptReviewDate: "2024-01-25",
  ptNotes: "Dokumen lengkap dan memenuhi syarat. Disyorkan untuk sokongan eksekutif.",
  executiveDate: "2024-02-01",
  executiveNotes: "Sokongan diberikan berdasarkan merit dan keperluan institusi.",
  departmentHeadDate: "2024-02-05",
  departmentHeadNotes: "Disahkan berdasarkan kelayakan dan keperluan jabatan.",
  divisionHeadDate: "2024-02-10",
  divisionHeadNotes: "Diluluskan untuk pelantikan sebagai Penolong Amil.",
  nasRegistrationDate: "2024-02-15",
  nasAccountId: "PA-2024-001",
  nasAccountStatus: "Aktif",
  icDocument: true,
  supportLetter: true,
  auditTrail: [
    {
      action: "Pendaftaran calon baharu",
      timestamp: "2024-01-15 10:30:00",
      user: "Ahmad Abdullah (PYB)",
      notes: "Calon didaftarkan melalui borang pendaftaran"
    },
    {
      action: "Saringan risiko selesai",
      timestamp: "2024-01-20 14:15:00",
      user: "Siti Fatimah (Eksekutif Risiko)",
      notes: "Calon lulus saringan risiko"
    },
    {
      action: "Semakan PT selesai",
      timestamp: "2024-01-25 09:45:00",
      user: "Mohd Ali (Pegawai Tadbir)",
      notes: "Dokumen lengkap dan memenuhi syarat"
    },
    {
      action: "Sokongan eksekutif diberikan",
      timestamp: "2024-02-01 11:20:00",
      user: "Dr. Aminah (Eksekutif)",
      notes: "Sokongan berdasarkan merit dan keperluan"
    },
    {
      action: "Pengesahan ketua jabatan",
      timestamp: "2024-02-05 16:30:00",
      user: "Tuan Haji Omar (Ketua Jabatan)",
      notes: "Disahkan berdasarkan kelayakan"
    },
    {
      action: "Kelulusan ketua divisyen",
      timestamp: "2024-02-10 13:45:00",
      user: "Dato' Ahmad (Ketua Divisyen)",
      notes: "Diluluskan untuk pelantikan"
    },
    {
      action: "Pendaftaran sistem NAS",
      timestamp: "2024-02-15 08:15:00",
      user: "Sistem NAS",
      notes: "Akaun berjaya dicipta"
    }
  ]
});

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    "Draft": "default",
    "Submitted": "warning",
    "Under Review": "info",
    "Approved": "success",
    "Rejected": "danger",
    "Diluluskan": "success"
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    "Pending": "warning",
    "Appointed": "info",
    "Active": "success",
    "Inactive": "secondary",
    "Terminated": "danger",
    "Aktif": "success"
  };
  return statusVariants[status] || "default";
};

const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
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
    
    // In real implementation, fetch application data based on rujukan
    console.log("Loading process trace for:", rujukan);
    
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
/* Custom styles for process trace */
</style> 