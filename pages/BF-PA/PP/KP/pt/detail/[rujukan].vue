<!-- 
  RTMF SCREEN: PA-PP-KP-02_01 (PT Review)
  PURPOSE: Semakan kemaskini maklumat Perkhidmatan Penolong Amil oleh PT
  DESCRIPTION: PT review screen for service information updates
  ROUTE: /BF-PA/PP/KP/pt/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:clipboard-text" class="w-6 h-6 mr-3 text-primary" />
            Semakan PT - Kemaskini Maklumat Perkhidmatan
          </h1>
          <p class="text-gray-600 mt-1">Semakan permintaan kemaskini maklumat perkhidmatan penolong amil</p>
        </div>
        <div class="flex items-center gap-2">
          <rs-badge variant="warning" class="flex items-center">
            <Icon name="ph:clock" class="w-3 h-3 mr-1" />
            Menunggu Semakan PT
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Enhanced Request Information -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:info" class="w-5 h-5 mr-2" />
            Maklumat Permintaan
          </h3>
          <div class="flex items-center gap-2">
            <rs-badge variant="info" class="flex items-center">
              <Icon name="ph:hash" class="w-3 h-3 mr-1" />
              {{ request.rujukan }}
            </rs-badge>
          </div>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="ph:user" class="w-4 h-4 mr-2" />
              Maklumat Penolong Amil
            </h4>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
                <p class="text-gray-900">{{ penolongAmil.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No. Kad Pengenalan</label>
                <p class="text-gray-900">{{ penolongAmil.noKP }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emel</label>
                <p class="text-gray-900">{{ penolongAmil.emel }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <p class="text-gray-900">{{ penolongAmil.telefon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <p class="text-gray-900">{{ penolongAmil.alamat }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="ph:user-gear" class="w-4 h-4 mr-2" />
              Maklumat Pegawai
            </h4>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dihantar Oleh</label>
                <p class="text-gray-900">{{ request.submittedBy }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Permintaan</label>
                <p class="text-gray-900">{{ request.submittedDate }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Semasa</label>
                <rs-badge variant="warning">Menunggu Semakan PT</rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Review History -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
          Sejarah Semakan
        </h3>
      </template>
      <template #body>
        <div class="space-y-6">
          <!-- Warning Letter History -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="ph:warning" class="w-4 h-4 mr-2 text-yellow-600" />
              Sejarah Surat Amaran
            </h4>
            <div class="space-y-3">
              <div v-if="warningLetterHistory.length === 0" class="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div class="text-sm text-green-800">
                  <Icon name="ph:check-circle" class="w-4 h-4 inline mr-1" />
                  Tiada surat amaran dihantar - Rekod bersih
                </div>
              </div>
              <div v-for="(letter, index) in warningLetterHistory" :key="letter.id" class="border-l-4 border-yellow-500 pl-4">
                <div class="flex items-center justify-between mb-2">
                  <h5 class="font-medium text-gray-900">Surat Amaran #{{ index + 1 }}</h5>
                  <rs-badge :variant="getWarningLetterStatusVariant(letter.status)" size="sm">
                    {{ getWarningLetterStatusLabel(letter.status) }}
                  </rs-badge>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-600">Tarikh Dihantar:</span>
                    <span class="text-gray-900 ml-2">{{ letter.date }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Dihantar oleh:</span>
                    <span class="text-gray-900 ml-2">{{ letter.sentBy }}</span>
                  </div>
                </div>
                <div class="mt-2">
                  <span class="text-gray-600">Sebab:</span>
                  <p class="text-gray-900 mt-1">{{ letter.reason }}</p>
                </div>
                <div class="mt-2">
                  <span class="text-gray-600">Catatan:</span>
                  <p class="text-gray-900 mt-1">{{ letter.notes }}</p>
                </div>
                <div v-if="letter.attachments && letter.attachments.length > 0" class="mt-2">
                  <span class="text-gray-600">Lampiran:</span>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span v-for="attachment in letter.attachments" :key="attachment" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      <Icon name="ph:paperclip" class="w-3 h-3 mr-1" />
                      {{ attachment }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Termination Service History -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="ph:stop-circle" class="w-4 h-4 mr-2 text-red-600" />
              Sejarah Penamatan Jawatan
            </h4>
            <div class="space-y-3">
              <div v-if="terminationHistory.length === 0" class="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div class="text-sm text-green-800">
                  <Icon name="ph:check-circle" class="w-4 h-4 inline mr-1" />
                  Tiada permohonan penamatan - Rekod bersih
                </div>
              </div>
              <div v-for="(termination, index) in terminationHistory" :key="termination.id" class="border-l-4 border-red-500 pl-4">
                <div class="flex items-center justify-between mb-2">
                  <h5 class="font-medium text-gray-900">Permohonan Penamatan #{{ index + 1 }}</h5>
                  <rs-badge :variant="getTerminationStatusVariant(termination.status)" size="sm">
                    {{ getTerminationStatusLabel(termination.status) }}
                  </rs-badge>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-600">Tarikh Permohonan:</span>
                    <span class="text-gray-900 ml-2">{{ termination.date }}</span>
                  </div>
                  <div>
                    <span class="text-gray-600">Dimulakan oleh:</span>
                    <span class="text-gray-900 ml-2">{{ termination.initiatedBy }}</span>
                  </div>
                </div>
                <div class="mt-2">
                  <span class="text-gray-600">Sebab Penamatan:</span>
                  <p class="text-gray-900 mt-1">{{ termination.reason }}</p>
                </div>
                <div class="mt-2">
                  <span class="text-gray-600">Catatan:</span>
                  <p class="text-gray-900 mt-1">{{ termination.notes }}</p>
                </div>
                <div v-if="termination.supportingDocuments && termination.supportingDocuments.length > 0" class="mt-2">
                  <span class="text-gray-600">Dokumen Sokongan:</span>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span v-for="document in termination.supportingDocuments" :key="document" class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      <Icon name="ph:file-text" class="w-3 h-3 mr-1" />
                      {{ document }}
                    </span>
                  </div>
                </div>
                <div v-if="termination.approvalDate" class="mt-2">
                  <span class="text-gray-600">Tarikh Kelulusan:</span>
                  <span class="text-gray-900 ml-2">{{ termination.approvalDate }}</span>
                </div>
                <div v-if="termination.approvedBy" class="mt-2">
                  <span class="text-gray-600">Diluluskan oleh:</span>
                  <span class="text-gray-900 ml-2">{{ termination.approvedBy }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Back Button -->
    <div class="flex justify-end mt-6">
      <rs-button
        type="button"
        @click="handleBack"
        class="flex items-center"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Kembali
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();

// Enhanced breadcrumb
const breadcrumb = ref([
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA",
  },
  {
    name: "PP",
    type: "link",
    path: "/BF-PA/PP",
  },
  {
    name: "Kemaskini Maklumat Perkhidmatan",
    type: "link",
    path: "/BF-PA/PP/KP",
  },
  {
    name: "Semakan PT",
    type: "current",
    path: `/BF-PA/PP/KP/pt/detail/${route.params.rujukan}`,
  },
]);

// Mock request data
const request = ref({
  rujukan: "KP-2024-001",
  submittedBy: "Siti Fatimah binti Omar",
  submittedDate: "15-01-2024",
  justification: "Pindah tempat tinggal ke kawasan baru untuk mendapatkan pendidikan yang lebih baik."
});

// Mock penolong amil data
const penolongAmil = ref({
  nama: "Ahmad bin Abdullah",
  noKP: "880429-10-5605",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  alamat: "No. 123, Jalan Utama, Taman Seri Indah, 50000 Kuala Lumpur",
  status: "Aktif",
  kategoriSemasa: "Penolong Amil Fitrah",
  kategoriBaharu: "Penolong Amil Kariah",
  sesiSemasa: "Pagi",
  sesiBaharu: "Petang",
  daerahSemasa: "Kuala Lumpur",
  daerahBaharu: "Selangor",
  institusiSemasa: "Masjid Wilayah Persekutuan",
  institusiBaharu: "Masjid Negeri Selangor",
  justification: "Pindah tempat tinggal ke kawasan baru untuk mendapatkan pendidikan yang lebih baik."
});

// Mock warning letter history
const warningLetterHistory = ref([
  {
    id: 1,
    date: "2024-01-20",
    sentBy: "PYB Institusi",
    reason: "Tidak menghantar laporan bulanan tepat waktu",
    notes: "Penyelesaian masalah diberikan dan penolong amil diinstruksikan untuk menghantar laporan bulanan tepat waktu.",
    status: "resolved",
    attachments: ["laporan_bulanan_1.pdf"]
  },
  {
    id: 2,
    date: "2024-02-05",
    sentBy: "PYB Institusi",
    reason: "Tidak menghantar laporan bulanan tepat waktu",
    notes: "Penyelesaian masalah diberikan dan penolong amil diinstruksikan untuk menghantar laporan bulanan tepat waktu.",
    status: "resolved",
    attachments: ["laporan_bulanan_2.pdf"]
  }
]);

// Mock termination history
const terminationHistory = ref([
  {
    id: 1,
    date: "2024-03-10",
    initiatedBy: "PYB Institusi",
    reason: "Tidak menghantar laporan bulanan tepat waktu",
    notes: "Penyelesaian masalah diberikan dan penolong amil diinstruksikan untuk menghantar laporan bulanan tepat waktu.",
    status: "approved",
    supportingDocuments: ["surat_penolakan_laporan.pdf"],
    approvalDate: "2024-03-12",
    approvedBy: "Ketua Jabatan"
  }
]);

// Helper functions for warning letters
const getWarningLetterStatusVariant = (status) => {
  switch (status) {
    case "sent":
      return "info";
    case "resolved":
      return "success";
    case "escalated":
      return "warning";
    default:
      return "info";
  }
};

const getWarningLetterStatusLabel = (status) => {
  switch (status) {
    case "sent":
      return "Dihantar";
    case "resolved":
      return "Selesai";
    case "escalated":
      return "Dinaikkan";
    default:
      return "Tidak diketahui";
  }
};

// Helper functions for termination services
const getTerminationStatusVariant = (status) => {
  switch (status) {
    case "initiated":
      return "info";
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    default:
      return "info";
  }
};

const getTerminationStatusLabel = (status) => {
  switch (status) {
    case "initiated":
      return "Dimulakan";
    case "approved":
      return "Diluluskan";
    case "rejected":
      return "Ditolak";
    default:
      return "Tidak diketahui";
  }
};

// Methods
const handleBack = () => {
  navigateTo('/BF-PA/PP/KP');
};

// Enhanced lifecycle
onMounted(() => {
  console.log("Loading PT review for:", route.params.rujukan);
  // In real implementation, fetch data based on rujukan
});
</script>

<style scoped>
/* Enhanced styling */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 