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
                  <div class="mb-2">Baki Pendapatan: <span class="font-bold">RM {{ bakiPendapatan.toFixed(2) }}</span></div>
                  <div class="mb-2">Peratusan Perbezaan: <span class="font-bold">{{ peratusanPendapatan.toFixed(2) }}%</span></div>
                  <div class="mb-2">Kategori Keluarga Asnaf: <span class="text-blue-600 font-bold">{{ kategoriKeluarga }}</span></div>
                  <div class="mb-4">Kategori Asnaf: <span class="text-blue-600 font-bold">{{ kategoriAsnaf }}</span></div>

                  <!-- Household Breakdown Table -->
                  <div class="overflow-x-auto mb-2">
                    <table class="min-w-max w-full text-sm border border-blue-300 mb-2">
                      <thead class="bg-blue-100">
                        <tr>
                          <th class="border px-2 py-1">Kategori</th>
                          <th class="border px-2 py-1">Had Kifayah</th>
                          <th class="border px-2 py-1">Bil</th>
                          <th class="border px-2 py-1">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="border px-2 py-1">Rumah Tidak Berbayar</td>
                          <td class="border px-2 py-1">780.00</td>
                          <td class="border px-2 py-1">1</td>
                          <td class="border px-2 py-1">780.00</td>
                        </tr>
                        <tr>
                          <td class="border px-2 py-1">Dewasa Tidak Bekerja</td>
                          <td class="border px-2 py-1">167.00</td>
                          <td class="border px-2 py-1">1</td>
                          <td class="border px-2 py-1">167.00</td>
                        </tr>
                        <tr>
                          <td class="border px-2 py-1">Tanggungan 7-17 tahun</td>
                          <td class="border px-2 py-1">408.00</td>
                          <td class="border px-2 py-1">1</td>
                          <td class="border px-2 py-1">408.00</td>
                        </tr>
                        <tr>
                          <td class="border px-2 py-1">Tanggungan Belajar IPT</td>
                          <td class="border px-2 py-1">613.00</td>
                          <td class="border px-2 py-1">1</td>
                          <td class="border px-2 py-1">613.00</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="bg-blue-100 font-bold">
                          <td class="border px-2 py-1 text-right" colspan="3">Jumlah Had Kifayah</td>
                          <td class="border px-2 py-1">1968.00</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
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
                  @click="goToSummary"
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
  icNumber: "770319035991",
  name: "",
  income: 1000,
  dependentsIncome: 0,
});

const kifayahLimit = ref(null);

// Computed values for calculation and categorization
const totalIncome = computed(() => {
  // Pendapatan Isi Rumah
  return Number(formData.value.income) || 0;
});

const bakiPendapatan = computed(() => {
  // Baki Pendapatan = Pendapatan Isi Rumah - Jumlah Had Kifayah
  if (!kifayahLimit.value) return 0;
  return totalIncome.value - kifayahLimit.value;
});

const peratusanPendapatan = computed(() => {
  // Peratusan = (Pendapatan Isi Rumah / Jumlah Had Kifayah) × 100
  if (!kifayahLimit.value || kifayahLimit.value === 0) return 0;
  return (totalIncome.value / kifayahLimit.value) * 100;
});

const kategoriKeluarga = computed(() => {
  if (!kifayahLimit.value || kifayahLimit.value === 0) return '-';
  if (peratusanPendapatan.value < 50) return 'Fakir';
  if (peratusanPendapatan.value <= 100) return 'Miskin';
  return 'Non-FM';
});

const kategoriAsnaf = computed(() => kategoriKeluarga.value);

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
    formData.value.income === null ||
    formData.value.dependentsIncome === null
  ) {
    return;
  }

  processing.value = true;

  // Hardcoded household category values as per example
  // Rumah Percuma: 780
  // Dewasa Tidak Bekerja: 167
  // Tanggungan 7-17 tahun: 408
  // Tanggungan Belajar IPT: 613
  // Jumlah Had Kifayah = 780 + 167 + 408 + 613 = 1968
  const jumlahHadKifayah = 780 + 167 + 408 + 613;
  kifayahLimit.value = jumlahHadKifayah;
  processing.value = false;
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  calculateKifayahLimit();
};
</script>
