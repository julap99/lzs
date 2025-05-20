<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pengesahan Profil (EOAD)</h2>
        </div>
      </template>

      <template #body>
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-4">
            Pegawai LZS akan membuat pengesahan Profil dan menentukan status
            asnaf
          </p>

          <!-- Read-Only Information Section -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">Maklumat Asas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-500"
                  >No. Kad Pengenalan</label
                >
                <div class="font-medium">{{ formData.icNumber }}</div>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Nama</label>
                <div class="font-medium">{{ formData.name }}</div>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Alamat</label>
                <div class="font-medium">{{ formData.address }}</div>
              </div>
            </div>
          </div>

          <!-- User Input Section -->
          <div class="bg-green-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">
              Pengesahan Status Asnaf
            </h3>

            <FormKit type="form" @submit="submitForm" :actions="false">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Status Keluarga Asnaf Dropdown -->
                <FormKit
                  type="select"
                  name="familyCategory"
                  label="Status Keluarga Asnaf*"
                  validation="required"
                  v-model="formData.familyCategory"
                  :options="familyCategoryOptions"
                  placeholder="Pilih status keluarga"
                  :validation-messages="{
                    required: 'Sila pilih status keluarga asnaf',
                  }"
                />

                <!-- Status Asnaf Dropdown -->
                <FormKit
                  type="select"
                  name="asnafStatus"
                  label="Status Asnaf*"
                  validation="required"
                  v-model="formData.asnafStatus"
                  :options="asnafStatusOptions"
                  placeholder="Pilih status asnaf"
                  :validation-messages="{
                    required: 'Sila pilih status asnaf',
                  }"
                />

                <!-- Status Asnaf Tanggungan Dropdown -->
                <FormKit
                  type="select"
                  name="dependentStatus"
                  label="Status Asnaf Tanggungan*"
                  validation="required"
                  v-model="formData.dependentStatus"
                  :options="dependentStatusOptions"
                  placeholder="Pilih status tanggungan"
                  :validation-messages="{
                    required: 'Sila pilih status tanggungan',
                  }"
                />
              </div>

              <div class="mt-6 flex justify-end gap-4">
                <rs-button
                  variant="primary-outline"
                  @click="navigateTo('/BF-PRF/AS/FR/04')"
                >
                  Kembali
                </rs-button>

                <rs-button
                  type="submit"
                  variant="primary"
                  :disabled="processing"
                  @click="submitForm"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" size="1rem" class="mr-1" />
                    Menyimpan...
                  </span>
                  <span v-else>Sahkan</span>
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Pengesahan Profil",
});

const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Analisa Data",
    type: "current",
    path: "/kifayah-analysis",
  },
]);

// Sample data - should come from previous page/API
const formData = ref({
  icNumber: "880101121234",
  name: "Ahmad bin Abdullah",
  address: "No 12, Jalan Merdeka, 43000 Kajang, Selangor",
  familyCategory: "miskin", // Now editable by admin
  asnafStatus: null, // To be selected by admin
  dependentStatus: null, // To be selected by admin
});

const familyCategoryOptions = {
  fakir: "Fakir",
  miskin: "Miskin",
  fisabilillah: "Fisabilillah",
  gharimin: "Gharimin",
  ibnussabil: "Ibnus Sabil",
  muallaf: "Muallaf",
  amil: "Amil",
  non_fm: "Non-FM",
};

const asnafStatusOptions = {
  fakir: "Fakir",
  miskin: "Miskin",
  fisabilillah: "Fisabilillah",
  gharimin: "Gharimin",
  ibnussabil: "Ibnus Sabil",
  muallaf: "Muallaf",
  amil: "Amil",
};

const dependentStatusOptions = {
  yes: "Ya",
  no: "Tidak",
  partial: "Sebahagian",
};

const submitForm = () => {
  processing.value = true;

  // Simulate form submission
  setTimeout(() => {
    console.log("Form submitted:", formData.value);

    // Navigate after submission
    navigateTo("/BF-PRF/AS/FR/07");
    processing.value = false;
  }, 1000);
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
