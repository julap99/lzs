<!-- 
  RTMF SCREEN: PA-PP-KP-04_01
  PURPOSE: Pengesahan kemaskini maklumat Perkhidmatan Penolong Amil oleh Ketua Jabatan
  DESCRIPTION: Ketua Jabatan confirmation screen for service information update requests
  ROUTE: /BF-PA/PP/KP/ketua-jabatan/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pengesahan Kemaskini Maklumat Perkhidmatan</h1>
          <p class="text-gray-600 mt-1">Pengesahan permintaan kemaskini maklumat perkhidmatan penolong amil</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="secondary-outline"
            @click="handleBack"
          >
            Kembali
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Request Information -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Permintaan</h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rujukan</label>
            <p class="text-gray-900 font-medium">{{ request.rujukan }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <rs-badge variant="info">Disokong Eksekutif</rs-badge>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dihantar Oleh</label>
            <p class="text-gray-900">{{ request.submittedBy }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Permintaan</label>
            <p class="text-gray-900">{{ request.submittedDate }}</p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Penolong Amil Information -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Penolong Amil</h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <p class="text-gray-900">{{ penolongAmil.alamat }}</p>
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

    <!-- Ketua Jabatan Confirmation Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Pengesahan Ketua Jabatan</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan Pengesahan *</label>
            <FormKit
              type="select"
              v-model="ketuaJabatanConfirmation.decision"
              :options="decisionOptions"
              validation="required"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Pengesahan</label>
            <FormKit
              type="textarea"
              v-model="ketuaJabatanConfirmation.remarks"
              placeholder="Nyatakan catatan pengesahan anda..."
              rows="4"
              outer-class="mb-0"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Disahkan Oleh</label>
              <FormKit
                type="text"
                v-model="currentUser.name"
                readonly
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Pengesahan</label>
              <FormKit
                type="text"
                v-model="currentDate"
                readonly
                outer-class="mb-0"
              />
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Submit Buttons -->
    <div class="flex justify-end gap-4 mt-6">
      <rs-button
        type="button"
        variant="secondary-outline"
        @click="handleBack"
        :disabled="isSubmitting"
      >
        Batal
      </rs-button>
      <rs-button
        type="button"
        variant="danger"
        @click="showRejectModal = true"
        :disabled="isSubmitting || !ketuaJabatanConfirmation.decision"
      >
        <Icon name="ph:x" class="w-4 h-4 mr-2" />
        Tolak
      </rs-button>
      <rs-button
        type="button"
        variant="primary"
        :disabled="isSubmitting || !ketuaJabatanConfirmation.decision"
        @click="showConfirmModal = true"
      >
        <Icon
          v-if="isSubmitting"
          name="ph:spinner"
          class="w-4 h-4 mr-2 animate-spin"
        />
        {{ isSubmitting ? 'Menghantar...' : 'Sahkan' }}
      </rs-button>
    </div>

    <!-- Confirm Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Sahkan Pengesahan
          </h3>
          <p class="text-gray-600 mb-4">
            Adakah anda pasti untuk mengesahkan permintaan kemaskini maklumat perkhidmatan ini?
          </p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-green-800">
              <strong>Penolong Amil:</strong> {{ penolongAmil.nama }}
            </p>
            <p class="text-sm text-green-800">
              <strong>Kategori Baharu:</strong> {{ request.newKategori }}
            </p>
            <p class="text-sm text-green-800">
              <strong>Institusi Baharu:</strong> {{ request.newInstitusi }}
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmApproval"
            :loading="isSubmitting"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Sahkan
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Sahkan Penolakan
          </h3>
          <p class="text-gray-600 mb-4">
            Adakah anda pasti untuk menolak permintaan kemaskini maklumat perkhidmatan ini?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-800">
              <strong>Penolong Amil:</strong> {{ penolongAmil.nama }}
            </p>
            <p class="text-sm text-red-800">
              <strong>Kategori Baharu:</strong> {{ request.newKategori }}
            </p>
            <p class="text-sm text-red-800">
              <strong>Institusi Baharu:</strong> {{ request.newInstitusi }}
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showRejectModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="confirmReject"
            :loading="isSubmitting"
          >
            <Icon name="ph:x" class="w-4 h-4 mr-2" />
            Ya, Tolak
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Pengesahan Kemaskini Maklumat Perkhidmatan - Ketua Jabatan",
  description: "Pengesahan permintaan kemaskini maklumat perkhidmatan penolong amil oleh Ketua Jabatan",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pengurusan Penolong Amil",
    type: "link",
    path: "/BF-PA/PP",
  },
  {
    name: "Kemaskini Maklumat Perkhidmatan",
    type: "link",
    path: "/BF-PA/PP/KP",
  },
  {
    name: "Pengesahan Ketua Jabatan",
    type: "current",
    path: `/BF-PA/PP/KP/ketua-jabatan/detail/${route.params.rujukan}`,
  },
]);

// Current user data (mock session token)
const currentUser = ref({
  name: "Tuan Haji Mohd Zain bin Abdullah",
  role: "Ketua Jabatan",
  id: "KJ001",
  department: "Pengurusan Penolong Amil"
});

// Current date
const currentDate = ref(new Date().toLocaleDateString('ms-MY'));

