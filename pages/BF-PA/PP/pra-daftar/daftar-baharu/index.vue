<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pra Pendaftaran Calon Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Information Section -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex">
              <Icon name="ph:info" class="w-5 h-5 text-blue-400 mt-0.5" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Maklumat Pra Pendaftaran
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  Sila isi maklumat asas calon penolong amil di bawah. Setiap
                  calon perlu menyediakan dokumen yang diperlukan.
                </p>
              </div>
            </div>
          </div>

          <!-- Candidates Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-semibold text-gray-900">
                  Senarai Calon
                </h3>
                <span
                  class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ forms.length }}
                  {{ forms.length === 1 ? "Calon" : "Calon" }}
                </span>
              </div>
              <div class="flex items-center space-x-3">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  size="sm"
                  @click="handleImportCandidates"
                  :disabled="isImporting"
                  class="flex items-center space-x-2"
                >
                  <Icon
                    :name="isImporting ? 'ph:spinner' : 'ph:download'"
                    size="16"
                    :class="{ 'animate-spin': isImporting }"
                  />
                  <span>{{
                    isImporting ? "Mengimport..." : "Import Data"
                  }}</span>
                </rs-button>
                <rs-button
                  type="button"
                  variant="primary"
                  size="sm"
                  @click="addNewCandidate"
                  class="flex items-center space-x-2"
                >
                  <Icon name="ph:plus" size="16" />
                  <span>Tambah Calon</span>
                </rs-button>
              </div>
            </div>

            <!-- Candidates Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(candidate, index) in forms"
                :key="index"
                class="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <!-- Status Indicator -->
                <div class="absolute top-3 right-3">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full',
                      isCandidateComplete(candidate)
                        ? 'bg-green-500'
                        : isCandidateValid(candidate)
                        ? 'bg-yellow-500'
                        : 'bg-red-500',
                    ]"
                    :title="getCandidateStatus(candidate)"
                  ></div>
                </div>

                <!-- Remove Button -->
                <button
                  v-if="forms.length > 1"
                  @click="removeCandidate(index)"
                  class="absolute top-3 right-8 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Buang Calon"
                >
                  <Icon name="ph:x" size="14" />
                </button>

                <!-- Candidate Info -->
                <div class="mb-4">
                  <div class="flex items-center space-x-3 mb-2">
                    <div
                      class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                    >
                      <Icon name="ph:user" class="w-6 h-6 text-blue-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-gray-900 truncate">
                        {{
                          candidate.namaCalonPenolongAmil ||
                          `Calon ${index + 1}`
                        }}
                      </h4>
                      <p class="text-sm text-gray-500 truncate">
                        {{ candidate.noKadPengenalan || "Belum diisi" }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Status Badge -->
                <div class="mb-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      isCandidateComplete(candidate)
                        ? 'bg-green-100 text-green-800'
                        : isCandidateValid(candidate)
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    <Icon
                      :name="
                        isCandidateComplete(candidate)
                          ? 'ph:check-circle'
                          : isCandidateValid(candidate)
                          ? 'ph:clock'
                          : 'ph:warning-circle'
                      "
                      class="w-3 h-3 mr-1"
                    />
                    {{ getCandidateStatus(candidate) }}
                  </span>
                </div>

                <!-- Basic Info Preview -->
                <div class="space-y-2 mb-4 text-sm">
                  <div class="flex items-center text-gray-600">
                    <Icon name="ph:envelope" class="w-4 h-4 mr-2" />
                    <span class="truncate">{{
                      candidate.emel || "Belum diisi"
                    }}</span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <Icon name="ph:phone" class="w-4 h-4 mr-2" />
                    <span>{{ candidate.noTelefon || "Belum diisi" }}</span>
                  </div>
                  <div class="flex items-center text-gray-600">
                    <Icon name="ph:tag" class="w-4 h-4 mr-2" />
                    <span class="text-xs">
                      {{
                        getSelectedCategories(candidate) ||
                        "Belum pilih kategori"
                      }}
                    </span>
                  </div>
                </div>

                <!-- Action Button -->
                <rs-button
                  type="button"
                  variant="primary-outline"
                  size="sm"
                  @click="editCandidate(index)"
                  class="w-full flex items-center justify-center space-x-2"
                >
                  <Icon name="ph:pencil" size="16" />
                  <span>Isi Maklumat</span>
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Supporting Documents Upload -->
          <rs-card class="border border-gray-200 shadow-sm">
            <template #header>
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:file-text" class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Surat Sokongan
                  </h3>
                  <p class="text-sm text-gray-500">
                    Dokumen sokongan untuk permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <FormKit
                  type="file"
                  name="suratSokongan"
                  label="Muat Naik Surat Sokongan"
                  accept=".pdf,.doc,.docx"
                  multiple
                  help="Format yang diterima: PDF, DOC, DOCX (Saiz maksimum: 10MB setiap fail)"
                />
              </div>
            </template>
          </rs-card>

          <!-- Progress Summary -->
          <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900">Kemajuan Pendaftaran</h4>
              <span class="text-sm text-gray-600">
                {{ completedCandidates }}/{{ forms.length }} calon selesai
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Pastikan semua calon telah dilengkapkan sebelum menghantar
              permohonan
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200"
          >
            <rs-button
              type="button"
              variant="primary-outline"
              @click="goBack"
              class="flex items-center space-x-2"
            >
              <Icon name="ph:arrow-left" size="16" />
              <span>Kembali</span>
            </rs-button>
            <rs-button
              type="button"
              variant="primary"
              @click="handleHantar"
              :disabled="!canSubmit"
              class="flex items-center space-x-2"
            >
              <Icon name="ph:paper-plane-tilt" size="16" />
              <span>Hantar Permohonan</span>
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Candidate Edit Modal -->
    <rs-modal
      v-model="showEditModal"
      :title="`Maklumat Calon ${editingCandidateIndex + 1}`"
      size="xl"
      position="center"
    >
      <template #body>
        <div class="overflow-y-auto">
          <FormKit
            type="form"
            id="candidateForm"
            :actions="false"
            v-if="editingCandidate"
          >
            <div class="space-y-6">
              <!-- Quick Summary -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user" class="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">
                      {{
                        editingCandidate.namaCalonPenolongAmil ||
                        `Calon ${editingCandidateIndex + 1}`
                      }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      Status: {{ getCandidateStatus(editingCandidate) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="space-y-4">
                <div
                  class="flex items-center space-x-2 pb-2 border-b border-gray-200"
                >
                  <Icon name="ph:address-book" class="w-5 h-5 text-gray-600" />
                  <h4 class="text-md font-semibold text-gray-800">
                    Maklumat Peribadi
                  </h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="noKadPengenalan"
                    label="Nombor Kad Pengenalan"
                    placeholder="Contoh: 901231012345"
                    help="Masukkan 12 digit tanpa tanda sengkang"
                    validation="required|length:12"
                    :validation-messages="{
                      required: 'Nombor kad pengenalan diperlukan',
                      length: 'Nombor kad pengenalan mesti 12 digit',
                    }"
                    v-model="editingCandidate.noKadPengenalan"
                  />

                  <FormKit
                    type="text"
                    name="namaCalonPenolongAmil"
                    label="Nama Calon"
                    placeholder="Masukkan nama penuh"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama calon diperlukan',
                    }"
                    v-model="editingCandidate.namaCalonPenolongAmil"
                  />

                  <FormKit
                    type="email"
                    name="emel"
                    label="Emel"
                    placeholder="contoh@email.com"
                    validation="required|email"
                    :validation-messages="{
                      required: 'Emel diperlukan',
                      email: 'Format emel tidak sah',
                    }"
                    v-model="editingCandidate.emel"
                  />

                  <FormKit
                    type="tel"
                    name="noTelefon"
                    label="No Telefon"
                    placeholder="Contoh: 0123456789"
                    validation="required|matches:/^[0-9]{10,11}$/"
                    :validation-messages="{
                      required: 'No telefon diperlukan',
                      matches: 'Format no telefon tidak sah',
                    }"
                    v-model="editingCandidate.noTelefon"
                  />
                </div>
              </div>

              <!-- Category Selection -->
              <div class="space-y-4">
                <div
                  class="flex items-center space-x-2 pb-2 border-b border-gray-200"
                >
                  <Icon name="ph:tag" class="w-5 h-5 text-gray-600" />
                  <h4 class="text-md font-semibold text-gray-800">
                    Kategori Penolong Amil
                  </h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Basic Categories -->
                  <div class="space-y-3">
                    <h5 class="text-sm font-medium text-gray-700">
                      Kategori Asas
                    </h5>

                    <label
                      class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <FormKit
                        type="checkbox"
                        name="kategori_fitrah"
                        v-model="editingCandidate.kategori.fitrah"
                        :classes="{ wrapper: 'mb-0' }"
                      />
                      <div>
                        <div class="font-medium text-gray-900">Fitrah</div>
                        <div class="text-sm text-gray-500">
                          Pengutipan zakat fitrah
                        </div>
                      </div>
                    </label>

                    <label
                      class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <FormKit
                        type="checkbox"
                        name="kategori_padi"
                        v-model="editingCandidate.kategori.padi"
                        :classes="{ wrapper: 'mb-0' }"
                      />
                      <div>
                        <div class="font-medium text-gray-900">Padi</div>
                        <div class="text-sm text-gray-500">
                          Pengutipan zakat padi
                        </div>
                      </div>
                    </label>
                  </div>

                  <!-- Advanced Categories -->
                  <div class="space-y-3">
                    <h5 class="text-sm font-medium text-gray-700">
                      Kategori Khusus
                    </h5>

                    <!-- Kariah -->
                    <div class="border border-gray-200 rounded-lg p-3">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <FormKit
                          type="checkbox"
                          name="kategori_kariah"
                          v-model="editingCandidate.kategori.kariah"
                          :classes="{ wrapper: 'mb-0' }"
                        />
                        <div class="flex-1">
                          <div class="font-medium text-gray-900">Kariah</div>
                          <div class="text-sm text-gray-500">
                            Aktiviti di peringkat kariah
                          </div>
                        </div>
                      </label>

                      <div
                        v-if="editingCandidate.kategori.kariah"
                        class="mt-3 pl-8"
                      >
                        <FormKit
                          type="select"
                          name="kariah_institusi"
                          label="Institusi"
                          placeholder="Pilih institusi"
                          :options="kariahInstitusiOptions"
                          validation="required"
                          :validation-messages="{
                            required: 'Sila pilih institusi',
                          }"
                          v-model="editingCandidate.kariah.institusi"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Document Upload -->
              <div class="space-y-4">
                <div
                  class="flex items-center space-x-2 pb-2 border-b border-gray-200"
                >
                  <Icon name="ph:paperclip" class="w-5 h-5 text-gray-600" />
                  <h4 class="text-md font-semibold text-gray-800">
                    Dokumen Diperlukan
                  </h4>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="file"
                    name="kadPengenalanFile"
                    label="Salinan Kad Pengenalan"
                    accept=".jpg,.jpeg,.png,.pdf"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila muat naik salinan kad pengenalan',
                    }"
                    help="Format: JPG, JPEG, PNG, PDF (Maks: 5MB)"
                  />

                  <FormKit
                    type="file"
                    name="gambarCalon"
                    label="Gambar Calon"
                    accept=".jpg,.jpeg,.png"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila muat naik gambar calon',
                    }"
                    help="Format: JPG, JPEG, PNG (Maks: 5MB)"
                  />
                </div>
              </div>
            </div>
          </FormKit>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="primary-outline" @click="closeEditModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="saveCandidate">
            Simpan Maklumat
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Pendaftaran Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-4">
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
            >
              <Icon name="ph:check-circle" class="text-green-600" size="32" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Pra Pendaftaran Berjaya Dihantar
          </h3>
          <p class="text-gray-600 mb-4">
            Sila maklumkan kepada calon untuk log masuk ke dalam sistem bagi
            mengisi maklumat yang diperlukan.
          </p>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800">
              E-mel juga telah dihantar kepada calon untuk tindakan selanjutnya.
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button
            variant="primary-outline"
            @click="showSuccessModal = false"
          >
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="handleModalClose">
            Terus ke Senarai Permohonan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

