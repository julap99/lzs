<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <div class="space-y-6 mt-4">
        <!-- Header Card -->
        <rs-card>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="ph:clipboard-text" class="mr-2" />
                <h2 class="text-xl font-semibold">
                  Sokongan Lantikan Penolong Amil (JPPA)
                </h2>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <Icon name="ph:file-text" class="w-4 h-4" />
                <span class="font-medium">No. Rujukan:</span>
                <span class="font-bold text-primary-600">{{
                  candidate.referenceNo
                }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Status Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <Icon name="ph:user" class="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Status Permohonan
                </p>
                <p class="text-xs text-gray-500">Tahap semasa</p>
              </div>
            </div>
            <div class="mt-3">
              <rs-badge :variant="getStatusVariant(candidate.status)">
                {{ candidate.status }}
              </rs-badge>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <Icon name="ph:calendar" class="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  Tarikh Permohonan
                </p>
                <p class="text-xs text-gray-500">
                  {{ candidate.applicationDate }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <Icon name="ph:files" class="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Dokumen</p>
                <p class="text-xs text-green-600 font-medium">
                  {{ candidate.documentCount }} Lengkap
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Candidate Information -->
        <rs-card>
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:user-circle" class="mr-2" />
              Maklumat Calon Penolong Amil
            </div>
          </template>
          <template #body>
            <div class="p-4">
              <!-- Candidate Profile -->
              <div class="mb-6">
                <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Nombor Kad Pengenalan</p>
                      <p class="font-medium">{{ candidate.icNumber }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Nama Calon</p>
                      <p class="font-medium">{{ candidate.candidateName }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Emel</p>
                      <p class="font-medium">{{ candidate.email }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">
                        Kategori Penolong Amil
                      </p>
                      <p class="font-medium">{{ candidate.categoryLabel }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Document Preview Section -->
              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Salinan Kad Pengenalan -->
                <div>
                  <h4 class="font-medium mb-3">Salinan Kad Pengenalan</h4>
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
                        <span>{{
                          candidate.documentSalinanKadPengenalan
                        }}</span>
                      </div>
                      <rs-button
                        size="sm"
                        variant="primary-outline"
                        @click="previewDocument('salinanKadPengenalan')"
                      >
                        <Icon name="heroicons:eye" class="mr-1" size="16" />
                        Lihat
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
                        Klik butang "Lihat" untuk melihat Salinan Kad Pengenalan
                      </p>
                    </div>
                    <div class="p-3 bg-gray-50 text-sm text-gray-500">
                      Dimuat naik oleh {{ candidate.candidateName }} pada
                      {{ candidate.uploadDate }}
                    </div>
                  </div>
                </div>

                <!-- Gambar Calon -->
                <div>
                  <h4 class="font-medium mb-3">Gambar Calon</h4>
                  <div class="border border-gray-200 rounded-md">
                    <div
                      class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center"
                    >
                      <div class="flex items-center">
                        <Icon
                          name="heroicons:photo"
                          class="text-blue-600 mr-2"
                          size="20"
                        />
                        <span>{{ candidate.documentGambarCalon }}</span>
                      </div>
                      <rs-button
                        size="sm"
                        variant="primary-outline"
                        @click="previewDocument('gambarCalon')"
                      >
                        <Icon name="heroicons:eye" class="mr-1" size="16" />
                        Lihat
                      </rs-button>
                    </div>
                    <div
                      class="p-4 bg-gray-100 border-b border-gray-200 text-center text-gray-500"
                    >
                      <div class="mb-2">
                        <Icon
                          name="heroicons:photo"
                          size="48"
                          class="text-gray-400"
                        />
                      </div>
                      <p class="text-sm">
                        Klik butang "Lihat" untuk melihat Gambar Calon
                      </p>
                    </div>
                    <div class="p-3 bg-gray-50 text-sm text-gray-500">
                      Dimuat naik oleh {{ candidate.candidateName }} pada
                      {{ candidate.uploadDate }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Institution Information -->
        <rs-card>
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:building" class="mr-2" />
              Maklumat Wakil Institusi
            </div>
          </template>
          <template #body>
            <div class="p-4">
              <div class="mb-6">
                <div class="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Wakil Institusi</p>
                      <p class="font-medium">{{ candidate.picName }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">No. Rujukan</p>
                      <p class="font-medium">{{ candidate.referenceNo }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Tarikh Permohonan</p>
                      <p class="font-medium">{{ candidate.applicationDate }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Masjid</p>
                      <p class="font-medium">{{ candidate.masjidName }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Surat Sokongan Document -->
              <div class="mb-6">
                <h4 class="font-medium mb-3">Surat Sokongan</h4>
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
                      <span>{{ candidate.documentSuratSokongan }}</span>
                    </div>
                    <rs-button
                      size="sm"
                      variant="primary-outline"
                      @click="previewDocument('suratSokongan')"
                    >
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat
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
                      Klik butang "Lihat" untuk melihat Surat Sokongan
                    </p>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ candidate.picName }} pada
                    {{ candidate.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Screening Form -->
        <rs-card>
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:clipboard-text" class="mr-2" />
              Tapisan dan Semakan
            </div>
          </template>
          <template #body>
            <div class="p-4">
              <FormKit
                type="form"
                id="screeningForm"
                @submit="handleSubmit"
                :actions="false"
              >
                <!-- Screening Checklist -->
                <div class="mb-8">
                  <div class="flex items-center space-x-2 mb-6">
                    <Icon
                      name="ph:check-square"
                      class="w-5 h-5 text-green-600"
                    />
                    <h3 class="text-lg font-semibold text-gray-900">
                      Senarai Semak Tapisan
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Left Column -->
                    <div class="space-y-4">
                      <div class="p-4 flex flex-col gap-2 rounded-lg border">
                        <label for="checkIdentity" class=""
                          >Pengenalan Calon</label
                        >
                        <div>
                          <FormKit
                            type="checkbox"
                            name="checkIdentity"
                            help="Dokumen pengenalan sah dan lengkap"
                            validation="accepted"
                            :validation-messages="{
                              accepted: 'Sila sahkan pengenalan calon',
                            }"
                          />
                        </div>
                      </div>

                      <div class="p-4 flex flex-col gap-2 rounded-lg border">
                        <label for="checkBackground" class=""
                          >Latar Belakang</label
                        >
                        <div>
                          <FormKit
                            type="checkbox"
                            name="checkBackground"
                            help="Tiada rekod negatif atau isu disiplin"
                            validation="accepted"
                            :validation-messages="{
                              accepted: 'Sila sahkan latar belakang calon',
                            }"
                          />
                        </div>
                      </div>

                      <div class="p-4 flex flex-col gap-2 rounded-lg border">
                        <label for="checkQualification" class=""
                          >Kelayakan</label
                        >
                        <div>
                          <FormKit
                            type="checkbox"
                            name="checkQualification"
                            help="Memenuhi syarat minimum dan kriteria"
                            validation="accepted"
                            :validation-messages="{
                              accepted: 'Sila sahkan kelayakan calon',
                            }"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-4">
                      <div class="p-4 flex flex-col gap-2 rounded-lg border">
                        <label for="checkIntegrity" class="">Integriti</label>
                        <div>
                          <FormKit
                            type="checkbox"
                            name="checkIntegrity"
                            help="Berpegang kepada amanah dan nilai Islam"
                            validation="accepted"
                            :validation-messages="{
                              accepted: 'Sila sahkan integriti calon',
                            }"
                          />
                        </div>
                      </div>

                      <div class="p-4 flex flex-col gap-2 rounded-lg border">
                        <label for="checkCommitment" class="">Komitmen</label>
                        <div>
                          <FormKit
                            type="checkbox"
                            name="checkCommitment"
                            help="Berkomitmen melaksanakan tugas dengan baik"
                            validation="accepted"
                            :validation-messages="{
                              accepted: 'Sila sahkan komitmen calon',
                            }"
                          />
                        </div>
                      </div>

                      <div class="p-4 flex flex-col gap-2 rounded-lg border">
                        <label for="checkDocuments" class=""
                          >Dokumen Sokongan</label
                        >
                        <div>
                          <FormKit
                            type="checkbox"
                            name="checkDocuments"
                            help="Surat sokongan dan dokumen lengkap"
                            validation="accepted"
                            :validation-messages="{
                              accepted: 'Sila sahkan dokumen sokongan',
                            }"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Document Upload Section -->
                <!-- Document Preview Section for Surat Sokongan -->
                <div class="mt-6">
                  <h4 class="font-medium mb-3">
                    Dokumen Surat Tapisan Jabatan Pengurusan Risiko
                  </h4>
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
                        <span>{{ candidate.documentSuratTapisan }}</span>
                      </div>
                      <rs-button
                        size="sm"
                        variant="primary-outline"
                        @click="previewDocument('suratSokongan')"
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
                        Klik butang "Lihat Dokumen" untuk melihat Surat
                        Tapisan Jabatan Pengurusan Risiko
                      </p>
                    </div>
                    <div class="p-3 bg-gray-50 text-sm text-gray-500">
                      Dimuat naik oleh {{ candidate.picName }} pada
                      {{ candidate.uploadDate }}
                    </div>
                  </div>
                </div>

                <!-- Final Confirmation -->
                <div class="mt-6 mb-8">
                  <div
                    class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
                  >
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                        >
                          <Icon
                            name="ph:shield-check"
                            class="w-5 h-5 text-blue-600"
                          />
                        </div>
                      </div>
                      <div class="flex-1">
                        <h4 class="text-base font-semibold text-blue-900 mb-3">
                          Penilaian Eksekutif JPPA
                        </h4>

                        <div class="flex flex-col gap-2">
                          <label for="finalConfirmation" class="">
                            Saya mengesahkan bahawa semua maklumat dan dokumen
                            telah disemak dan keputusan saya adalah berdasarkan
                            penilaian yang teliti dan menyokong pelantikan calon
                            ini sebagai Penolong Amil
                          </label>

                          <div>
                            <FormKit
                              type="checkbox"
                              name="finalConfirmation"
                              validation="accepted"
                              :validation-messages="{
                                accepted:
                                  'Sila sahkan bahawa calon telah disemak',
                              }"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div
                  class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200"
                >
                  <rs-button variant="primary-outline" @click="goBack">
                    <Icon name="ph:arrow-left" size="16" class="mr-2" />
                    Kembali
                  </rs-button>
                  <rs-button variant="danger" @click="handleReject">
                    <Icon name="ph:x-circle" size="16" class="mr-2" />
                    Tolak Permohonan
                  </rs-button>
                  <rs-button
                    type="submit"
                    variant="primary"
                    :loading="isSubmitting"
                  >
                    <Icon name="ph:check-circle" size="16" class="mr-2" />
                    Sokong & Hantar ke Ketua JPPA
                  </rs-button>
                </div>
              </FormKit>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Tapisan Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Icon name="ph:check-circle" class="text-green-600" size="32" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Tapisan Berjaya Dihantar
          </h3>
          <p class="text-gray-600 mb-4">
            Calon {{ candidate.candidateName }} telah berjaya disemak dan
            dihantar untuk tindakan selanjutnya.
          </p>
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p class="text-sm text-blue-800">
              Status calon telah dikemaskini kepada "Menunggu Sokongan JPPA"
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Rejection Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Tolak Permohonan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="py-4">
          <div class="flex items-start space-x-3 mb-4">
            <Icon
              name="ph:warning-circle"
              class="w-6 h-6 text-red-600 mt-0.5"
            />
            <div>
              <h4 class="font-medium text-gray-900 mb-2">
                Tolak Permohonan Lantikan
              </h4>
              <p class="text-gray-600 text-sm">
                Adakah anda pasti untuk menolak permohonan calon
                {{ candidate.candidateName }}? Tindakan ini tidak boleh
                dibatalkan.
              </p>
            </div>
          </div>

          <div class="mt-4">
            <FormKit
              type="textarea"
              name="rejectionReason"
              label="Sebab Penolakan"
              placeholder="Sila nyatakan sebab penolakan..."
              validation="required"
              :validation-messages="{
                required: 'Sila masukkan sebab penolakan',
              }"
              rows="4"
              v-model="rejectionReason"
            />
          </div>

          <div class="mt-4 bg-red-50 rounded-lg p-3 border border-red-200">
            <p class="text-sm text-red-800">
              <Icon name="ph:info" class="w-4 h-4 inline mr-1" />
              Notifikasi penolakan akan dihantar kepada calon dan wakil
              institusi.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="primary-outline" @click="showRejectModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="confirmRejection"
            :loading="isSubmitting"
          >
            Tolak Permohonan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Document Preview Modal -->
    <rs-modal
      v-model="showDocumentModal"
      title="Dokumen Calon"
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
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Tapisan Lantikan Penolong Amil",
  description: "Semakan dan tapisan calon penolong amil",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/pra-daftar",
  },
  {
    name: "Senarai Permohonan",
    type: "link",
    path: "/BF-PA/PP/pra-daftar",
  },
  {
    name: "Tapisan Lantikan",
    type: "current",
    path: "/BF-PA/PP/pra-daftar/tapisan-lantikan",
  },
]);

