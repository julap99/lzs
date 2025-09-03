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
                <div class="text-lg font-semibold">
                  
                  <!-- Household Breakdown Table -->
                  <div class="overflow-x-auto mb-2">
                    <rs-table 
                      :field="tableFields" 
                      :data="tableData" 
                      :options="{
                        variant: 'default',
                        striped: true,
                        borderless: false,
                        hover: true
                      }"
                      basic
                      class="mb-2 border border-gray-300"
                    >
                    </rs-table>
                    
                    <!-- Footer row as separate div since rs-table might not support footer slot -->
                    <div class="bg-blue-100 font-bold p-2 text-end border border-blue-300">
                      <div class="mr-20">
                      <span>Jumlah Had Kifayah: RM1968.00</span>
                    </div>
                    </div>
                    
                  <div class="mb-2">Baki Pendapatan: Jumlah Pendapatan Keluarga - Jumlah Had Kifayah = 1000 - 1968 = -968</div>
                  <div class="mb-2">Peratusan Perbezaan: (Pendapatan Isi Rumah / Jumlah Had Kifayah) × 100 = (1000 / 1968) × 100 = 50.81% </div>
                  <div class="mb-2">Kategori Keluarga Asnaf: Miskin </div>
                  <div class="mb-4">Kategori Asnaf: Miskin</div>

                  </div>
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
                  variant="primary"
                  class="ml-auto"
                  @click="goToSummary"
                  :disabled="processing"
                >
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
import { ref, computed, onMounted } from "vue";

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

// Table data for rs-table
const tableFields = ref(["Kategori", "Had Kifayah", "Bil", "Jumlah"]);

const tableData = ref([
  { "Kategori": 'Rumah Tidak Berbayar', "Had Kifayah": '780.00', "Bil": '1', "Jumlah": '780.00' },
  { "Kategori": 'Dewasa Tidak Bekerja', "Had Kifayah": '167.00', "Bil": '1', "Jumlah": '167.00' },
  { "Kategori": 'Tanggungan 7-17 tahun', "Had Kifayah": '408.00', "Bil": '1', "Jumlah": '408.00' },
  { "Kategori": 'Tanggungan Belajar IPT', "Had Kifayah": '613.00', "Bil": '1', "Jumlah": '613.00' }
]);

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

// Automatically calculate kifayah limit when component mounts
onMounted(() => {
  calculateKifayahLimit();
});

function goToSummary() {
  // Save Had Kifayah results to localStorage
  localStorage.setItem('hadKifayahResult', JSON.stringify({
    bakiPendapatan: bakiPendapatan.value,
    peratusanPendapatan: peratusanPendapatan.value,
    kategoriKeluarga: kategoriKeluarga.value,
    kategoriAsnaf: kategoriAsnaf.value,
    kifayahLimit: kifayahLimit.value,
    breakdown: [
      { kategori: 'Rumah Tidak Berbayar', had: 780, bil: 1, jumlah: 780 },
      { kategori: 'Dewasa Tidak Bekerja', had: 167, bil: 1, jumlah: 167 },
      { kategori: 'Tanggungan 7-17 tahun', had: 408, bil: 1, jumlah: 408 },
      { kategori: 'Tanggungan Belajar IPT', had: 613, bil: 1, jumlah: 613 }
    ]
  }))
  navigateTo('/BF-PRF/AS/FR/05')
}
</script>
