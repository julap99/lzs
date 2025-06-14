<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Sokongan Lantikan Penolong Amil (JPPA)
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Calon Penolong Amil -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-medium">Maklumat Calon Penolong Amil</h3>
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

          <!-- Maklumat Wakil Institusi -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Maklumat Wakil Institusi</h3>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Wakil Institusi</p>
                  <p class="font-medium">{{ application.picName }}</p>
                </div>
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

          <!-- Maklumat Jabatan Pengurusan Risiko -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Maklumat Jabatan Pengurusan Risiko</h3>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div class="mb-3">
                <p class="text-sm text-gray-500">Keputusan Tapisan</p>
                <p class="font-medium">
                  <span
                    class="px-2 py-1 text-sm font-medium rounded-md"
                    :class="application.isQualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ application.isQualified ? 'Calon Berkelayakan' : 'Calon Tidak Layak' }}
                  </span>
                </p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Tarikh Tapisan</p>
                  <p class="font-medium">{{ application.uploadDate }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500 mb-1">Catatan dari Jabatan Pengurusan Risiko</p>
                  <p class="text-gray-700">{{ application.notes || "Tiada catatan" }}</p>
                </div>
              </div>

              <!-- Document Preview Section for Surat Tapisan Jabatan Pengurusan Risiko -->
              <div class="mt-6">
                <h4 class="font-medium mb-3">Dokumen Surat Tapisan Jabatan Pengurusan Risiko</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.documentSuratTapisan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('suratTapisan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500">
                    <div class="mb-2">
                      <Icon name="heroicons:document" size="48" class="text-gray-400" />
                    </div>
                    <p class="text-sm">
                      Klik butang "Lihat Dokumen" untuk melihat Surat Tapisan Jabatan Pengurusan Risiko
                    </p>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.picName }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Penilaian Eksekutif JPPA -->
          <FormKit
            type="form"
            id="reviewForm"
            @submit="handleSubmit"
            :actions="false"
          >
            <div class="mb-6">
              <h3 class="font-medium mb-3">Penilaian Eksekutif JPPA</h3>

              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="confirmationCheck"
                  label="Saya mengesahkan bahawa semua maklumat dan dokumen telah disemak dan keputusan saya adalah berdasarkan penilaian yang teliti dan menyokong pelantikan calon ini sebagai Penolong Amil"
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
                Sokong & Hantar ke Ketua JPPA
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal for Submission -->
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
            Sokongan lantikan Penolong Amil berjaya dihantar ke Ketua JPPA.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Menunggu Kelulusan Ketua JPPA".
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
            Status permohonan telah dikemaskini kepada "Tidak Disokong".
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
      :title="isRejecting ? 'Pengesahan Tolak' : 'Pengesahan Sokong'"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            {{ isRejecting 
              ? 'Adakah anda pasti untuk menolak permohonan lantikan Penolong Amil ini?'
              : 'Adakah anda pasti untuk menyokong permohonan lantikan Penolong Amil ini?'
            }}
          </p>
          <p class="text-gray-600 text-sm">
            {{ isRejecting 
              ? 'Selepas ditolak, permohonan ini tidak boleh dihantar semula. Notifikasi akan dihantar kepada calon.'
              : 'Selepas disokong, permohonan akan dihantar kepada Ketua JPPA untuk kelulusan.'
            }}
          </p>
          <div class="mt-4">
            <FormKit
              type="textarea"
              name="remarks"
              :label="isRejecting ? 'Sebab Penolakan' : 'Ulasan / Justifikasi'"
              :placeholder="isRejecting ? 'Masukkan sebab penolakan permohonan' : 'Masukkan ulasan dan justifikasi sokongan'"
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
            {{ isRejecting ? 'Tolak' : 'Sokong' }}
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
  documentSalinanKadPengenalan: "Salinan_Kad_Pengenalan.pdf",
  documentGambarCalon: "Gambar_Calon.jpg",
  documentSuratSokongan: "Surat_Sokongan.pdf",
  documentSuratTapisan: "Surat_Tapisan_Jabatan_Pengurusan_Risiko.pdf",
  notes: "Calon telah melengkapkan semua syarat dan berkelayakan untuk dilantik sebagai Penolong Amil Fitrah.",
  isQualified: true,
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
const showRejectSuccessModal = ref(false);
const showConfirmModal = ref(false);
const showDocumentModal = ref(false);
const isRejecting = ref(false);
const remarks = ref('');

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
    "Menunggu Kelulusan Ketua JPPA": "bg-blue-100 text-blue-800",
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
      application.value.status = "Tidak Disokong";
      
      // Show rejection success modal
      showRejectSuccessModal.value = true;
    } else {
      // Handle submission
      console.log("Submitted review data:", {
        remarks: remarks.value,
        applicationId: application.value.referenceNo,
        reviewedBy: currentUser.value.name,
        reviewedAt: new Date().toISOString(),
      });

      // Update application status
      application.value.status = "Menunggu Kelulusan Ketua JPPA";

      // Show submission success modal
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error("Error processing review:", error);
    alert("Ralat semasa memproses penilaian. Sila cuba lagi.");
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
  navigateTo("/BF-PA/PP/PD/04");
};

const handleRejectModalClose = () => {
  showRejectSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};
</script>
