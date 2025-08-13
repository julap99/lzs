<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Daftar PIC Masjid Baharu</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          id="picMasjidForm"
          :actions="false"
          @submit="submitForm"
          :value="formData"
          #default="{ value }"
        >
          <!-- Section: Maklumat Masjid -->
          <div class="border-b pb-4">
            <h3 class="text-lg font-medium mb-4">Maklumat Masjid</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="kodMasjid"
                label="Kod Masjid"
                placeholder="Contoh: MSJ-KUL-001"
                help="Format: MSJ-[KOD NEGERI]-[NOMBOR]"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />

              <FormKit
                type="text"
                name="namaMasjid"
                label="Nama Masjid"
                placeholder="Masukkan nama penuh masjid"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />

              <FormKit
                type="select"
                name="negeri"
                label="Negeri"
                placeholder="Pilih negeri"
                :options="negeriOptions"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
                @input="loadDaerah"
              />

              <FormKit
                type="select"
                name="daerah"
                label="Daerah"
                placeholder="Pilih daerah"
                :options="daerahOptions"
                validation-visibility="live"
                :disabled="!value.negeri"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />

              <FormKit
                type="textarea"
                name="alamat"
                label="Alamat Masjid"
                placeholder="Masukkan alamat penuh masjid"
                validation-visibility="live"
                rows="3"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />

              <FormKit
                type="text"
                name="poskod"
                label="Poskod"
                placeholder="Contoh: 50480"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                  length: 'Poskod mestilah 5 digit',
                  matches: 'Poskod mestilah 5 digit nombor sahaja',
                }"
              />
            </div>
          </div>

          <!-- Section: Maklumat PIC -->
          <div class="border-b pb-4 mt-6">
            <h3 class="text-lg font-medium mb-4">
              Maklumat Pegawai Perhubungan (PIC)
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaPIC"
                label="Nama PIC"
                placeholder="Masukkan nama penuh PIC"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />

              <FormKit
                type="text"
                name="noKP"
                label="No. Kad Pengenalan"
                placeholder="Contoh: 800101012345"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                  length: 'No. Kad Pengenalan mestilah 12 digit',
                  matches: 'No. Kad Pengenalan mestilah 12 digit nombor sahaja',
                }"
              />

              <FormKit
                type="text"
                name="jawatan"
                label="Jawatan"
                placeholder="Contoh: Imam, AJK Pentadbiran"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />

              <FormKit
                type="tel"
                name="noTelefon"
                label="No. Telefon"
                placeholder="Contoh: 0123456789"
              />

              <FormKit
                type="email"
                name="emel"
                label="Emel"
                placeholder="Contoh: nama@domain.com"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                  email: 'Format emel tidak sah',
                }"
              />
            </div>
          </div>

          <!-- Maklumat Status -->
          <div class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="status"
                label="Status"
                placeholder="Pilih status"
                :options="statusOptions"
                validation="required"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi',
                }"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6">
            <rs-button variant="primary-outline" @click="cancelForm">
              Batal
            </rs-button>

            <rs-button
              :disabled="isSubmitting"
              :loading="isSubmitting"
              @click="submitForm"
            >
              Hantar
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Pengesahan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon name="mdi:check-circle" class="text-green-500 text-5xl mb-3" />
          <h3 class="text-lg font-medium">Pendaftaran Berjaya!</h3>
          <p class="mt-2">
            Maklumat PIC Masjid telah berjaya didaftarkan dalam sistem.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center w-full">
          <rs-button variant="primary" @click="navigateToList">
            Terus ke skrin Ketua Jabatan JPPA
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

definePageMeta({
  title: "Daftar PIC Masjid Baharu",
  description: "Pendaftaran maklumat PIC (Person In Charge) Masjid baharu",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran Sistem",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Senarai PIC Masjid",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Daftar PIC Masjid Baharu",
    type: "current",
    path: "/BF-PS/PPK/KP/pic-masjid-baharu",
  },
]);

// Form data
const formData = reactive({
  kodMasjid: "",
  namaMasjid: "",
  negeri: "",
  daerah: "",
  alamat: "",
  poskod: "",
  namaPIC: "",
  noKP: "",
  jawatan: "",
  noTelefon: "",
  emel: "",
  status: "Aktif",
});

// Form submission state
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

// Options for dropdown selects
const negeriOptions = ref([
  { label: "Sila pilih...", value: "" },
  { label: "Selangor", value: "SLG" },
  { label: "Kuala Lumpur", value: "KUL" },
  { label: "Putrajaya", value: "PTJ" },
  { label: "Johor", value: "JHR" },
  { label: "Kedah", value: "KDH" },
  { label: "Kelantan", value: "KTN" },
  { label: "Melaka", value: "MLK" },
  { label: "Negeri Sembilan", value: "NSN" },
  { label: "Pahang", value: "PHG" },
  { label: "Perak", value: "PRK" },
  { label: "Perlis", value: "PLS" },
  { label: "Pulau Pinang", value: "PNG" },
  { label: "Sabah", value: "SBH" },
  { label: "Sarawak", value: "SWK" },
  { label: "Terengganu", value: "TRG" },
]);

const daerahOptions = ref([]);

const statusOptions = ref([
  { label: "Sila pilih...", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
]);

// Load daerah based on selected negeri
const loadDaerah = (negeriCode) => {
  formData.daerah = ""; // Reset daerah selection

  // Simulate loading daerah list based on negeri
  switch (negeriCode) {
    case "SLG":
      daerahOptions.value = [
        { label: "Petaling", value: "Petaling" },
        { label: "Klang", value: "Klang" },
        { label: "Hulu Langat", value: "Hulu Langat" },
        { label: "Sepang", value: "Sepang" },
        { label: "Gombak", value: "Gombak" },
      ];
      break;
    case "KUL":
      daerahOptions.value = [{ label: "Kuala Lumpur", value: "Kuala Lumpur" }];
      break;
    case "PTJ":
      daerahOptions.value = [{ label: "Putrajaya", value: "Putrajaya" }];
      break;
    case "JHR":
      daerahOptions.value = [
        { label: "Johor Bahru", value: "Johor Bahru" },
        { label: "Batu Pahat", value: "Batu Pahat" },
        { label: "Muar", value: "Muar" },
      ];
      break;
    // Add other states as needed
    default:
      daerahOptions.value = [];
  }
};

// Form submission
const submitForm = async (formValues) => {
  isSubmitting.value = true;

  try {
    // Simulate API call to save data
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update local formData with FormKit values
    Object.assign(formData, formValues);

    // Show success modal
    showConfirmationModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Ralat berlaku semasa pendaftaran. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Cancel form and return to listing
const cancelForm = () => {
  if (
    confirm(
      "Adakah anda pasti ingin membatalkan pendaftaran ini? Semua maklumat yang dimasukkan akan hilang."
    )
  ) {
    navigateToList();
  }
};

// Navigate back to PIC Masjid listing
const navigateToList = () => {
  showConfirmationModal.value = false;
  navigateTo("/BF-PA/PP/PM/03");
};
</script>
