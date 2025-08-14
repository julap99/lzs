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

    <!-- Enhanced Service Information Changes -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:arrows-left-right" class="w-5 h-5 mr-2" />
          Perubahan Maklumat Perkhidmatan
        </h3>
      </template>
      <template #body>
        <div class="space-y-6">
          <!-- Kategori Changes -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:briefcase" class="w-4 h-4 mr-2" />
              Kategori Perkhidmatan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Semasa</label>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
            <h4 class="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:buildings" class="w-4 h-4 mr-2" />
              Institusi Perkhidmatan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Institusi Semasa</label>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
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

          <!-- Tarikh Mula Changes -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:calendar" class="w-4 h-4 mr-2" />
              Tarikh Mula Perkhidmatan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Semasa</label>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-gray-900">{{ request.currentTarikhMula }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Baharu</label>
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p class="text-blue-900 font-medium">{{ request.newTarikhMula }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:note" class="w-4 h-4 mr-2" />
              Maklumat Tambahan
            </h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sebab Permintaan</label>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-gray-900">{{ request.reason }}</p>
                </div>
              </div>
              <div v-if="request.supportingDocuments">
                <label class="block text-sm font-medium text-gray-700 mb-1">Dokumen Sokongan</label>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div class="flex items-center">
                    <Icon name="ph:file-text" class="w-4 h-4 text-gray-500 mr-2" />
                    <span class="text-gray-900">{{ request.supportingDocuments }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Enhanced PT Review Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
          Semakan PT
        </h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan Semakan *</label>
            <FormKit
              type="select"
              v-model="ptReview.decision"
              :options="decisionOptions"
              validation="required"
              outer-class="mb-0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Semakan</label>
            <FormKit
              type="textarea"
              v-model="ptReview.remarks"
              placeholder="Nyatakan catatan semakan anda..."
              rows="4"
              outer-class="mb-0"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Disemak Oleh</label>
              <FormKit
                type="text"
                v-model="currentUser.name"
                readonly
                outer-class="mb-0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Semakan</label>
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

    <!-- Enhanced Submit Buttons -->
    <div class="flex justify-end gap-4 mt-6">
      <rs-button
        type="button"
        variant="secondary-outline"
        @click="handleBack"
        :disabled="isSubmitting"
        class="flex items-center"
      >
        <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
        Batal
      </rs-button>
      <rs-button
        type="button"
        variant="primary"
        :disabled="isSubmitting || !isFormValid"
        @click="showConfirmationModal = true"
        class="flex items-center"
      >
        <Icon name="ph:check" class="w-4 h-4 mr-2" />
        {{ isSubmitting ? 'Menghantar...' : 'Hantar Keputusan' }}
      </rs-button>
    </div>

    <!-- Enhanced Confirmation Modal -->
    <rs-modal v-model="showConfirmationModal" size="lg">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:warning-circle" class="w-6 h-6 text-warning mr-3" />
          <h3 class="text-lg font-semibold text-gray-900">Sahkan Keputusan Semakan</h3>
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-900 mb-2">Maklumat Keputusan</h4>
                <div class="space-y-2 text-sm text-blue-800">
                  <p><strong>Penolong Amil:</strong> {{ penolongAmil.nama }}</p>
                  <p><strong>Keputusan:</strong> {{ getDecisionLabel(ptReview.decision) }}</p>
                  <p v-if="ptReview.remarks"><strong>Catatan:</strong> {{ ptReview.remarks }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start">
              <Icon name="ph:warning" class="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 class="font-medium text-yellow-900 mb-2">Peringatan</h4>
                <p class="text-sm text-yellow-800">
                  Keputusan ini akan dihantar kepada Eksekutif untuk sokongan seterusnya. 
                  Anda tidak akan dapat mengubah keputusan ini selepas dihantar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmationModal = false"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="flex items-center"
          >
            <Icon v-if="isSubmitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
            <Icon v-else name="ph:check" class="w-4 h-4 mr-2" />
            {{ isSubmitting ? 'Menghantar...' : 'Ya, Hantar Keputusan' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Enhanced Success Notification -->
    <div v-if="showSuccessNotification" class="fixed top-4 right-4 z-50">
      <rs-card class="shadow-lg border-l-4 border-success">
        <template #body>
          <div class="flex items-center">
            <Icon name="ph:check-circle" class="w-5 h-5 text-success mr-3" />
            <div>
              <div class="font-medium text-gray-900">Keputusan Berjaya Dihantar</div>
              <div class="text-sm text-gray-600">Keputusan semakan PT telah dihantar kepada Eksekutif untuk sokongan seterusnya.</div>
            </div>
            <button @click="hideSuccessNotification" class="ml-4 text-gray-400 hover:text-gray-600">
              <Icon name="ph:x" class="w-4 h-4" />
            </button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

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

// Enhanced reactive data
const showConfirmationModal = ref(false);
const showSuccessNotification = ref(false);
const isSubmitting = ref(false);

// Enhanced current user and date
const currentUser = ref({
  name: "Siti Fatimah binti Omar",
  role: "PT",
  id: "PT001",
});

const currentDate = ref(new Date().toLocaleDateString('ms-MY'));

// Enhanced options
const decisionOptions = [
  { label: "Sila Pilih Keputusan", value: "" },
  { label: "Lulus", value: "approve" },
  { label: "Tolak", value: "reject" },
];

// Enhanced mock data
const request = ref({
  rujukan: "KP-2024-001",
  currentKategori: "Penolong Amil Fitrah",
  newKategori: "Penolong Amil Kariah",
  currentInstitusi: "Masjid Al-Hidayah",
  newInstitusi: "Surau Al-Amin",
      currentTarikhMula: "15-01-2023",
    newTarikhMula: "01-02-2024",
  reason: "Pindah tempat tinggal dan perubahan kategori perkhidmatan",
  supportingDocuments: "surat_permintaan.pdf",
  submittedBy: "Ahmad bin Abdullah",
  submittedDate: "15-01-2024",
});

const penolongAmil = ref({
  nama: "Ahmad bin Abdullah",
  noKP: "901231012345",
  emel: "ahmad.abdullah@email.com",
  telefon: "012-3456789",
  alamat: "No. 123, Jalan Utama, Taman Seri, 43000 Kajang, Selangor",
});

const ptReview = ref({
  decision: "",
  remarks: "",
  reviewedBy: "Siti Fatimah binti Omar",
  reviewDate: "16-01-2024",
});

// Enhanced computed properties
const isFormValid = computed(() => {
  return ptReview.value.decision && ptReview.value.decision !== "";
});

// Enhanced helper functions
const getDecisionLabel = (decision) => {
  const labels = {
    approve: "Lulus",
    reject: "Tolak",
    need_more_info: "Telah Disemak dan Perlu Maklumat Tambahan",
  };
  return labels[decision] || decision;
};

// Enhanced methods
const handleBack = () => {
  navigateTo('/BF-PA/PP/KP');
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showConfirmationModal.value = false;
    showSuccessNotification.value = true;
    
    // Navigate back to listing page after a delay
    setTimeout(() => {
      navigateTo('/BF-PA/PP/KP');
    }, 3000);
    
  } catch (error) {
    console.error('Error submitting review:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const hideSuccessNotification = () => {
  showSuccessNotification.value = false;
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