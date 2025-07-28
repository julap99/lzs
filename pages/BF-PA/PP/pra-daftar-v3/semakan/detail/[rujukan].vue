<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semakan PT Calon Penolong Amil
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
            <rs-button
              variant="success"
              @click="handleApproveReview"
              :disabled="reviewData.statusSemakan === 'Lulus'"
            >
              <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
              Lulus Semakan
            </rs-button>
            <rs-button
              variant="danger"
              @click="handleRejectReview"
              :disabled="reviewData.statusSemakan === 'Tidak Lulus'"
            >
              <Icon name="ph:x-circle" class="w-4 h-4 mr-1" />
              Tidak Lulus
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
                  Status Semakan PT
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ application.statusPendaftaran }}
                </rs-badge>
                <rs-badge :variant="getReviewStatusVariant(reviewData.statusSemakan)">
                  {{ reviewData.statusSemakan }}
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

          <!-- Screening Results -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Keputusan Saringan
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
                <p class="text-gray-900">{{ screeningData.disaredOleh }}</p>
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

          <!-- PT Review Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Semakan PT
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status Semakan
                </label>
                <rs-badge :variant="getReviewStatusVariant(reviewData.statusSemakan)">
                  {{ reviewData.statusSemakan }}
                </rs-badge>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Semakan
                </label>
                <p class="text-gray-900">{{ reviewData.tarikhSemakan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Disemak Oleh
                </label>
                <p class="text-gray-900">{{ reviewData.disemakOleh }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jabatan PT
                </label>
                <p class="text-gray-900">{{ reviewData.jabatanPT }}</p>
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Catatan Semakan
                </label>
                <p class="text-gray-900">{{ reviewData.catatanSemakan }}</p>
              </div>
            </div>
          </div>

          <!-- Review Criteria -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Kriteria Semakan PT
            </h3>
            
            <div class="space-y-4">
              <div v-for="(criteria, index) in reviewData.kriteriaSemakan" :key="index" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
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

          <!-- PT Review Action Form -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Tindakan Semakan PT
            </h3>
            
            <FormKit
              type="form"
              id="reviewForm"
              :actions="false"
              @submit="handleReviewSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="select"
                  name="statusSemakan"
                  label="Status Semakan"
                  :options="statusSemakanOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Status semakan diperlukan',
                  }"
                  v-model="reviewForm.statusSemakan"
                />

                <FormKit
                  type="date"
                  name="tarikhSemakan"
                  label="Tarikh Semakan"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh semakan diperlukan',
                  }"
                  v-model="reviewForm.tarikhSemakan"
                />

                <FormKit
                  type="textarea"
                  name="catatanSemakan"
                  label="Catatan Semakan"
                  placeholder="Masukkan catatan semakan..."
                  v-model="reviewForm.catatanSemakan"
                />

                <FormKit
                  type="text"
                  name="disemakOleh"
                  label="Disemak Oleh"
                  placeholder="Nama penyemak PT"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama penyemak diperlukan',
                  }"
                  v-model="reviewForm.disemakOleh"
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
                  {{ isSubmitting ? 'Menghantar...' : 'Hantar Semakan' }}
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
  title: "Semakan PT Calon Penolong Amil",
  description: "Paparan semakan PT calon penolong amil",
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
    name: "Semakan PT",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3/semakan",
  },
  {
    name: "Detail Semakan",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/semakan/detail/${route.params.rujukan}`,
  },
]);

// RTMF Required Options
const statusSemakanOptions = [
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
  statusPendaftaran: "Screened",
});

// Mock screening data
const screeningData = ref({
  statusSaringan: "Lulus",
  tarikhSaringan: "20/03/2024",
  disaredOleh: "Encik Mohd Zulkifli bin Ahmad",
  jabatan: "Jabatan Pengurusan Risiko",
  catatanSaringan: "Calon telah lulus semua kriteria saringan.",
});

// Mock PT review data
const reviewData = ref({
  statusSemakan: "Dalam Proses",
  tarikhSemakan: "25/03/2024",
  disemakOleh: "Dr. Siti Aminah binti Hassan",
  jabatanPT: "Jabatan Pengurusan Talenta",
  catatanSemakan: "Semakan PT sedang dijalankan untuk memastikan kelayakan calon.",
  kriteriaSemakan: [
    {
      nama: "Kelayakan Akademik",
      deskripsi: "Memastikan kelayakan akademik calon",
      status: "Lulus",
      catatan: "Sijil SPM diperolehi",
    },
    {
      nama: "Pengalaman Kerja",
      deskripsi: "Semakan pengalaman kerja calon",
      status: "Lulus",
      catatan: "Mempunyai pengalaman yang sesuai",
    },
    {
      nama: "Kemahiran Komunikasi",
      deskripsi: "Penilaian kemahiran komunikasi calon",
      status: "Dalam Proses",
      catatan: "Menunggu penilaian kemahiran",
    },
    {
      nama: "Kesediaan Kerja",
      deskripsi: "Penilaian kesediaan calon untuk bekerja",
      status: "Lulus",
      catatan: "Calon menunjukkan kesediaan yang baik",
    },
  ],
});

// Form data
const reviewForm = ref({
  statusSemakan: reviewData.value.statusSemakan,
  tarikhSemakan: new Date().toISOString().split('T')[0],
  catatanSemakan: "",
  disemakOleh: "Dr. Siti Aminah binti Hassan",
});

const isSubmitting = ref(false);

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Screened: "success",
    "Under Review": "info",
    "PT Reviewed": "success",
    "PT Rejected": "danger",
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

const getReviewStatusVariant = (status) => {
  const statusVariants = {
    "Dalam Proses": "warning",
    Lulus: "success",
    "Tidak Lulus": "danger",
  };
  return statusVariants[status] || "default";
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3/semakan");
};

const handleApproveReview = () => {
  reviewForm.value.statusSemakan = "Lulus";
  handleReviewSubmit();
};

const handleRejectReview = () => {
  reviewForm.value.statusSemakan = "Tidak Lulus";
  handleReviewSubmit();
};

const handleReviewSubmit = async (formData) => {
  // Form submission handler
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update review data
    reviewData.value.statusSemakan = reviewForm.value.statusSemakan;
    reviewData.value.tarikhSemakan = reviewForm.value.tarikhSemakan;
    reviewData.value.catatanSemakan = reviewForm.value.catatanSemakan;
    reviewData.value.disemakOleh = reviewForm.value.disemakOleh;
    
    // PT review submitted successfully
    
    // Navigate back to review list
    navigateTo("/BF-PA/PP/pra-daftar-v3/semakan");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar semakan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};



onMounted(() => {
  // In real implementation, fetch application, screening, and review data based on rujukan
      // Loading PT review details
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 