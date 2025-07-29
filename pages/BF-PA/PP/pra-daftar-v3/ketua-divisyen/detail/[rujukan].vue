<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Ketua Divisyen - Maklumat Terperinci
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Status Permohonan
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ application.statusPendaftaran }}
                </rs-badge>
                <rs-badge :variant="getStatusLantikanVariant(application.statusLantikan)">
                  {{ application.statusLantikan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Workflow Progress -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg bg-blue-50">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Proses Verifikasi Calon Penolong Amil
            </h3>
            
            <div class="relative">
              <!-- Progress Line -->
              <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <!-- Workflow Steps -->
              <div class="space-y-4">
                <!-- Step 1: Registration -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-green-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">1. Pendaftaran Calon</h4>
                    <p class="text-sm text-gray-600 mb-2">PYB Institusi mendaftar calon</p>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p class="text-sm text-green-800">
                        <strong>Status:</strong> Selesai<br>
                        <span class="text-xs">Calon berjaya didaftarkan oleh PYB Institusi</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Screening -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-blue-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">2. Saringan Risiko</h4>
                    <p class="text-sm text-gray-600 mb-2">Jabatan Pengurusan Risiko</p>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p class="text-sm text-blue-800">
                        <strong>Status:</strong> Selesai<br>
                        <span class="text-xs">Calon telah lulus saringan risiko</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 3: PT Review -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-yellow-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">3. Semakan PT</h4>
                    <p class="text-sm text-gray-600 mb-2">Pegawai Tadbir</p>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p class="text-sm text-yellow-800">
                        <strong>Status:</strong> Selesai<br>
                        <span class="text-xs">Calon telah disemak oleh PT</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Executive Support -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-purple-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">4. Sokongan Eksekutif</h4>
                    <p class="text-sm text-gray-600 mb-2">Eksekutif</p>
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p class="text-sm text-purple-800">
                        <strong>Status:</strong> Selesai<br>
                        <span class="text-xs">Calon telah disokong oleh eksekutif</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 5: Department Head Confirmation -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-circle" class="text-indigo-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">5. Pengesahan Ketua Jabatan</h4>
                    <p class="text-sm text-gray-600 mb-2">Ketua Jabatan</p>
                    <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                      <p class="text-sm text-indigo-800">
                        <strong>Status:</strong> Selesai<br>
                        <span class="text-xs">Calon telah disahkan oleh ketua jabatan</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 6: Division Head Approval -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:star" class="text-red-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">6. Kelulusan Ketua Divisyen</h4>
                    <p class="text-sm text-gray-600 mb-2">Ketua Divisyen</p>
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p class="text-sm text-red-800">
                        <strong>Status:</strong> Dalam Proses<br>
                        <span class="text-xs">Sedang menunggu kelulusan ketua divisyen</span>
                      </p>
                    </div>
                  </div>
                </div>
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

          <!-- Department Confirmation Information -->
          <div class="mb-6 p-6 border border-purple-200 rounded-lg bg-purple-50">
            <h3 class="text-lg font-semibold mb-4 text-purple-900">
              Maklumat Pengesahan Ketua Jabatan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-purple-700 mb-1">
                  Status Pengesahan Ketua Jabatan
                </label>
                <rs-badge variant="success">{{ application.departmentConfirmation.status }}</rs-badge>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-purple-700 mb-1">
                  Disahkan Oleh
                </label>
                <p class="text-purple-900">{{ application.departmentConfirmation.confirmedBy }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-purple-700 mb-1">
                  Tarikh Pengesahan
                </label>
                <p class="text-purple-900">{{ application.departmentConfirmation.confirmedAt }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-purple-700 mb-1">
                  Ulasan Pengesahan Ketua Jabatan
                </label>
                <p class="text-purple-900">{{ application.departmentConfirmation.comments }}</p>
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

          <!-- Division Head Approval Form -->
          <div class="mb-6 p-6 border border-orange-200 rounded-lg bg-orange-50">
            <h3 class="text-lg font-semibold mb-4 text-orange-900">
              Keputusan Kelulusan Ketua Divisyen
            </h3>
            
            <FormKit
              type="form"
              id="divisionApprovalForm"
              :actions="false"
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Approval Decision -->
                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="approvalDecision"
                    label="Keputusan Kelulusan"
                    :options="approvalDecisionOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan kelulusan diperlukan',
                    }"
                    v-model="formData.approvalDecision"
                  />
                </div>

                <!-- Approval Comments -->
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="approvalComments"
                    label="Ulasan Kelulusan"
                    placeholder="Sila berikan ulasan kelulusan anda..."
                    validation="required"
                    :validation-messages="{
                      required: 'Ulasan kelulusan diperlukan',
                    }"
                    v-model="formData.approvalComments"
                    :classes="{
                      input: 'min-h-[120px]',
                    }"
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
                    v-model="formData.additionalDocuments"
                  />
                </div>
              </div>

              <!-- Submit Buttons -->
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
  title: "Kelulusan Ketua Divisyen - Maklumat Terperinci",
  description: "Maklumat terperinci untuk kelulusan ketua divisyen",
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
    name: "Kelulusan Ketua Divisyen",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3/ketua-divisyen",
  },
  {
    name: "Maklumat Terperinci",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/ketua-divisyen/detail/${route.params.rujukan}`,
  },
]);

// Approval Decision Options
const approvalDecisionOptions = [
  { label: "Lulus", value: "approve" },
  { label: "Tidak Lulus", value: "reject" },
  { label: "Perlu Maklumat Tambahan", value: "need_more_info" },
];

// Form Data
const formData = ref({
  approvalDecision: "",
  approvalComments: "",
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
  statusPendaftaran: "Department Confirmed",
  statusLantikan: "Under Review",
  salinanKadPengenalan: "salinan_kp_ahmad.pdf",
  suratSokongan: "surat_sokongan_ahmad.pdf",
  dokumenLain: null,
  uploadDate: "15/03/2024",
  departmentConfirmation: {
    status: "Disahkan",
    confirmedBy: "Dr. Mohd Zulkifli bin Ahmad",
    confirmedAt: "30/03/2024 15:45",
    comments: "Berdasarkan semakan dokumen dan pengesahan ketua jabatan, calon memenuhi semua kriteria yang ditetapkan. Layak untuk diluluskan.",
  },
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
      action: "Semakan PT",
      date: "20/03/2024 14:30 PM",
      notes: "Calon lulus semakan PT"
    },
    {
      action: "Sokongan Eksekutif",
      date: "25/03/2024 11:30 AM",
      notes: "Calon disokong oleh eksekutif"
    },
    {
      action: "Pengesahan Ketua Jabatan",
      date: "30/03/2024 15:45 PM",
      notes: "Calon disahkan oleh ketua jabatan"
    },
    {
      action: "Menunggu Kelulusan Ketua Divisyen",
      date: "31/03/2024 09:00 AM",
      notes: "Permohonan dalam proses kelulusan ketua divisyen"
    }
  ]
});

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    "Department Confirmed": "success",
    "Under Review": "info",
    "Division Approved": "success",
    "Division Rejected": "danger",
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    Pending: "warning",
    "Under Review": "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3/ketua-divisyen");
};

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // Show success message
    alert("Kelulusan ketua divisyen berjaya dihantar. Calon akan dihantar untuk integrasi NAS");
    
    // Navigate to NAS integration
    navigateTo(`/BF-PA/PP/pra-daftar-v3/nas/cipta-akaun/${route.params.rujukan}`);
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar kelulusan ketua divisyen");
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Show success message
    // Division approval submitted successfully
    
    // Navigate to success page or list
    navigateTo("/BF-PA/PP/pra-daftar-v3/ketua-divisyen");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar kelulusan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const previewDocument = (documentType) => {
  // Simulate document preview
      // Previewing document
  // In real implementation, this would open a modal or navigate to document viewer
};

onMounted(() => {
  // In real implementation, fetch application data based on rujukan
      // Loading application details
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 