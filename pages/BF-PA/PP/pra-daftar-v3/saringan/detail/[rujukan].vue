<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

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

          <!-- Screening Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Saringan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status Saringan
                </label>
                <rs-badge :variant="getScreeningStatusVariant(screeningData.statusSaringan)">
                  {{ screeningData.statusSaringan }}
                </rs-badge>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Saringan
                </label>
                <p class="text-gray-900">{{ screeningData.tarikhSaringan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Disaring Oleh
                </label>
                <p class="text-gray-900">{{ screeningData.disaringOleh }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jabatan
                </label>
                <p class="text-gray-900">{{ screeningData.jabatan }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Catatan Saringan
                </label>
                <p class="text-gray-900">{{ screeningData.catatanSaringan }}</p>
              </div>
            </div>
          </div>

          <!-- Screening Criteria -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Kriteria Saringan
            </h3>
            
            <div class="space-y-4">
              <div v-for="(criteria, index) in screeningData.kriteriaSaringan" :key="index" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 class="font-medium text-gray-900">{{ criteria.nama }}</h4>
                  <p class="text-sm text-gray-600">{{ criteria.deskripsi }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <rs-badge :variant="criteria.status === 'Lulus' ? 'success' : 'danger'">
                    {{ criteria.status }}
                  </rs-badge>
                  <span class="text-sm text-gray-500">{{ criteria.catatan }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Screening Action Form -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Tindakan Saringan
            </h3>
            
            <FormKit
              type="form"
              id="screeningForm"
              :actions="false"
              @submit="handleScreeningSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="select"
                  name="statusSaringan"
                  label="Status Saringan"
                  :options="statusSaringanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Status saringan diperlukan',
                  }"
                  v-model="screeningForm.statusSaringan"
                />

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

                <FormKit
                  type="textarea"
                  name="catatanSaringan"
                  label="Catatan Saringan"
                  placeholder="Masukkan catatan saringan..."
                  v-model="screeningForm.catatanSaringan"
                />

                <FormKit
                  type="text"
                  name="disaringOleh"
                  label="Disaring Oleh"
                  placeholder="Nama penyaring"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama penyaring diperlukan',
                  }"
                  v-model="screeningForm.disaredOleh"
                />
              </div>

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
                  {{ isSubmitting ? 'Menghantar...' : 'Hantar Saringan' }}
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
  description: "Paparan saringan calon penolong amil",
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
    name: "Saringan",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3/saringan",
  },
  {
    name: "Detail Saringan",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/saringan/detail/${route.params.rujukan}`,
  },
]);

// RTMF Required Options
const statusSaringanOptions = [
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Dalam Proses", value: "Dalam Proses" },
];

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
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Under Review",
});

// Mock screening data
const screeningData = ref({
  statusSaringan: "Dalam Proses",
  tarikhSaringan: "20/03/2024",
  disaredOleh: "Encik Mohd Zulkifli bin Ahmad",
  jabatan: "Jabatan Pengurusan Risiko",
  catatanSaringan: "Saringan sedang dijalankan untuk memastikan kelayakan calon.",
  kriteriaSaringan: [
    {
      nama: "Kelayakan Akademik",
      deskripsi: "Memastikan kelayakan akademik calon",
      status: "Lulus",
      catatan: "Sijil SPM diperolehi",
    },
    {
      nama: "Rekod Jenayah",
      deskripsi: "Semakan rekod jenayah calon",
      status: "Lulus",
      catatan: "Tiada rekod jenayah",
    },
    {
      nama: "Kesihatan",
      deskripsi: "Pemeriksaan kesihatan calon",
      status: "Dalam Proses",
      catatan: "Menunggu laporan kesihatan",
    },
    {
      nama: "Rujukan",
      deskripsi: "Semakan rujukan calon",
      status: "Lulus",
      catatan: "Rujukan disahkan",
    },
  ],
});

// Form data
const screeningForm = ref({
  statusSaringan: screeningData.value.statusSaringan,
  tarikhSaringan: new Date().toISOString().split('T')[0],
  catatanSaringan: "",
  disaredOleh: "Encik Mohd Zulkifli bin Ahmad",
});

const isSubmitting = ref(false);

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Submitted: "warning",
    "Under Review": "info",
    Screened: "success",
    "Screening Failed": "danger",
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
  navigateTo("/BF-PA/PP/pra-daftar-v3/saringan");
};

const handleApproveScreening = () => {
  screeningForm.value.statusSaringan = "Lulus";
  handleScreeningSubmit();
};

const handleRejectScreening = () => {
  screeningForm.value.statusSaringan = "Tidak Lulus";
  handleScreeningSubmit();
};

const handleScreeningSubmit = async (formData) => {
  // Form submission handler
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
    
    // Navigate back to screening list
    navigateTo("/BF-PA/PP/pra-daftar-v3/saringan");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar saringan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};



onMounted(() => {
  // In real implementation, fetch application and screening data based on rujukan
      // Loading screening details
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 