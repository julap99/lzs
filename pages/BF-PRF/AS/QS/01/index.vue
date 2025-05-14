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
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Keterangan Aktiviti</h3>
          <p>Semak Kewujudan Profil Asnaf</p>

          <h4 class="text-md font-medium mt-3 mb-2">Kaedah/Operasi:</h4>
          <ol class="list-decimal ml-5 space-y-1">
            <li>
              Pemohon akan memasukkan maklumat No Kad Pengenalan (baru) / No Polis / No
              Tentera / No Pasport semasa login
            </li>
            <li>
              NAS akan menyemak kewujudan profil dengan menggunakan maklumat yang
              dimasukkan
            </li>
          </ol>
        </div>

        <!-- Success Message - Only shown after search with results -->
        <div v-if="searchCompleted && profileFound" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">Profil ditemui dalam sistem</p>
          </div>
        </div>

        <!-- Not Found Message -->
        <div v-if="searchCompleted && !profileFound" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:alert-circle" class="text-amber-500" size="1.5rem" />
            <p class="text-amber-600 font-medium">
              Tiada profil ditemui untuk ID yang dimasukkan
            </p>
          </div>
        </div>

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

const route = useRoute();
const router = useRouter();
const processing = ref(false);
const searchCompleted = ref(false);
const profileFound = ref(false);

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Carian Profil",
    type: "current",
    path: "/carian-profil",
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

// Sample profile data - in real app, this would come from API
const profileData = ref({
  name: "Ahmad bin Abdullah",
  idNumber: "880101-12-1234",
  address: "No. 123, Jalan Masjid, Kampung Baru, 50300 Kuala Lumpur",
  phone: "012-3456789",
  status: "Aktif",
  category: "Fakir",
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

const getIdLabel = () => {
  switch (formData.value.idType) {
    case "ic":
      return "No. Kad Pengenalan";
    case "police":
      return "No. Polis";
    case "military":
      return "No. Tentera";
    case "passport":
      return "No. Pasport";
    default:
      return "ID";
  }
};

const getStatusClass = () => {
  switch (profileData.value.status) {
    case "Aktif":
      return "bg-green-100 text-green-800";
    case "Tidak Aktif":
      return "bg-red-100 text-red-800";
    case "Dalam Semakan":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
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

    navigateTo(`/BF-PRF/AS/QS/02`);
  }, 1000);
};

const viewFullProfile = () => {
  // Navigate to full profile page (in real app)
  router.push(`/profil/${formData.value.idType}/${formData.value.idNumber}`);
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
