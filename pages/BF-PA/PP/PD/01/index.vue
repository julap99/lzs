<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pra Pendaftaran Calon Penolong Amil
          </h2>
          <rs-button variant="secondary" @click="showImportModal = true">
            <Icon name="mdi:import" class="mr-1" size="1rem" />
            Muat Turun
          </rs-button>
        </div>
      </template>

      <!-- Import Modal -->
      <rs-modal v-model="showImportModal" title="Muat Turun Data" size="md">
        <template #body>
          <div class="p-4">
            <FormKit
              type="form"
              :actions="false"
              @submit="handleImport"
            >
              <FormKit
                type="file"
                name="importFile"
                label="Upload File"
                accept=".xlsx,.xls,.csv"
                validation="required"
                v-model="importFile"
                :validation-messages="{ required: 'Please upload a file' }"
              />
            </FormKit>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-2">
            <rs-button variant="primary" @click="handleImport">
              Muat Turun
            </rs-button>
          </div>
        </template>
      </rs-modal>

      <template #body>
        <div class="p-4">
          <p class="mb-4 text-gray-700">
            Sila isi maklumat asas calon penolong amil di bawah:
          </p>

          <!-- FormKit Form -->
          <FormKit
            type="form"
            id="registrationForm"
            :actions="false"
          >
            <!-- Dynamic Forms Container -->
            <div v-for="(form, index) in forms" :key="index" class="mb-8 p-4 border rounded-lg relative">
              <!-- Remove Form Button -->
              <button 
                v-if="forms.length > 1"
                type="button"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                @click="removeForm(index)"
              >
                <Icon name="mdi:delete" size="1.25rem" />
              </button>

              <h3 class="text-lg font-semibold mb-4">Borang Calon {{ index + 1 }}</h3>

              <!-- Personal Information Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Nombor Kad Pengenalan -->
                <FormKit
                  type="text"
                  :name="`forms.${index}.noKadPengenalan`"
                  label="Nombor Kad Pengenalan"
                  placeholder="Contoh: 901231012345"
                  help="Masukkan nombor kad pengenalan tanpa tanda sengkang (-)"
                  validation="required|length:12"
                  :validation-messages="{
                    required: 'Nombor kad pengenalan diperlukan',
                    length: 'Nombor kad pengenalan mesti 12 digit',
                  }"
                  v-model="forms[index].noKadPengenalan"
                />

                <!-- Nama Calon -->
                <FormKit
                  type="text"
                  :name="`forms.${index}.namaCalonPenolongAmil`"
                  label="Nama Calon"
                  placeholder="Masukkan nama penuh"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama calon diperlukan',
                  }"
                  v-model="forms[index].namaCalonPenolongAmil"
                />

                <!-- Emel -->
                <FormKit
                  type="email"
                  :name="`forms.${index}.emel`"
                  label="Emel"
                  placeholder="contoh@email.com"
                  validation="required|email"
                  :validation-messages="{
                    required: 'Emel diperlukan',
                    email: 'Format emel tidak sah',
                  }"
                  v-model="forms[index].emel"
                />

                <!-- No Telefon -->
                <FormKit
                  type="tel"
                  :name="`forms.${index}.noTelefon`"
                  label="No Telefon"
                  placeholder="Contoh: 0123456789"
                  validation="required|matches:/^[0-9]{10,11}$/"
                  :validation-messages="{
                    required: 'No telefon diperlukan',
                    matches: 'Format no telefon tidak sah',
                  }"
                  v-model="forms[index].noTelefon"
                />

                <!-- Kategori Penolong Amil -->
                <div class="md:col-span-2">
                  <h4 class="text-sm font-medium mb-2">Kategori Penolong Amil</h4>
                  <div class="space-y-2">
                    <!-- Fitrah -->
                    <FormKit
                      type="checkbox"
                      :name="`forms.${index}.kategori.fitrah`"
                      value="FITRAH"
                      label="Fitrah"
                      :label-class="'ml-2'"
                      :input-class="'formkit-checkbox'"
                      v-model="forms[index].kategori.fitrah"
                    />

                    <!-- Padi -->
                    <FormKit
                      type="checkbox"
                      :name="`forms.${index}.kategori.padi`"
                      value="PADI"
                      label="Padi"
                      :label-class="'ml-2'"
                      :input-class="'formkit-checkbox'"
                      v-model="forms[index].kategori.padi"
                    />

                    <!-- Kariah -->
                    <div class="space-y-2">
                      <FormKit
                        type="checkbox"
                        :name="`forms.${index}.kategori.kariah`"
                        value="KARIAH"
                        label="Kariah"
                        :label-class="'ml-2'"
                        :input-class="'formkit-checkbox'"
                        v-model="forms[index].kategori.kariah"
                      />
                      <div v-if="forms[index].kategori.kariah" class="ml-6">
                        <FormKit
                          type="select"
                          :name="`forms.${index}.kariah.institusi`"
                          label="Institusi"
                          placeholder="Pilih institusi"
                          :options="kariahInstitusiOptions"
                          validation="required"
                          :validation-messages="{
                            required: 'Sila pilih institusi',
                          }"
                          v-model="forms[index].kariah.institusi"
                        />
                      </div>
                    </div>

                    <!-- Komuniti -->
                    <div class="space-y-2">
                      <FormKit
                        type="checkbox"
                        :name="`forms.${index}.kategori.komuniti`"
                        value="KOMUNITI"
                        label="Komuniti"
                        :label-class="'ml-2'"
                        :input-class="'formkit-checkbox'"
                        v-model="forms[index].kategori.komuniti"
                      />
                      <div v-if="forms[index].kategori.komuniti" class="ml-6 space-y-4">
                        <FormKit
                          type="select"
                          :name="`forms.${index}.komuniti.jenis`"
                          label="Jenis"
                          placeholder="Pilih jenis"
                          :options="komunitiJenisOptions"
                          validation="required"
                          v-model="forms[index].komuniti.jenis"
                          :validation-messages="{
                            required: 'Sila pilih jenis',
                          }"
                        />
                        <FormKit
                          v-if="forms[index].komuniti.jenis"
                          type="select"
                          :name="`forms.${index}.komuniti.institusi`"
                          label="Institusi"
                          placeholder="Pilih institusi"
                          :options="getKomunitiInstitusiOptions(forms[index].komuniti.jenis)"
                          validation="required"
                          :validation-messages="{
                            required: 'Sila pilih institusi',
                          }"
                          v-model="forms[index].komuniti.institusi"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Document Upload Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="md:col-span-2 text-md font-semibold mb-4">Dokumen Diperlukan</h4>
                
                <!-- Kad Pengenalan Upload -->
                <FormKit
                  type="file"
                  :name="`forms.${index}.kadPengenalanFile`"
                  label="Salinan Kad Pengenalan"
                  accept=".jpg,.jpeg,.png,.pdf"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila muat naik salinan kad pengenalan',
                  }"
                  help="Format yang diterima: JPG, JPEG, PNG, PDF"
                  :classes="{
                    fileItem: 'flex items-center justify-between p-2 bg-white rounded border',
                    fileRemove: 'text-red-500 hover:text-red-700 p-1',
                    fileRemoveIcon: 'mdi:delete',
                    fileRemoveText: 'sr-only'
                  }"
                  v-model="forms[index].kadPengenalanFile"
                />

                <!-- Gambar Calon Upload -->
                <FormKit
                  type="file"
                  :name="`forms.${index}.gambarCalon`"
                  label="Gambar Calon"
                  accept=".jpg,.jpeg,.png"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila muat naik gambar calon',
                  }"
                  help="Format yang diterima: JPG, JPEG, PNG"
                  :classes="{
                    fileItem: 'flex items-center justify-between p-2 bg-white rounded border',
                    fileRemove: 'text-red-500 hover:text-red-700 p-1',
                    fileRemoveIcon: 'mdi:delete',
                    fileRemoveText: 'sr-only'
                  }"
                  v-model="forms[index].gambarCalon"
                />
              </div>
            </div>

            <!-- Add Form Button -->
            <div class="flex justify-center mb-6">
              <rs-button
                type="button"
                variant="secondary"
                @click="addForm"
                class="flex items-center"
              >
                <Icon name="material-symbols:add-circle" class="mr-2" />
                Tambah Calon
              </rs-button>
            </div>

            <!-- Supporting Documents Upload -->
            <div class="mt-6 p-4 border rounded-lg">
              <h3 class="text-lg font-semibold mb-4">Surat Sokongan</h3>
              <FormKit
                type="file"
                name="suratSokongan"
                label="Muat Naik Surat Sokongan"
                accept=".pdf,.doc,.docx"
                multiple
                help="Format yang diterima: PDF, DOC, DOCX"
                :classes="{
                  fileItem: 'flex items-center justify-between p-2 bg-white rounded border',
                  fileRemove: 'text-red-500 hover:text-red-700 p-1',
                  fileRemoveIcon: 'mdi:delete',
                  fileRemoveText: 'sr-only'
                }"
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                type="button"
                variant="primary-outline"
                @click="goBack"
              >
                Kembali
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleHantar"
              >
                Hantar
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Pendaftaran Berjaya"
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
            Pra Pendaftaran Calon Penolong Amil berjaya dihantar.
          </p>
          <p class="text-gray-600">
            Sila maklumkan kepada calon untuk log masuk ke dalam sistem bagi
            mengisi maklumat yang diperlukan. E-mel juga telah dihantar kepada
            calon.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Terus ke skrin penolong amil mengisi maklumat yang diperlukan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

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
    path: "/BF-PA/PP/PM/02",
  },
]);

