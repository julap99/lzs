<!-- 
  RTMF SCREEN: PA-KF-KJ-03_03 (Position Approval)
  PURPOSE: Kelulusan akhir jawatan penolong amil oleh Ketua Divisyen
  DESCRIPTION: Final approval form for position changes with complete workflow display
  ROUTE: /BF-PA/KF/KJ/approve/[id]
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
            Kelulusan Akhir Jawatan Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">
            Semakan dan kelulusan akhir jawatan oleh Ketua Divisyen
          </p>
        </div>
      </div>
    </div>

    <!-- Main Approval Form -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:identification-card" class="w-5 h-5 mr-2" />
          Maklumat Perubahan Jawatan
        </h3>
      </template>
      
      <template #body>
        <!-- Category Context Section -->
        <rs-card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:tag" class="w-5 h-5 mr-2" />
              Maklumat Kategori
            </h3>
          </template>
          
          <template #body>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Penolong Amil</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {{ categoryData.kategoriPenolongAmil }}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan Kategori</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {{ categoryData.kodSingkatan }}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status Kategori</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    <rs-badge :variant="getStatusVariant(categoryData.status)">
                      {{ categoryData.status }}
                    </rs-badge>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Rujukan Jawatan</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                    {{ positionData.rujukan }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Position Changes Section -->
        <rs-card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:list-checks" class="w-5 h-5 mr-2" />
              Maklumat Perubahan Jawatan Yang Dibuat
            </h3>
          </template>
          
          <template #body>
            <div class="p-6">
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
                      
                      <p class="text-sm text-gray-700 mb-3">{{ change.description }}</p>
                      
                      <div class="text-sm space-y-1">
                        <div v-if="change.oldValue" class="flex items-center space-x-2">
                          <span class="font-medium">Nilai Sebelum:</span> {{ change.oldValue }}
                        </div>
                        <div v-if="change.newValue" class="flex items-center space-x-2">
                          <span class="font-medium">Nilai Selepas:</span> {{ change.newValue }}
                        </div>
                        <div v-if="change.oldValue && !change.newValue" class="flex items-center space-x-2">
                          <span class="font-medium">Nilai Dipadamkan:</span> {{ change.oldValue }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8 text-gray-500">
                <Icon name="ph:info" class="w-8 h-8 mx-auto mb-2" />
                <p>Tiada perubahan khusus untuk jawatan ini</p>
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
            <div class="p-6">
              <div class="space-y-4">
                <!-- Eksekutif Review -->
                <div class="flex items-start justify-between p-4">
                  <div class="flex items-start">
                    <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-gray-900">Eksekutif</h4>
                        <rs-badge variant="success">Selesai</rs-badge>
                      </div>
                      <p class="text-sm text-gray-700 mb-2">Sokongan eksekutif</p>
                      <div class="text-xs text-gray-600 space-y-1">
                        <p><strong>Disemak oleh:</strong> {{ previousRemarks.eksekutif.namaPenyokong }} (Eksekutif)</p>
                        <p><strong>Tarikh:</strong> {{ formatDate(previousRemarks.eksekutif.tarikhSokongan) }}</p>
                        <p><strong>Catatan:</strong> {{ previousRemarks.eksekutif.ulasan }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ketua Jabatan Review -->
                <div class="flex items-start justify-between p-4">
                  <div class="flex items-start">
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-gray-500 mt-1" />
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-gray-900">Ketua Jabatan</h4>
                        <rs-badge variant="success">Selesai</rs-badge>
                      </div>
                      <p class="text-sm text-gray-700 mb-2">Pengesahan ketua jabatan</p>
                      <div class="text-xs text-gray-600 space-y-1">
                        <p><strong>Disemak oleh:</strong> {{ previousRemarks.ketuaJabatan.namaPengesah }} (Ketua Jabatan)</p>
                        <p><strong>Tarikh:</strong> {{ formatDate(previousRemarks.ketuaJabatan.tarikhPengesahan) }}</p>
                        <p><strong>Catatan:</strong> {{ previousRemarks.ketuaJabatan.ulasan }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ketua Divisyen Review (Current) -->
                <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div class="flex items-start">
                    <Icon name="ph:star" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-orange-900">Ketua Divisyen</h4>
                        <rs-badge variant="warning">Dalam Proses</rs-badge>
                      </div>
                      <p class="text-sm text-orange-700 mb-2">Kelulusan akhir ketua divisyen</p>
                      <div class="text-xs text-orange-600 space-y-1">
                        <p><strong>Disemak oleh:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
                        <p><strong>Tarikh:</strong> {{ currentDate }}</p>
                        <p><strong>Status:</strong> Menunggu keputusan kelulusan akhir</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Approval Form -->
        <rs-card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
              Borang Kelulusan
            </h3>
          </template>
          
          <template #body>
            <div class="p-6">
              <FormKit
                type="form"
                @submit="handleApprovalSubmit"
                :loading="isSubmitting"
                :actions="false"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormKit
                    type="select"
                    name="approvalDecision"
                    label="Keputusan Kelulusan"
                    :options="approvalOptions"
                    validation="required"
                    help="Pilih keputusan kelulusan anda"
                  />

                  <FormKit
                    type="date"
                    name="approvalDate"
                    label="Tarikh Kelulusan"
                    :value="formData.approvalDate"
                    :disabled="true"
                    help="Tarikh semasa"
                  />
                </div>

                <div class="mb-6">
                  <FormKit
                    type="text"
                    name="approverName"
                    label="Nama Pelulus"
                    :value="formData.approverName"
                    :disabled="true"
                    help="Nama pelulus berdasarkan akaun semasa"
                  />
                </div>

                <div class="mb-6">
                  <FormKit
                    type="textarea"
                    name="approvalNotes"
                    label="Ulasan Kelulusan"
                    validation="required|length:10,500"
                    rows="4"
                    help="Berikan ulasan dan justifikasi untuk keputusan kelulusan"
                  />
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between items-center pt-6 border-t border-gray-200">
                  <rs-button
                    variant="secondary-outline"
                    @click="navigateTo('/BF-PA/KF/KJ')"
                    class="flex items-center"
                  >
                    <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
                    Kembali
                  </rs-button>
                  
                  <div class="flex space-x-3">
                    <rs-button
                      variant="danger"
                      @click="openConfirmationModal('tolak')"
                      :disabled="!isFormValid"
                      class="flex items-center"
                    >
                      <Icon name="ph:x" class="w-4 h-4 mr-2" />
                      Tolak
                    </rs-button>
                    <rs-button
                      variant="success"
                      @click="openConfirmationModal('luluskan')"
                      :disabled="!isFormValid"
                      class="flex items-center"
                    >
                      <Icon name="ph:check" class="w-4 h-4 mr-2" />
                      Luluskan
                    </rs-button>
                  </div>
                </div>
              </FormKit>
            </div>
          </template>
        </rs-card>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                   :class="confirmationData.action === 'luluskan' ? 'bg-green-100' : 'bg-red-100'">
                <Icon :name="confirmationData.action === 'luluskan' ? 'ph:check-circle' : 'ph:x-circle'" 
                      class="h-6 w-6" 
                      :class="confirmationData.action === 'luluskan' ? 'text-green-600' : 'text-red-600'" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Keputusan Akhir {{ confirmationData.action === 'luluskan' ? 'Kelulusan' : 'Penolakan' }}
                </h3>
                <div class="mt-4">
                  <p class="text-sm text-gray-500 mb-4">
                    {{ confirmationData.action === 'luluskan' 
                        ? 'Anda akan meluluskan perubahan ini. Status akan berubah kepada "Aktif" dan ianya akan berkuatkuasa dalam sistem.' 
                        : 'Anda akan menolak perubahan ini. Status akan berubah kepada "Tidak Aktif".' }}
                  </p>
                  
                  <div class="text-sm text-red-600 font-medium mb-4">
                    ⚠️ Amaran: Ini adalah keputusan akhir dan tidak boleh dibatalkan.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <rs-button
              :variant="confirmationData.action === 'luluskan' ? 'success' : 'danger'"
              class="w-full sm:w-auto sm:ml-3"
              @click="confirmAction"
              :loading="isSubmitting"
            >
              <Icon :name="confirmationData.action === 'luluskan' ? 'ph:check' : 'ph:x'" class="w-4 h-4 mr-2" />
              Ya, {{ confirmationData.action === 'luluskan' ? 'Luluskan' : 'Tolak' }}
            </rs-button>
            <rs-button
              variant="secondary-outline"
              class="mt-3 w-full sm:mt-0 sm:w-auto"
              @click="showConfirmationModal = false"
              :disabled="isSubmitting"
            >
              Batal
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Kelulusan Jawatan Penolong Amil",
});

const route = useRoute();

// Role-based access control
onMounted(() => {
  const currentUserRole = "ketua-divisyen"; // This would come from auth system
  if (currentUserRole !== "ketua-divisyen") {
    toast.error("Anda tidak mempunyai kebenaran untuk meluluskan jawatan");
    navigateTo('/BF-PA/KF/KJ');
  }
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Jawatan', path: '/BF-PA/KF/KJ' },
  { name: 'Kelulusan Ketua Divisyen', path: null }
];

// Form state
const isSubmitting = ref(false);

// Confirmation modal state
const showConfirmationModal = ref(false);
const confirmationData = ref({
  action: 'luluskan' // 'luluskan' or 'tolak'
});

// Form data
const formData = ref({
  approvalDecision: '',
  approvalDate: new Date().toISOString().split('T')[0], // Current date
  approvalNotes: '',
  approverName: 'Dato\' Muhammad Hassan Bin Abdul Rahman' // Mock current user name
});

// Mock data - would come from API in real app
const positionId = ref(1); // Mock position ID

const categoryData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
});

const positionData = ref({
  rujukan: "KJ-2024-001"
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
  eksekutif: {
    namaPenyokong: "Eksekutif User",
    tarikhSokongan: "2024-02-01",
    ulasan: "Penambahan jawatan Ketua Penolong Amil adalah perlu untuk menguatkan struktur organisasi dalam kategori Penolong Amil Fitrah. Kod singkatan KPA akan memudahkan pengenalan dan rujukan."
  },
  ketuaJabatan: {
    namaPengesah: "Ketua Jabatan User",
    tarikhPengesahan: "2024-02-03",
    ulasan: "Permohonan jawatan Ketua Penolong Amil telah disemak dan adalah selaras dengan keperluan organisasi. Struktur jawatan yang dicadangkan adalah sesuai dan disahkan untuk kelulusan."
  }
});

// Form validation
const isFormValid = computed(() => {
  return formData.value.approvalDecision && formData.value.approvalNotes;
});

// Approval options
const approvalOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Luluskan", value: "luluskan" },
  { label: "Tolak", value: "tolak" },
];

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

