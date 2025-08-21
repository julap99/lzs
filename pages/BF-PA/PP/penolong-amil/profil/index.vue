<script setup>
import { useUserStore } from "~/stores/user";

definePageMeta({
  title: "Lengkapkan Profil Penolong Amil",
  layout: "default",
});

const { $swal } = useNuxtApp();
const route = useRoute();
const userStore = useUserStore();
import { useToast } from "vue-toastification";

const toast = useToast();

// Breadcrumb
const breadcrumb = [
  { title: "Utama", path: "/" },
  { title: "BF-PA", path: "/BF-PA" },
  { title: "Penolong Amil", path: "/BF-PA/PP/penolong-amil" },
  { title: "Lengkapkan Profil", path: "/BF-PA/PP/penolong-amil/profile-complete" },
];

// Form data
const profileForm = ref({
  // Personal Information
  nama: "Ahmad bin Abdullah",
  noKadPengenalan: "800101015432",
  tempatLahir: "Kuala Lumpur",
  tarikhLahir: "1980-01-01",
  jantina: "Lelaki",
  statusPerkahwinan: "Berkahwin",
  bangsa: "Melayu",
  agama: "Islam",
  
  // Contact Information
  alamat1: "No. 15, Jalan Melati",
  alamat2: "Taman Sri Melati",
  alamat3: "Seksyen 3",
  poskod: "43000",
  bandar: "Kajang",
  negeri: "Selangor",
  daerah: "Hulu Langat",
  noTelefon: "03-87345678",
  noTelefonBimbit: "012-3456789",
  emel: "ahmad.abdullah@email.com",
  
  // Employment Information
  pekerjaan: "Guru Sekolah Rendah",
  namaMajikan: "Kementerian Pendidikan Malaysia",
  alamatTempatKerja: "Sekolah Kebangsaan Sri Melati, Kajang",
  noTelefonPejabat: "03-87345679",
  
  // Education
  tahapPendidikan: "Ijazah Sarjana Muda",
  institusiPendidikan: "Universiti Malaya",
  tahunTamat: "2003",
  
  // Photo
  photo: null,
  
});

// Form validation - Disabled for presentation
const isFormValid = computed(() => {
  return true; // Always allow submission for presentation
});

// Options for dropdowns
const jantinaOptions = [
  { label: "Sila Pilih Jantina", value: "" },
  { label: "Lelaki", value: "Lelaki" },
  { label: "Perempuan", value: "Perempuan" },
];

const statusPerkahwinanOptions = [
  { label: "Sila Pilih Status", value: "" },
  { label: "Bujang", value: "Bujang" },
  { label: "Berkahwin", value: "Berkahwin" },
  { label: "Bercerai", value: "Bercerai" },
  { label: "Janda/Duda", value: "Janda/Duda" },
];

