<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Lengkapkan Maklumat Peribadi dan Perkhidmatan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <p class="mb-4 text-gray-700">
            Sila lengkapkan maklumat peribadi dan perkhidmatan anda sebagai
            penolong amil:
          </p>

          <!-- Progress Steps -->
          <div class="mb-8">
            <div class="flex items-center justify-between">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center"
              >
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-full"
                  :class="
                    currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  "
                >
                  {{ step.id }}
                </div>
                <div
                  class="ml-2 text-sm font-medium"
                  :class="
                    currentStep >= step.id
                      ? 'text-primary'
                      : 'text-gray-600'
                  "
                >
                  {{ step.title }}
                </div>
                <div
                  v-if="index < steps.length - 1"
                  class="w-24 h-1 mx-4"
                  :class="
                    currentStep > step.id
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  "
                ></div>
              </div>
            </div>
          </div>

          <!-- FormKit Form -->
          <FormKit
            type="form"
            id="detailsForm"
            @submit="handleSubmit"
            :actions="false"
          >
            <!-- Step 1: Maklumat Peribadi -->
            <div v-if="currentStep === 1">
              <h3 class="text-lg font-medium mb-4">Maklumat Peribadi</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nama Penuh -->
                <FormKit
                  type="text"
                  name="namaPenuh"
                  label="Nama Penuh"
                  placeholder="Masukkan nama penuh"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama penuh diperlukan',
                  }"
                  :value="userData.namaPenuh"
                />

                <!-- No Kad Pengenalan -->
                <FormKit
                  type="text"
                  name="noKadPengenalan"
                  label="No. Kad Pengenalan"
                  placeholder="Contoh: 901231012345"
                  validation="required|length:12"
                  :validation-messages="{
                    required: 'No. kad pengenalan diperlukan',
                    length: 'No. kad pengenalan mesti 12 digit',
                  }"
                  :value="userData.noKadPengenalan"
                  disabled
                />

                <!-- Tarikh Lahir -->
                <FormKit
                  type="date"
                  name="tarikhLahir"
                  label="Tarikh Lahir"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh lahir diperlukan',
                  }"
                  :value="userData.tarikhLahir"
                  @input="calculateAge"
                />

                <!-- Umur -->
                <FormKit
                  type="number"
                  name="umur"
                  label="Umur"
                  validation="required|min:18"
                  :validation-messages="{
                    required: 'Umur diperlukan',
                    min: 'Umur minimum adalah 18 tahun',
                  }"
                  :value="userData.umur"
                  disabled
                />

                <!-- Jenis Pengenalan -->
                <FormKit
                  type="select"
                  name="jenisPengenalan"
                  label="Jenis Pengenalan"
                  :options="[
                    { label: 'MyKad', value: 'MYKAD' },
                    { label: 'MyPR', value: 'MYPR' },
                    { label: 'Lain-lain', value: 'OTHERS' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Jenis pengenalan diperlukan',
                  }"
                  :value="userData.jenisPengenalan"
                />

                <!-- Pekerjaan Semasa -->
                <FormKit
                  type="text"
                  name="pekerjaanSemasa"
                  label="Pekerjaan Semasa"
                  placeholder="Masukkan pekerjaan semasa"
                  validation="required"
                  :validation-messages="{
                    required: 'Pekerjaan semasa diperlukan',
                  }"
                  :value="userData.pekerjaanSemasa"
                />

                <!-- Kelulusan Akademik -->
                <FormKit
                  type="select"
                  name="kelulusanAkademik"
                  label="Kelulusan Akademik"
                  :options="[
                    { label: 'SPM', value: 'SPM' },
                    { label: 'STPM/Diploma', value: 'STPM_DIPLOMA' },
                    { label: 'Ijazah Sarjana Muda', value: 'DEGREE' },
                    { label: 'Ijazah Sarjana', value: 'MASTERS' },
                    { label: 'PhD', value: 'PHD' },
                    { label: 'Lain-lain', value: 'OTHERS' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Kelulusan akademik diperlukan',
                  }"
                  :value="userData.kelulusanAkademik"
                />

                <!-- Emel -->
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
                  :value="userData.emel"
                />

                <!-- No Telefon -->
                <FormKit
                  type="tel"
                  name="noTelefon"
                  label="No. Telefon"
                  placeholder="Contoh: 0123456789"
                  validation="required|length:10,12"
                  :validation-messages="{
                    required: 'No. telefon diperlukan',
                    length: 'No. telefon mesti antara 10-12 digit',
                  }"
                  :value="userData.noTelefon"
                />
              </div>

              <!-- Alamat -->
              <div class="mt-6">
                <h4 class="font-medium mb-3">Alamat</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormKit
                    type="textarea"
                    name="alamat"
                    label="Alamat Lengkap"
                    placeholder="Masukkan alamat lengkap"
                    validation="required"
                    :validation-messages="{
                      required: 'Alamat diperlukan',
                    }"
                    :value="userData.alamat"
                  />

                  <div class="grid grid-cols-1 gap-6">
                    <FormKit
                      type="text"
                      name="poskod"
                      label="Poskod"
                      placeholder="Contoh: 50000"
                      validation="required|length:5"
                      :validation-messages="{
                        required: 'Poskod diperlukan',
                        length: 'Poskod mesti 5 digit',
                      }"
                      :value="userData.poskod"
                    />

                    <FormKit
                      type="select"
                      name="negeri"
                      label="Negeri"
                      :options="[
                        { label: 'Wilayah Persekutuan', value: 'WP' },
                        { label: 'Selangor', value: 'SGR' },
                        { label: 'Johor', value: 'JHR' },
                        { label: 'Kedah', value: 'KDH' },
                        { label: 'Kelantan', value: 'KTN' },
                        { label: 'Melaka', value: 'MLK' },
                        { label: 'Negeri Sembilan', value: 'NSN' },
                        { label: 'Pahang', value: 'PHG' },
                        { label: 'Pulau Pinang', value: 'PNG' },
                        { label: 'Perak', value: 'PRK' },
                        { label: 'Perlis', value: 'PLS' },
                        { label: 'Sabah', value: 'SBH' },
                        { label: 'Sarawak', value: 'SWK' },
                        { label: 'Terengganu', value: 'TRG' },
                      ]"
                      validation="required"
                      :validation-messages="{
                        required: 'Negeri diperlukan',
                      }"
                      :value="userData.negeri"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Maklumat Perkhidmatan -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-medium mb-4">Maklumat Perkhidmatan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kategori Amil -->
                <FormKit
                  type="select"
                  name="kategoriAmil"
                  label="Kategori Amil"
                  :options="[
                    { label: 'Fitrah', value: 'FITRAH' },
                    { label: 'Padi', value: 'PADI' },
                    { label: 'Kariah', value: 'KARIAH' },
                    { label: 'Komuniti', value: 'KOMUNITI' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Kategori amil diperlukan',
                  }"
                  :value="userData.kategoriAmil"
                  @input="updateJawatanAmil"
                />

                <!-- Jawatan Amil Komuniti (if applicable) -->
                <FormKit
                  v-if="userData.kategoriAmil === 'KOMUNITI'"
                  type="select"
                  name="jawatanAmilKomuniti"
                  label="Jawatan Amil Komuniti"
                  :options="[
                    { label: 'Pengerusi', value: 'PENGERUSI' },
                    { label: 'Setiausaha', value: 'SETIAUSAHA' },
                    { label: 'Bendahari', value: 'BENDAHARI' },
                    { label: 'Ahli Jawatankuasa', value: 'AJK' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Jawatan amil komuniti diperlukan',
                  }"
                  :value="userData.jawatanAmilKomuniti"
                />

                <!-- Jawatan dalam masjid/surau -->
                <FormKit
                  type="select"
                  name="jawatanMasjid"
                  label="Jawatan Dalam Masjid/Surau"
                  :options="[
                    { label: 'Pengerusi', value: 'PENGERUSI' },
                    { label: 'Imam', value: 'IMAM' },
                    { label: 'Bilal', value: 'BILAL' },
                    { label: 'Siak', value: 'SIAK' },
                    { label: 'AJK', value: 'AJK' },
                    { label: 'Kariah', value: 'KARIAH' },
                    { label: 'Tiada', value: 'NONE' },
                  ]"
                  :value="userData.jawatanMasjid"
                />

                <!-- Nama Bank -->
                <FormKit
                  type="select"
                  name="namaBank"
                  label="Nama Bank"
                  :options="[
                    { label: 'Maybank', value: 'MAYBANK' },
                    { label: 'CIMB', value: 'CIMB' },
                    { label: 'Bank Islam', value: 'BIMB' },
                    { label: 'RHB', value: 'RHB' },
                    { label: 'Bank Rakyat', value: 'RAKYAT' },
                    { label: 'Public Bank', value: 'PUBLIC' },
                    { label: 'Hong Leong Bank', value: 'HLB' },
                    { label: 'AmBank', value: 'AMBANK' },
                    { label: 'Affin Bank', value: 'AFFIN' },
                    { label: 'Bank Muamalat', value: 'MUAMALAT' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama bank diperlukan',
                  }"
                  :value="userData.namaBank"
                />

                <!-- No Akaun Bank -->
                <FormKit
                  type="text"
                  name="noAkaunBank"
                  label="No. Akaun Bank"
                  placeholder="Masukkan nombor akaun bank"
                  validation="required"
                  :validation-messages="{
                    required: 'No. akaun bank diperlukan',
                  }"
                  :value="userData.noAkaunBank"
                />
              </div>

              <!-- Maklumat Waris -->
              <div class="mt-6">
                <h4 class="font-medium mb-3">Maklumat Waris</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Nama Waris -->
                  <FormKit
                    type="text"
                    name="namaWaris"
                    label="Nama Waris"
                    placeholder="Masukkan nama waris"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama waris diperlukan',
                    }"
                    :value="userData.namaWaris"
                  />

                  <!-- No Kad Pengenalan Waris -->
                  <FormKit
                    type="text"
                    name="noKPWaris"
                    label="No. Kad Pengenalan Waris"
                    placeholder="Contoh: 901231012345"
                    validation="required|length:12"
                    :validation-messages="{
                      required: 'No. kad pengenalan waris diperlukan',
                      length: 'No. kad pengenalan mesti 12 digit',
                    }"
                    :value="userData.noKPWaris"
                  />

                  <!-- Hubungan dengan Waris -->
                  <FormKit
                    type="select"
                    name="hubunganWaris"
                    label="Hubungan dengan Waris"
                    :options="[
                      { label: 'Suami', value: 'HUSBAND' },
                      { label: 'Isteri', value: 'WIFE' },
                      { label: 'Anak', value: 'CHILD' },
                      { label: 'Ibu', value: 'MOTHER' },
                      { label: 'Bapa', value: 'FATHER' },
                      { label: 'Adik-beradik', value: 'SIBLING' },
                      { label: 'Lain-lain', value: 'OTHERS' },
                    ]"
                    validation="required"
                    :validation-messages="{
                      required: 'Hubungan dengan waris diperlukan',
                    }"
                    :value="userData.hubunganWaris"
                  />

                  <!-- No Telefon Waris -->
                  <FormKit
                    type="tel"
                    name="noTelefonWaris"
                    label="No. Telefon Waris"
                    placeholder="Contoh: 0123456789"
                    validation="required|length:10,12"
                    :validation-messages="{
                      required: 'No. telefon waris diperlukan',
                      length: 'No. telefon mesti antara 10-12 digit',
                    }"
                    :value="userData.noTelefonWaris"
                  />
                </div>
              </div>
            </div>

            <!-- Step 3: Muatnaik Dokumen -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-medium mb-4">
                Muatnaik Dokumen Sokongan
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Salinan Kad Pengenalan -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium mb-2">Salinan Kad Pengenalan</h4>
                  <p class="text-sm text-gray-600 mb-4">
                    Sila muatnaik salinan depan dan belakang kad pengenalan
                    anda.
                  </p>
                  <FormKit
                    type="file"
                    name="salinanKadPengenalan"
                    label="Muatnaik Kad Pengenalan"
                    accept=".jpg,.jpeg,.png,.pdf"
                    validation="required"
                    :validation-messages="{
                      required: 'Salinan kad pengenalan diperlukan',
                    }"
                  />
                  <div v-if="userData.salinanKadPengenalan" class="mt-2">
                    <p class="text-sm text-gray-600">
                      Fail dimuat naik: {{ userData.salinanKadPengenalan }}
                    </p>
                  </div>
                </div>

                <!-- Gambar -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium mb-2">Gambar</h4>
                  <p class="text-sm text-gray-600 mb-4">
                    Sila muatnaik gambar berukuran pasport dengan latar belakang
                    biru.
                  </p>
                  <FormKit
                    type="file"
                    name="gambar"
                    label="Muatnaik Gambar"
                    accept=".jpg,.jpeg,.png"
                    validation="required"
                    :validation-messages="{
                      required: 'Gambar diperlukan',
                    }"
                  />
                  <div v-if="userData.gambar" class="mt-2">
                    <p class="text-sm text-gray-600">
                      Fail dimuat naik: {{ userData.gambar }}
                    </p>
                  </div>
                </div>

                <!-- Penyata Bank -->
                <div class="border rounded-lg p-4">
                  <h4 class="font-medium mb-2">Penyata Bank</h4>
                  <p class="text-sm text-gray-600 mb-4">
                    Sila muatnaik penyata bank yang menunjukkan nama dan nombor
                    akaun anda.
                  </p>
                  <FormKit
                    type="file"
                    name="penyataBank"
                    label="Muatnaik Penyata Bank"
                    accept=".jpg,.jpeg,.png,.pdf"
                    validation="required"
                    :validation-messages="{
                      required: 'Penyata bank diperlukan',
                    }"
                  />
                  <div v-if="userData.penyataBank" class="mt-2">
                    <p class="text-sm text-gray-600">
                      Fail dimuat naik: {{ userData.penyataBank }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="mt-8 flex justify-between">
              <rs-button
                v-if="currentStep > 1"
                variant="primary-outline"
                @click="currentStep--"
              >
                Kembali
              </rs-button>
              <div class="flex gap-3">
                <rs-button
                  v-if="currentStep < 3"
                  variant="primary"
                  @click="nextStep"
                >
                  Seterusnya
                </rs-button>
                <rs-button
                  v-if="currentStep === 3"
                  variant="primary"
                  type="submit"
                  :loading="isSubmitting"
                  @click="submitForm"
                >
                  Simpan & Sahkan
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Maklumat Berjaya Disimpan"
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
            Maklumat peribadi dan perkhidmatan anda telah berjaya disimpan.
          </p>
          <p class="text-gray-600">
            Permohonan anda akan disemak oleh pihak pengurusan. Anda akan
            dimaklumkan melalui e-mel mengenai status permohonan anda.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Terus ke skrin PIC masjid memuat naik dokumen sokongan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

definePageMeta({
  title: "Lengkapkan Maklumat Penolong Amil",
  description: "Lengkapkan maklumat peribadi dan perkhidmatan penolong amil",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PD/Dashboard_PA",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PD/Dashboard_PA",
  },
  {
    name: "Maklumat Peribadi",
    type: "current",
    path: "/BF-PA/PP/PD/09",
  },
]);