// Single candidate data
const candidate = ref({
  referenceNo: "PA-2025-0001",
  candidateName: "Ahmad bin Abdullah",
  icNumber: "901231012345",
  email: "ahmad@email.com",
  phoneNumber: "0123456789",
  masjidName: "Masjid Wilayah Persekutuan",
  categoryLabel: "Fitrah",
  applicationDate: "01-01-2025",
  uploadDate: "01-01-2025, 14:32",
  status: "Menunggu Tapisan",
  documentCount: 3,
  picName: "Mohd Razak bin Ibrahim",
  picEmail: "razak@masjid.gov.my",
  picPhone: "013-9876543",
  documentSalinanKadPengenalan: "Salinan_Kad_Pengenalan.pdf",
  documentGambarCalon: "Gambar_Calon.jpg",
  documentSuratSokongan: "Surat_Sokongan.pdf",
  documentSuratTapisan: "Surat_Tapisan.pdf",
});

// State management
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showRejectModal = ref(false);
const showDocumentModal = ref(false);
const rejectionReason = ref("");

// Helper functions
const getStatusVariant = (status) => {
  const statusVariants = {
    "Menunggu Tapisan": "warning",
    "Menunggu Sokongan JPPA": "info",
    "Menunggu Kelulusan Ketua JPPA": "info",
    Lulus: "success",
    Diluluskan: "success",
    Ditolak: "danger",
    "Tidak Disokong": "danger",
  };
  return statusVariants[status] || "disabled";
};

