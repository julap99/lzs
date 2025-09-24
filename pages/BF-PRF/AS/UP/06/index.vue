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

            <!-- Sebelum Kemaskini -->
            <div class="mt-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-xl font-semibold">Sebelum Kemaskini</h3>
                <div class="text-lg font-semibold">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormKit
                    readonly
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
                      readonly
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
                  <div class="overflow-x-auto mb-2 text-sm">
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
                      class="mb-2 border border-gray-300 text-sm"
                    >
                    </rs-table>
                    <div class="bg-blue-100 font-bold p-2 text-end border border-blue-300 text-sm">
                      <div class="mr-20">
                        <span>Jumlah Had Kifayah: RM{{ kifayahLimit }}.00</span>
                      </div>
                    </div>
                    <div class="mb-2 text-sm">Pendapatan Isi Rumah: Pendapatan + Pendapatan Tanggungan = {{ Number(formData.income) || 0 }} + {{ Number(formData.dependentsIncome) || 0 }} = {{ totalIncomeAsal }}</div>
                    <div class="mb-2 text-sm">Baki Pendapatan: {{ totalIncomeAsal }} - {{ kifayahLimit }} = {{ bakiPendapatanAsal }}</div>
                    <div class="mb-2 text-sm">Peratusan Perbezaan: ({{ totalIncomeAsal }} / {{ kifayahLimit }}) × 100 = {{ peratusanPendapatanAsal.toFixed(2) }}%</div>
                    <div class="mb-2 text-sm">Kategori Keluarga Asnaf: {{ kategoriKeluargaAsal }}</div>
                    <div class="mb-4 text-sm">Kategori Asnaf: {{ kategoriAsnafAsal }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selepas Kemaskini (Latest) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <FormKit
                type="number"
                name="incomeBaru"
                label="Pendapatan Terkini (RM)"
                validation="required"
                v-model="formDataUpdated.income"
                :validation-messages="{
                  required: 'Pendapatan adalah wajib',
                }"
                placeholder="Masukkan jumlah pendapatan"
              />

              <FormKit
                type="number"
                name="dependentsIncomeBaru"
                label="Pendapatan Tanggungan Terkini (RM)"
                validation="required"
                v-model="formDataUpdated.dependentsIncome"
                :validation-messages="{
                  required: 'Pendapatan tanggungan adalah wajib',
                }"
                placeholder="Masukkan jumlah pendapatan tanggungan"
              />
            </div>

            <div class="mt-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-xl font-semibold">Selepas Kemaskini</h3>
                <div class="text-lg font-semibold">
                  <div class="overflow-x-auto mb-2 text-sm">
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
                      class="mb-2 border border-gray-300 text-sm"
                    >
                    </rs-table>
                    <div class="bg-blue-100 font-bold p-2 text-end border border-blue-300 text-sm">
                      <div class="mr-20">
                        <span>Jumlah Had Kifayah: RM{{ kifayahLimit }}.00</span>
                      </div>
                    </div>
                    <div class="mb-2 text-sm">Pendapatan Isi Rumah: Pendapatan + Pendapatan Tanggungan = {{ Number(formDataUpdated.income) || 0 }} + {{ Number(formDataUpdated.dependentsIncome) || 0 }} = {{ totalIncomeBaru }}</div>
                    <div class="mb-2 text-sm">Baki Pendapatan: {{ totalIncomeBaru }} - {{ kifayahLimit }} = {{ bakiPendapatanBaru }}</div>
                    <div class="mb-2 text-sm">Peratusan Perbezaan: ({{ totalIncomeBaru }} / {{ kifayahLimit }}) × 100 = {{ peratusanPendapatanBaru.toFixed(2) }}%</div>
                    <div class="mb-2 text-sm">Kategori Keluarga Asnaf: {{ kategoriKeluargaBaru }}</div>
                    <div class="mb-4 text-sm">Kategori Asnaf: {{ kategoriAsnafBaru }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Perbandingan Ringkas -->
            <div class="mt-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-xl font-semibold">Perbandingan (Sebelum vs Selepas)</h3>
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
              </div>
            </div>

            <div class="flex justify-between items-center mt-6">
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
    name: "Pengiraan Had Kifayah",
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

// Latest (selepas kemaskini)
const formDataUpdated = ref({
  income: 900,
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
  // Pendapatan Isi Rumah = Pendapatan + Pendapatan Tanggungan
  const income = Number(formData.value.income) || 0;
  const dependents = Number(formData.value.dependentsIncome) || 0;
  return income + dependents;
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

// Aliases for Sebelum (asal)
const totalIncomeAsal = computed(() => totalIncome.value);
const bakiPendapatanAsal = computed(() => bakiPendapatan.value);
const peratusanPendapatanAsal = computed(() => peratusanPendapatan.value);
const kategoriKeluargaAsal = computed(() => kategoriKeluarga.value);
const kategoriAsnafAsal = computed(() => kategoriAsnaf.value);

// Computations for Selepas (baru)
const totalIncomeBaru = computed(() => {
  const income = Number(formDataUpdated.value.income) || 0;
  const dependents = Number(formDataUpdated.value.dependentsIncome) || 0;
  return income + dependents;
});

const bakiPendapatanBaru = computed(() => {
  if (!kifayahLimit.value) return 0;
  return totalIncomeBaru.value - kifayahLimit.value;
});

const peratusanPendapatanBaru = computed(() => {
  if (!kifayahLimit.value || kifayahLimit.value === 0) return 0;
  return (totalIncomeBaru.value / kifayahLimit.value) * 100;
});

const kategoriKeluargaBaru = computed(() => {
  if (!kifayahLimit.value || kifayahLimit.value === 0) return '-';
  if (peratusanPendapatanBaru.value < 50) return 'Fakir';
  if (peratusanPendapatanBaru.value <= 100) return 'Miskin';
  return 'Non-FM';
});

const kategoriAsnafBaru = computed(() => kategoriKeluargaBaru.value);

// Comparison table
const comparisonFields = ref(['Metrik', 'Sebelum', 'Selepas', 'Perubahan']);
const comparisonData = computed(() => {
  const diffIncome = (totalIncomeBaru.value - totalIncomeAsal.value) || 0;
  const diffBaki = (bakiPendapatanBaru.value - bakiPendapatanAsal.value) || 0;
  const diffPct = (peratusanPendapatanBaru.value - peratusanPendapatanAsal.value) || 0;

  return [
    {
      Metrik: 'Pendapatan (RM)',
      Sebelum: Number(totalIncomeAsal.value).toFixed(2),
      Selepas: Number(totalIncomeBaru.value).toFixed(2),
      Perubahan: (diffIncome >= 0 ? '+' : '') + diffIncome.toFixed(2),
    },
    {
      Metrik: 'Baki Pendapatan (RM)',
      Sebelum: Number(bakiPendapatanAsal.value).toFixed(2),
      Selepas: Number(bakiPendapatanBaru.value).toFixed(2),
      Perubahan: (diffBaki >= 0 ? '+' : '') + diffBaki.toFixed(2),
    },
    {
      Metrik: 'Peratusan (%)',
      Sebelum: Number(peratusanPendapatanAsal.value).toFixed(2),
      Selepas: Number(peratusanPendapatanBaru.value).toFixed(2),
      Perubahan: (diffPct >= 0 ? '+' : '') + diffPct.toFixed(2),
    },
    {
      Metrik: 'Kategori Keluarga',
      Sebelum: kategoriKeluargaAsal.value,
      Selepas: kategoriKeluargaBaru.value,
      Perubahan: kategoriKeluargaAsal.value === kategoriKeluargaBaru.value ? '-' : `${kategoriKeluargaAsal.value} → ${kategoriKeluargaBaru.value}`,
    },
    {
      Metrik: 'Kategori Asnaf',
      Sebelum: kategoriAsnafAsal.value,
      Selepas: kategoriAsnafBaru.value,
      Perubahan: kategoriAsnafAsal.value === kategoriAsnafBaru.value ? '-' : `${kategoriAsnafAsal.value} → ${kategoriAsnafBaru.value}`,
    },
  ];
});

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
  navigateTo('/BF-PRF/AS/UP/07')
}
</script>
