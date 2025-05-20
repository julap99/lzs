<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pengesahan Lantikan Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Candidate Information Section -->
          <div class="mb-6">
            <h3 class="font-medium mb-3">Maklumat Calon Penolong Amil</h3>
            <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Nombor Kad Pengenalan</p>
                  <p class="font-medium">{{ candidateInfo.noKadPengenalan }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Calon</p>
                  <p class="font-medium">
                    {{ candidateInfo.namaCalonPenolongAmil }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Emel</p>
                  <p class="font-medium">{{ candidateInfo.emel }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Kategori Penolong Amil</p>
                  <p class="font-medium">
                    {{ getCategoryLabel(candidateInfo.kategoriPenolongAmil) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status Pendaftaran</p>
                  <p>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(candidateInfo.status)"
                    >
                      {{ candidateInfo.status }}
                    </span>
                  </p>
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
                Muat Naik Surat Pengesahan Lantikan
              </h3>

              <FormKit
                type="file"
                name="suratPengesahan"
                label="Surat Pengesahan Lantikan"
                help="Format dokumen: PDF atau JPEG sahaja (Maksimum 5MB)"
                accept=".pdf,.jpg,.jpeg"
                validation="required|mime:application/pdf,image/jpeg,image/jpg|size:5000000"
                :validation-messages="{
                  required: 'Surat pengesahan lantikan diperlukan',
                  mime: 'Format fail tidak sah. Sila muat naik fail PDF atau JPEG sahaja',
                  size: 'Saiz fail melebihi had maksimum 5MB',
                }"
              />

              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="confirmationCheck"
                  label="Saya mengesahkan bahawa dokumen yang dimuat naik telah disahkan dan ditandatangani oleh pihak masjid"
                  validation="accepted"
                  :validation-messages="{
                    accepted: 'Sila sahkan dokumen telah disahkan',
                  }"
                />
              </div>
            </div>

            <div class="mt-6">
              <h3 class="font-medium mb-3">Catatan (Jika Ada)</h3>
              <FormKit
                type="textarea"
                name="notes"
                placeholder="Masukkan catatan tambahan jika ada"
                rows="3"
              />
            </div>

            <!-- Submit Buttons -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button variant="outline" @click="goBack"> Kembali </rs-button>
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Hantar ke JPPA
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
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
            Surat Pengesahan Lantikan Penolong Amil berjaya dimuat naik dan
            dihantar.
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
            Adakah anda pasti untuk menghantar permohonan lantikan Penolong Amil
            ini kepada JPPA untuk sokongan?
          </p>
          <p class="text-gray-600 text-sm">
            Selepas dihantar, anda tidak boleh lagi mengemaskini maklumat
            sehingga tindakan diambil oleh pihak JPPA.
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
  title: "Pengesahan Lantikan Penolong Amil",
  description:
    "Pengesahan dan muat naik dokumen lantikan penolong amil oleh PIC Masjid",
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
    name: "Pengesahan Lantikan",
    type: "current",
    path: "/BF-PA/PP/PM/02",
  },
]);

// Mock candidate data (would be fetched from API in real app)
const candidateInfo = ref({
  noKadPengenalan: "901231012345",
  namaCalonPenolongAmil: "Ahmad bin Abdullah",
  emel: "ahmad@email.com",
  kategoriPenolongAmil: "FITRAH",
  status: "Pendaftaran Lengkap",
});

// Form submission state
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showConfirmModal = ref(false);
const uploadedDocument = ref(null);

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
    "Pendaftaran Lengkap": "bg-yellow-100 text-yellow-800",
    "Menunggu Sokongan JPPA": "bg-blue-100 text-blue-800",
    Diluluskan: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

// Form submission handlers
const handleSubmit = async (formData) => {
  // Show confirmation modal before proceeding
  showConfirmModal.value = true;
  uploadedDocument.value = formData;
};

const confirmSubmission = async () => {
  try {
    isSubmitting.value = true;
    showConfirmModal.value = false;

    // Mock API call - would be replaced with actual API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Submitted document data:", {
      ...uploadedDocument.value,
      masjidId: currentMasjid.value.kodMasjid,
      namaMasjid: currentMasjid.value.namaMasjid,
      timestamp: new Date().toISOString(),
    });

    // Update candidate status
    candidateInfo.value.status = "Menunggu Sokongan JPPA";

    // Show success modal after submission
    // showSuccessModal.value = true;

    navigateTo("/BF-PA/PP/PD/04");
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Ralat semasa muat naik dokumen. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation and modal handlers
const goBack = () => {
  navigateTo("/BF-PA/PP/PM/01");
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/02");
};
</script>
