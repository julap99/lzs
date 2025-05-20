<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pendaftaran Awal Calon Penolong Amil
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombor Kad Pengenalan -->
              <FormKit
                type="text"
                name="noKadPengenalan"
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
                name="namaCalonPenolongAmil"
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
                name="emel"
                label="Emel"
                placeholder="contoh@email.com"
                validation="required|email"
                :validation-messages="{
                  required: 'Emel diperlukan',
                  email: 'Format emel tidak sah',
                }"
              />

              <!-- Kategori Penolong Amil -->
              <FormKit
                type="select"
                name="kategoriPenolongAmil"
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

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Daftar Calon
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
            Pendaftaran awal calon penolong amil berjaya dihantar.
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
  title: "Pendaftaran Awal Calon Penolong Amil",
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

// Form submission state
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

// Form submission handler
const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;

    // Mock API call - would be replaced with actual API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Submitted form data:", {
      ...formData,
      masjidId: currentMasjid.value.kodMasjid,
      namaMasjid: currentMasjid.value.namaMasjid,
    });

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
const goBack = () => {
  navigateTo("/BF-PA/PP/PM/01");
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD/02");
};
</script>
