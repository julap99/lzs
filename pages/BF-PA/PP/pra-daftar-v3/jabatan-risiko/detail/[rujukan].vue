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
                  {{ application.statusPendaftaran }}
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
            
            <div class="space-y-3">
              <!-- PYB Institusi Review -->
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:user-plus" class="w-5 h-5 mr-3 text-green-500" />
                  <div>
                    <p class="font-medium">PYB Institusi</p>
                    <p class="text-sm text-gray-600">Mendaftar calon</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">15/01/2024</p>
                  <rs-badge variant="success">Selesai</rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Screening Form -->
          <div class="mb-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
            <h3 class="text-lg font-semibold mb-4 text-blue-900">
              Keputusan Saringan Jabatan Pengurusan Risiko
            </h3>
            
            <FormKit
              type="form"
              id="screeningForm"
              :actions="false"
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Screening Decision -->
                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="statusSaringan"
                    label="Keputusan Saringan"
                    :options="screeningDecisionOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan saringan diperlukan',
                    }"
                    v-model="screeningForm.statusSaringan"
                  />
                </div>

                <!-- Screening Date -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhSaringan"
                    label="Tarikh Saringan"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh saringan diperlukan',
                    }"
                    v-model="screeningForm.tarikhSaringan"
                  />
                </div>

                <!-- Screener Name -->
                <div>
                  <FormKit
                    type="text"
                    name="disaredOleh"
                    label="Disaring Oleh"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama penyaring diperlukan',
                    }"
                    v-model="screeningForm.disaredOleh"
                  />
                </div>

                <!-- Screening Comments -->
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="catatanSaringan"
                    label="Catatan Saringan"
                    placeholder="Sila berikan catatan saringan anda..."
                    validation="required"
                    :validation-messages="{
                      required: 'Catatan saringan diperlukan',
                    }"
                    v-model="screeningForm.catatanSaringan"
                    :classes="{
                      input: 'min-h-[120px]',
                    }"
                  />
                </div>

                <!-- Screening Results Upload -->
                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="keputusanSaringan"
                    label="Keputusan Saringan *"
                    accept=".pdf,.doc,.docx"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan saringan diperlukan',
                    }"
                    :classes="{
                      input: '!py-2',
                    }"
                    v-model="screeningForm.keputusanSaringan"
                    help="Format: PDF, DOC, DOCX. Keputusan saringan rasmi"
                  />
                </div>

                <!-- Additional Documents -->
                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="additionalDocuments"
                    label="Dokumen Tambahan (Opsional)"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    :classes="{
                      input: '!py-2',
                    }"
                    v-model="screeningForm.additionalDocuments"
                  />
                </div>
              </div>

              <!-- Submit Buttons - Standardized at the bottom -->
              <div class="flex justify-end gap-4 mt-6">
                <rs-button
                  type="button"
                  variant="primary"
                  @click="handleSubmitDirect"
                  :disabled="isSubmitting"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="ph:spinner"
                    class="w-4 h-4 mr-2 animate-spin"
                  />
                  {{ isSubmitting ? 'Menghantar...' : 'Hantar Keputusan' }}
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const route = useRoute();

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
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Perlu Maklumat Tambahan", value: "Perlu Maklumat Tambahan" },
];

// Form Data
const screeningForm = ref({
  statusSaringan: "",
  tarikhSaringan: "",
  disaredOleh: "",
  catatanSaringan: "",
  keputusanSaringan: null,
  additionalDocuments: null,
});

const isSubmitting = ref(false);

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
  statusPendaftaran: "Submitted",
  statusLantikan: "Pending",
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
  keputusanSaringan: null,
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
    Draft: "default",
    Submitted: "warning",
    "Under Review": "info",
    Screened: "info",
    "PT Reviewed": "info",
    "Executive Supported": "success",
    "Department Confirmed": "success",
    "Division Approved": "success",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

const getScreeningStatusVariant = (status) => {
  const statusVariants = {
    "Dalam Proses": "warning",
    Lulus: "success",
    "Tidak Lulus": "danger",
  };
  return statusVariants[status] || "default";
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

const handleSubmit = async (formData) => {
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
    
    // Show success message
    alert(`Saringan berjaya dihantar. Status: ${screeningForm.value.statusSaringan}`);
    
    // Navigate back to dashboard
    navigateTo("/BF-PA/PP/pra-daftar-v3");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar saringan");
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update screening data
    screeningData.value.statusSaringan = screeningForm.value.statusSaringan;
    screeningData.value.tarikhSaringan = screeningForm.value.tarikhSaringan;
    screeningData.value.catatanSaringan = screeningForm.value.catatanSaringan;
    screeningData.value.disaredOleh = screeningForm.value.disaredOleh;
    
    // Screening submitted successfully
    
    // Navigate back to dashboard
    navigateTo("/BF-PA/PP/pra-daftar-v3");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar saringan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const previewDocument = (documentType) => {
  // Simulate document preview
  alert(`Melihat dokumen: ${documentType}`);
};

onMounted(() => {
  // In real implementation, fetch application and screening data based on rujukan
  console.log("Loading screening details");
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 