// Form management
const forms = ref([{
  kategori: {
    fitrah: false,
    padi: false,
    kariah: false,
    komuniti: false
  },
  kariah: {
    institusi: ''
  },
  komuniti: {
    jenis: '',
    institusi: ''
  }
}]);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Get current masjid info (would be fetched from API/store in real app)
const currentMasjid = ref({
  namaMasjid: "Masjid Wilayah Persekutuan",
  kodMasjid: "MSJ-KUL-001",
  namaPIC: "Mohd Razak bin Ibrahim",
  emel: "razak@masjid.gov.my",
  noTelefon: "013-9876543",
});

// Add new form
const addForm = () => {
  forms.value.push({
    kategori: {
      fitrah: false,
      padi: false,
      kariah: false,
      komuniti: false
    },
    kariah: {
      institusi: ''
    },
    komuniti: {
      jenis: '',
      institusi: ''
    }
  });
};

// Remove form
const removeForm = (index) => {
  forms.value.splice(index, 1);
};

// Kariah Institusi Options
const kariahInstitusiOptions = [
  { label: 'Masjid Kariah', value: 'MASJID_KARIAH' },
  { label: 'Masjid Al-Khairiyah', value: 'MASJID_AL_KHAIRIYAH' },
  { label: 'Taman Seri Gombak', value: 'TAMAN_SERI_GOMBAK' },
  { label: 'Masjid Damansara Perdana', value: 'MASJID_DAMANSARA_PERDANA' },
  { label: 'Masjid Bandar Utama', value: 'MASJID_BANDAR_UTAMA' },
  { label: 'Batang Kali', value: 'BATANG_KALI' },
  { label: 'Masjid Kg Delek', value: 'MASJID_KG_DELEK' },
  { label: 'Masjid Bandar Sultan Suleiman', value: 'MASJID_BANDAR_SULTAN_SULEIMAN' },
  { label: 'Masjid As-Saadah', value: 'MASJID_AS_SAADAH' },
  { label: 'Bandar Sultan Suleiman', value: 'BANDAR_SULTAN_SULEIMAN' },
  { label: 'Masjid Bandar Seri Putra', value: 'MASJID_BANDAR_SERI_PUTRA' },
  { label: 'Masjid Sultan Haji Ahmad Shah', value: 'MASJID_SULTAN_HAJI_AHMAD_SHAH' },
  { label: 'UIAM', value: 'UIAM' },
  { label: 'Masjid Puncak Alam', value: 'MASJID_PUNCAK_ALAM' },
  { label: 'Masjid Saujana KLIA', value: 'MASJID_SAUJANA_KLIA' },
];

