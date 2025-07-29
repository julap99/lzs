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
                    <Icon name="ph:file-text" class="text-yellow-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">3. Semakan PT</h4>
                    <p class="text-sm text-gray-600 mb-2">Pegawai Tadbir</p>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p class="text-sm text-yellow-800">
                        <strong>Status:</strong> {{ reviewData.statusSemakan }}<br>
                        <span class="text-xs">Disemak oleh: {{ reviewData.disemakOleh || 'Belum disemak' }}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Executive Support -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:hand-thumbs-up" class="text-purple-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">4. Sokongan Eksekutif</h4>
                    <p class="text-sm text-gray-600 mb-2">Eksekutif</p>
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p class="text-sm text-purple-800">
                        <strong>Status:</strong> Menunggu Semakan PT<br>
                        <span class="text-xs">Akan disokong selepas semakan PT selesai</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Step 5: Department Head Confirmation -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <Icon name="ph:check-square" class="text-indigo-600" size="24" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900">5. Pengesahan Ketua Jabatan</h4>
                    <p class="text-sm text-gray-600 mb-2">Ketua Jabatan</p>
                    <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                      <p class="text-sm text-indigo-800">
                        <strong>Status:</strong> Menunggu Sokongan Eksekutif<br>
                        <span class="text-xs">Akan disahkan selepas sokongan eksekutif</span>
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
                        <strong>Status:</strong> Menunggu Pengesahan Ketua Jabatan<br>
                        <span class="text-xs">Akan diluluskan selepas pengesahan ketua jabatan</span>
                      </p>
                    </div>
                  </div>
                </div>
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
    name: "PT",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3/PT",
  },
  {
    name: "Detail Semakan",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/PT/detail/${route.params.rujukan}`,
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
  navigateTo("/BF-PA/PP/pra-daftar-v3/PT");
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
  try {
    isSubmitting.value = true;
    
    // Update review data
    reviewData.value = {
      ...reviewData.value,
      ...reviewForm.value,
      statusSemakan: reviewForm.value.statusSemakan,
      tarikhSemakan: reviewForm.value.tarikhSemakan,
      disemakOleh: reviewForm.value.disemakOleh,
    };
    
    // Show success message
    alert(`Semakan PT berjaya dihantar. Status: ${reviewForm.value.statusSemakan}`);
    
    // Navigate back to dashboard
    navigateTo("/BF-PA/PP/pra-daftar-v3");
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar semakan PT");
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Update review data
    reviewData.value.statusSemakan = reviewForm.value.statusSemakan;
    reviewData.value.tarikhSemakan = reviewForm.value.tarikhSemakan;
    reviewData.value.catatanSemakan = reviewForm.value.catatanSemakan;
    reviewData.value.disemakOleh = reviewForm.value.disemakOleh;
    
    // PT review submitted successfully
    
    // Navigate back to review list
    navigateTo("/BF-PA/PP/pra-daftar-v3/PT");
    
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