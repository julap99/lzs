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

          <!-- Sebelum Kemaskini (Readonly) -->
          <div class="bg-green-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">Sebelum Kemaskini</h3>

            <FormKit type="form" @submit="submitForm" :actions="false">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Status Keluarga Asnaf Dropdown -->
                <FormKit
                  readonly
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
                  readonly
                  type="select"
                  name="asnafStatus"
                  label="Status Asnaf*"
                  validation="required"
                  :options="asnafStatusOptions"
                  v-model="formData.asnafStatus"
                  placeholder="Pilih status asnaf"
                  :validation-messages="{
                    required: 'Sila pilih status asnaf',
                  }"
                />

                <!-- Status Asnaf Tanggungan Dropdown -->
                <FormKit
                  readonly
                  value="yes"
                  type="select"
                  name="dependentStatus"
                  label="Status Asnaf Tanggungan*"
                  validation="required"
                  :options="dependentStatusOptions"
                  placeholder="Pilih status tanggungan"
                  :validation-messages="{
                    required: 'Sila pilih status tanggungan',
                  }"
                />
              </div>
            </FormKit>
          </div>

          <!-- Selepas Kemaskini (Editable) -->
          <div class="bg-green-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">Selepas Kemaskini</h3>

            <FormKit type="form" @submit="submitForm" :actions="false">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Status Keluarga Asnaf Dropdown -->
                <FormKit
                  type="select"
                  name="familyCategory"
                  label="Status Keluarga Asnaf*"
                  validation="required"
                  v-model="formDataAfter.familyCategory"
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
                  v-model="formDataAfter.asnafStatus"
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
                  v-model="formDataAfter.dependentStatus"
                  :options="dependentStatusOptions"
                  placeholder="Pilih status tanggungan"
                  :validation-messages="{
                    required: 'Sila pilih status tanggungan',
                  }"
                />
              </div>

              
            </FormKit>
          </div>

          <!-- Perbandingan Ringkas -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">Perbandingan (Sebelum vs Selepas)</h3>
            <div class="overflow-x-auto text-sm mt-2">
              <rs-table
                :field="comparisonFields"
                :data="comparisonData"
                :options="{
                  variant: 'default',
                  striped: true,
                  borderless: false,
                  hover: true
                }"
                basic
                class="mb-2 border border-gray-300 text-sm"
              >
              </rs-table>
            </div>
            <div class="mt-6 flex justify-end gap-4">
                <rs-button
                  variant="primary-outline"
                  @click="navigateTo('/BF-PRF/AS/UP/07')"
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
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

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
  icNumber: "770319035991",
  name: "ADNAN BIN ABU",
  address: "No 12, Jalan Merdeka, 43000 Kajang, Selangor, Malaysia",
  familyCategory: "miskin", // Now editable by admin
  asnafStatus: "miskin", // Default to match readonly select
  dependentStatus: "yes", // Default to match readonly select
});

// After (editable)
const formDataAfter = ref({
  familyCategory: null,
  asnafStatus: null,
  dependentStatus: null,
});

// Comparison table
const comparisonFields = ref(["Medan", "Sebelum", "Selepas"]);
const comparisonData = computed(() => {
  return [
    {
      Medan: 'Status Keluarga Asnaf',
      Sebelum: familyCategoryOptions[formData.value.familyCategory] || '-',
      Selepas: familyCategoryOptions[formDataAfter.value.familyCategory] || '-',
    },
    {
      Medan: 'Status Asnaf',
      Sebelum: asnafStatusOptions[formData.value.asnafStatus] || '-',
      Selepas: asnafStatusOptions[formDataAfter.value.asnafStatus] || '-',
    },
    {
      Medan: 'Status Asnaf Tanggungan',
      Sebelum: dependentStatusOptions[formData.value.dependentStatus] || '-',
      Selepas: dependentStatusOptions[formDataAfter.value.dependentStatus] || '-',
    },
  ];
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
    navigateTo("/BF-PRF/AS/FR/01");
    processing.value = false;
  }, 1000);
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