// Komuniti Jenis Options
const komunitiJenisOptions = [
  { label: 'Pembangunan Sosial', value: 'PEMBANGUNAN_SOSIAL' },
  { label: 'Pembangunan Ekonomi', value: 'PEMBANGUNAN_EKONOMI' },
  { label: 'Pembangunan Pendidikan', value: 'PEMBANGUNAN_PENDIDIKAN' },
  { label: 'Pembangunan Insan', value: 'PEMBANGUNAN_INSAN' },
  { label: 'Pembangunan Institusi Agama', value: 'PEMBANGUNAN_INSTITUSI_AGAMA' },
];

// Komuniti Institusi Options by Jenis
const komunitiInstitusiOptions = {
  PEMBANGUNAN_SOSIAL: [
    { label: 'Masjid dan Surau', value: 'MASJID_DAN_SURAU' },
    { label: 'Pusat Khidmat Masyarakat', value: 'PUSAT_KHIDMAT_MASYARAKAT' },
    { label: 'Pertubuhan Bukan Kerajaan (NGO)', value: 'NGO' },
  ],
  PEMBANGUNAN_EKONOMI: [
    { label: 'Pusat Latihan dan Kemahiran', value: 'PUSAT_LATIHAN_KEMAHIRAN' },
    { label: 'Koperasi Asnaf', value: 'KOPERASI_ASNAF' },
    { label: 'Program Usahawan Asnaf', value: 'PROGRAM_USAHAWAN_ASNAF' },
  ],
  PEMBANGUNAN_PENDIDIKAN: [
    { label: 'Sekolah Agama Rakyat', value: 'SEKOLAH_AGAMA_RAKYAT' },
    { label: 'Sekolah Tahfiz', value: 'SEKOLAH_TAHFIZ' },
    { label: 'Sekolah Integrasi Islam', value: 'SEKOLAH_INTEGRASI_ISLAM' },
  ],
  PEMBANGUNAN_INSAN: [
    { label: 'Pusat Pemulihan Dadah', value: 'PUSAT_PEMULIHAN_DADAH' },
    { label: 'Pusat Perlindungan Wanita dan Kanak-Kanak', value: 'PUSAT_PERLINDUNGAN' },
    { label: 'Pusat Khidmat Psikososial', value: 'PUSAT_KHIDMAT_PSIKOSOSIAL' },
  ],
  PEMBANGUNAN_INSTITUSI_AGAMA: [
    { label: 'Sekolah Agama dan Pendidikan', value: 'SEKOLAH_AGAMA_PENDIDIKAN' },
    { label: 'Maahad Tahfiz', value: 'MAAHAD_TAHFIZ' },
    { label: 'Sekolah Rendah Integrasi Islam', value: 'SEKOLAH_RENDAH_INTEGRASI' },
  ],
};

