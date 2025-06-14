<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tapisan Lantikan Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Summary & Status -->
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
                        candidateInfo.kategoriPenolongAmil
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
                  <p class="text-sm text-gray-500">Wakil Institusi</p>
                  <p class="font-medium">{{ application.picName }}</p>
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

          <!-- Document Upload Section -->
          <FormKit
            type="form"
            id="documentUploadForm"
            @submit="handleSubmit"
            :actions="false"
          >
            <div class="mb-6">
              <h3 class="font-medium mb-3">
                Muat Naik Surat Tapisan Jabatan Pengurusan Risiko
              </h3>

              <FormKit
                type="file"
                name="suratPengesahan"
                label="Surat Tapisan"
                help="Format dokumen: PDF atau JPEG sahaja (Maksimum 5MB)"
                accept=".pdf,.jpg,.jpeg"
                validation="required|mime:application/pdf,image/jpeg,image/jpg|size:5000000"
                :validation-messages="{
                  required: 'Surat tapisan lantikan diperlukan',
                  mime: 'Format fail tidak sah. Sila muat naik fail PDF atau JPEG sahaja',
                  size: 'Saiz fail melebihi had maksimum 5MB',
                }"
              />

              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="confirmationCheck"
                  label="Saya mengesahkan bahawa dokumen yang dimuat naik telah disahkan dan ditandatangani oleh wakil institusi"
                  validation="accepted"
                  :validation-messages="{
                    accepted: 'Sila sahkan dokumen telah disahkan',
                  }"
                />
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button variant="primary-outline" @click="goBack"> Kembali </rs-button>
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
                Telah Disahkan & Hantar ke JPPA
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal for Submission -->
    <rs-modal
      v-model="showSuccessModal"
      title="Pengesahan Berjaya Dihantar"
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
            Surat Tapisan Lantikan Penolong Amil berjaya dimuat naik dan dihantar.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Menunggu Sokongan JPPA".
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
      :title="isRejecting ? 'Pengesahan Tolak' : 'Pengesahan Hantar'"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            {{ isRejecting 
              ? 'Adakah anda pasti untuk menolak permohonan lantikan Penolong Amil ini?'
              : 'Adakah anda pasti untuk menghantar permohonan lantikan Penolong Amil ini kepada JPPA?'
            }}
          </p>
          <p class="text-gray-600 text-sm">
            {{ isRejecting 
              ? 'Selepas ditolak, permohonan ini tidak boleh dihantar semula. Notifikasi akan dihantar kepada calon.'
              : 'Selepas dihantar, anda tidak boleh lagi mengemaskini maklumat sehingga tindakan diambil oleh pihak JPPA.'
            }}
          </p>
          <div class="mt-4">
            <FormKit
              type="textarea"
              name="remarks"
              :label="isRejecting ? 'Sebab Penolakan' : 'Catatan'"
              :placeholder="isRejecting ? 'Masukkan sebab penolakan permohonan' : 'Masukkan catatan tambahan (jika ada)'"
              validation="required"
              :validation-messages="{
                required: isRejecting ? 'Sila masukkan sebab penolakan' : 'Sila masukkan catatan',
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
            {{ isRejecting ? 'Tolak' : 'Hantar' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Pengesahan Lantikan Penolong Amil",
  description:
    "Pengesahan dan muat naik dokumen lantikan penolong amil oleh Wakil Institusi",
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
    name: "Tapisan Lantikan",
    type: "current",
    path: "/BF-PA/PP/PM/02",
  },
]);

// Mock candidate data (would be fetched from API in real app)
const application = ref({
  referenceNo: "PA-2025-0542",
  applicationDate: "12/05/2025",
  masjidName: "Masjid Wilayah Persekutuan",
  picName: "Mohd Razak bin Ibrahim",
  picPhone: "0123456789",
  picEmail: "razak@masjid.gov.my",
  uploadDate: "12/05/2025, 14:32",
  status: "Menunggu Tapisan",
  documentSalinanKadPengenalan: "Salinan_Kad_Pengenalan.pdf",
  documentGambarCalon: "Gambar_Calon.jpg",
  documentSuratSokongan: "Surat_Sokongan.pdf",
  candidate: {
    namaCalonPenolongAmil: "Ahmad bin Abdullah",
    noKadPengenalan: "901231012345",
    emel: "ahmad@email.com",
    noTelefon: "0123456789"
  }
});
const candidateInfo = ref({
  noKadPengenalan: "901231012345",
  namaCalonPenolongAmil: "Ahmad bin Abdullah",
  emel: "ahmad@email.com",
  kategoriPenolongAmil: "FITRAH",
  status: "Belum Disemak",
});


// Form submission state
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showRejectSuccessModal = ref(false);
const showConfirmModal = ref(false);
const uploadedDocument = ref(null);
const isRejecting = ref(false);
const remarks = ref('');

// Get current masjid info (would be fetched from API/store in real app)
const currentMasjid = ref({
  namaMasjid: "Masjid Wilayah Persekutuan",
  kodMasjid: "MSJ-KUL-001",
  namaPIC: "Mohd Razak bin Ibrahim",
  emel: "razak@masjid.gov.my",
  noTelefon: "013-9876543",
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
    "Menunggu Tapisan": "bg-yellow-100 text-yellow-800",
    "Menunggu Sokongan JPPA": "bg-blue-100 text-blue-800",
    "Menunggu Kelulusan Ketua JPPA": "bg-blue-100 text-blue-800",
    "Diluluskan": "bg-green-100 text-green-800",
    "Tidak Disokong": "bg-red-100 text-red-800",
    "Ditolak": "bg-red-100 text-red-800"
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

// Form submission handlers
const handleSubmit = async (formData) => {
  // Show confirmation modal before proceeding
  isRejecting.value = false;
  showConfirmModal.value = true;
  uploadedDocument.value = formData;
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
      
      // Update candidate status
      candidateInfo.value.status = "Ditolak";
      
      // Show rejection success modal
      showRejectSuccessModal.value = true;
    } else {
      // Handle submission
      console.log("Submitted document data:", {
        ...uploadedDocument.value,
        remarks: remarks.value,
        masjidId: currentMasjid.value.kodMasjid,
        namaMasjid: currentMasjid.value.namaMasjid,
        timestamp: new Date().toISOString(),
      });

      // Update candidate status
      candidateInfo.value.status = "Menunggu Sokongan JPPA";

      // Show submission success modal
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error("Error processing form:", error);
    alert("Ralat semasa memproses permohonan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation and modal handlers
const goBack = () => {
  navigateTo("/BF-PA/PP/PD");
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/03");
};

const handleRejectModalClose = () => {
  showRejectSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};

// Update the script section to include new document preview function
const previewDocument = (documentType) => {
  // TODO: Implement document preview logic based on documentType
  console.log(`Previewing ${documentType} document`)
}
</script>
