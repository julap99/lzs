<!-- 
  RTMF SCREEN: PA-KF-KS-01_06 (Approval Form)
  PURPOSE: Kelulusan sesi penolong amil oleh Ketua Divisyen
  DESCRIPTION: Approval form for Penolong Amil session by Ketua Divisyen
  ROUTE: /BF-PA/KF/KS/approve/[id]
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
            Kelulusan Sesi Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Kelulusan akhir sesi penolong amil oleh Ketua Divisyen</p>
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
          <rs-badge variant="success">
            {{ categoryData.status }}
          </rs-badge>
        </div>
      </template>
      <template #body>
        <div class="p-6">
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
              <div class="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                {{ categoryData.status }}
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
          Maklumat Perubahan Sesi Yang Dibuat
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
                      <span class="text-red-600 font-medium">Lama:</span> {{ change.oldValue }}
                    </div>
                    <div v-if="change.newValue" class="mb-1">
                      <span class="text-green-600 font-medium">Baru:</span> {{ change.newValue }}
                    </div>
                  </div>
                </div>
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
                    <p><strong>Disemak oleh:</strong> {{ previousRemarks.eksekutif.nama }} (Eksekutif)</p>
                    <p><strong>Tarikh:</strong> {{ formatDate(previousRemarks.eksekutif.tarikh) }}</p>
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
                    <p><strong>Disemak oleh:</strong> {{ previousRemarks.ketuaJabatan.nama }} (Ketua Jabatan)</p>
                    <p><strong>Tarikh:</strong> {{ formatDate(previousRemarks.ketuaJabatan.tarikh) }}</p>
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
                v-model="formData.approvalDecision"
                :options="[
                  { label: 'Sila pilih...', value: '' },
                  { label: 'Luluskan', value: 'luluskan' },
                  { label: 'Tolak', value: 'tolak' }
                ]"
                validation="required"
                validation-label="Keputusan Kelulusan"
              />
              
              <FormKit
                type="date"
                name="approvalDate"
                label="Tarikh Kelulusan"
                v-model="formData.approvalDate"
                :disabled="true"
                help="Tarikh akan ditetapkan secara automatik"
              />
              
              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="approvalNotes"
                  label="Ulasan Kelulusan"
                  v-model="formData.approvalNotes"
                  validation="required"
                  validation-label="Ulasan Kelulusan"
                  :rows="4"
                  placeholder="Sila masukkan ulasan mengenai kelulusan sesi ini..."
                />
              </div>
              
              <FormKit
                type="text"
                name="approverName"
                label="Nama Pelulus"
                v-model="formData.approverName"
                :disabled="true"
                help="Nama akan diambil dari sistem pengguna semasa"
              />
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <rs-button
          variant="secondary-outline"
          @click="navigateTo('/BF-PA/KF/KS')"
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
            class="flex items-center"
          >
            <Icon name="ph:x-circle" class="w-4 h-4 mr-2" />
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
                <Icon :name="confirmationData.action === 'luluskan' ? 'ph:check' : 'ph:x-circle'" 
                      class="h-6 w-6"
                      :class="confirmationData.action === 'luluskan' ? 'text-green-600' : 'text-red-600'" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Pengesahan Tindakan
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Adakah anda pasti mahu <strong>{{ confirmationData.action === 'luluskan' ? 'meluluskan' : 'menolak' }}</strong> sesi ini? 
                    Tindakan ini tidak boleh dibatalkan.
                  </p>
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
  title: "Kelulusan Sesi Penolong Amil",
});

// Role-based access control
onMounted(() => {
  const currentUserRole = "ketua-divisyen"; // This would come from auth system
  if (currentUserRole !== "ketua-divisyen") {
    toast.error("Anda tidak mempunyai kebenaran untuk meluluskan sesi");
    navigateTo('/BF-PA/KF/KS');
  }
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Sesi', path: '/BF-PA/KF/KS' },
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
    section: 'Sesi dalam Kategori',
    description: 'Tarikh Tamat untuk "SESI 2025-2027"',
    oldValue: '31-12-2026',
    newValue: '31-12-2027'
  },
  {
    type: 'added',
    section: 'Sesi dalam Kategori',
    description: 'Ditambah: SESI 2028-2030',
    oldValue: null,
    newValue: '01-01-2028 - 31-12-2030'
  }
]);

// Previous remarks from Eksekutif and Ketua Jabatan
const previousRemarks = ref({
  eksekutif: {
    ulasan: 'Perubahan tempoh sesi ini diperlukan untuk menyesuaikan dengan jadual operasi yang baharu dan memastikan kesinambungan perkhidmatan zakat.',
    nama: 'Ahmad Bin Abdullah',
    tarikh: '2024-01-15'
  },
  ketuaJabatan: {
    ulasan: 'Setelah semakan, perubahan tempoh sesi ini adalah munasabah dan selaras dengan keperluan operasi semasa. Disahkan untuk kelulusan akhir.',
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
const sessionData = ref({
  id: 1,
  namaSesi: "Sesi 2025",
  tarikhMula: "2025-01-01",
  tarikhTamat: "2025-12-31",
  status: "Menunggu Kelulusan",
  penerangan: "Sesi penolong amil untuk tahun 2025",
});

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
      sessionId: route.params.id,
      previousRemarks: previousRemarks.value
    };
    
    if (confirmationData.value.action === 'luluskan') {
      // Update status to "Aktif"
      sessionData.value.status = "Aktif";
      
      toast.success('Sesi penolong amil berjaya diluluskan oleh Ketua Divisyen. Status berubah kepada "Aktif" dan berkuatkuasa dalam sistem.');
    } else {
      // Update status to "Tidak Aktif"
      sessionData.value.status = "Tidak Aktif";
      
      toast.success('Sesi penolong amil telah ditolak oleh Ketua Divisyen. Status berubah kepada "Tidak Aktif".');
    }
    
    // Approval data processed
    
    // Navigate back to list
    await navigateTo('/BF-PA/KF/KS');
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
  // Fetch session data from API in real app
      // Loading session for approval
});
</script> 