const bangsaOptions = [
  { label: "Sila Pilih Bangsa", value: "" },
  { label: "Melayu", value: "Melayu" },
  { label: "Cina", value: "Cina" },
  { label: "India", value: "India" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const negeriOptions = [
  { label: "Sila Pilih Negeri", value: "" },
  { label: "Selangor", value: "Selangor" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Putrajaya", value: "Putrajaya" },
  { label: "Negeri Sembilan", value: "Negeri Sembilan" },
  { label: "Melaka", value: "Melaka" },
  { label: "Johor", value: "Johor" },
  { label: "Pahang", value: "Pahang" },
  { label: "Terengganu", value: "Terengganu" },
  { label: "Kelantan", value: "Kelantan" },
  { label: "Perak", value: "Perak" },
  { label: "Perlis", value: "Perlis" },
  { label: "Kedah", value: "Kedah" },
  { label: "Pulau Pinang", value: "Pulau Pinang" },
];

const daerahOptions = [
  { label: "Sila Pilih Daerah", value: "" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Putrajaya", value: "Putrajaya" },
  { label: "Selangor", value: "Selangor" },
];

const tahapPendidikanOptions = [
  { label: "Sila Pilih Tahap Pendidikan", value: "" },
  { label: "Tiada Pendidikan Formal", value: "Tiada Pendidikan Formal" },
  { label: "Pendidikan Rendah", value: "Pendidikan Rendah" },
  { label: "Pendidikan Menengah", value: "Pendidikan Menengah" },
  { label: "Diploma", value: "Diploma" },
  { label: "Ijazah Sarjana Muda", value: "Ijazah Sarjana Muda" },
  { label: "Ijazah Sarjana", value: "Ijazah Sarjana" },
  { label: "Doktor Falsafah", value: "Doktor Falsafah" },
];

// Methods
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail gambar sahaja.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Saiz fail terlalu besar. Sila pilih fail kurang daripada 5MB.');
      return;
    }
    
    profileForm.value.photo = file;
  }
};

const handleSubmit = async () => {
  // Simple redirect for presentation
  // In real implementation, this would save data and show loading
  toast.success('Profil berjaya dikemaskini');
  
  // Redirect to dashboard immediately
  navigateTo('/BF-PA/PP/penolong-amil/dashboard');
};

// const handleBack = () => {
//   navigateTo('/BF-PA/PP/penolong-amil');
// };
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Progress Indicator -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Lengkapkan Profil</h3>
              <p class="text-sm text-gray-600">Maklumat peribadi dan foto</p>
            </div>
          </div>
          <rs-badge variant="success">Kemaskini Profil</rs-badge>
        </div>
      </template>
    </rs-card>

    <!-- Profile Form -->
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Maklumat Peribadi
          </h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Personal Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
              Maklumat Peribadi
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="nama"
                label="Nama Penuh"
                v-model="profileForm.nama"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="text"
                name="noKadPengenalan"
                label="Nombor Kad Pengenalan"
                v-model="profileForm.noKadPengenalan"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="text"
                name="tempatLahir"
                label="Tempat Lahir"
                v-model="profileForm.tempatLahir"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="date"
                name="tarikhLahir"
                label="Tarikh Lahir"
                v-model="profileForm.tarikhLahir"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="select"
                name="jantina"
                label="Jantina"
                v-model="profileForm.jantina"
                :options="jantinaOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="select"
                name="statusPerkahwinan"
                label="Status Perkahwinan"
                v-model="profileForm.statusPerkahwinan"
                :options="statusPerkahwinanOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="select"
                name="bangsa"
                label="Bangsa"
                v-model="profileForm.bangsa"
                :options="bangsaOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
              Maklumat Perhubungan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="textarea"
                name="alamat1"
                label="Alamat 1"
                v-model="profileForm.alamat1"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="select"
                name="negeri"
                label="Negeri"
                v-model="profileForm.negeri"
                :options="negeriOptions"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="textarea"
                name="alamat2"
                label="Alamat 2"
                v-model="profileForm.alamat2"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="select"
                name="daerah"
                label="Daerah"
                v-model="profileForm.daerah"
                :options="daerahOptions"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                type="textarea"
                name="alamat3"
                label="Alamat 3"
                v-model="profileForm.alamat3"
                :classes="{
                  input: '!py-2',
                }"
              />      

              <FormKit
                type="text"
                name="bandar"
                label="Bandar"
                v-model="profileForm.bandar"
                :classes="{
                  input: '!py-2',
                }"
              />
                

              <FormKit
                type="text"
                name="poskod"
                label="Poskod"
                v-model="profileForm.poskod"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="tel"
                name="noTelefon"
                label="Nombor Telefon"
                v-model="profileForm.noTelefon"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="tel"
                name="noTelefonBimbit"
                label="Nombor Telefon Bimbit"
                v-model="profileForm.noTelefonBimbit"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="email"
                name="emel"
                label="Alamat E-mel"
                v-model="profileForm.emel"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Employment Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
              Maklumat Pekerjaan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="pekerjaan"
                label="Pekerjaan"
                v-model="profileForm.pekerjaan"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="text"
                name="namaMajikan"
                label="Nama Majikan"
                v-model="profileForm.namaMajikan"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="textarea"
                name="alamatTempatKerja"
                label="Alamat Tempat Kerja"
                v-model="profileForm.alamatTempatKerja"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="tel"
                name="noTelefonPejabat"
                label="Nombor Telefon Pejabat"
                v-model="profileForm.noTelefonPejabat"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Education Information -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
              Maklumat Pendidikan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="tahapPendidikan"
                label="Tahap Pendidikan"
                v-model="profileForm.tahapPendidikan"
                :options="tahapPendidikanOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="text"
                name="institusiPendidikan"
                label="Institusi Pendidikan"
                v-model="profileForm.institusiPendidikan"
                :classes="{
                  input: '!py-2',
                }"
              />
              
              <FormKit
                type="number"
                name="tahunTamat"
                label="Tahun Tamat"
                v-model="profileForm.tahunTamat"
                :classes="{
                  input: '!py-2',
                }"
                min="1950"
                max="2030"
              />
            </div>
          </div>

          <!-- Photo Upload -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
              Foto Profil
            </h3>
            
            <div class="space-y-4">
              <div class="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <Icon name="ph:warning" class="text-warning mt-0.5" size="20" />
                  <div>
                    <p class="font-semibold text-warning mb-2">Foto Profil Diperlukan</p>
                    <p class="text-gray-700 text-sm">
                      Sila muat naik foto profil anda. Foto ini akan digunakan untuk kad tauliah dan dokumen rasmi.
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Muat Naik Foto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Format: JPG, PNG. Saiz maksimum: 5MB
                  </p>
                </div>
                
                <div v-if="profileForm.photo" class="flex items-center justify-center">
                  <div class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <img
                      :src="URL.createObjectURL(profileForm.photo)"
                      alt="Preview"
                      class="w-28 h-28 object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end gap-4 pt-6 border-t">
            <rs-button variant="secondary-outline" @click="handleBack">
              Reset
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleSubmit"
            >
              <Icon name="ph:check" class="w-4 h-4 mr-2" />
              Kemaskini
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Custom styles */
</style> 