definePageMeta({
  title: "Pra Pendaftaran Calon Penolong Amil",
  description: "Pendaftaran awal maklumat calon penolong amil oleh PIC Masjid",
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
    name: "Pra Daftar Penolong Amil",
    type: "current",
    path: "/BF-PA/PP/pra-daftar",
  },
]);

// Form management
const forms = ref([
  {
    noKadPengenalan: "",
    namaCalonPenolongAmil: "",
    emel: "",
    noTelefon: "",
    kategori: {
      fitrah: false,
      padi: false,
      kariah: false,
    },
    kariah: {
      institusi: "",
    },
  },
]);

const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Modal management for candidate editing
const showEditModal = ref(false);
const editingCandidateIndex = ref(-1);
const editingCandidate = ref(null);

// Helper function to create a new empty candidate
const createEmptyCandidate = () => ({
  noKadPengenalan: "",
  namaCalonPenolongAmil: "",
  emel: "",
  noTelefon: "",
  kategori: {
    fitrah: false,
    padi: false,
    kariah: false,
  },
  kariah: {
    institusi: "",
  },
});

// Add new candidate
const addNewCandidate = () => {
  const newCandidate = createEmptyCandidate();
  forms.value.push(newCandidate);

  // Automatically open the edit modal for the new candidate
  editCandidate(forms.value.length - 1);
};

