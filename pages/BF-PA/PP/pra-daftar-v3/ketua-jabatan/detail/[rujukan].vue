<!-- 
  RTMF SCREEN: PA-PP-PD-05_02
  PURPOSE: Department Head Confirmation Detail - Paparan Terperinci Pengesahan
  DESCRIPTION: Detailed department head confirmation view for candidate approval
  ROUTE: /BF-PA/PP/pra-daftar-v3/ketua-jabatan/detail/[rujukan]
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
            <rs-badge variant="warning">Ketua Jabatan</rs-badge>
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
            Pengesahan Ketua Jabatan - Maklumat Terperinci
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
                  Status Pengesahan Ketua Jabatan
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ application.statusPendaftaran }}
                </rs-badge>
                <rs-badge :variant="getConfirmationStatusVariant(confirmationData.statusPengesahan)">
                  {{ confirmationData.statusPengesahan }}
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

              <!-- Jabatan Pengurusan Risiko Review -->
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:shield-check" class="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <p class="font-medium">Jabatan Pengurusan Risiko</p>
                    <p class="text-sm text-gray-600">Saringan risiko</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">20/01/2024</p>
                  <rs-badge variant="success">Lulus</rs-badge>
                </div>
              </div>

              <!-- PT Review -->
              <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:clipboard-text" class="w-5 h-5 mr-3 text-yellow-500" />
                  <div>
                    <p class="font-medium">PT</p>
                    <p class="text-sm text-gray-600">Semakan dokumen</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">25/01/2024</p>
                  <rs-badge variant="success">Lulus</rs-badge>
                </div>
              </div>

              <!-- Eksekutif Review -->
              <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-purple-500" />
                  <div>
                    <p class="font-medium">Eksekutif</p>
                    <p class="text-sm text-gray-600">Sokongan eksekutif</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">30/01/2024</p>
                  <rs-badge variant="success">Sokong</rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Department Head Confirmation Form -->
          <div class="mb-6 p-6 border border-orange-200 rounded-lg bg-orange-50">
            <h3 class="text-lg font-semibold mb-4 text-orange-900">
              Keputusan Pengesahan Ketua Jabatan
            </h3>
            
            <FormKit
              type="form"
              id="confirmationForm"
              :actions="false"
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Confirmation Decision -->
                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="statusPengesahan"
                    label="Keputusan Pengesahan"
                    :options="confirmationDecisionOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan pengesahan diperlukan',
                    }"
                    v-model="confirmationForm.statusPengesahan"
                  />
                </div>

                <!-- Confirmation Date -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhPengesahan"
                    label="Tarikh Pengesahan"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh pengesahan diperlukan',
                    }"
                    v-model="confirmationForm.tarikhPengesahan"
                  />
                </div>

                <!-- Confirmer Name -->
                <div>
                  <FormKit
                    type="text"
                    name="dipengesahOleh"
                    label="Dipengesah Oleh"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama pengesah diperlukan',
                    }"
                    v-model="confirmationForm.dipengesahOleh"
                  />
                </div>

                <!-- Confirmation Comments -->
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="catatanPengesahan"
                    label="Catatan Pengesahan"
                    placeholder="Sila berikan catatan pengesahan anda..."
                    validation="required"
                    :validation-messages="{
                      required: 'Catatan pengesahan diperlukan',
                    }"
                    v-model="confirmationForm.catatanPengesahan"
                    :classes="{
                      input: 'min-h-[120px]',
                    }"
                  />
                </div>

                <!-- Confirmation Letter Upload -->
                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="suratPengesahan"
                    label="Surat Pengesahan Ketua Jabatan *"
                    accept=".pdf,.doc,.docx"
                    validation="required"
                    :validation-messages="{
                      required: 'Surat pengesahan ketua jabatan diperlukan',
                    }"
                    :classes="{
                      input: '!py-2',
                    }"
                    v-model="confirmationForm.suratPengesahan"
                    help="Format: PDF, DOC, DOCX. Surat pengesahan rasmi dari ketua jabatan"
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
                    v-model="confirmationForm.additionalDocuments"
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
  title: "Pengesahan Ketua Jabatan - Maklumat Terperinci",
  description: "Paparan terperinci pengesahan ketua jabatan",
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
    name: "Ketua Jabatan",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Maklumat Terperinci",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/ketua-jabatan/detail/${route.params.rujukan}`,
  },
]);

