<!-- 
  RTMF SCREEN: PA-KF-KJ-05_01 (Position Verification)
  PURPOSE: Pengesahan jawatan penolong amil oleh Ketua Jabatan
  DESCRIPTION: Verification screen for Penolong Amil positions by Ketua Jabatan
  ROUTE: /BF-PA/KF/KJ/verify/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold flex items-center">
              <Icon name="ph:clipboard-text" class="mr-2" size="24" />
              Pengesahan Jawatan Penolong Amil
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Semakan dan pengesahan jawatan oleh Ketua Jabatan
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Category Context Section -->
        <rs-card class="mb-6 bg-gray-50 border-gray-300">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:tag" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Maklumat Kategori</h3>
            </div>
          </template>
          
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Penolong Amil</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ categoryData.kategoriPenolongAmil }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kod Singkatan Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ categoryData.kodSingkatan }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  <rs-badge :variant="getStatusVariant(categoryData.status)">
                    {{ categoryData.status }}
                  </rs-badge>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rujukan Jawatan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ positionData.rujukan }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Position Changes Section -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:list-checks" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Maklumat Perubahan Jawatan Yang Dibuat</h3>
            </div>
          </template>
          
          <template #body>
            <div v-if="changeLog.length > 0" class="space-y-4">
              <div v-for="(change, index) in changeLog" :key="index" class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <Icon 
                      :name="change.type === 'added' ? 'ph:plus-circle' : change.type === 'removed' ? 'ph:minus-circle' : 'ph:pencil-circle'" 
                      :class="change.type === 'added' ? 'text-green-600' : change.type === 'removed' ? 'text-red-600' : 'text-blue-600'"
                      size="20"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="text-sm font-medium text-gray-900">{{ change.section }}</span>
                      <rs-badge 
                        :variant="change.type === 'added' ? 'success' : change.type === 'removed' ? 'danger' : 'info'"
                        size="sm"
                      >
                        {{ change.type === 'added' ? 'Ditambah' : change.type === 'removed' ? 'Dipadamkan' : 'Diubah' }}
                      </rs-badge>
                    </div>
                    
                    <div class="text-sm text-gray-700 mb-2">
                      {{ change.description }}
                    </div>
                    
                    <div v-if="change.type === 'modified'" class="space-y-1">
                      <div class="text-sm text-gray-600">
                        <span class="font-medium">Nilai Lama:</span> {{ change.oldValue }}
                      </div>
                      <div class="text-sm text-gray-600">
                        <span class="font-medium">Nilai Baharu:</span> {{ change.newValue }}
                      </div>
                    </div>
                    
                    <div v-else-if="change.type === 'added'" class="text-sm text-gray-600">
                      <span class="font-medium">Nilai Baharu:</span> {{ change.newValue }}
                    </div>
                    
                    <div v-else-if="change.type === 'removed'" class="text-sm text-gray-600">
                      <span class="font-medium">Nilai Dipadamkan:</span> {{ change.oldValue }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="ph:info" class="w-8 h-8 mx-auto mb-2" />
              <p>Tiada perubahan khusus untuk jawatan ini</p>
            </div>
          </template>
        </rs-card>

        <!-- Previous Remarks Section -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:chat-text" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Ulasan Dari Eksekutif</h3>
            </div>
          </template>
          
          <template #body>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <Icon name="ph:user-circle" class="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div class="flex-1">
                  <div class="text-sm text-blue-900 font-medium mb-1">
                    Sokongan Eksekutif - {{ previousRemarks.namaPenyokong }}
                  </div>
                  <div class="text-sm text-blue-700 mb-2">
                    {{ formatDate(previousRemarks.tarikhSokongan) }}
                  </div>
                  <div class="text-sm text-blue-800 bg-white rounded px-3 py-2 border border-blue-200">
                    {{ previousRemarks.ulasan }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Verification Form -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:clipboard-text" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Borang Pengesahan</h3>
            </div>
          </template>
          
          <template #body>
            <FormKit
              type="form"
              @submit="handleVerificationSubmit"
              :loading="isSubmitting"
              :actions="false"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormKit
                  type="select"
                  name="verificationDecision"
                  label="Keputusan Pengesahan"
                  :options="verificationOptions"
                  validation="required"
                  help="Pilih keputusan pengesahan anda"
                />

                <FormKit
                  type="date"
                  name="verificationDate"
                  label="Tarikh Pengesahan"
                  :value="formData.verificationDate"
                  :disabled="true"
                  help="Tarikh pengesahan akan ditetapkan secara automatik"
                />

                <FormKit
                  type="text"
                  name="verifierName"
                  label="Nama Pengesah"
                  :value="formData.verifierName"
                  :disabled="true"
                  help="Nama pengesah berdasarkan akaun semasa"
                />
              </div>

              <div class="mb-6">
                <FormKit
                  type="textarea"
                  name="verificationNotes"
                  label="Ulasan Pengesahan"
                  validation="required|length:10,500"
                  rows="4"
                  help="Berikan ulasan dan justifikasi untuk keputusan pengesahan"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                <rs-button
                  variant="secondary"
                  @click="navigateTo('/BF-PA/KF/KJ')"
                  class="flex items-center"
                >
                  <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
                  Kembali
                </rs-button>
                
                <div class="flex space-x-3">
                  <rs-button
                    variant="danger"
                    @click="showConfirmationModal = true"
                    :disabled="!isFormValid"
                    class="flex items-center"
                  >
                    <Icon name="ph:x" class="w-4 h-4 mr-2" />
                    Tolak
                  </rs-button>
                  
                  <rs-button
                    variant="success"
                    @click="showConfirmationModal = true"
                    :disabled="!isFormValid"
                    class="flex items-center"
                  >
                    <Icon name="ph:check" class="w-4 h-4 mr-2" />
                    Sahkan
                  </rs-button>
                </div>
              </div>
            </FormKit>
          </template>
        </rs-card>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <Icon name="ph:warning" class="w-6 h-6 text-orange-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900">Pengesahan Tindakan</h3>
          </div>
          
          <p class="text-gray-600 mb-4">
            Adakah anda pasti untuk melakukan tindakan ini? Tindakan ini tidak boleh dibatalkan.
          </p>

          <div class="flex justify-end space-x-3">
            <rs-button
              variant="secondary"
              @click="showConfirmationModal = false"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              @click="confirmAction"
              :loading="isSubmitting"
            >
              Ya, Teruskan
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { formatDate } from "~/utils/dateFormatter";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Pengesahan Jawatan Penolong Amil",
});

