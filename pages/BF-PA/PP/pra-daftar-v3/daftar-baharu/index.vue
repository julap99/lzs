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

          <!-- Registration Form -->
          <FormKit
            type="form"
            id="registrationForm"
            :actions="false"
            @submit="handleSubmit"
          >
            <!-- Personal Information Section -->
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Peribadi
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- No Kad Pengenalan (RTMF Required) -->
                <FormKit
                  type="text"
                  name="noKP"
                  label="Nombor Kad Pengenalan"
                  placeholder="Contoh: 901231012345"
                  help="Masukkan nombor kad pengenalan tanpa tanda sengkang (-)"
                  v-model="formData.noKP"
                />

                <!-- Nama Calon -->
                <FormKit
                  type="text"
                  name="namaCalon"
                  label="Nama Penuh Calon"
                  placeholder="Masukkan nama penuh"
                  v-model="formData.namaCalon"
                />

                <!-- Jantina (RTMF Required) -->
                <FormKit
                  type="select"
                  name="jantina"
                  label="Jantina"
                  :options="jantinaOptions"
                  v-model="formData.jantina"
                />

                <!-- Bangsa (RTMF Required) -->
                <FormKit
                  type="select"
                  name="bangsa"
                  label="Bangsa"
                  :options="bangsaOptions"
                  v-model="formData.bangsa"
                />

                <!-- Agama (RTMF Required) -->
                <FormKit
                  type="select"
                  name="agama"
                  label="Agama"
                  :options="agamaOptions"
                  v-model="formData.agama"
                />

                <!-- Emel -->
                <FormKit
                  type="email"
                  name="emel"
                  label="Alamat Emel"
                  placeholder="contoh@email.com"

                  v-model="formData.emel"
                />

                <!-- Nombor Telefon -->
                <FormKit
                  type="tel"
                  name="telefon"
                  label="Nombor Telefon"
                  placeholder="0123456789"

                  v-model="formData.telefon"
                />
              </div>
            </div>

            <!-- Address Information Section -->
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Alamat
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Alamat Rumah -->
                <FormKit
                  type="textarea"
                  name="alamatRumah"
                  label="Alamat Rumah"
                  placeholder="Masukkan alamat rumah lengkap"

                  v-model="formData.alamatRumah"
                />

                <!-- Poskod -->
                <FormKit
                  type="text"
                  name="poskod"
                  label="Poskod"
                  placeholder="50000"

                  v-model="formData.poskod"
                />

                <!-- Bandar -->
                <FormKit
                  type="text"
                  name="bandar"
                  label="Bandar"
                  placeholder="Kuala Lumpur"

                  v-model="formData.bandar"
                />

                <!-- Negeri -->
                <FormKit
                  type="select"
                  name="negeri"
                  label="Negeri"
                  :options="negeriOptions"

                  v-model="formData.negeri"
                />
              </div>
            </div>

            <!-- Service Information Section -->
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Perkhidmatan
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kategori Penolong Amil -->
                <FormKit
                  type="select"
                  name="kategoriPenolongAmil"
                  label="Kategori Penolong Amil"
                  :options="kategoriPenolongAmilOptions"

                  v-model="formData.kategoriPenolongAmil"
                />

                <!-- Jawatan (RTMF Required) -->
                <FormKit
                  type="select"
                  name="jawatan"
                  label="Jawatan"
                  :options="jawatanOptions"

                  v-model="formData.jawatan"
                />

                <!-- Institusi/Kariah (RTMF Required) -->
                <FormKit
                  type="select"
                  name="institusiKariah"
                  label="Institusi/Kariah"
                  :options="institusiKariahOptions"

                  v-model="formData.institusiKariah"
                />

                <!-- Sesi Perkhidmatan (RTMF Required) -->
                <FormKit
                  type="select"
                  name="sesiPerkhidmatan"
                  label="Sesi Perkhidmatan"
                  :options="sesiPerkhidmatanOptions"

                  v-model="formData.sesiPerkhidmatan"
                />
              </div>
            </div>

            <!-- Document Upload Section -->
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Dokumen Sokongan
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Salinan Kad Pengenalan -->
                <FormKit
                  type="file"
                  name="salinanKadPengenalan"
                  label="Salinan Kad Pengenalan"
                  accept=".pdf,.jpg,.jpeg,.png"

                  help="Format: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
                  v-model="formData.salinanKadPengenalan"
                />

                <!-- Gambar Calon -->
                <FormKit
                  type="file"
                  name="gambarCalon"
                  label="Gambar Calon"
                  accept=".jpg,.jpeg,.png"

                  help="Format: JPG, JPEG, PNG. Saiz maksimum: 2MB"
                  v-model="formData.gambarCalon"
                />

                <!-- Surat Sokongan (Optional) -->
                <FormKit
                  type="file"
                  name="suratSokongan"
                  label="Surat Sokongan (Pilihan)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
                  v-model="formData.suratSokongan"
                />

                <!-- Dokumen Lain (Optional) -->
                <FormKit
                  type="file"
                  name="dokumenLain"
                  label="Dokumen Lain (Pilihan)"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  help="Format: PDF, JPG, JPEG, PNG, DOC, DOCX. Saiz maksimum: 10MB"
                  v-model="formData.dokumenLain"
                />
              </div>
            </div>

            <!-- Declaration Section -->
            <div class="mb-8 p-6 border border-gray-200 rounded-lg bg-blue-50">
              <h3 class="text-lg font-semibold mb-4 text-blue-900">
                Pengakuan dan Pengesahan
              </h3>
              
              <div class="space-y-4">
                <label class="flex items-start">
                  <input 
                    type="checkbox" 
                    v-model="formData.pengakuanMaklumat"
                    class="mr-3 mt-1"
                  />
                  <span class="text-blue-800">Saya mengakui bahawa semua maklumat yang diberikan adalah benar dan tepat</span>
                </label>

                <label class="flex items-start">
                  <input 
                    type="checkbox" 
                    v-model="formData.pengakuanDokumen"
                    class="mr-3 mt-1"
                  />
                  <span class="text-blue-800">Saya mengakui bahawa semua dokumen yang dimuat naik adalah sah dan terkini</span>
                </label>

                <label class="flex items-start">
                  <input 
                    type="checkbox" 
                    v-model="formData.pengakuanPerkhidmatan"
                    class="mr-3 mt-1"
                  />
                  <span class="text-blue-800">Saya bersetuju untuk memberikan perkhidmatan sebagai Penolong Amil mengikut terma dan syarat yang ditetapkan</span>
                </label>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end gap-4">
              <rs-button
                type="button"
                variant="secondary-outline"
                @click="handleCancel"
              >
                Batal
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleSubmitDirect"
                :disabled="isSubmitting"
              >
                <Icon v-if="isSubmitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
                {{ isSubmitting ? 'Menghantar...' : 'Hantar Permohonan' }}
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
            Permohonan anda telah berjaya dihantar untuk proses saringan. 
            Sila tunggu makluman selanjutnya.
          </p>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800">
              Rujukan permohonan: <strong>PA-{{ new Date().getFullYear() }}-{{ String(Math.floor(Math.random() * 1000)).padStart(3, '0') }}</strong>
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
            Terus ke Senarai Saringan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Pra Pendaftaran Calon Penolong Amil",
  description: "Borang pendaftaran calon penolong amil",
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
    name: "Daftar Baharu",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3/daftar-baharu",
  },
]);

