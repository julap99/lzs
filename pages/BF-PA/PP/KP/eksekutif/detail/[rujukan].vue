<!-- 
  RTMF SCREEN: PA-PP-KP-03_01
  PURPOSE: Sokongan kemaskini maklumat Perkhidmatan Penolong Amil oleh Eksekutif
  DESCRIPTION: Eksekutif support screen for service information update requests
  ROUTE: /BF-PA/PP/KP/eksekutif/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sokongan Kemaskini Maklumat Perkhidmatan</h1>
          <p class="text-gray-600 mt-1">Sokongan permintaan kemaskini maklumat perkhidmatan penolong amil</p>
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
            <rs-badge variant="info">Disemak PT</rs-badge>
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

    <!-- PT Review Information -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Maklumat Semakan PT</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan PT</label>
              <rs-badge variant="success">Lulus</rs-badge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Disemak Oleh</label>
              <p class="text-gray-900">{{ ptReview.reviewedBy }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Semakan</label>
              <p class="text-gray-900">{{ ptReview.reviewDate }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <rs-badge variant="info">Disemak PT</rs-badge>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Semakan PT</label>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-gray-900">{{ ptReview.remarks }}</p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Executive Support Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Sokongan Eksekutif</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan Sokongan *</label>
            <FormKit
              type="select"
              v-model="executiveSupport.decision"
              :options="decisionOptions"
              validation="required"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Sokongan</label>
            <FormKit
              type="textarea"
              v-model="executiveSupport.remarks"
              placeholder="Nyatakan catatan sokongan anda..."
              rows="4"
              outer-class="mb-0"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Disokong Oleh</label>
              <FormKit
                type="text"
                v-model="currentUser.name"
                readonly
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Sokongan</label>
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
        :disabled="isSubmitting || !executiveSupport.decision"
      >
        <Icon name="ph:x" class="w-4 h-4 mr-2" />
        Tolak
      </rs-button>
      <rs-button
        type="button"
        variant="primary"
        :disabled="isSubmitting || !executiveSupport.decision"
        @click="showSupportModal = true"
      >
        <Icon
          v-if="isSubmitting"
          name="ph:spinner"
          class="w-4 h-4 mr-2 animate-spin"
        />
        {{ isSubmitting ? 'Menghantar...' : 'Sokong' }}
      </rs-button>
    </div>

    <!-- Support Confirmation Modal -->
    <div v-if="showSupportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Sahkan Sokongan
          </h3>
          <p class="text-gray-600 mb-4">
            Adakah anda pasti untuk menyokong permintaan kemaskini maklumat perkhidmatan ini?
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
            @click="showSupportModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSupport"
            :loading="isSubmitting"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Sokong
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
  title: "Sokongan Kemaskini Maklumat Perkhidmatan - Eksekutif",
  description: "Sokongan permintaan kemaskini maklumat perkhidmatan penolong amil oleh Eksekutif",
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
    name: "Sokongan Eksekutif",
    type: "current",
    path: `/BF-PA/PP/KP/eksekutif/detail/${route.params.rujukan}`,
  },
]);

// Current user data (mock session token)
const currentUser = ref({
  name: "Dr. Aminah binti Hassan",
  role: "Eksekutif",
  id: "EXE001",
  department: "Pengurusan"
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
  submittedDate: "15/01/2024",
  status: "pt_reviewed"
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
  reviewDate: "16/01/2024",
  decision: "approved",
  remarks: "Permintaan kemaskini maklumat perkhidmatan adalah munasabah dan memenuhi kriteria yang ditetapkan. Sokongan diberikan untuk perubahan kategori dan institusi perkhidmatan."
});

// Executive Support form
const executiveSupport = ref({
  decision: "",
  remarks: "",
});

// State management
const isSubmitting = ref(false);
const showSupportModal = ref(false);
const showRejectModal = ref(false);

// Options for decision
const decisionOptions = [
  { label: "Sila pilih keputusan", value: "" },
  { label: "Sokong", value: "supported" },
  { label: "Tidak Sokong", value: "not_supported" },
  { label: "Perlu Maklumat Tambahan", value: "need_more_info" },
];

// Actions
const handleBack = () => {
  navigateTo("/BF-PA/PP/KP");
};

const confirmSupport = async () => {
  showSupportModal.value = false;
  await handleSupport();
};

const confirmReject = async () => {
  showRejectModal.value = false;
  await handleReject();
};

const handleSupport = async () => {
  try {
    isSubmitting.value = true;
    
    // In real implementation, submit to API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success notification
    alert(`Berjaya! Permintaan kemaskini maklumat perkhidmatan telah disokong. Rujukan: ${route.params.rujukan}`);
    
    // Navigate back to listing page
    navigateTo("/BF-PA/PP/KP");
    
  } catch (error) {
    alert("Ralat! Ralat berlaku semasa menyokong permintaan");
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
  console.log("Loading Executive support data for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles for Executive support screen */
</style> 