// Edit candidate - opens modal
const editCandidate = (index) => {
  editingCandidateIndex.value = index;
  // Create a deep copy of the candidate for editing
  editingCandidate.value = JSON.parse(JSON.stringify(forms.value[index]));
  showEditModal.value = true;
};

// Save candidate changes
const saveCandidate = () => {
  if (editingCandidateIndex.value >= 0 && editingCandidate.value) {
    // Update the original candidate with the edited data
    forms.value[editingCandidateIndex.value] = JSON.parse(
      JSON.stringify(editingCandidate.value)
    );
    closeEditModal();
  }
};

// Close edit modal
const closeEditModal = () => {
  showEditModal.value = false;
  editingCandidateIndex.value = -1;
  editingCandidate.value = null;
};

// Remove candidate with confirmation
const removeCandidate = (index) => {
  if (forms.value.length > 1) {
    if (
      confirm(`Adakah anda pasti ingin membuang maklumat Calon ${index + 1}?`)
    ) {
      forms.value.splice(index, 1);
    }
  }
};

// Helper function to get selected categories for display
const getSelectedCategories = (candidate) => {
  const categories = [];
  if (candidate.kategori.fitrah) categories.push("Fitrah");
  if (candidate.kategori.padi) categories.push("Padi");
  if (candidate.kategori.kariah) categories.push("Kariah");

  if (categories.length === 0) return null;
  if (categories.length <= 2) return categories.join(", ");
  return `${categories.slice(0, 2).join(", ")} (+${categories.length - 2})`;
};