// Mock request data
const request = ref({
  rujukan: route.params.rujukan,
  namaPenolongAmil: "Ahmad bin Abdullah",
  noKP: "901231012345",
  currentKategori: "Penolong Amil Fitrah",
  newKategori: "Penolong Amil Kariah",
  currentInstitusi: "Masjid Wilayah Persekutuan",
  newInstitusi: "Masjid Negeri Selangor",
  reason: "Pindah tempat tinggal ke kawasan baru",
  supportingDocuments: "surat_pindah_ahmad.pdf",
  submittedBy: "Siti Fatimah binti Omar",
  submittedDate: "15-01-2024",
  status: "executive_supported"
});

// Mock Penolong Amil data
const penolongAmil = ref({
  nama: "Ahmad bin Abdullah",
  noKP: "901231012345",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  alamat: "No. 123, Jalan Utama, Taman Seri Indah, 50000 Kuala Lumpur",
  status: "Aktif"
});

// Mock PT Review data
const ptReview = ref({
  reviewedBy: "Ustaz Haitham Ismail",
  reviewDate: "16-01-2024",
  decision: "approved",
  remarks: "Permintaan kemaskini maklumat perkhidmatan adalah munasabah dan memenuhi kriteria yang ditetapkan. Sokongan diberikan untuk perubahan kategori dan institusi perkhidmatan."
});

// Mock Executive Support data
const executiveSupport = ref({
  supportedBy: "Dr. Aminah binti Hassan",
  supportDate: "17-01-2024",
  decision: "supported",
  remarks: "Sokongan diberikan berdasarkan justifikasi yang kukuh dan memenuhi keperluan organisasi. Perubahan ini akan meningkatkan keberkesanan perkhidmatan penolong amil."
});

// Mock Warning Letter History data
const warningLetterHistory = ref([
  {
    id: 1,
    date: "10-01-2024",
    sentBy: "Ustaz Haitham Ismail",
    reason: "Tidak menghantar laporan bulanan tepat waktu",
    notes: "Penyelesaian masalah diberikan dan penolong amil diinstruksikan untuk menghantar laporan bulanan tepat waktu.",
    status: "resolved",
    attachments: ["laporan_bulanan_1.pdf"]
  },
  {
    id: 2,
    date: "15-01-2024",
    sentBy: "Siti Fatimah binti Omar",
    reason: "Tidak menghantar laporan bulanan tepat waktu",
    notes: "Penyelesaian masalah diberikan dan penolong amil diinstruksikan untuk menghantar laporan bulanan tepat waktu.",
    status: "resolved",
    attachments: ["laporan_bulanan_2.pdf"]
  }
]);

// Mock Termination Service History data
const terminationHistory = ref([
  {
    id: 1,
    date: "20-01-2024",
    initiatedBy: "Siti Fatimah binti Omar",
    reason: "Tidak menghantar laporan bulanan tepat waktu",
    notes: "Penyelesaian masalah diberikan dan penolong amil diinstruksikan untuk menghantar laporan bulanan tepat waktu.",
    status: "approved",
    supportingDocuments: ["surat_penolakan_laporan.pdf"],
    approvalDate: "22-01-2024",
    approvedBy: "Ustaz Haitham Ismail"
  }
]);

// Ketua Jabatan Confirmation form
const ketuaJabatanConfirmation = ref({
  decision: "",
  remarks: "",
});

// State management
const isSubmitting = ref(false);
const showConfirmModal = ref(false);
const showRejectModal = ref(false);

// Options for decision
const decisionOptions = [
  { label: "Sila pilih keputusan", value: "" },
  { label: "Sahkan", value: "confirmed" },
  { label: "Tidak Sahkan", value: "not_confirmed" },
];

// Actions
const handleBack = () => {
  navigateTo("/BF-PA/PP/KP");
};

const confirmApproval = async () => {
  showConfirmModal.value = false;
  await handleConfirm();
};

const confirmReject = async () => {
  showRejectModal.value = false;
  await handleReject();
};

const handleConfirm = async () => {
  try {
    isSubmitting.value = true;
    
    // In real implementation, submit to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success notification
    alert(`Berjaya! Permintaan kemaskini maklumat perkhidmatan telah disahkan. Rujukan: ${route.params.rujukan}`);
    
    // Navigate back to listing page
    navigateTo("/BF-PA/PP/KP");
    
  } catch (error) {
    alert("Ralat! Ralat berlaku semasa mengesahkan permintaan");
  } finally {
    isSubmitting.value = false;
  }
};

const handleReject = async () => {
  try {
    isSubmitting.value = true;
    
    // In real implementation, submit to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success notification
    alert(`Berjaya! Permintaan kemaskini maklumat perkhidmatan telah ditolak. Rujukan: ${route.params.rujukan}`);
    
    // Navigate back to listing page
    navigateTo("/BF-PA/PP/KP");
    
  } catch (error) {
    alert("Ralat! Ralat berlaku semasa menolak permintaan");
  } finally {
    isSubmitting.value = false;
  }
};

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

onMounted(() => {
  // In real implementation, fetch request data based on rujukan
  console.log("Loading Ketua Jabatan confirmation data for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles for Ketua Jabatan confirmation screen */
</style> 