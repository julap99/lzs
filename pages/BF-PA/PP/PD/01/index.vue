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
          <p class="mb-4 text-gray-700">
            Sila isi maklumat asas calon penolong amil di bawah:
          </p>

          <!-- FormKit Form -->
          <FormKit
            type="form"
            id="registrationForm"
            @submit="handleSubmit"
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
                />

                <!-- Kategori Penolong Amil -->
                <FormKit
                  type="select"
                  :name="`forms.${index}.kategoriPenolongAmil`"
                  label="Kategori Penolong Amil"
                  placeholder="Pilih kategori"
                  validation="required"
                  :options="[
                    { label: 'Fitrah', value: 'FITRAH' },
                    { label: 'Padi', value: 'PADI' },
                    { label: 'Kariah', value: 'KARIAH' },
                    { label: 'Komuniti', value: 'KOMUNITI' },
                  ]"
                  :validation-messages="{
                    required: 'Kategori diperlukan',
                  }"
                />
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
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
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
import { ref } from "vue";

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
const forms = ref([{}]);
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
  forms.value.push({});
};

// Remove form
const removeForm = (index) => {
  forms.value.splice(index, 1);
};

// Form submission handler
const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;

    // Process form data
    const processedData = {
      forms: formData.forms.map(form => ({
        ...form,
        masjidId: currentMasjid.value.kodMasjid,
        namaMasjid: currentMasjid.value.namaMasjid,
      })),
      suratSokongan: formData.suratSokongan,
    };

    console.log("Submitted form data:", processedData);

    // Show success modal after submission
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Ralat semasa pendaftaran. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigation and modal handlers
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/02");
};
</script>