// Steps configuration
const steps = ref([
  { id: 1, title: "Maklumat Peribadi" },
  { id: 2, title: "Maklumat Perkhidmatan" },
  { id: 3, title: "Muatnaik Dokumen" },
]);

const currentStep = ref(1);

// User data state
const userData = ref({
  // Pre-filled from registration
  namaPenuh: "",
  noKadPengenalan: "",
  emel: "",
  kategoriAmil: "",

  // New fields to complete
  tarikhLahir: "",
  umur: "",
  jenisPengenalan: "MYKAD",
  pekerjaanSemasa: "",
  kelulusanAkademik: "",
  noTelefon: "",
  alamat: "",
  poskod: "",
  negeri: "",
  jawatanAmilKomuniti: "",
  jawatanMasjid: "",
  namaBank: "",
  noAkaunBank: "",
  namaWaris: "",
  noKPWaris: "",
  hubunganWaris: "",
  noTelefonWaris: "",
  salinanKadPengenalan: "",
  gambar: "",
  penyataBank: "",
});

// Form submission state
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Fetch pre-filled data on component mount
onMounted(async () => {
  try {
    // In a real app, this would fetch data from an API
    // Simulating API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock pre-filled data from registration
    userData.value = {
      ...userData.value,
      namaPenuh: "Muhammad Aiman bin Abdullah",
      noKadPengenalan: "901231012345",
      emel: "aiman@email.com",
      kategoriAmil: "FITRAH",
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// Calculate age based on date of birth
const calculateAge = (date) => {
  if (!date) return;

  const birthDate = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  userData.value.umur = age;
};

// Update jawatan fields based on kategori
const updateJawatanAmil = (value) => {
  userData.value.kategoriAmil = value;
  if (value !== "KOMUNITI") {
    userData.value.jawatanAmilKomuniti = "";
  }
};

// Form navigation
const handleStepChange = (step) => {
  currentStep.value = step;
};

const nextStep = () => {
  if (currentStep.value < steps.value.length) {
    currentStep.value++;
  }
};

// Form submission
const submitForm = async () => {
  try {
    isSubmitting.value = true;

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Submitted form data:", userData.value);

    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Ralat semasa menyimpan maklumat. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation and modal handlers
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/Dashboard_PA");
};
</script> 