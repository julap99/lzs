<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Lantikan Penolong Amil (Ketua JPPA)
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">

                    <!-- Maklumat Calon Penolong Amil -->
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
                    {{ getCategoryLabel(application.candidate.kategoriPenolongAmil) }}
                  </p>
                </div>
              </div>

              <!-- Document Preview Section for Salinan Kad Pengenalan and Gambar Calon -->
              <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Salinan Kad Pengenalan -->
                <div>
                  <h4 class="font-medium mb-3">Salinan Kad Pengenalan</h4>
                  <div class="border border-gray-200 rounded-md">
                    <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                      <div class="flex items-center">
                        <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                        <span>{{ application.documentSalinanKadPengenalan }}</span>
                      </div>
                      <rs-button size="sm" variant="primary-outline" @click="previewDocument('salinanKadPengenalan')">
                        <Icon name="heroicons:eye" class="mr-1" size="16" />
                        Lihat Dokumen
                      </rs-button>
                    </div>
                    <div class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500">
                      <div class="mb-2">
                        <Icon name="heroicons:document" size="48" class="text-gray-400" />
                      </div>
                      <p class="text-sm">Klik butang "Lihat Dokumen" untuk melihat Salinan Kad Pengenalan</p>
                    </div>
                    <div class="p-3 bg-gray-50 text-sm text-gray-500">
                      Dimuat naik oleh {{ application.candidate.namaCalonPenolongAmil }} pada {{ application.uploadDate }}
                    </div>
                  </div>
                </div>

                <!-- Gambar Calon -->
                <div>
                  <h4 class="font-medium mb-3">Gambar Calon</h4>
                  <div class="border border-gray-200 rounded-md">
                    <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                      <div class="flex items-center">
                        <Icon name="heroicons:photo" class="text-blue-600 mr-2" size="20" />
                        <span>{{ application.documentGambarCalon }}</span>
                      </div>
                      <rs-button size="sm" variant="primary-outline" @click="previewDocument('gambarCalon')">
                        <Icon name="heroicons:eye" class="mr-1" size="16" />
                        Lihat Dokumen
                      </rs-button>
                    </div>
                    <div class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500">
                      <div class="mb-2">
                        <Icon name="heroicons:photo" size="48" class="text-gray-400" />
                      </div>
                      <p class="text-sm">Klik butang "Lihat Dokumen" untuk melihat Gambar Calon</p>
                    </div>
                    <div class="p-3 bg-gray-50 text-sm text-gray-500">
                      Dimuat naik oleh {{ application.candidate.namaCalonPenolongAmil }} pada {{ application.uploadDate }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat PIC Masjid -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Maklumat PIC Masjid</h3>
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
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500 mb-1">Catatan dari PIC Masjid</p>
                  <p class="text-gray-700">
                    {{ application.notes || "Tiada catatan" }}
                  </p>
                </div>
              </div>

              <!-- Document Preview Section for Surat Sokongan -->
              <div class="mt-6">
                <h4 class="font-medium mb-3">Surat Sokongan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.documentSuratSokongan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('suratSokongan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500">
                    <div class="mb-2">
                      <Icon name="heroicons:document" size="48" class="text-gray-400" />
                    </div>
                    <p class="text-sm">Klik butang "Lihat Dokumen" untuk melihat Surat Sokongan</p>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.picName }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Application Summary & Status -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-medium">Maklumat Tapisan Jabatan Pengurusan Risiko</h3>
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

          <!-- Document Preview Section -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Dokumen Surat Tapisan Jabatan Pengurusan Risiko</h3>
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
                  <span>{{ application.documentSuratTapisan }}</span>
                </div>
                <rs-button
                  size="sm"
                  variant="primary-outline"
                  @click="previewDocument('suratTapisan')"
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
                  Klik butang "Lihat Dokumen" untuk melihat Surat Tapisan Jabatan Pengurusan Risiko
                </p>
              </div>
              <div class="p-3 bg-gray-50 text-sm text-gray-500">
                Dimuat naik oleh {{ riskScreening.officer }} pada
                {{ riskScreening.uploadDate }}
              </div>
            </div>
          </div>

          <!-- Executive Review Section -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Sokongan Eksekutif JPPA</h3>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div class="mb-3">
                <p class="text-sm text-gray-500">Keputusan Sokongan</p>
                <p class="font-medium">
                  <span
                    class="px-2 py-1 text-sm font-medium rounded-md"
                    :class="
                      application.executiveReview.recommendation === 'approve'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{
                      application.executiveReview.recommendation === "approve"
                        ? "Disokong"
                        : "Tidak Disokong"
                    }}
                  </span>
                </p>
              </div>
              <div class="mb-3">
                <p class="text-sm text-gray-500">Ulasan/Justifikasi</p>
                <p class="text-gray-700">
                  {{ application.executiveReview.comments }}
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Disokong Oleh</p>
                  <p class="font-medium">
                    {{ application.executiveReview.reviewedBy }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Sokongan</p>
                  <p class="font-medium">
                    {{ application.executiveReview.reviewedAt }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Manager Approval Form -->
          <FormKit
            type="form"
            id="approvalForm"
            @submit="handleSubmit"
            :actions="false"
          >
            <div class="mb-6">
              <h3 class="font-medium mb-3">Keputusan Ketua JPPA</h3>

              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="confirmationCheck"
                  label="Saya mengesahkan bahawa semua maklumat dan dokumen telah disemak dan keputusan saya adalah muktamad"
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
                variant="danger"
                @click="handleReject"
              >
                Tolak
              </rs-button>
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Lulus & Hantar
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal for Submission -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kelulusan Berjaya Dihantar"
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
            Kelulusan lantikan Penolong Amil berjaya direkodkan.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Diluluskan".
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

    <!-- Success Modal for Rejection -->
    <rs-modal
      v-model="showRejectSuccessModal"
      title="Permohonan Ditolak"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-red-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Permohonan lantikan Penolong Amil telah ditolak.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Ditolak".
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleRejectModalClose">
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      :title="isRejecting ? 'Pengesahan Tolak' : 'Pengesahan Lulus'"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            {{ isRejecting 
              ? 'Adakah anda pasti untuk menolak permohonan lantikan Penolong Amil ini?'
              : 'Adakah anda pasti untuk meluluskan permohonan lantikan Penolong Amil ini?'
            }}
          </p>
          <p class="text-gray-600 text-sm">
            {{ isRejecting 
              ? 'Selepas ditolak, permohonan ini tidak boleh dihantar semula. Notifikasi akan dihantar kepada calon.'
              : 'Selepas diluluskan, permohonan ini adalah muktamad. Notifikasi akan dihantar kepada semua pihak yang berkaitan.'
            }}
          </p>
          <div class="mt-4">
            <FormKit
              type="textarea"
              name="remarks"
              :label="isRejecting ? 'Sebab Penolakan' : 'Ulasan / Justifikasi'"
              :placeholder="isRejecting ? 'Masukkan sebab penolakan permohonan' : 'Masukkan ulasan dan justifikasi kelulusan'"
              validation="required"
              :validation-messages="{
                required: isRejecting ? 'Sila masukkan sebab penolakan' : 'Sila masukkan ulasan',
              }"
              rows="3"
              v-model="remarks"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="outline" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button 
            :variant="isRejecting ? 'danger' : 'primary'" 
            @click="confirmSubmission"
          >
            {{ isRejecting ? 'Tolak' : 'Lulus' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Document Preview Modal -->
    <rs-modal
      v-model="showDocumentModal"
      title="Surat Tapisan Jabatan Pengurusan Risiko"
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
          <rs-button variant="primary-outline" @click="downloadDocument">
            <Icon name="heroicons:arrow-down-tray" class="mr-1" size="16" />
            Muat Turun
          </rs-button>
          <rs-button variant="primary" @click="showDocumentModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kelulusan Lantikan Penolong Amil",
  description:
    "Semakan dan kelulusan permohonan lantikan penolong amil oleh Ketua JPPA",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/JPPA/PS/01",
  },
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-PA/JPPA/PS/03",
  },
  {
    name: "Kelulusan Lantikan",
    type: "current",
    path: "/BF-PA/JPPA/PS/04",
  },
]);