const handleApprovalSubmit = (formData) => {
  // Store form data for confirmation
  Object.assign(formData.value, formData);
  showConfirmationModal.value = true;
};

const openConfirmationModal = (action) => {
  confirmationData.value.action = action;
  formData.value.approvalDecision = action;
  showConfirmationModal.value = true;
};

const confirmAction = async () => {
  isSubmitting.value = true;
  
  try {
    // Determine new status based on decision
    const newStatus = formData.value.approvalDecision === 'luluskan' 
      ? 'Aktif' 
      : 'Tidak Aktif';
    
    // Log complete data for backend
    const approvalData = {
      positionId: positionId.value,
      approvalDecision: formData.value.approvalDecision,
      approvalNotes: formData.value.approvalNotes,
      approvalDate: formData.value.approvalDate,
      approverName: formData.value.approverName,
      newStatus: newStatus,
      approvedBy: "Ketua Divisyen User",
      approvedAt: new Date().toISOString(),
      tarikhKuatkuasa: newStatus === 'Aktif' ? formData.value.approvalDate : null,
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    const actionText = formData.value.approvalDecision === 'luluskan' ? 'diluluskan' : 'ditolak';
    toast.success(`Jawatan penolong amil berjaya ${actionText}`);
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    // Error approving position
    toast.error("Ralat semasa memproses kelulusan");
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};
</script> 