const route = useRoute();
const positionId = route.params.id;

const breadcrumb = [
  { label: 'Laman Utama', to: '/' },
  { label: 'Modul BF-PA', to: '/BF-PA' },
  { label: 'Konfigurasi', to: '/BF-PA/KF' },
  { label: 'Maklumat Jawatan', to: '/BF-PA/KF/KJ' },
  { label: 'Pengesahan Ketua Jabatan', to: null }
];

const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

// Verification options
const verificationOptions = [
  { label: "Sila pilih keputusan...", value: "" },
  { label: "Sahkan", value: "sahkan" },
  { label: "Tolak", value: "tolak" },
];

// Form data
const formData = ref({
  verificationDate: new Date().toISOString().split('T')[0],
  verifierName: "Ketua Jabatan User (Mock)",
});

// Mock position data
const positionData = ref({
  rujukan: "KJ-2024-001",
  namaJawatan: "Ketua Penolong Amil",
  kodSingkatan: "KPA",
  status: "Menunggu Pengesahan",
});

// Mock category data for context
const categoryData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
});

// Mock change log
const changeLog = ref([
  {
    type: "added",
    section: "Jawatan dalam Kategori",
    description: "Ditambah: Penolong Amil Eksekutif",
    oldValue: null,
    newValue: "Penolong Amil Eksekutif (PAE)"
  },
  {
    type: "modified",
    section: "Jawatan dalam Kategori", 
    description: "Diubah: Nama Jawatan baris 1",
    oldValue: "Ketua Penolong Amil Fitrah",
    newValue: "Ketua Penolong Amil"
  },
  {
    type: "modified",
    section: "Jawatan dalam Kategori",
    description: "Diubah: Kod Singkatan baris 1",
    oldValue: "KPAF",
    newValue: "KPA"
  }
]);

// Mock previous remarks
const previousRemarks = ref({
  namaPenyokong: "Eksekutif User",
  tarikhSokongan: "2024-02-01",
  ulasan: "Penambahan jawatan Ketua Penolong Amil adalah perlu untuk menguatkan struktur organisasi dalam kategori Penolong Amil Fitrah. Kod singkatan KPA akan memudahkan pengenalan dan rujukan."
});

// Form validation
const isFormValid = computed(() => {
  return formData.value.verificationDecision && formData.value.verificationNotes;
});

// Helper functions
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info',
  };
  return variants[status] || 'disabled';
};

const handleVerificationSubmit = (formData) => {
  // Store form data for confirmation
  Object.assign(formData.value, formData);
  showConfirmationModal.value = true;
};

const confirmAction = async () => {
  isSubmitting.value = true;
  
  try {
    // Determine new status based on decision
    const newStatus = formData.value.verificationDecision === 'sahkan' 
      ? 'Menunggu Kelulusan' 
      : 'Tidak Aktif';
    
    // Log complete data for backend
    const verificationData = {
      positionId: positionId,
      verificationDecision: formData.value.verificationDecision,
      verificationNotes: formData.value.verificationNotes,
      verificationDate: formData.value.verificationDate,
      verifierName: formData.value.verifierName,
      newStatus: newStatus,
      verifiedBy: "Ketua Jabatan User",
      verifiedAt: new Date().toISOString(),
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    const actionText = formData.value.verificationDecision === 'sahkan' ? 'disahkan' : 'ditolak';
    toast.success(`Jawatan penolong amil berjaya ${actionText}`);
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    // Error verifying position
    toast.error("Ralat semasa memproses pengesahan");
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};
</script> 