// Validation helpers
const isCandidateValid = (candidate) => {
  if (!candidate) return false;

  const hasBasicInfo = !!(
    candidate.noKadPengenalan &&
    candidate.namaCalonPenolongAmil &&
    candidate.emel &&
    candidate.noTelefon
  );

  const hasCategory = !!(
    candidate.kategori.fitrah ||
    candidate.kategori.padi ||
    candidate.kategori.kariah
  );

  return hasBasicInfo && hasCategory;
};

const isCandidateComplete = (candidate) => {
  if (!isCandidateValid(candidate)) return false;

  // Check if conditional fields are filled when required
  if (candidate.kategori.kariah && !candidate.kariah.institusi) {
    return false;
  }

  return true;
};

const getCandidateStatus = (candidate) => {
  if (isCandidateComplete(candidate)) {
    return "Lengkap";
  } else if (isCandidateValid(candidate)) {
    return "Dalam Kemajuan";
  } else {
    return "Belum Lengkap";
  }
};

// Progress tracking
const completedCandidates = computed(() => {
  return forms.value.filter((candidate) => isCandidateComplete(candidate))
    .length;
});

const progressPercentage = computed(() => {
  if (forms.value.length === 0) return 0;
  return Math.round((completedCandidates.value / forms.value.length) * 100);
});

const canSubmit = computed(() => {
  return (
    forms.value.length > 0 &&
    forms.value.every((candidate) => isCandidateComplete(candidate))
  );
});

