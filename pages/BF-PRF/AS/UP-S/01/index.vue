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

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/UP-S/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/UP-S/01",
  },
  {
    name: "Kemaskini Profil",
    type: "current",
    path: "/BF-PRF/AS/UP-S/01",
  },
]);

const idTypeOptions = [
  { label: "No. Kad Pengenalan", value: "ic" },
  { label: "No. Polis", value: "police" },
  { label: "No. Tentera", value: "military" },
  { label: "No. Pasport", value: "passport" },
];

const formData = ref({
  idType: "",
  idNumber: "",
});

const getPlaceholder = () => {
  switch (formData.value.idType) {
    case "ic":
      return "Contoh: 880101121234";
    case "police":
      return "Masukkan No. Polis";
    case "military":
      return "Masukkan No. Tentera";
    case "passport":
      return "Masukkan No. Pasport";
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

  // Simulate API call to search for profile
  setTimeout(() => {
    processing.value = false;
    searchCompleted.value = true;

    navigateTo(`/BF-PRF/AS/UP-S/02`);
  }, 1000);
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
