<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Status Tracking</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          :classes="{
            messages: 'mb-4',
            form: 'space-y-6',
          }"
        >
          <!-- Access Method Selection -->
          <FormKit
            type="select"
            name="accessMethod"
            label="Kaedah Akses"
            :options="[{ label: 'Semak Guna No. Kad Pengenalan', value: 'ic' }]"
            validation="required"
            :validation-messages="{
              required: 'Sila pilih kaedah akses',
            }"
          />

          <!-- User Type Selection -->
          <FormKit
            type="select"
            name="userType"
            label="Jenis Pengguna"
            :options="[
              { label: 'Individu/Asnaf', value: 'individual' },
              {
                label: 'Third-party (Individu)',
                value: 'third_party_individual',
              },
              { label: 'Third-party (Syarikat)', value: 'third_party_company' },
              { label: 'Organisasi/NGO/Masjid', value: 'organization' },
              { label: 'Penolong Amil', value: 'amil' },
            ]"
            validation="required"
            :validation-messages="{
              required: 'Sila pilih jenis pengguna',
            }"
          />

          <!-- Identification Number -->
          <FormKit
            type="text"
            name="identificationNumber"
            label="Nombor Pengenalan"
            :placeholder="getIdentificationPlaceholder"
            validation="required"
            :validation-messages="{
              required: 'Nombor pengenalan diperlukan',
            }"
            :help="getIdentificationHelp"
          />

          <!-- Reference Number -->
          <FormKit
            type="text"
            name="referenceNumber"
            label="Nombor Rujukan Semakan"
            placeholder="Masukkan nombor rujukan semakan"
            validation="required"
            :validation-messages="{
              required: 'Nombor rujukan semakan diperlukan',
            }"
          />

          <!-- Captcha -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium mb-4">Pengesahan Captcha</h3>
            <div class="flex items-center justify-center">
              <!-- Replace with actual captcha component -->
              <div class="bg-gray-200 p-4 rounded">
                [Captcha Component Placeholder]
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6">
            <rs-button
              variant="primary"
              type="submit"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              Semak Status
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Error Modal -->
    <rs-modal
      v-model="showErrorModal"
      title="Ralat"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon name="mdi:alert-circle" class="text-red-500 text-5xl mb-3" />
          <h3 class="text-lg font-medium">Maklumat Tidak Dijumpai</h3>
          <p class="mt-2">
            Sila semak semula Nombor Pengenalan dan Nombor Rujukan anda.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center w-full">
          <rs-button variant="primary" @click="showErrorModal = false">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Status Tracking",
});

const toast = useToast();
const isSubmitting = ref(false);
const showErrorModal = ref(false);

const breadcrumb = ref([
  {
    name: "Dashboard & Pelaporan",
    type: "link",
    path: "/BF-DP/ST/01",
  },
  {
    name: "Status Tracking",
    type: "current",
    path: "/BF-DP/ST/01",
  },
]);

const formData = ref({
  accessMethod: "",
  userType: "",
  identificationNumber: "",
  referenceNumber: "",
});

const getIdentificationPlaceholder = computed(() => {
  switch (formData.value.userType) {
    case "individual":
    case "third_party_individual":
    case "amil":
      return "Masukkan No. Kad Pengenalan";
    case "third_party_company":
      return "Masukkan No. Pendaftaran SSM";
    case "organization":
      return "Masukkan No. Rujukan Rasmi (SSM, ROS, ID NAS)";
    default:
      return "Masukkan Nombor Pengenalan";
  }
});

const getIdentificationHelp = computed(() => {
  switch (formData.value.userType) {
    case "individual":
      return "Masukkan No. Kad Pengenalan (IC)";
    case "third_party_individual":
      return "Masukkan IC atau No. Pasport";
    case "third_party_company":
      return "Masukkan No. Pendaftaran SSM";
    case "organization":
      return "Masukkan No. Rujukan Rasmi (SSM, ROS, ID NAS)";
    case "amil":
      return "Masukkan No. Kad Pengenalan atau ID Penolong Amil";
    default:
      return "";
  }
});

const handleSubmit = async (data) => {
  try {
    isSubmitting.value = true;

    // TODO: Implement actual API call to check status
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate error case
    // showErrorModal.value = true;

    navigateTo("/BF-DP/ST/02");
  } catch (error) {
    toast.error("Ralat semasa menyemak status");
    console.error("Error checking status:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
