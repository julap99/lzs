<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Sokongan Lantikan Penolong Amil (Eksekutif JPPA)
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Summary & Status -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-medium">Ringkasan Permohonan</h3>
              <span
                class="px-3 py-1 text-sm font-medium rounded-full"
                :class="getStatusClass(application.status)"
              >
                {{ application.status }}
              </span>
            </div>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">No. Rujukan</p>
                  <p class="font-medium">{{ application.referenceNo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Permohonan</p>
                  <p class="font-medium">{{ application.applicationDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Masjid</p>
                  <p class="font-medium">{{ application.masjidName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">PIC Masjid</p>
                  <p class="font-medium">{{ application.picName }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Candidate Information Section -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Maklumat Calon Penolong Amil</h3>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Nombor Kad Pengenalan</p>
                  <p class="font-medium">
                    {{ application.candidate.noKadPengenalan }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Calon</p>
                  <p class="font-medium">
                    {{ application.candidate.namaCalonPenolongAmil }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Emel</p>
                  <p class="font-medium">{{ application.candidate.emel }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Kategori Penolong Amil</p>
                  <p class="font-medium">
                    {{
                      getCategoryLabel(
                        application.candidate.kategoriPenolongAmil
                      )
                    }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500 mb-1">
                    Catatan dari PIC Masjid
                  </p>
                  <p class="text-gray-700">
                    {{ application.notes || "Tiada catatan" }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Document Preview Section -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Dokumen Surat Pengesahan Lantikan</h3>
            <div class="border border-gray-200 rounded-md">
              <div
                class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center"
              >
                <div class="flex items-center">
                  <Icon
                    name="heroicons:document-text"
                    class="text-blue-600 mr-2"
                    size="20"
                  />
                  <span>{{ application.documentName }}</span>
                </div>
                <rs-button
                  size="sm"
                  variant="primary-outline"
                  @click="previewDocument"
                >
                  <Icon name="heroicons:eye" class="mr-1" size="16" />
                  Lihat Dokumen
                </rs-button>
              </div>
              <div
                class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500"
              >
                <div class="mb-2">
                  <Icon
                    name="heroicons:document"
                    size="48"
                    class="text-gray-400"
                  />
                </div>
                <p class="text-sm">
                  Klik butang "Lihat Dokumen" untuk melihat surat pengesahan
                  lantikan
                </p>
              </div>
              <div class="p-3 bg-gray-50 text-sm text-gray-500">
                Dimuat naik oleh {{ application.picName }} pada
                {{ application.uploadDate }}
              </div>
            </div>
          </div>

          <!-- Review Form -->
          <FormKit
            type="form"
            id="reviewForm"
            @submit="handleSubmit"
            :actions="false"
          >
            <div class="mb-6">
              <h3 class="font-medium mb-3">Penilaian Eksekutif JPPA</h3>

              <div class="mb-4">
                <FormKit
                  type="radio"
                  name="recommendation"
                  label="Keputusan Sokongan"
                  :options="[
                    { label: 'Sokong', value: 'approve' },
                    { label: 'Tidak Sokong', value: 'reject' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Keputusan sokongan diperlukan',
                  }"
                />
              </div>

              <FormKit
                type="textarea"
                name="comments"
                label="Ulasan / Justifikasi"
                placeholder="Masukkan ulasan dan justifikasi keputusan"
                validation="required"
                :validation-messages="{
                  required: 'Ulasan diperlukan',
                }"
                rows="4"
              />

              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="confirmationCheck"
                  label="Saya mengesahkan bahawa semua maklumat dan dokumen telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti"
                  validation="accepted"
                  :validation-messages="{
                    accepted: 'Sila buat pengesahan sebelum hantar',
                  }"
                />
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button variant="primary-outline" @click="goBack">
                Kembali
              </rs-button>
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Hantar ke Pengurus JPPA
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Sokongan Berjaya Dihantar"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-green-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Sokongan lantikan Penolong Amil berjaya dihantar ke Pengurus JPPA.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada
            {{
              reviewData.recommendation === "approve"
                ? '"Menunggu Kelulusan Pengurus"'
                : '"Tidak Disokong"'
            }}.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Document Preview Modal -->
    <rs-modal
      v-model="showDocumentModal"
      title="Surat Pengesahan Lantikan"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="text-center p-4">
          <!-- Placeholder for document viewer -->
          <div
            class="bg-gray-100 rounded-md p-10 flex flex-col items-center justify-center"
          >
            <Icon
              name="heroicons:document-text"
              size="64"
              class="text-gray-400 mb-4"
            />
            <p class="text-gray-500">
              Pratonton dokumen tidak tersedia dalam demo ini
            </p>
            <p class="text-sm text-gray-400 mt-2">
              Dalam sistem sebenar, dokumen PDF atau JPEG akan dipaparkan di
              sini
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <rs-button variant="outline" @click="downloadDocument">
            <Icon name="heroicons:arrow-down-tray" class="mr-1" size="16" />
            Muat Turun
          </rs-button>
          <rs-button variant="primary" @click="showDocumentModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      title="Pengesahan Hantar"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            Adakah anda pasti untuk menghantar sokongan
            <span
              class="font-medium"
              :class="
                reviewData.recommendation !== 'approve'
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              {{
                reviewData.recommendation !== "approve"
                  ? "SOKONG"
                  : "TIDAK SOKONG"
              }}
            </span>
            bagi permohonan lantikan Penolong Amil ini kepada Pengurus JPPA?
          </p>
          <p class="text-gray-600 text-sm">
            Selepas dihantar, anda tidak boleh lagi mengemaskini sokongan
            sehingga tindakan diambil oleh Pengurus JPPA.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="outline" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmSubmission">
            Hantar
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Sokongan Lantikan Penolong Amil",
  description:
    "Semakan dan sokongan permohonan lantikan penolong amil oleh Eksekutif JPPA",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/JPPA/PS/01",
  },
  {
    name: "Sokongan",
    type: "link",
    path: "/BF-PA/JPPA/PS/01",
  },
  {
    name: "Sokongan Lantikan",
    type: "current",
    path: "/BF-PA/JPPA/PS/02",
  },
]);

// Mock application data (would be fetched from API in real app)
const application = ref({
  referenceNo: "PA-2025-0542",
  applicationDate: "12/05/2025",
  masjidName: "Masjid Wilayah Persekutuan",
  picName: "Mohd Razak bin Ibrahim",
  status: "Menunggu Sokongan JPPA",
  uploadDate: "12/05/2025, 14:32",
  documentName: "Surat_Pengesahan_Lantikan_Ahmad_bin_Abdullah.pdf",
  notes:
    "Calon telah melengkapkan semua syarat dan berkelayakan untuk dilantik sebagai Penolong Amil Fitrah.",
  candidate: {
    noKadPengenalan: "901231012345",
    namaCalonPenolongAmil: "Ahmad bin Abdullah",
    emel: "ahmad@email.com",
    kategoriPenolongAmil: "FITRAH",
  },
});

// Form submission state
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showConfirmModal = ref(false);
const showDocumentModal = ref(false);
const reviewData = ref({
  recommendation: "",
  comments: "",
});

// Get current JPPA executive info (would be fetched from API/store in real app)
const currentUser = ref({
  name: "Sarah binti Hamid",
  position: "Eksekutif JPPA",
  department: "Jabatan Pengurusan Penolong Amil",
  email: "sarah@jppa.gov.my",
});

// Helper functions
const getCategoryLabel = (value) => {
  const categories = {
    FITRAH: "Fitrah",
    PADI: "Padi",
    KARIAH: "Kariah",
    KOMUNITI: "Komuniti",
  };
  return categories[value] || value;
};

const getStatusClass = (status) => {
  const statusClasses = {
    "Menunggu Sokongan JPPA": "bg-yellow-100 text-yellow-800",
    "Menunggu Kelulusan Pengurus": "bg-blue-100 text-blue-800",
    Diluluskan: "bg-green-100 text-green-800",
    "Tidak Disokong": "bg-red-100 text-red-800",
    Ditolak: "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

// Document handlers
const previewDocument = () => {
  showDocumentModal.value = true;
};

const downloadDocument = () => {
  // This would be replaced with actual download functionality
  alert("Fungsi muat turun akan dilaksanakan dalam sistem sebenar.");
};

// Form submission handlers
const handleSubmit = async (formData) => {
  // Store review data and show confirmation modal
  reviewData.value = formData;
  showConfirmModal.value = true;
};

const confirmSubmission = async () => {
  try {
    isSubmitting.value = true;
    showConfirmModal.value = false;

    // Mock API call - would be replaced with actual API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Submitted review data:", {
      ...reviewData.value,
      applicationId: application.value.referenceNo,
      reviewedBy: currentUser.value.name,
      reviewedAt: new Date().toISOString(),
    });

    // Update application status based on recommendation
    application.value.status =
      reviewData.value.recommendation === "approve"
        ? "Menunggu Kelulusan Pengurus"
        : "Tidak Disokong";

    // Show success modal after submission
    // showSuccessModal.value = true;

    navigateTo("/BF-PA/PP/PD/05");
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Ralat semasa menghantar sokongan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation and modal handlers
const goBack = () => {
  navigateTo("/BF-PA/PP/PD/01");
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/05");
};
</script>
