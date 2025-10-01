<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Profil</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Carian Profil</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="idType"
                label="Jenis ID"
                validation="required"
                :options="idTypeOptions"
                placeholder="Pilih jenis ID"
                v-model="formData.idType"
                :validation-messages="{
                  required: 'Jenis ID adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="idNumber"
                label="Nombor ID"
                validation="required"
                v-model="formData.idNumber"
                :validation-messages="{
                  required: 'Nombor ID adalah wajib',
                }"
                :placeholder="getPlaceholder()"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button variant="primary-outline" @click="resetForm">
                  Reset
                </rs-button>
              </div>

              <div>
                <rs-button
                  variant="primary"
                  class="ml-auto"
                  @click="validateAndSearch"
                  :disabled="processing"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Cari</span>
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Search Result Section -->
        <div v-if="searchCompleted" class="mt-6">
          <rs-card
            :variant="profileStatus === 'found' ? 'success' : profileStatus === 'not_found' ? 'warning' : 'info'"
            class="mb-4"
          >
            <template #body>
              <div class="flex items-center">
                <div class="mr-4">
                  <Icon
                    :name="
                      profileStatus === 'found' ? 'mdi:check-circle' : profileStatus === 'not_found' ? 'mdi:alert-circle' : 'mdi:information'
                    "
                    size="2rem"
                    :class="profileStatus === 'found' ? 'text-green-600' : profileStatus === 'not_found' ? 'text-amber-600' : 'text-blue-600'"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium">
                    {{
                      profileStatus === 'found' ? "Profil Ditemui" : profileStatus === 'not_found' ? "Profil Tidak Ditemui" : "Lengkapkan Profil"
                    }}
                  </h3>
                  <p class="text-sm mt-1">
                    {{
                      profileStatus === 'found'
                        ? "Profil bagi ID yang dimasukkan telah dijumpai dalam sistem."
                        : profileStatus === 'not_found'
                        ? "Tiada profil ditemui bagi ID yang dimasukkan."
                        : "Profil tidak lengkap. Silakan lengkapkan profil."
                    }}
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                <rs-button
                  variant="primary"
                  @click="navigateNext"
                >
                  {{ profileStatus === 'found' ? "Kemaskini Profil" : profileStatus === 'not_found' ? "Pendaftaran Baru" : "Lengkapkan Profil" }}
                </rs-button>
              </div>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Carian Profil",
});

const processing = ref(false);
const searchCompleted = ref(false);
const profileStatus = ref(""); // "found", "not_found", "incomplete"

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/QS/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/QS/01",
  },
  {
    name: "Pendaftaran Pantas Perseorangan",
    type: "current",
    path: "/BF-PRF/AS/QS/01",
  },
]);

const idTypeOptions = [
  { label: "No. Kad Pengenalan", value: "ic" },
  { label: "Foreign ID", value: "foreign" },
];

const formData = ref({
  idType: "",
  idNumber: "",
});

const getPlaceholder = () => {
  switch (formData.value.idType) {
    case "ic":
      return "Contoh: 123456789";
    case "foreign":
      return "Masukkan Foreign ID";
    default:
      return "Sila pilih jenis ID dahulu";
  }
};

const resetForm = () => {
  formData.value.idType = "";
  formData.value.idNumber = "";
  searchCompleted.value = false;
};

const validateAndSearch = () => {
  if (!formData.value.idType || !formData.value.idNumber) {
    return;
  }

  performSearch();
};

const performSearch = async () => {
  processing.value = true;
  searchCompleted.value = false;

  // Simulate API call to search for profile with randomized result
  setTimeout(() => {
    processing.value = false;
    // Randomize between three states: found, not_found, incomplete
    const random = Math.random();
    if (random < 0.33) {
      profileStatus.value = "found";
    } else if (random < 0.66) {
      profileStatus.value = "not_found";
    } else {
      profileStatus.value = "incomplete";
    }
    searchCompleted.value = true;
  }, 1000);
};

const navigateNext = () => {
  if (profileStatus.value === "found") {
    // Navigate to update profile page
    navigateTo("/BF-PRF/AS/UP/02");
  } else if (profileStatus.value === "incomplete") {
    // Navigate to complete profile page
    navigateTo("/BF-PRF/AS/QS/02");
  } else {
    // Navigate to new registration page
    navigateTo("/BF-PRF/AS/QS/02");
  }
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  validateAndSearch();
};

// Watch for changes in ID type to clear the ID number field
watch(
  () => formData.value.idType,
  () => {
    formData.value.idNumber = "";
  }
);
</script>
