<!-- 
  RTMF SCREEN: PA-PP-PD-01_04
  PURPOSE: Edit Form - Borang Kemaskini Maklumat Penolong Amil
  DESCRIPTION: Edit form for updating Penolong Amil information
  ROUTE: /BF-PA/PP/pra-daftar-v3/edit/[rujukan]
-->
<template>
  <div>
    <RoleSimulator :initial-role="currentRole" @role-change="handleRoleChange" />
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kemaskini Permohonan Penolong Amil
          </h2>
          <rs-button
            variant="secondary-outline"
            @click="handleBack"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <FormKit
          v-model="formData"
          type="form"
          @submit="handleSubmit"
          :actions="false"
        >
          <!-- Maklumat Peribadi -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">
                Maklumat Peribadi
              </h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.jenisPengenalan"
                  type="select"
                  name="jenisPengenalan"
                  label="Jenis Pengenalan"
                  :options="jenisPengenalanOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.noKP"
                  type="text"
                  name="noKP"
                  label="Nombor Kad Pengenalan"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.nama"
                  type="text"
                  name="nama"
                  label="Nama Penuh"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.jantina"
                  type="select"
                  name="jantina"
                  label="Jantina"
                  :options="jantinaOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.bangsa"
                  type="select"
                  name="bangsa"
                  label="Bangsa"
                  :options="bangsaOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.agama"
                  type="select"
                  name="agama"
                  label="Agama"
                  :options="agamaOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.tempatLahir"
                  type="text"
                  name="tempatLahir"
                  label="Tempat Lahir"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.tarikhLahir"
                  type="date"
                  name="tarikhLahir"
                  label="Tarikh Lahir"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.negeri"
                  type="select"
                  name="negeri"
                  label="Negeri"
                  :options="negeriOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.alamat"
                  type="textarea"
                  name="alamat"
                  label="Alamat"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.noTelefon"
                  type="tel"
                  name="noTelefon"
                  label="Nombor Telefon"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.email"
                  type="email"
                  name="email"
                  label="Alamat E-mel"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Penolong Amil -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">
                Maklumat Penolong Amil
              </h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.kategoriPenolongAmil"
                  type="select"
                  name="kategoriPenolongAmil"
                  label="Kategori Penolong Amil"
                  :options="kategoriPenolongAmilOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.jawatan"
                  type="select"
                  name="jawatan"
                  label="Jawatan"
                  :options="jawatanOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.institusiKariah"
                  type="select"
                  name="institusiKariah"
                  label="Institusi/Kariah"
                  :options="institusiKariahOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.sesiPerkhidmatan"
                  type="select"
                  name="sesiPerkhidmatan"
                  label="Sesi Perkhidmatan"
                  :options="sesiPerkhidmatanOptions"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.tarikhMula"
                  type="date"
                  name="tarikhMula"
                  label="Tarikh Mula Perkhidmatan"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.tarikhTamat"
                  type="date"
                  name="tarikhTamat"
                  label="Tarikh Tamat Perkhidmatan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Kelayakan -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">
                Maklumat Kelayakan
              </h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.pendidikanTertinggi"
                  type="text"
                  name="pendidikanTertinggi"
                  label="Pendidikan Tertinggi"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.pengalamanKerja"
                  type="textarea"
                  name="pengalamanKerja"
                  label="Pengalaman Kerja"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.kemahiran"
                  type="textarea"
                  name="kemahiran"
                  label="Kemahiran Khas"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.sijil"
                  type="textarea"
                  name="sijil"
                  label="Sijil/Penghargaan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </template>
          </rs-card>

          <!-- Maklumat Bank -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">
                Maklumat Bank
              </h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.namaBank"
                  type="text"
                  name="namaBank"
                  label="Nama Bank"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.namaAkaun"
                  type="text"
                  name="namaAkaun"
                  label="Nama Pemegang Akaun"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.noAkaun"
                  type="text"
                  name="noAkaun"
                  label="Nombor Akaun"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </template>
          </rs-card>

          <!-- Dokumen Sokongan -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">
                Dokumen Sokongan
              </h3>
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.salinanKP"
                  type="file"
                  name="salinanKP"
                  label="Salinan Kad Pengenalan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.suratSokongan"
                  type="file"
                  name="suratSokongan"
                  label="Surat Sokongan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.sijilPendidikan"
                  type="file"
                  name="sijilPendidikan"
                  label="Sijil Pendidikan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :classes="{
                    input: '!py-2',
                  }"
                />

                <FormKit
                  v-model="formData.suratTawaran"
                  type="file"
                  name="suratTawaran"
                  label="Surat Tawaran (jika ada)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </template>
          </rs-card>

          <!-- Pengakuan dan Pengesahan -->
          <rs-card class="mb-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-800">
                Pengakuan dan Pengesahan
              </h3>
            </template>
            <template #body>
              <div class="space-y-4">
                <div class="flex items-start">
                  <input
                    v-model="formData.pengakuanMaklumat"
                    type="checkbox"
                    id="pengakuanMaklumat"
                    class="mr-3 mt-1"
                  />
                  <label
                    for="pengakuanMaklumat"
                    class="text-blue-800 cursor-pointer"
                  >
                    Saya mengakui bahawa semua maklumat yang diberikan adalah benar dan tepat
                  </label>
                </div>

                <div class="flex items-start">
                  <input
                    v-model="formData.persetujuanData"
                    type="checkbox"
                    id="persetujuanData"
                    class="mr-3 mt-1"
                  />
                  <label
                    for="persetujuanData"
                    class="text-blue-800 cursor-pointer"
                  >
                    Saya bersetuju untuk membenarkan LZS menggunakan maklumat saya untuk tujuan pengurusan penolong amil
                  </label>
                </div>

                <div class="flex items-start">
                  <input
                    v-model="formData.persetujuanAudit"
                    type="checkbox"
                    id="persetujuanAudit"
                    class="mr-3 mt-1"
                  />
                  <label
                    for="persetujuanAudit"
                    class="text-blue-800 cursor-pointer"
                  >
                    Saya bersetuju untuk audit dan pemantauan oleh pihak berkuasa yang berkaitan
                  </label>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Action Buttons - Standardized at the bottom -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="secondary"
              @click="handleCancel"
            >
              Batal
            </rs-button>
            <rs-button
              type="button"
              variant="primary"
              :disabled="isSubmitting"
              @click="handleSubmitDirect"
            >
              <Icon
                v-if="isSubmitting"
                name="ph:spinner"
                class="w-4 h-4 mr-2 animate-spin"
              />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Berjaya!"
      size="sm"
      @close="handleModalClose"
    >
      <div class="text-center">
        <Icon
          name="ph:check-circle"
          class="w-16 h-16 text-green-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-semibold mb-2">
          Permohonan Berjaya Dikemaskini!
        </h3>
        <p class="text-gray-600 mb-4">
          Nombor Rujukan: <strong>{{ generatedRujukan }}</strong>
        </p>
        <p class="text-sm text-gray-500">
          Permohonan anda telah berjaya dikemaskini dan dihantar untuk semakan.
        </p>
      </div>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