// RTMF Required Options with default "Sila pilih" option
const jantinaOptions = [
  { label: "Sila pilih jantina", value: "" },
  { label: "Lelaki", value: "Lelaki" },
  { label: "Perempuan", value: "Perempuan" },
];

const bangsaOptions = [
  { label: "Sila pilih bangsa", value: "" },
  { label: "Melayu", value: "Melayu" },
  { label: "Cina", value: "Cina" },
  { label: "India", value: "India" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const agamaOptions = [
  { label: "Sila pilih agama", value: "" },
  { label: "Islam", value: "Islam" },
  { label: "Kristian", value: "Kristian" },
  { label: "Buddha", value: "Buddha" },
  { label: "Hindu", value: "Hindu" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const negeriOptions = [
  { label: "Sila pilih negeri", value: "" },
  { label: "Johor", value: "Johor" },
  { label: "Kedah", value: "Kedah" },
  { label: "Kelantan", value: "Kelantan" },
  { label: "Melaka", value: "Melaka" },
  { label: "Negeri Sembilan", value: "Negeri Sembilan" },
  { label: "Pahang", value: "Pahang" },
  { label: "Perak", value: "Perak" },
  { label: "Perlis", value: "Perlis" },
  { label: "Pulau Pinang", value: "Pulau Pinang" },
  { label: "Sabah", value: "Sabah" },
  { label: "Sarawak", value: "Sarawak" },
  { label: "Selangor", value: "Selangor" },
  { label: "Terengganu", value: "Terengganu" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Labuan", value: "Labuan" },
  { label: "Putrajaya", value: "Putrajaya" },
];

const kategoriPenolongAmilOptions = [
  { label: "Sila pilih kategori", value: "" },
  { label: "Fitrah", value: "Fitrah" },
  { label: "Padi", value: "Padi" },
  { label: "Kariah", value: "Kariah" },
  { label: "Komuniti", value: "Komuniti" },
];

const jawatanOptions = [
  { label: "Sila pilih jawatan", value: "" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
];

const institusiKariahOptions = [
  { label: "Sila pilih institusi", value: "" },
  { label: "Masjid Wilayah Persekutuan", value: "Masjid Wilayah Persekutuan" },
  { label: "Masjid Al-Khairiyah", value: "Masjid Al-Khairiyah" },
  { label: "Masjid Bandar Utama", value: "Masjid Bandar Utama" },
  { label: "Masjid Damansara Perdana", value: "Masjid Damansara Perdana" },
  { label: "Masjid Kg Delek", value: "Masjid Kg Delek" },
  { label: "Masjid Al-Hidayah", value: "Masjid Al-Hidayah" },
];

const sesiPerkhidmatanOptions = [
  { label: "Sila pilih sesi perkhidmatan", value: "" },
  { label: "Sesi 1 - Januari-Mac", value: "Sesi 1" },
  { label: "Sesi 2 - April-Jun", value: "Sesi 2" },
  { label: "Sesi 3 - Julai-September", value: "Sesi 3" },
  { label: "Sesi 4 - Oktober-Disember", value: "Sesi 4" },
];

// Form Data
const formData = ref({
  // Personal Information
  noKP: "",
  namaCalon: "",
  jantina: "",
  bangsa: "",
  agama: "",
  emel: "",
  telefon: "",
  
  // Address Information
  alamatRumah: "",
  poskod: "",
  bandar: "",
  negeri: "",
  
  // Service Information
  kategoriPenolongAmil: "",
  jawatan: "",
  institusiKariah: "",
  sesiPerkhidmatan: "",
  
  // Documents
  salinanKadPengenalan: null,
  gambarCalon: null,
  suratSokongan: null,
  dokumenLain: null,
  
  // Declarations
  pengakuanMaklumat: false,
  pengakuanDokumen: false,
  pengakuanPerkhidmatan: false,
});



// Modal state
const showSuccessModal = ref(false);
const isSubmitting = ref(false);

// Form handlers
const handleSubmit = async (formDataFromForm) => {
  try {
    // Show success modal instead of alert
    showSuccessModal.value = true;
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar permohonan. Sila cuba lagi.");
  }
};

// Direct submit handler for button click
const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success modal
    showSuccessModal.value = true;
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar permohonan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};



const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/pra-daftar-v3/saringan");
};

const handleCancel = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 