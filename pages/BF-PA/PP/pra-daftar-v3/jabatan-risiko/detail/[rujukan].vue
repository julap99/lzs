<!-- 
  RTMF SCREEN: PA-PP-PD-02_02
  PURPOSE: Screening Detail - Paparan Terperinci Semakan & Saringan
  DESCRIPTION: Detailed screening view for Jabatan Pengurusan Risiko
  ROUTE: /BF-PA/PP/pra-daftar-v3/jabatan-risiko/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Compact Workflow Widget -->
    <div class="mb-4">
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              Proses Verifikasi Calon Penolong Amil
            </h3>
            <rs-badge variant="info">Jabatan Pengurusan Risiko</rs-badge>
          </div>
        </template>
        <template #body>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div 
                v-for="(step, index) in workflowSteps" 
                :key="step.key"
                class="flex items-center"
              >
                <div class="flex flex-col items-center">
                  <div 
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                      getStepVariant(step.key)
                    ]"
                  >
                    <Icon 
                      v-if="step.icon" 
                      :name="step.icon" 
                      class="w-4 h-4"
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs mt-1 text-center max-w-16">{{ step.label }}</span>
                </div>
                <div 
                  v-if="index < workflowSteps.length - 1"
                  :class="[
                    'h-1 w-8 mx-1',
                    getStepLineVariant(step.key)
                  ]"
                ></div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Saringan Calon Penolong Amil
          </h2>
          <rs-button
            variant="secondary-outline"
            @click="handleBack"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Status Saringan
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ getLocalizedStatus(application.statusPendaftaran) }}
                </rs-badge>
                <rs-badge :variant="getScreeningStatusVariant(screeningData.statusSaringan)">
                  {{ screeningData.statusSaringan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Peribadi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Kad Pengenalan
                </label>
                <p class="text-gray-900">{{ application.noKP }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penuh
                </label>
                <p class="text-gray-900">{{ application.nama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jantina
                </label>
                <p class="text-gray-900">{{ application.jantina }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bangsa
                </label>
                <p class="text-gray-900">{{ application.bangsa }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Agama
                </label>
                <p class="text-gray-900">{{ application.agama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Emel
                </label>
                <p class="text-gray-900">{{ application.emel }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Telefon
                </label>
                <p class="text-gray-900">{{ application.telefon }}</p>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Alamat
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Rumah
                </label>
                <p class="text-gray-900">{{ application.alamatRumah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Poskod
                </label>
                <p class="text-gray-900">{{ application.poskod }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bandar
                </label>
                <p class="text-gray-900">{{ application.bandar }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Negeri
                </label>
                <p class="text-gray-900">{{ application.negeri }}</p>
              </div>
            </div>
          </div>

          <!-- Service Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Perkhidmatan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Penolong Amil
                </label>
                <p class="text-gray-900">{{ application.kategoriPenolongAmil }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jawatan
                </label>
                <p class="text-gray-900">{{ application.jawatan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Institusi/Kariah
                </label>
                <p class="text-gray-900">{{ application.institusiKariah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sesi Perkhidmatan
                </label>
                <p class="text-gray-900">{{ application.sesiPerkhidmatan }}</p>
              </div>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Dokumen Sokongan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Salinan Kad Pengenalan -->
              <div>
                <h4 class="font-medium mb-3">Salinan Kad Pengenalan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.salinanKadPengenalan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('salinanKadPengenalan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>

              <!-- Surat Sokongan (if exists) -->
              <div v-if="application.suratSokongan">
                <h4 class="font-medium mb-3">Surat Sokongan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.suratSokongan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('suratSokongan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review History -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Semakan
            </h3>
            
            <div class="space-y-4">
              <!-- PYB Institusi Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:user-plus" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-900">PYB Institusi</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Mendaftar calon penolong amil</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Ahmad Abdullah (PYB)</p>
                      <p><strong>Tarikh:</strong> 15/01/2024 10:30 AM</p>
                      <p><strong>Catatan:</strong> Calon berjaya didaftarkan dengan maklumat lengkap</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Jabatan Pengurusan Risiko Review (Current) -->
              <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-start">
                  <Icon name="ph:shield-check" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-orange-900">Jabatan Pengurusan Risiko</h4>
                      <rs-badge variant="warning">Dalam Proses</rs-badge>
                    </div>
                    <p class="text-sm text-orange-700 mb-2">Saringan risiko calon</p>
                    <div class="text-xs text-orange-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
                      <p><strong>Tarikh:</strong> {{ currentDate }}</p>
                      <p><strong>Status:</strong> Menunggu keputusan saringan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Screening Form -->
          <div class="mb-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
            <h3 class="text-lg font-semibold mb-4 text-blue-900">
              Keputusan Saringan Jabatan Pengurusan Risiko
            </h3>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Screening Decision -->
                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="statusSaringan"
                    label="Keputusan Saringan *"
                    :options="screeningDecisionOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan saringan diperlukan',
                    }"
                    v-model="screeningForm.statusSaringan"
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div>

                <!-- Screening Date (Auto-filled, cannot edit) -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhSaringan"
                    label="Tarikh Saringan *"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh saringan diperlukan',
                    }"
                    v-model="screeningForm.tarikhSaringan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>

                <!-- Screener Name (Auto-filled, cannot edit) -->
                <div>
                  <FormKit
                    type="text"
                    name="disaredOleh"
                    label="Disaring Oleh *"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama penyaring diperlukan',
                    }"
                    v-model="screeningForm.disaredOleh"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>

                <!-- Screening Comments -->
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="catatanSaringan"
                    label="Catatan Saringan *"
                    placeholder="Sila berikan catatan saringan anda..."
                    validation="required"
                    :validation-messages="{
                      required: 'Catatan saringan diperlukan',
                    }"
                    v-model="screeningForm.catatanSaringan"
                    :classes="{
                      input: 'min-h-[120px] !py-2',
                    }"
                  />
                </div>

                <!-- Additional Documents (Optional) -->
                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="additionalDocuments"
                    label="Sila Upload Dokumen Tapisan"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    :classes="{
                      input: '!py-2',
                    }"
                    v-model="screeningForm.additionalDocuments"
                    help="Format: PDF, DOC, DOCX, JPG, JPEG, PNG. Saiz maksimum 10MB"
                  />
                </div>
              </div>

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
                  variant="primary"
                  :disabled="isSubmitting"
                  @click="showConfirmationModal = true"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="ph:spinner"
                    class="w-4 h-4 mr-2 animate-spin"
                  />
                  {{ isSubmitting ? 'Menghantar...' : 'Hantar Keputusan' }}
                </rs-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" style="background: white; border-radius: 8px; padding: 24px; max-width: 400px; width: 100%; margin: 0 16px;">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Adakah anda pasti?
          </h3>
          <p class="text-gray-600 mb-4">
            Anda akan menghantar keputusan saringan untuk permohonan ini. 
            Tindakan ini tidak boleh dibatalkan.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800">
              <strong>Keputusan:</strong> {{ screeningForm.statusSaringan || 'Belum dipilih' }}
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
            :loading="isSubmitting"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Hantar Keputusan
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

const route = useRoute();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Saringan Calon Penolong Amil",
  description: "Paparan terperinci saringan calon penolong amil",
});

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
    name: "Jabatan Pengurusan Risiko",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Maklumat Terperinci",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/jabatan-risiko/detail/${route.params.rujukan}`,
  },
]);

// Workflow steps for Jabatan Pengurusan Risiko role
const workflowSteps = computed(() => {
  return [
    { key: 'registration', label: 'Pendaftaran', icon: 'ph:user-plus' },
    { key: 'screening', label: 'Saringan', icon: 'ph:shield-check' }
  ];
});

// Screening Decision Options
const screeningDecisionOptions = [
  { label: "Sila Pilih Keputusan", value: "" },
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Telah Disemak dan Perlu Maklumat Tambahan", value: "Perlu Maklumat Tambahan" },
];

// Form Data
const screeningForm = ref({
  statusSaringan: "",
  tarikhSaringan: "",
  disaredOleh: "",
  catatanSaringan: "",
  additionalDocuments: null,
});

// State management
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

// Current user data (mock session token)
const currentUser = ref({
  name: "Siti Fatimah binti Omar",
  role: "Eksekutif Pengurusan Risiko",
  id: "RISK001",
  department: "Jabatan Pengurusan Risiko"
});

// Current date
const currentDate = ref(new Date().toLocaleDateString('ms-MY'));

// Form validation
const isFormValid = computed(() => {
  return true; // Temporarily disable validation for presentation
  // return (
  //   screeningForm.value.statusSaringan &&
  //   screeningForm.value.catatanSaringan
  // );
});

// Mock application data based on RTMF requirements
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  jantina: "Lelaki",
  bangsa: "Melayu",
  agama: "Islam",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  alamatRumah: "No. 123, Jalan Utama, Taman Seri Indah",
  poskod: "50000",
  bandar: "Kuala Lumpur",
  negeri: "Kuala Lumpur",
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Dihantar",
  statusLantikan: "Menunggu",
  salinanKadPengenalan: "salinan_kp_ahmad.pdf",
  suratSokongan: "surat_sokongan_ahmad.pdf",
  dokumenLain: null,
  uploadDate: "15/03/2024",
  timeline: [
    {
      action: "Permohonan Dihantar",
      date: "15/03/2024 10:30 AM",
      notes: "Permohonan berjaya dihantar untuk semakan"
    },
    {
      action: "Dokumen Disemak",
      date: "16/03/2024 02:15 PM",
      notes: "Semua dokumen lengkap dan sah"
    },
    {
      action: "Menunggu Saringan",
      date: "17/03/2024 09:00 AM",
      notes: "Permohonan dalam proses saringan"
    }
  ]
});

// Mock screening data
const screeningData = ref({
  statusSaringan: "Dalam Proses",
  tarikhSaringan: "",
  disaredOleh: "",
  catatanSaringan: "",
});

// Helper functions
const getStepVariant = (step) => {
  const stepStatus = {
    'registration': 'bg-green-100 text-green-800 border-2 border-green-300',
    'screening': 'bg-blue-100 text-blue-800 border-2 border-blue-300'
  };
  return stepStatus[step] || 'bg-gray-100 text-gray-400 border-2 border-gray-200';
};

const getStepLineVariant = (step) => {
  const lineStatus = {
    'registration': 'bg-green-300',
    'screening': 'bg-blue-300'
  };
  return lineStatus[step] || 'bg-gray-200';
};

const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "disabled",        // Use disabled for proper grey color
    Dihantar: "warning",
    "Dalam Semakan": "info",
    Disaring: "info",
    "Disemak PT": "info",
    "Disokong Eksekutif": "success",
    "Disahkan Jabatan": "success",
    "Diluluskan Divisyen": "success",
    Diluluskan: "success",
    Ditolak: "danger",
    Submitted: "warning",
    Pending: "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "secondary"; // Use secondary instead of default
};

const getScreeningStatusVariant = (status) => {
  const statusVariants = {
    "Dalam Proses": "warning",
    Lulus: "success",
    "Tidak Lulus": "danger",
  };
  return statusVariants[status] || "secondary"; // Use secondary instead of default
};

// Localize status text
const getLocalizedStatus = (status) => {
  const statusMap = {
    'Submitted': 'Dihantar',
    'Pending': 'Menunggu',
    'Approved': 'Diluluskan',
    'Rejected': 'Ditolak',
    'Draft': 'Draf',
    'Dihantar': 'Dihantar',
    'Dalam Semakan': 'Dalam Semakan',
    'Disaring': 'Disaring',
    'Disemak PT': 'Disemak PT',
    'Disokong Eksekutif': 'Disokong Eksekutif',
    'Disahkan Jabatan': 'Disahkan Jabatan',
    'Diluluskan Divisyen': 'Diluluskan Divisyen',
    'Diluluskan': 'Diluluskan',
    'Ditolak': 'Ditolak',
  };
  return statusMap[status] || status;
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleSubmit();
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // Update screening data
    screeningData.value = {
      ...screeningData.value,
      ...screeningForm.value,
      statusSaringan: screeningForm.value.statusSaringan,
      tarikhSaringan: screeningForm.value.tarikhSaringan,
      disaredOleh: screeningForm.value.disaredOleh,
    };
    
    // Show success notification
    alert(`Berjaya! Keputusan saringan berjaya dihantar. Status: ${screeningForm.value.statusSaringan}`);
    
    // Navigate back to dashboard immediately
    navigateTo("/BF-PA/PP/pra-daftar-v3");
    
  } catch (error) {
    alert("Ralat! Ralat berlaku semasa menghantar saringan");
  } finally {
    isSubmitting.value = false;
  }
};

const previewDocument = (documentType) => {
  // Simulate document preview
  alert(`Melihat dokumen: ${documentType}`);
};

onMounted(() => {
  // Auto-fill the form with current user and date
  screeningForm.value.tarikhSaringan = new Date().toISOString().split('T')[0];
  screeningForm.value.disaredOleh = currentUser.value.name;
  
  // In real implementation, fetch application and screening data based on rujukan
  console.log("Loading screening details for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 