// Document preview function
const previewDocument = (documentType) => {
  showDocumentModal.value = true;
  console.log(`Previewing ${documentType} document`);
};

// Document download function
const downloadDocument = () => {
  alert("Fungsi muat turun akan dilaksanakan dalam sistem sebenar.");
};

// Form handlers
const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Screening data:", {
      candidate: candidate.value.referenceNo,
      ...formData,
      timestamp: new Date().toISOString(),
    });

    // Update candidate status
    candidate.value.status = "Menunggu Sokongan JPPA";

    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting screening:", error);
    alert("Ralat semasa menghantar tapisan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleReject = () => {
  showRejectModal.value = true;
};

const confirmRejection = async () => {
  try {
    isSubmitting.value = true;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Rejection:", {
      candidate: candidate.value.referenceNo,
      reason: rejectionReason.value,
      timestamp: new Date().toISOString(),
    });

    // Update candidate status
    candidate.value.status = "Ditolak";

    // Close modal and navigate back
    showRejectModal.value = false;
    rejectionReason.value = "";

    // Navigate back after brief delay
    setTimeout(() => {
      navigateTo("/BF-PA/PP/pra-daftar");
    }, 1000);
  } catch (error) {
    console.error("Error rejecting application:", error);
    alert("Ralat semasa menolak permohonan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation handlers
const goBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar");
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/pra-daftar");
};
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.rs-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Hover effects for interactive elements */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

/* Focus states for accessibility */
.focus\:ring-2:focus {
  ring-width: 2px;
}

.focus\:ring-blue-500:focus {
  ring-color: #3b82f6;
}
</style>
