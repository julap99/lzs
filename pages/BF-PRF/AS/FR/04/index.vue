<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Analisa Data (Had Kifayah) (NAS)</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-4">
            Proses mengira had kifayah asnaf berdasarkan maklumat yang
            dimasukkan
          </p>

          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="icNumber"
                label="No. Kad Pengenalan"
                validation="required"
                v-model="formData.icNumber"
                :validation-messages="{
                  required: 'No. Kad Pengenalan adalah wajib',
                }"
                placeholder="Contoh: 880101121234"
                disabled
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormKit
                type="number"
                name="income"
                label="Pendapatan (RM)"
                validation="required"
                v-model="formData.income"
                :validation-messages="{
                  required: 'Pendapatan adalah wajib',
                }"
                placeholder="Masukkan jumlah pendapatan"
              />

              <FormKit
                type="number"
                name="dependentsIncome"
                label="Pendapatan Tanggungan (RM)"
                validation="required"
                v-model="formData.dependentsIncome"
                :validation-messages="{
                  required: 'Pendapatan tanggungan adalah wajib',
                }"
                placeholder="Masukkan jumlah pendapatan tanggungan"
              />
            </div>

            <div class="mt-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-medium text-gray-700 mb-2">
                  Hasil Pengiraan Had Kifayah
                </h3>
                <div v-if="kifayahLimit" class="text-lg font-semibold">
                  Total Had Kifayah: RM {{ kifayahLimit.toFixed(2) }}
                </div>
                <div v-else class="text-gray-500">
                  Masukkan maklumat untuk pengiraan
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button
                  variant="primary-outline"
                  @click="navigateTo('/BF-PRF/AS/FR/03')"
                >
                  Kembali
                </rs-button>
              </div>

              <div>
                <rs-button
                  v-if="!kifayahLimit"
                  variant="primary"
                  class="ml-auto"
                  @click="calculateKifayahLimit"
                  :disabled="processing"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Kira Had Kifayah</span>
                </rs-button>

                <rs-button
                  v-else
                  variant="primary"
                  class="ml-auto"
                  @click="navigateTo(`/BF-PRF/AS/FR/05`)"
                  :disabled="processing"
                >

                <!-- BF-BTN/PB/syorkan-bantuan -->
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Seterusnya</span>
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
import { ref, computed } from "vue";

definePageMeta({
  title: "Analisa Data Had Kifayah",
});

const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Analisa Data",
    type: "current",
    path: "/kifayah-analysis",
  },
]);

const formData = ref({
  icNumber: "000000000000",
  name: "",
  income: 2000,
  dependentsIncome: 1000,
});

const kifayahLimit = ref(null);

const resetForm = () => {
  formData.value = {
    icNumber: "",
    name: "",
    income: null,
    dependentsIncome: null,
  };
  kifayahLimit.value = null;
};

const calculateKifayahLimit = () => {
  if (
    !formData.value.icNumber ||
    !formData.value.income ||
    !formData.value.dependentsIncome
  ) {
    return;
  }

  processing.value = true;

  // Simulate calculation process
  setTimeout(() => {
    // Example calculation logic - replace with your actual formula
    const basicNeed = 1500; // Basic living cost
    const dependentsNeed = formData.value.dependentsIncome * 0.6; // Example calculation

    kifayahLimit.value = basicNeed + dependentsNeed;
    processing.value = false;
  }, 1000);
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  calculateKifayahLimit();
};
</script>