// Helper function to get Komuniti Institusi options based on selected Jenis
const getKomunitiInstitusiOptions = (jenis) => {
  return komunitiInstitusiOptions[jenis] || [];
};

// Navigation and modal handlers
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/02");
};

const goBack = () => {
  navigateTo("/BF-PA/PP/PD");
};

// Simple function to handle Hantar button click
const handleHantar = () => {
  window.alert("Pendaftaran Calon Penolong Amil telah berjaya dihantar");
  navigateTo("/BF-PA/PP/PD/02");
};

// Watch for isSubmitting changes
watch(isSubmitting, (newValue) => {
  if (!newValue && showSuccessModal.value) {
    navigateTo("/BF-PA/PP/PD/02");
  }
});

// Import modal state
const showImportModal = ref(false);
const importFile = ref(null);

const handleImport = () => {
  // Fill forms with 5 mock candidates
  forms.value = generateMockCandidates(5);
  showImportModal.value = false;
};

function generateMockCandidates(count) {
  const names = [
    'Ahmad bin Ali',
    'Siti binti Abu',
    'Mohd Faizal',
    'Nurul Aisyah',
    'Ali bin Hassan'
  ];
  const icNumbers = [
    '900101012345',
    '880202023456',
    '920303034567',
    '950404045678',
    '970505056789'
  ];
  const emails = [
    'ahmad@example.com',
    'siti@example.com',
    'faizal@example.com',
    'aisyah@example.com',
    'ali@example.com'
  ];
  const phones = [
    '0123456789',
    '0132345678',
    '0141234567',
    '0179876543',
    '0198765432'
  ];
  const kariahInstitusi = [
    'MASJID_KARIAH',
    'MASJID_AL_KHAIRIYAH',
    'TAMAN_SERI_GOMBAK',
    'MASJID_DAMANSARA_PERDANA',
    'MASJID_BANDAR_UTAMA'
  ];
  const komunitiJenis = [
    'PEMBANGUNAN_SOSIAL',
    'PEMBANGUNAN_EKONOMI',
    'PEMBANGUNAN_PENDIDIKAN',
    'PEMBANGUNAN_INSAN',
    'PEMBANGUNAN_INSTITUSI_AGAMA'
  ];
  const komunitiInstitusi = [
    'MASJID_DAN_SURAU',
    'PUSAT_KHIDMAT_MASYARAKAT',
    'NGO',
    'PUSAT_LATIHAN_KEMAHIRAN',
    'KOPERASI_ASNAF'
  ];
  return Array.from({ length: count }, (_, i) => ({
    noKadPengenalan: icNumbers[i],
    namaCalonPenolongAmil: names[i],
    emel: emails[i],
    noTelefon: phones[i],
    kategori: {
      fitrah: i % 2 === 0,
      padi: i % 3 === 0,
      kariah: i % 2 === 1,
      komuniti: i % 2 === 0
    },
    kariah: {
      institusi: kariahInstitusi[i % kariahInstitusi.length]
    },
    komuniti: {
      jenis: komunitiJenis[i % komunitiJenis.length],
      institusi: komunitiInstitusi[i % komunitiInstitusi.length]
    },
    kadPengenalanFile: null,
    gambarCalon: null
  }));
}
</script>

