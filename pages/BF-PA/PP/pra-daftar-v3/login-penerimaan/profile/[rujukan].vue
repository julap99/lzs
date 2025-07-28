<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Lengkapkan Profil Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Progress Indicator -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="ph:check-circle" class="text-green-600 mr-3" size="24" />
                <div>
                  <h3 class="text-lg font-semibold text-blue-900">
                    Pelantikan Telah Diterima
                  </h3>
                  <p class="text-blue-800 text-sm">
                    Sila lengkapkan maklumat profil anda untuk memulakan perkhidmatan
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm text-blue-700">Langkah 2/2</p>
                <p class="text-xs text-blue-600">Lengkapkan Profil</p>
              </div>
            </div>
          </div>

          <!-- Profile Update Form -->
          <FormKit
            type="form"
            id="profileUpdateForm"
            :actions="false"
            @submit="handleSubmit"
          >
            <!-- Personal Information Section -->
            <div class="mb-6 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Peribadi
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="text"
                  name="nama"
                  label="Nama Penuh"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama penuh diperlukan',
                  }"
                  v-model="formData.nama"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="text"
                  name="noKP"
                  label="Nombor Kad Pengenalan"
                  validation="required"
                  :validation-messages="{
                    required: 'Nombor kad pengenalan diperlukan',
                  }"
                  v-model="formData.noKP"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="select"
                  name="jantina"
                  label="Jantina"
                  :options="jantinaOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Jantina diperlukan',
                  }"
                  v-model="formData.jantina"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="select"
                  name="bangsa"
                  label="Bangsa"
                  :options="bangsaOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Bangsa diperlukan',
                  }"
                  v-model="formData.bangsa"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="email"
                  name="emel"
                  label="Alamat Emel"
                  validation="required|email"
                  :validation-messages="{
                    required: 'Alamat emel diperlukan',
                    email: 'Alamat emel tidak sah',
                  }"
                  v-model="formData.emel"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="tel"
                  name="telefon"
                  label="Nombor Telefon"
                  validation="required"
                  :validation-messages="{
                    required: 'Nombor telefon diperlukan',
                  }"
                  v-model="formData.telefon"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </div>

            <!-- Address Information Section -->
            <div class="mb-6 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Alamat
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="alamatRumah"
                    label="Alamat Rumah"
                    validation="required"
                    :validation-messages="{
                      required: 'Alamat rumah diperlukan',
                    }"
                    v-model="formData.alamatRumah"
                    :classes="{
                      input: 'min-h-[80px]',
                    }"
                  />
                </div>
                
                <FormKit
                  type="text"
                  name="poskod"
                  label="Poskod"
                  validation="required"
                  :validation-messages="{
                    required: 'Poskod diperlukan',
                  }"
                  v-model="formData.poskod"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="text"
                  name="bandar"
                  label="Bandar"
                  validation="required"
                  :validation-messages="{
                    required: 'Bandar diperlukan',
                  }"
                  v-model="formData.bandar"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="select"
                  name="negeri"
                  label="Negeri"
                  :options="negeriOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Negeri diperlukan',
                  }"
                  v-model="formData.negeri"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </div>

            <!-- Service Information Section -->
            <div class="mb-6 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Perkhidmatan
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="select"
                  name="kategoriPenolongAmil"
                  label="Kategori Penolong Amil"
                  :options="kategoriOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Kategori penolong amil diperlukan',
                  }"
                  v-model="formData.kategoriPenolongAmil"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="text"
                  name="jawatan"
                  label="Jawatan"
                  validation="required"
                  :validation-messages="{
                    required: 'Jawatan diperlukan',
                  }"
                  v-model="formData.jawatan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="text"
                  name="institusiKariah"
                  label="Institusi/Kariah"
                  validation="required"
                  :validation-messages="{
                    required: 'Institusi/kariah diperlukan',
                  }"
                  v-model="formData.institusiKariah"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="select"
                  name="sesiPerkhidmatan"
                  label="Sesi Perkhidmatan"
                  :options="sesiOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Sesi perkhidmatan diperlukan',
                  }"
                  v-model="formData.sesiPerkhidmatan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </div>

            <!-- Account Security Section -->
            <div class="mb-6 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Keselamatan Akaun
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="password"
                  name="password"
                  label="Kata Laluan"
                  validation="required|length:8"
                  :validation-messages="{
                    required: 'Kata laluan diperlukan',
                    length: 'Kata laluan mesti sekurang-kurangnya 8 aksara',
                  }"
                  v-model="formData.password"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  type="password"
                  name="confirmPassword"
                  label="Sahkan Kata Laluan"
                  validation="required|confirm:password"
                  :validation-messages="{
                    required: 'Sahkan kata laluan diperlukan',
                    confirm: 'Kata laluan tidak sepadan',
                  }"
                  v-model="formData.confirmPassword"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>
            </div>

            <!-- Additional Information Section -->
            <div class="mb-6 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Tambahan
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="textarea"
                  name="pengalaman"
                  label="Pengalaman Berkaitan (Opsional)"
                  placeholder="Sila nyatakan pengalaman berkaitan dengan perkhidmatan penolong amil..."
                  v-model="formData.pengalaman"
                  :classes="{
                    input: 'min-h-[100px]',
                  }"
                />
                
                <FormKit
                  type="textarea"
                  name="kemahiran"
                  label="Kemahiran Khas (Opsional)"
                  placeholder="Sila nyatakan kemahiran khas yang relevan..."
                  v-model="formData.kemahiran"
                  :classes="{
                    input: 'min-h-[100px]',
                  }"
                />
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end gap-4 mt-6">
              <rs-button
                type="button"
                variant="primary"
                @click="handleSubmitDirect"
                :disabled="isSubmitting"
              >
                <Icon
                  v-if="isSubmitting"
                  name="ph:spinner"
                  class="w-4 h-4 mr-2 animate-spin"
                />
                {{ isSubmitting ? 'Menghantar...' : 'Lengkapkan Profil' }}
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Lengkapkan Profil Penolong Amil",
  description: "Halaman untuk melengkapkan profil penolong amil",
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
    name: "Penerimaan Pelantikan",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3/login-penerimaan",
  },
  {
    name: "Lengkapkan Profil",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/login-penerimaan/profile/${route.params.rujukan}`,
  },
]);

// Form Data
const formData = ref({
  nama: "",
  noKP: "",
  jantina: "",
  bangsa: "",
  emel: "",
  telefon: "",
  alamatRumah: "",
  poskod: "",
  bandar: "",
  negeri: "",
  kategoriPenolongAmil: "",
  jawatan: "",
  institusiKariah: "",
  sesiPerkhidmatan: "",
  password: "",
  confirmPassword: "",
  pengalaman: "",
  kemahiran: "",
});

const isSubmitting = ref(false);

// Options for form fields
const jantinaOptions = [
  { label: "Lelaki", value: "Lelaki" },
  { label: "Perempuan", value: "Perempuan" },
];

const bangsaOptions = [
  { label: "Melayu", value: "Melayu" },
  { label: "Cina", value: "Cina" },
  { label: "India", value: "India" },
  { label: "Lain-lain", value: "Lain-lain" },
];

const negeriOptions = [
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

const kategoriOptions = [
  { label: "Fitrah", value: "Fitrah" },
  { label: "Kariah", value: "Kariah" },
  { label: "Komuniti", value: "Komuniti" },
  { label: "Padi", value: "Padi" },
];

const sesiOptions = [
  { label: "Sesi 1", value: "Sesi 1" },
  { label: "Sesi 2", value: "Sesi 2" },
  { label: "Sesi 3", value: "Sesi 3" },
  { label: "Sesi 4", value: "Sesi 4" },
];

// Action handlers
const handleSubmit = async (formData) => {
  // Form submission handler
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    // Profile update submitted successfully
    
    // Navigate to dashboard or success page
    navigateTo("/BF-PA/PP/pra-daftar-v3/dashboard");
    
  } catch (error) {
    alert("Ralat berlaku semasa menyimpan profil. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};



onMounted(() => {
  // In real implementation, fetch existing profile data based on rujukan
      // Loading profile data
  
  // Pre-fill form with existing data if available
  formData.value = {
    nama: "Ahmad bin Abdullah",
    noKP: "901231012345",
    jantina: "Lelaki",
    bangsa: "Melayu",
    emel: "ahmad.abdullah@email.com",
    telefon: "0123456789",
    alamatRumah: "No. 123, Jalan Utama, Taman Seri Indah",
    poskod: "50000",
    bandar: "Kuala Lumpur",
    negeri: "Kuala Lumpur",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Wilayah Persekutuan",
    sesiPerkhidmatan: "Sesi 1",
    password: "",
    confirmPassword: "",
    pengalaman: "",
    kemahiran: "",
  };
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 