// Mock application data (would be fetched from API in real app)
const application = ref({
  referenceNo: "PA-2025-0542",
  applicationDate: "12/05/2025",
  masjidName: "Masjid Wilayah Persekutuan",
  picName: "Mohd Razak bin Ibrahim",
  status: "Menunggu Kelulusan Ketua JPPA",
  uploadDate: "12/05/2025, 14:32",
  documentSuratTapisan: "Surat_Tapisan_Jabatan_Pengurusan_Risiko.pdf",
  notes:
    "Calon telah melengkapkan semua syarat dan berkelayakan untuk dilantik sebagai Penolong Amil Fitrah.",
  candidate: {
    noKadPengenalan: "901231012345",
    namaCalonPenolongAmil: "Ahmad bin Abdullah",
    emel: "ahmad@email.com",
    kategoriPenolongAmil: "FITRAH",
  },
  executiveReview: {
    recommendation: "approve",
    comments:
      "Berdasarkan semakan dokumen, calon memenuhi semua kriteria dan layak untuk dilantik sebagai Penolong Amil Fitrah. Rekod calon juga bersih dan tiada sebarang rekod negatif.",
    reviewedBy: "Sarah binti Hamid",
    reviewedAt: "15/05/2025, 10:45",
  },
});

const riskScreening = ref({
  status: 'Lulus',
  date: '15/05/2025',
  officer: 'Dr. Siti Aminah binti Abdullah',
  notes: 'Calon bebas risiko dan layak.',
  uploadDate: '15/05/2025, 10:15',
});