<style scoped>
.custom-checkbox-group {
  :deep(.formkit-options) {
    @apply space-y-3;
  }

  :deep(.formkit-option) {
    @apply flex items-center hover:text-primary transition-colors duration-200;
  }

  :deep(.formkit-inner) {
    @apply relative flex items-center justify-center h-5 w-5 mr-3 rounded-md 
           border-2 border-gray-300 bg-white transition-all duration-200 
           focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 
           hover:border-primary/60;
  }

  :deep(input[type="checkbox"]) {
    @apply absolute opacity-0 h-0 w-0;
  }

  :deep(input[type="checkbox"]:checked + .formkit-inner) {
    @apply bg-primary border-primary;
  }

  :deep(input[type="checkbox"]:checked + .formkit-inner::after) {
    content: "";
    @apply absolute block w-1.5 h-3 border-solid border-white border-r-2 border-b-2 transform rotate-45 -translate-y-px;
  }

  :deep(input[type="checkbox"]:focus + .formkit-inner) {
    @apply ring-2 ring-primary/30;
  }

  :deep(input[type="checkbox"]:disabled + .formkit-inner) {
    @apply opacity-50 cursor-not-allowed;
  }

  :deep(input[type="checkbox"]:disabled ~ .formkit-label) {
    @apply opacity-50 cursor-not-allowed;
  }

  :deep(.formkit-label) {
    @apply text-sm font-medium cursor-pointer select-none;
  }
}

/* Hide the remove text and show only the icon */
:deep(.formkit-file-remove-text) {
  display: none !important;
}

:deep(.formkit-file-remove) {
  @apply flex items-center justify-center;
}

:deep(.formkit-file-remove-icon) {
  @apply text-xl;
}
</style>
