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
            :variant="profileExists ? 'success' : 'warning'"
            class="mb-4"
          >
            <template #body>
              <div class="flex items-center">
                <div class="mr-4">
                  <Icon
                    :name="
                      profileExists ? 'mdi:check-circle' : 'mdi:alert-circle'
                    "
                    size="2rem"
                    :class="profileExists ? 'text-green-600' : 'text-amber-600'"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium">
                    {{
                      profileExists ? "Profil Ditemui" : "Profil Tidak Ditemui"
                    }}
                  </h3>
                  <p class="text-sm mt-1">
                    {{
                      profileExists
                        ? "Profil bagi ID yang dimasukkan telah dijumpai dalam sistem."
                        : "Tiada profil ditemui bagi ID yang dimasukkan."
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
                  {{ profileExists ? "Kemaskini Profil" : "Pendaftaran Baru" }}
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
const profileExists = ref(false);

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR-S/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/FR-S/01",
  },
  {
    name: "Pendaftaran Lengkap",
    type: "current",
    path: "/BF-PRF/AS/FR-S/01",
  },
]);

const idTypeOptions = [
  { label: "No. Kad Pengenalan", value: "ic" },
  { label: "No. Polis", value: "police" },
  { label: "No. Tentera", value: "army" },
  { label: "No. Passport", value: "passport" },
];

const formData = ref({
  idType: "",
  idNumber: "",
});

const getPlaceholder = () => {
  switch (formData.value.idType) {
    case "ic":
      return "Contoh: 880101121234";
    case "org":
      return "Masukkan No. Organisasi";
    case "rujukan":
      return "Masukkan No. Rujukan";
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
    // Randomize whether profile exists or not (50% chance)
    profileExists.value = Math.random() >= 0.5;
    searchCompleted.value = true;
  }, 1000);
};

const navigateNext = () => {
  if (profileExists.value) {
    // Navigate to update profile page
    navigateTo("/BF-PRF/AS/UP/02");
  } else {
    // Navigate to new registration page
    navigateTo("/BF-PRF/AS/FR/02");
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
