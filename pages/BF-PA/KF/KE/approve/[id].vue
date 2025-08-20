<!-- 
  RTMF SCREEN: PA-KF-KE-01_06 (Approval Form)
  PURPOSE: Kelulusan elaun penolong amil oleh Ketua Divisyen
  DESCRIPTION: Approval form for Penolong Amil allowance by Ketua Divisyen
  ROUTE: /BF-PA/KF/KE/approve/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:check" class="w-6 h-6 mr-3 text-primary" />
            Kelulusan Elaun Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Kelulusan elaun penolong amil oleh Ketua Divisyen</p>
        </div>
      </div>
    </div>

    <!-- Category Information for Context -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:tag" class="w-5 h-5 mr-2" />
            Maklumat Kategori
          </h3>
          <rs-badge variant="info">
            Menunggu Kelulusan
          </rs-badge>
        </div>
      </template>
      <template #body>
        <div class="p-6">
          <p class="text-sm text-gray-600 mb-4">
            Maklumat elaun yang sedang dikemaskini adalah untuk kategori berikut:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Penolong Amil</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-semibold">
                {{ categoryData.kategoriPenolongAmil }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kod Singkatan</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ categoryData.kodSingkatan }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Kategori</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                <rs-badge :variant="categoryData.status === 'Aktif' ? 'success' : 'secondary'">
                  {{ categoryData.status }}
                </rs-badge>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh Kuatkuasa Kategori</label>
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ formatDate(categoryData.tarikhKuatkuasa) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Changes Made Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:git-diff" class="w-5 h-5 mr-2" />
          Maklumat Perubahan Elaun Yang Dibuat
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div v-if="changeLog.length === 0" class="text-center py-8 text-gray-500">
            <Icon name="ph:equals" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Tiada perubahan dibuat pada data</p>
          </div>
          <div v-else class="space-y-4">
            <div v-for="(change, index) in changeLog" :key="index" 
                 class="border rounded-lg p-4"
                 :class="{
                   'border-green-200 bg-green-50': change.type === 'added',
                   'border-blue-200 bg-blue-50': change.type === 'modified',
                   'border-red-200 bg-red-50': change.type === 'removed'
                 }">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <rs-badge 
                      :variant="change.type === 'added' ? 'success' : change.type === 'modified' ? 'info' : 'danger'"
                      size="sm"
                      class="mr-2"
                    >
                      {{ change.type === 'added' ? 'DITAMBAH' : change.type === 'modified' ? 'DIUBAH' : 'DIPADAMKAN' }}
                    </rs-badge>
                    <span class="text-sm font-medium text-gray-700">{{ change.section }}</span>
                  </div>
                  <p class="text-sm text-gray-900 font-medium mb-2">{{ change.description }}</p>
                  <div class="text-sm">
                    <div v-if="change.oldValue" class="mb-1">
                      <span class="text-gray-600">Sebelum:</span>
                      <span class="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{{ change.oldValue }}</span>
                    </div>
                    <div v-if="change.newValue">
                      <span class="text-gray-600">Selepas:</span>
                      <span class="ml-2 font-mono px-2 py-1 rounded"
                            :class="change.type === 'added' ? 'bg-green-100 text-green-800' : change.type === 'modified' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'">
                        {{ change.newValue }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Previous Remarks Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:chat-text" class="w-5 h-5 mr-2" />
          Ulasan Terdahulu
        </h3>
      </template>
      <template #body>
        <!-- Eksekutif Remarks -->
        <div class="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-blue-900">Ulasan Sokongan dari Eksekutif:</span>
              <rs-badge variant="info" size="sm">Eksekutif</rs-badge>
            </div>
            <div class="bg-white p-4 rounded-md border border-blue-200">
              <p class="text-gray-800">{{ previousRemarks.eksekutif.ulasan }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-blue-900">Nama:</span>
              <span class="text-gray-700 ml-2">{{ previousRemarks.eksekutif.nama }}</span>
            </div>
            <div>
              <span class="font-medium text-blue-900">Tarikh:</span>
              <span class="text-gray-700 ml-2">{{ formatDate(previousRemarks.eksekutif.tarikh) }}</span>
            </div>
          </div>
        </div>

        <!-- Ketua Jabatan Remarks -->
        <div class="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-yellow-900">Ulasan Pengesahan dari Ketua Jabatan:</span>
              <rs-badge variant="warning" size="sm">Ketua Jabatan</rs-badge>
            </div>
            <div class="bg-white p-4 rounded-md border border-yellow-200">
              <p class="text-gray-800">{{ previousRemarks.ketuaJabatan.ulasan }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-yellow-900">Nama:</span>
              <span class="text-gray-700 ml-2">{{ previousRemarks.ketuaJabatan.nama }}</span>
            </div>
            <div>
              <span class="font-medium text-yellow-900">Tarikh:</span>
              <span class="text-gray-700 ml-2">{{ formatDate(previousRemarks.ketuaJabatan.tarikh) }}</span>
            </div>
          </div>
        </div>
      </template>
    </rs-card>



    <!-- Approval Form -->
    <FormKit
      type="form"
      id="approvalForm"
      :actions="false"
      @submit="handleSubmit"
    >
      <rs-card class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
            Borang Kelulusan
          </h3>
        </template>
        <template #body>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="approvalDecision"
                label="Keputusan Kelulusan"
                :options="[
                  { label: 'Sila pilih...', value: '' },
                  { label: 'Luluskan', value: 'luluskan' },
                  { label: 'Tolak', value: 'tolak' },
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Keputusan kelulusan diperlukan',
                }"
                v-model="formData.approvalDecision"
              />
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tarikh</label>
                <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  {{ formatDate(formData.approvalDate) }}
                </div>
              </div>
              <FormKit
                type="textarea"
                name="approvalNotes"
                label="Catatan Kelulusan"
                placeholder="Catatan atau komen kelulusan..."
                rows="4"
                validation="required"
                :validation-messages="{
                  required: 'Catatan kelulusan diperlukan',
                }"
                v-model="formData.approvalNotes"
              />
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                  {{ formData.approverName }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <rs-button
          variant="secondary-outline"
          @click="navigateTo('/BF-PA/KF/KE')"
          class="flex items-center"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
          Kembali
        </rs-button>
        
        <div class="flex gap-3">
          <rs-button
            variant="danger"
            @click="openConfirmationModal('tolak')"
            :disabled="!isFormValid"
          >
            <Icon name="ph:x-circle" class="w-4 h-4 mr-2" />
            Tolak
          </rs-button>
          <rs-button
            variant="success"
            @click="openConfirmationModal('luluskan')"
            :disabled="!isFormValid"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Luluskan
          </rs-button>
        </div>
      </div>
    </FormKit>

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
              @click="confirmApproval"
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
import { ref, onMounted, computed } from "vue";
import { formatDate } from "~/utils/dateFormatter";
import { useToast } from "vue-toastification";

const route = useRoute();
const toast = useToast();

definePageMeta({
  title: "Kelulusan Elaun Penolong Amil",
});

// Role-based access control
onMounted(() => {
  const currentUserRole = "ketua-divisyen"; // This would come from auth system
  if (currentUserRole !== "ketua-divisyen") {
    toast.error("Anda tidak mempunyai kebenaran untuk meluluskan elaun");
    navigateTo('/BF-PA/KF/KE');
  }
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Elaun', path: '/BF-PA/KF/KE' },
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

// Change log from Eksekutif's modifications
const changeLog = ref([
  {
    type: 'modified',
    section: 'Elaun dalam Kategori',
    description: 'Amaun untuk "Elaun Bancian Baru : per borang permohonan"',
    oldValue: 'RM 25',
    newValue: 'RM 30'
  },
  {
    type: 'modified',
    section: 'Elaun dalam Kategori',
    description: 'Kod Bajet untuk "Elaun Kemaskini/permohonan bantuan : per borang"',
    oldValue: 'B34106',
    newValue: 'B34110'
  },
  {
    type: 'added',
    section: 'Elaun dalam Kategori',
    description: 'Ditambah: Elaun Tahunan KPAF',
    oldValue: null,
    newValue: 'RM 300'
  },
  {
    type: 'modified',
    section: 'Elaun Khas',
    description: 'Amaun untuk "KHAS - 48 AKTIVITI/TAHUN"',
    oldValue: 'RM 350',
    newValue: 'RM 400'
  },
  {
    type: 'modified',
    section: 'Elaun Khas',
    description: 'Target KPI untuk "KHAS - 48 AKTIVITI/TAHUN"',
    oldValue: '36',
    newValue: '48'
  }
]);

// Previous remarks from Eksekutif and Ketua Jabatan
const previousRemarks = ref({
  eksekutif: {
    ulasan: 'Perubahan kadar elaun ini diperlukan untuk menyesuaikan dengan kenaikan kos hidup dan untuk meningkatkan motivasi Penolong Amil dalam menjalankan tugas mereka.',
    nama: 'Ahmad Bin Abdullah',
    tarikh: '2024-01-15'
  },
  ketuaJabatan: {
    ulasan: 'Setelah semakan, perubahan kadar elaun ini adalah munasabah dan selaras dengan polisi kewangan semasa. Disahkan untuk kelulusan akhir.',
    nama: 'Siti Aminah Binti Omar',
    tarikh: '2024-01-21'
  }
});



// Form validation
const isFormValid = computed(() => {
  return formData.value.approvalDecision &&
         formData.value.approvalNotes.trim();
});

// Mock data - would come from API in real app
const categoryData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
  tarikhKuatkuasa: "01-01-2024"
});

// Open confirmation modal
const openConfirmationModal = (action) => {
  confirmationData.value.action = action;
  formData.value.approvalDecision = action;
  showConfirmationModal.value = true;
};

// Confirm approval action
const confirmApproval = async () => {
  isSubmitting.value = true;
  
  try {
    // Close modal
    showConfirmationModal.value = false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const approvalData = {
      ...formData.value,
      allowanceId: route.params.id,
      previousRemarks: previousRemarks.value
    };
    
    if (confirmationData.value.action === 'luluskan') {
      // Update status to "Aktif"
      allowanceData.value.status = "Aktif";
      
      toast.success('Elaun penolong amil berjaya diluluskan oleh Ketua Divisyen. Status berubah kepada "Aktif" dan berkuatkuasa dalam sistem.');
    } else {
      // Update status to "Tidak Aktif"
      allowanceData.value.status = "Tidak Aktif";
      
      toast.success('Elaun penolong amil telah ditolak oleh Ketua Divisyen. Status berubah kepada "Tidak Aktif".');
    }
    
    // Approval data processed
    
    // Navigate back to list
    await navigateTo('/BF-PA/KF/KE');
  } catch (error) {
    toast.error('Ralat semasa kelulusan');
    // Error during approval
  } finally {
    isSubmitting.value = false;
  }
};

// Legacy form submit handler (kept for compatibility)
const handleSubmit = async (formData) => {
      // Form submitted via legacy handler
};

onMounted(() => {
  // Fetch allowance data from API in real app
      // Loading allowance for approval
});
</script> 