// Workflow steps for Ketua Jabatan role
const workflowSteps = computed(() => {
  return [
    { key: 'registration', label: 'Pendaftaran', icon: 'ph:user-plus' },
    { key: 'screening', label: 'Saringan', icon: 'ph:shield-check' },
    { key: 'review', label: 'Semakan PT', icon: 'ph:clipboard-text' },
    { key: 'support', label: 'Sokongan', icon: 'ph:thumbs-up' },
    { key: 'confirmation', label: 'Pengesahan', icon: 'ph:check-circle' }
  ];
});

// Confirmation Decision Options
const confirmationDecisionOptions = [
  { label: "Sah", value: "Sah" },
  { label: "Tidak Sah", value: "Tidak Sah" },
  { label: "Perlu Maklumat Tambahan", value: "Perlu Maklumat Tambahan" },
];

// Form Data
const confirmationForm = ref({
  statusPengesahan: "",
  tarikhPengesahan: "",
  dipengesahOleh: "",
  catatanPengesahan: "",
  suratPengesahan: null,
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
  statusPendaftaran: "Executive Supported",
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
      action: "Saringan Selesai",
      date: "20/03/2024 11:30 AM",
      notes: "Calon lulus saringan risiko"
    },
    {
      action: "Semakan PT Selesai",
      date: "25/03/2024 14:30 PM",
      notes: "Calon lulus semakan PT"
    },
    {
      action: "Sokongan Eksekutif Selesai",
      date: "30/03/2024 16:30 PM",
      notes: "Calon disokong oleh eksekutif"
    },
    {
      action: "Menunggu Pengesahan Ketua Jabatan",
      date: "31/03/2024 09:00 AM",
      notes: "Permohonan dalam proses pengesahan ketua jabatan"
    }
  ]
});

// Mock confirmation data
const confirmationData = ref({
  statusPengesahan: "Dalam Proses",
  tarikhPengesahan: "",
  dipengesahOleh: "",
  catatanPengesahan: "",
  suratPengesahan: null,
});

// Helper functions
const getStepVariant = (step) => {
  const stepStatus = {
    'registration': 'bg-green-100 text-green-800 border-2 border-green-300',
    'screening': 'bg-green-100 text-green-800 border-2 border-green-300',
    'review': 'bg-green-100 text-green-800 border-2 border-green-300',
    'support': 'bg-green-100 text-green-800 border-2 border-green-300',
    'confirmation': 'bg-orange-100 text-orange-800 border-2 border-orange-300'
  };
  return stepStatus[step] || 'bg-gray-100 text-gray-400 border-2 border-gray-200';
};

const getStepLineVariant = (step) => {
  const lineStatus = {
    'registration': 'bg-green-300',
    'screening': 'bg-green-300',
    'review': 'bg-green-300',
    'support': 'bg-green-300',
    'confirmation': 'bg-orange-300'
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

const getConfirmationStatusVariant = (status) => {
  const statusVariants = {
    "Dalam Proses": "warning",
    Sah: "success",
    "Tidak Sah": "danger",
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
    
    // Update confirmation data
    confirmationData.value = {
      ...confirmationData.value,
      ...confirmationForm.value,
      statusPengesahan: confirmationForm.value.statusPengesahan,
      tarikhPengesahan: confirmationForm.value.tarikhPengesahan,
      dipengesahOleh: confirmationForm.value.dipengesahOleh,
    };
    
    // Show success message
    alert(`Pengesahan ketua jabatan berjaya dihantar. Status: ${confirmationForm.value.statusPengesahan}`);
    
    // Navigate back to dashboard
    navigateTo("/BF-PA/PP/pra-daftar-v3");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar pengesahan ketua jabatan");
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update confirmation data
    confirmationData.value.statusPengesahan = confirmationForm.value.statusPengesahan;
    confirmationData.value.tarikhPengesahan = confirmationForm.value.tarikhPengesahan;
    confirmationData.value.catatanPengesahan = confirmationForm.value.catatanPengesahan;
    confirmationData.value.dipengesahOleh = confirmationForm.value.dipengesahOleh;
    
    // Confirmation submitted successfully
    
    // Navigate back to dashboard
    navigateTo("/BF-PA/PP/pra-daftar-v3");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar pengesahan ketua jabatan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const previewDocument = (documentType) => {
  // Simulate document preview
  alert(`Melihat dokumen: ${documentType}`);
};

onMounted(() => {
  // In real implementation, fetch application and confirmation data based on rujukan
  console.log("Loading department head confirmation details");
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 