// Kariah Institusi Options
const kariahInstitusiOptions = [
  { label: "Masjid Kariah", value: "MASJID_KARIAH" },
  { label: "Masjid Al-Khairiyah", value: "MASJID_AL_KHAIRIYAH" },
  { label: "Taman Seri Gombak", value: "TAMAN_SERI_GOMBAK" },
  { label: "Masjid Damansara Perdana", value: "MASJID_DAMANSARA_PERDANA" },
  { label: "Masjid Bandar Utama", value: "MASJID_BANDAR_UTAMA" },
  { label: "Batang Kali", value: "BATANG_KALI" },
  { label: "Masjid Kg Delek", value: "MASJID_KG_DELEK" },
  {
    label: "Masjid Bandar Sultan Suleiman",
    value: "MASJID_BANDAR_SULTAN_SULEIMAN",
  },
  { label: "Masjid As-Saadah", value: "MASJID_AS_SAADAH" },
  { label: "Bandar Sultan Suleiman", value: "BANDAR_SULTAN_SULEIMAN" },
  { label: "Masjid Bandar Seri Putra", value: "MASJID_BANDAR_SERI_PUTRA" },
  {
    label: "Masjid Sultan Haji Ahmad Shah",
    value: "MASJID_SULTAN_HAJI_AHMAD_SHAH",
  },
  { label: "UIAM", value: "UIAM" },
  { label: "Masjid Puncak Alam", value: "MASJID_PUNCAK_ALAM" },
  { label: "Masjid Saujana KLIA", value: "MASJID_SAUJANA_KLIA" },
];

// Import functionality
const isImporting = ref(false);

const mockCandidatesData = [
  {
    noKadPengenalan: "900101031234",
    namaCalonPenolongAmil: "Ahmad Bin Abdullah",
    emel: "ahmad.abdullah@email.com",
    noTelefon: "0123456789",
    kategori: {
      fitrah: true,
      padi: false,
      kariah: true,
    },
    kariah: {
      institusi: "MASJID_KARIAH",
    },
  },
  {
    noKadPengenalan: "850315071234",
    namaCalonPenolongAmil: "Siti Fatimah Binti Hassan",
    emel: "siti.fatimah@email.com",
    noTelefon: "0134567890",
    kategori: {
      fitrah: true,
      padi: true,
      kariah: false,
    },
    kariah: {
      institusi: "",
    },
  },
  {
    noKadPengenalan: "920525081234",
    namaCalonPenolongAmil: "Muhammad Syafiq Bin Omar",
    emel: "syafiq.omar@email.com",
    noTelefon: "0145678901",
    kategori: {
      fitrah: false,
      padi: true,
      kariah: true,
    },
    kariah: {
      institusi: "MASJID_AL_KHAIRIYAH",
    },
  },
];

const handleImportCandidates = async () => {
  try {
    isImporting.value = true;

    // Simulate file processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add mock candidates to the form
    const newCandidates = [...mockCandidatesData];
    forms.value.push(...newCandidates);

    // Show success message
    alert(`Berjaya mengimport ${newCandidates.length} calon dari fail.`);
  } catch (error) {
    console.error("Error importing candidates:", error);
    alert("Ralat berlaku semasa mengimport data. Sila cuba lagi.");
  } finally {
    isImporting.value = false;
  }
};

// Navigation and modal handlers
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/pra-daftar/tapisan-lantikan");
};

const goBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar");
};

// Form submission handler
const handleHantar = async () => {
  try {
    isSubmitting.value = true;

    // Validate all candidates
    const incompleteCandidates = forms.value
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate }) => !isCandidateComplete(candidate));

    if (incompleteCandidates.length > 0) {
      const candidateNumbers = incompleteCandidates
        .map(({ index }) => index + 1)
        .join(", ");
      throw new Error(
        `Sila lengkapkan maklumat untuk Calon ${candidateNumbers} sebelum menghantar permohonan.`
      );
    }

    // Additional validation for email uniqueness
    const emails = forms.value.map((candidate) => candidate.emel);
    const duplicateEmails = emails.filter(
      (email, index) => emails.indexOf(email) !== index
    );
    if (duplicateEmails.length > 0) {
      throw new Error(
        "Alamat emel tidak boleh sama antara calon. Sila gunakan alamat emel yang berbeza."
      );
    }

    // Additional validation for IC uniqueness
    const icNumbers = forms.value.map((candidate) => candidate.noKadPengenalan);
    const duplicateICs = icNumbers.filter(
      (ic, index) => icNumbers.indexOf(ic) !== index
    );
    if (duplicateICs.length > 0) {
      throw new Error(
        "Nombor kad pengenalan tidak boleh sama antara calon. Sila semak semula maklumat yang dimasukkan."
      );
    }

    // Simulate API call with progress feedback
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);

    // Show user-friendly error message
    alert(
      error.message ||
        "Ralat berlaku semasa menghantar permohonan. Sila cuba lagi."
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Watch for modal state changes
watch(showEditModal, (newValue) => {
  if (!newValue) {
    // Clean up when modal closes
    editingCandidateIndex.value = -1;
    editingCandidate.value = null;
  }
});
</script>
