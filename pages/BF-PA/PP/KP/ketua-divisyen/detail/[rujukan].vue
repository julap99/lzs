<!-- 
  RTMF SCREEN: PA-PP-KP-05_01
  PURPOSE: Kelulusan akhir kemaskini maklumat Perkhidmatan Penolong Amil oleh Ketua Divisyen
  DESCRIPTION: Ketua Divisyen final approval screen for service information update requests
  ROUTE: /BF-PA/PP/KP/ketua-divisyen/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Kelulusan Akhir Kemaskini Maklumat Perkhidmatan</h1>
          <p class="text-gray-600 mt-1">Kelulusan akhir permintaan kemaskini maklumat perkhidmatan penolong amil</p>
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
            <rs-badge variant="info">Disahkan Jabatan</rs-badge>
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

    <!-- Service Information Changes -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Perubahan Maklumat Perkhidmatan</h3>
      </template>
      <template #body>
        <div class="space-y-6">
          <!-- Kategori Changes -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3">Kategori Perkhidmatan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Semasa</label>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-gray-900">{{ request.currentKategori }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Baharu</label>
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-blue-900 font-medium">{{ request.newKategori }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Institusi Changes -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3">Institusi Perkhidmatan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Institusi Semasa</label>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-gray-900">{{ request.currentInstitusi }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Institusi Baharu</label>
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-blue-900 font-medium">{{ request.newInstitusi }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3">Maklumat Tambahan</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sebab Permintaan</label>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-gray-900">{{ request.reason }}</p>
                </div>
              </div>
              <div v-if="request.supportingDocuments">
                <label class="block text-sm font-medium text-gray-700 mb-1">Dokumen Sokongan</label>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-gray-900">{{ request.supportingDocuments }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Complete Review History -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Sejarah Semakan Lengkap</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <!-- PT Review -->
          <div class="border-l-4 border-green-500 pl-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">Semakan PT</h4>
              <rs-badge variant="success">Selesai</rs-badge>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-600">Disemak oleh:</span>
                <span class="text-gray-900 ml-2">{{ ptReview.reviewedBy }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tarikh:</span>
                <span class="text-gray-900 ml-2">{{ ptReview.reviewDate }}</span>
              </div>
            </div>
            <div class="mt-2">
              <span class="text-gray-600">Catatan:</span>
              <p class="text-gray-900 mt-1">{{ ptReview.remarks }}</p>
            </div>
          </div>

          <!-- Executive Support -->
          <div class="border-l-4 border-green-500 pl-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">Sokongan Eksekutif</h4>
              <rs-badge variant="success">Selesai</rs-badge>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-600">Disokong oleh:</span>
                <span class="text-gray-900 ml-2">{{ executiveSupport.supportedBy }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tarikh:</span>
                <span class="text-gray-900 ml-2">{{ executiveSupport.supportDate }}</span>
              </div>
            </div>
            <div class="mt-2">
              <span class="text-gray-600">Catatan:</span>
              <p class="text-gray-900 mt-1">{{ executiveSupport.remarks }}</p>
            </div>
          </div>

          <!-- Ketua Jabatan Confirmation -->
          <div class="border-l-4 border-green-500 pl-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">Pengesahan Ketua Jabatan</h4>
              <rs-badge variant="success">Selesai</rs-badge>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-600">Disahkan oleh:</span>
                <span class="text-gray-900 ml-2">{{ ketuaJabatanConfirmation.confirmedBy }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tarikh:</span>
                <span class="text-gray-900 ml-2">{{ ketuaJabatanConfirmation.confirmDate }}</span>
              </div>
            </div>
            <div class="mt-2">
              <span class="text-gray-600">Catatan:</span>
              <p class="text-gray-900 mt-1">{{ ketuaJabatanConfirmation.remarks }}</p>
            </div>
          </div>

          <!-- Current Step -->
          <div class="border-l-4 border-orange-500 pl-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">Kelulusan Akhir Ketua Divisyen</h4>
              <rs-badge variant="warning">Dalam Proses</rs-badge>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-600">Diluluskan oleh:</span>
                <span class="text-gray-900 ml-2">{{ currentUser.name }}</span>
              </div>
              <div>
                <span class="text-gray-600">Tarikh:</span>
                <span class="text-gray-900 ml-2">{{ currentDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Ketua Divisyen Final Approval Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Kelulusan Akhir Ketua Divisyen</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan Kelulusan *</label>
            <FormKit
              type="select"
              v-model="ketuaDivisyenApproval.decision"
              :options="decisionOptions"
              validation="required"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Kelulusan</label>
            <FormKit
              type="textarea"
              v-model="ketuaDivisyenApproval.remarks"
              placeholder="Nyatakan catatan kelulusan anda..."
              rows="4"
              outer-class="mb-0"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Diluluskan Oleh</label>
              <FormKit
                type="text"
                v-model="currentUser.name"
                readonly
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kelulusan</label>
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
        :disabled="isSubmitting || !ketuaDivisyenApproval.decision"
      >
        <Icon name="ph:x" class="w-4 h-4 mr-2" />
        Tolak
      </rs-button>
      <rs-button
        type="button"
        variant="primary"
        :disabled="isSubmitting || !ketuaDivisyenApproval.decision"
        @click="showApproveModal = true"
      >
        <Icon
          v-if="isSubmitting"
          name="ph:spinner"
          class="w-4 h-4 mr-2 animate-spin"
        />
        {{ isSubmitting ? 'Menghantar...' : 'Lulus' }}
      </rs-button>
    </div>

    <!-- Approve Confirmation Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Sahkan Kelulusan Akhir
          </h3>
          <p class="text-gray-600 mb-4">
            Adakah anda pasti untuk meluluskan permintaan kemaskini maklumat perkhidmatan ini?
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
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-yellow-800">
              <strong>Nota:</strong> Ini adalah kelulusan akhir. Permintaan akan dilaksanakan selepas kelulusan ini.
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showApproveModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmApprove"
            :loading="isSubmitting"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Lulus
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
  title: "Kelulusan Akhir Kemaskini Maklumat Perkhidmatan - Ketua Divisyen",
  description: "Kelulusan akhir permintaan kemaskini maklumat perkhidmatan penolong amil oleh Ketua Divisyen",
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
    name: "Kelulusan Akhir Ketua Divisyen",
    type: "current",
    path: `/BF-PA/PP/KP/ketua-divisyen/detail/${route.params.rujukan}`,
  },
]);

// Current user data (mock session token)
const currentUser = ref({
  name: "Datuk Haji Ismail bin Ahmad",
  role: "Ketua Divisyen",
  id: "KD001",
  division: "Pengurusan Penolong Amil"
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
  status: "department_confirmed"
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

// Mock Ketua Jabatan Confirmation data
const ketuaJabatanConfirmation = ref({
  confirmedBy: "Tuan Haji Mohd Zain bin Abdullah",
      confirmDate: "18-01-2024",
  decision: "confirmed",
  remarks: "Pengesahan diberikan berdasarkan semakan menyeluruh dan memenuhi semua keperluan organisasi. Perubahan ini adalah wajar dan akan meningkatkan keberkesanan perkhidmatan."
});

// Ketua Divisyen Approval form
const ketuaDivisyenApproval = ref({
  decision: "",
  remarks: "",
});

// State management
const isSubmitting = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);

// Options for decision
const decisionOptions = [
  { label: "Sila pilih keputusan", value: "" },
  { label: "Lulus", value: "approved" },
  { label: "Tidak Lulus", value: "rejected" },
];

// Actions
const handleBack = () => {
  navigateTo("/BF-PA/PP/KP");
};

const confirmApprove = async () => {
  showApproveModal.value = false;
  await handleApprove();
};

const confirmReject = async () => {
  showRejectModal.value = false;
  await handleReject();
};

const handleApprove = async () => {
  try {
    isSubmitting.value = true;
    
    // In real implementation, submit to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success notification
    alert(`Berjaya! Permintaan kemaskini maklumat perkhidmatan telah diluluskan. Rujukan: ${route.params.rujukan}`);
    
    // Navigate back to listing page
    navigateTo("/BF-PA/PP/KP");
    
  } catch (error) {
    alert("Ralat! Ralat berlaku semasa meluluskan permintaan");
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

onMounted(() => {
  // In real implementation, fetch request data based on rujukan
  console.log("Loading Ketua Divisyen approval data for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles for Ketua Divisyen approval screen */
</style> 