definePageMeta({
  title: "Kemaskini Permohonan Penolong Amil",
  description: "Kemaskini maklumat permohonan penolong amil",
});

const route = useRoute();
const rujukan = route.params.rujukan;

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
    name: "Senarai Permohonan V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Kemaskini Permohonan",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/edit/${rujukan}`,
  },
]);

// Role simulator
const currentRole = ref("PYB Institusi");

// Form data
const formData = reactive({
  jenisPengenalan: "",
  noKP: "",
  nama: "",
  jantina: "",
  bangsa: "",
  agama: "",
  tempatLahir: "",
  tarikhLahir: "",
  negeri: "",
  alamat: "",
  noTelefon: "",
  email: "",
  kategoriPenolongAmil: "",
  jawatan: "",
  institusiKariah: "",
  sesiPerkhidmatan: "",
  tarikhMula: "",
  tarikhTamat: "",
  pendidikanTertinggi: "",
  pengalamanKerja: "",
  kemahiran: "",
  sijil: "",
  namaBank: "",
  namaAkaun: "",
  noAkaun: "",
  salinanKP: null,
  suratSokongan: null,
  sijilPendidikan: null,
  suratTawaran: null,
  pengakuanMaklumat: false,
  persetujuanData: false,
  persetujuanAudit: false,
});

// Options for select fields
const jenisPengenalanOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "MyKAD", value: "MyKAD" },
  { label: "Passport", value: "Passport" },
  { label: "Sijil Lahir", value: "Sijil Lahir" },
];

const jantinaOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Lelaki", value: "Lelaki" },
  { label: "Perempuan", value: "Perempuan" },
];

const bangsaOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Melayu", value: "Melayu" },
  { label: "Cina", value: "Cina" },
  { label: "India", value: "India" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const agamaOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Islam", value: "Islam" },
  { label: "Kristian", value: "Kristian" },
  { label: "Buddha", value: "Buddha" },
  { label: "Hindu", value: "Hindu" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const negeriOptions = [
  { label: "Sila pilih...", value: "" },
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
  { label: "WP Kuala Lumpur", value: "WP Kuala Lumpur" },
  { label: "WP Labuan", value: "WP Labuan" },
  { label: "WP Putrajaya", value: "WP Putrajaya" },
];

const kategoriPenolongAmilOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Kariah", value: "Kariah" },
  { label: "Komuniti", value: "Komuniti" },
  { label: "Padi", value: "Padi" },
  { label: "Fitrah", value: "Fitrah" },
  { label: "Zakat", value: "Zakat" },
];

const jawatanOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { label: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
  { label: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { label: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { label: "Penolong Amil Zakat", value: "Penolong Amil Zakat" },
];

const institusiKariahOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Masjid Al-Khairiyah", value: "Masjid Al-Khairiyah" },
  { label: "Masjid Bandar Utama", value: "Masjid Bandar Utama" },
  { label: "Masjid Damansara Perdana", value: "Masjid Damansara Perdana" },
  { label: "Masjid Kg Delek", value: "Masjid Kg Delek" },
  { label: "Masjid Al-Amin", value: "Masjid Al-Amin" },
];

const sesiPerkhidmatanOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Sesi 1", value: "Sesi 1" },
  { label: "Sesi 2", value: "Sesi 2" },
  { label: "Sesi 3", value: "Sesi 3" },
  { label: "Sesi 4", value: "Sesi 4" },
];

// Modal state
const showSuccessModal = ref(false);
const isSubmitting = ref(false);
const generatedRujukan = ref("");

// Load existing data
onMounted(() => {
  loadExistingData();
});

const loadExistingData = () => {
  // Mock data for editing - in real implementation, this would fetch from API
  const mockData = {
    jenisPengenalan: "MyKAD",
    noKP: "850515087654",
    nama: "Ahmad bin Abdullah",
    jantina: "Lelaki",
    bangsa: "Melayu",
    agama: "Islam",
    tempatLahir: "Kuala Lumpur",
    tarikhLahir: "15-05-1985",
    negeri: "Selangor",
    alamat: "No. 123, Jalan Utama, Taman Damai, 43000 Kajang, Selangor",
    noTelefon: "0123456789",
    email: "ahmad.abdullah@email.com",
    kategoriPenolongAmil: "Kariah",
    jawatan: "Penolong Amil Kariah",
    institusiKariah: "Masjid Al-Khairiyah",
    sesiPerkhidmatan: "Sesi 1",
    tarikhMula: "01-01-2024",
    tarikhTamat: "31-12-2024",
    pendidikanTertinggi: "Sijil Pelajaran Malaysia (SPM)",
    pengalamanKerja: "5 tahun sebagai guru agama di sekolah rendah",
    kemahiran: "Kemahiran dalam pengurusan zakat dan fitrah",
    sijil: "Sijil Pengajian Islam dari Institut Pengajian Tinggi",
    namaBank: "Bank Islam Malaysia Berhad",
    namaAkaun: "Ahmad bin Abdullah",
    noAkaun: "1234567890",
    pengakuanMaklumat: true,
    persetujuanData: true,
    persetujuanAudit: true,
  };

  // Populate form with existing data
  Object.assign(formData, mockData);
};

const handleSubmitDirect = async () => {
  isSubmitting.value = true;
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate new reference number
    generatedRujukan.value = `PA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    alert("Ralat berlaku semasa menyimpan perubahan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  // Navigate back to the appropriate dashboard based on role
  const dashboardPaths = {
    'pyb': '/BF-PA/PP/pra-daftar-v3',
    'eksekutif-pengurusan-risiko': '/BF-PA/PP/pra-daftar-v3',
    'pt': '/BF-PA/PP/pra-daftar-v3',
    'eksekutif': '/BF-PA/PP/pra-daftar-v3',
    'ketua-jabatan': '/BF-PA/PP/pra-daftar-v3',
    'ketua-divisyen': '/BF-PA/PP/pra-daftar-v3'
  };
  
  navigateTo(dashboardPaths[currentRole.value] || '/BF-PA/PP/pra-daftar-v3');
};

const handleBack = () => {
  // Navigate back to the appropriate dashboard based on role
  const dashboardPaths = {
    'pyb': '/BF-PA/PP/pra-daftar-v3',
    'eksekutif-pengurusan-risiko': '/BF-PA/PP/pra-daftar-v3',
    'pt': '/BF-PA/PP/pra-daftar-v3',
    'eksekutif': '/BF-PA/PP/pra-daftar-v3',
    'ketua-jabatan': '/BF-PA/PP/pra-daftar-v3',
    'ketua-divisyen': '/BF-PA/PP/pra-daftar-v3'
  };
  
  navigateTo(dashboardPaths[currentRole.value] || '/BF-PA/PP/pra-daftar-v3');
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo('/BF-PA/PP/pra-daftar-v3');
};

const handleRoleChange = (newRole) => {
  currentRole.value = newRole;
};
</script>

<style scoped>
/* Custom styles for edit form */
</style> 