// Form submission state
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showRejectSuccessModal = ref(false);
const showConfirmModal = ref(false);
const showDocumentModal = ref(false);
const isRejecting = ref(false);
const remarks = ref('');

// Get current JPPA manager info (would be fetched from API/store in real app)
const currentUser = ref({
  name: "Dr. Azman bin Abdul Rahman",
  position: "Ketua JPPA",
  department: "Jabatan Pengurusan Penolong Amil",
  email: "azman@jppa.gov.my",
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
    "Menunggu Kelulusan Ketua JPPA": "bg-blue-100 text-blue-800",
    Diluluskan: "bg-green-100 text-green-800",
    "Tidak Disokong": "bg-red-100 text-red-800",
    Ditolak: "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

const getRiskStatusClass = (status) => {
  if (status === 'Lulus') return 'bg-green-100 text-green-800';
  if (status === 'Tidak Lulus') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

// Document handlers
const previewDocument = (type) => {
  showDocumentModal.value = true;
};

const downloadDocument = () => {
  // This would be replaced with actual download functionality
  alert("Fungsi muat turun akan dilaksanakan dalam sistem sebenar.");
};

// Form submission handlers
const handleSubmit = async (formData) => {
  // Store approval data and show confirmation modal
  isRejecting.value = false;
  showConfirmModal.value = true;
};

const handleReject = () => {
  isRejecting.value = true;
  showConfirmModal.value = true;
};

const confirmSubmission = async () => {
  try {
    isSubmitting.value = true;
    showConfirmModal.value = false;

    if (isRejecting.value) {
      // Handle rejection
      console.log("Rejected application:", {
        remarks: remarks.value,
        timestamp: new Date().toISOString(),
      });
      
      // Update application status
      application.value.status = "Ditolak";
      
      // Show rejection success modal
      showRejectSuccessModal.value = true;
    } else {
      // Handle submission
      console.log("Submitted approval data:", {
        remarks: remarks.value,
        applicationId: application.value.referenceNo,
        approvedBy: currentUser.value.name,
        approvedAt: new Date().toISOString(),
      });

      // Update application status
      application.value.status = "Diluluskan";

      // Show submission success modal
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error("Error processing approval:", error);
    alert("Ralat semasa memproses kelulusan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation and modal handlers
const goBack = () => {
  navigateTo("/BF-PA/PP/PD/03");
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/05");
};

const handleRejectModalClose = () => {
  showRejectSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};
</script>
