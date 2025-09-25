<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Data (Kemaskini)</h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepA }} dari {{ totalStepsA }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Stepper (Kemaskini) -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in stepsA"
              :key="step.id"
              class="text-center flex-1 cursor-pointer flex items-center justify-center gap-1"
              :class="{ 'font-semibold': currentStepA >= step.id }"
              @click="goToStepA(step.id)">
              <span>{{ step.label }}</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepA >= totalStepsA
                  ? 100
                  : (currentStepA / totalStepsA) * 100
              }%`"></div>
          </div>
        </div>

        <!-- Step 1: Peribadi - Perbandingan Sebelum vs Selepas Kemaskini -->
        <div
          v-if="currentStepA === 1"
          class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card>
            <template #header>
              <div class="text-lg font-semibold">Sebelum Kemaskini</div>
            </template>
            <template #body>
              <PeribadiForms
                :formData="peribadi"
                :readOnly="true"
                :showFooterButtons="false" />
            </template>
          </rs-card>

          <rs-card>
            <template #header>
              <div class="text-lg font-semibold">Selepas Kemaskini</div>
            </template>
            <template #body>
              <FormKit type="form" :actions="false">
                <!-- Emel -->
                <FormKit
                  v-if="peribadiSelepas.emel !== peribadi.emel"
                  type="email"
                  name="emel"
                  label="Emel"
                  validation="required|email"
                  readonly
                  v-model="peribadiSelepas.emel" />

                <!-- No Telefon Bimbit -->
                <FormKit
                  v-if="
                    peribadiSelepas.no_telefon_bimbit !==
                    peribadi.no_telefon_bimbit
                  "
                  type="number"
                  name="no_telefon_bimbit"
                  label="No Telefon Bimbit"
                  placeholder="Contoh: 0123456789"
                  validation="required"
                  readonly
                  v-model="peribadiSelepas.no_telefon_bimbit" />

                <!-- Status Perkahwinan -->
                <FormKit
                  v-if="
                    peribadiSelepas.status_perkahwinan !==
                    peribadi.status_perkahwinan
                  "
                  type="select"
                  name="status_perkahwinan"
                  label="Status Perkahwinan"
                  :options="[
                    'Berkahwin',
                    'Bujang',
                    'Janda',
                    'Ibu Tinggal',
                    'Bapa Tinggal',
                    'Duda',
                    'Balu',
                  ]"
                  validation="required"
                  input-class="pointer-events-none"
                  readonly
                  v-model="peribadiSelepas.status_perkahwinan" />
              </FormKit>
            </template>
          </rs-card>
        </div>

        <!-- Step 2: Alamat - Perbandingan Sebelum vs Selepas Kemaskini -->
        <div
          v-if="currentStepA === 2"
          class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card>
            <template #header>
              <div class="text-lg font-semibold">Sebelum Kemaskini</div>
            </template>
            <template #body>
              <AlamatForms
                :formData="alamat"
                :readOnly="true"
                :showFooterButtons="false" />
            </template>
          </rs-card>

          <rs-card>
            <template #header>
              <div class="text-lg font-semibold">Selepas Kemaskini</div>
            </template>
            <template #body>
              <FormKit type="form" :actions="false">
                <!-- Alamat 1 -->
                <FormKit
                  v-if="
                    alamatSelepas.addressInfo.alamat1 !==
                    alamat.addressInfo.alamat1
                  "
                  type="textarea"
                  name="alamat1"
                  label="Alamat 1"
                  placeholder="Sila masukkan alamat 1"
                  readonly
                  v-model="alamatSelepas.addressInfo.alamat1" />

                <!-- Daerah -->
                <FormKit
                  v-if="
                    alamatSelepas.addressInfo.daerah !==
                    alamat.addressInfo.daerah
                  "
                  type="select"
                  name="daerah"
                  label="Daerah"
                  :options="daerahOptions"
                  input-class="pointer-events-none"
                  v-model="alamatSelepas.addressInfo.daerah" />

                <!-- Status Kediaman Tempat Tinggal -->
                <FormKit
                  v-if="
                    alamatSelepas.addressInfo.status_kediaman !==
                    alamat.addressInfo.status_kediaman
                  "
                  type="select"
                  name="status_kediaman"
                  label="Status Kediaman Tempat Tinggal"
                  :options="statusKediamanOptions"
                  input-class="pointer-events-none"
                  v-model="alamatSelepas.addressInfo.status_kediaman" />
              </FormKit>
            </template>
          </rs-card>
        </div>
      </template>

      <template #footer>
        <!-- Footer Navigation -->
        <div v-if="currentStepA === 1" class="flex justify-end gap-3">
          <rs-button type="button" variant="primary" @click="nextStepA">
             Alamat
          </rs-button>
        </div>
        <div v-else-if="currentStepA === 2" class="flex justify-between gap-3">
          <rs-button type="button" variant="primary-outline" @click="prevStepA">
            Peribadi
          </rs-button>
          <div class="flex-1"></div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PeribadiForms.vue";
import AlamatForms from "~/components/forms/borang-permohonan-lengkap/SectionA/AlamatForms.vue";

definePageMeta({
  title: "Semakan Data (Kemaskini)",
});

const breadcrumb = ref([
  {
    name: "Semakan Data (Kemaskini)",
    type: "current",
    path: "/BF-PRF/AS/permohonan/list-semakan/semakan-data-kemaskini",
  },
]);

const currentStepA = ref(1);
const totalStepsA = 2;
const stepsA = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
];

const goToStepA = (stepId) => {
  currentStepA.value = stepId;
};

const nextStepA = () => {
  if (currentStepA.value < totalStepsA) currentStepA.value++;
};

const prevStepA = () => {
  if (currentStepA.value > 1) currentStepA.value--;
};

// Mocked form data holders for comparison views
const peribadi = ref({
  jenis_id: "mykad",
  no_pengenalan: "900101015555",
  dokumen_id: null,
  nama: "AHMAD BIN ALI",
  warganegara: "Malaysia",
  lain_warganegara: null,
  taraf_penduduk: null,
  nopassportlama: "",
  passportStartDate: null,
  passportEndDate: null,
  negara_lain: null,
  tarikh_lahir: "1990-01-01",
  umur: "35",
  tempat_lahir: "Shah Alam",
  jantina: "Lelaki",
  agama: "Islam",
  agama_lain: "",
  bangsa: "Melayu",
  bangsa_lain: "",
  no_telefon_bimbit: "0123456789",
  emel: "ahmad@example.com",
  status_perkahwinan: "Berkahwin",
  status_poligami: "tidak",
  bilangan_isteri: 0,
  isteri_list: [],
});

// After update (selepas) mock model for comparison
const peribadiSelepas = ref({
  ...peribadi.value,
  emel: "ahmad.updated@example.com",
  no_telefon_bimbit: "0112233445",
  status_perkahwinan: "Bujang",
});

// Mock data for Alamat (before & after)
const alamat = ref({
  addressInfo: {
    alamat1: "No 10, Jalan Mawar 1",
    alamat2: "Taman Mawar",
    alamat3: "",
    negeri: "Selangor",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40100",
    kariah: "Seksyen 7",
    geolokasi: "",
    tempoh_menetap_selangor_nilai: 5,
    tempoh_menetap_selangor_unit: "tahun",
    kategori_menetap: "mukim",
    kelulusan_khas: "T",
    status_kediaman: "Sewa",
    lain_lain_status_kediaman: "",
    keadaan_kediaman: "Baik",
    kadar_bayaran_bulanan: null,
    kadar_sewa_bulanan: 800,
    dokumen_perjanjian_sewa: null,
  },
});

const alamatSelepas = ref({
  addressInfo: {
    ...alamat.value.addressInfo,
    alamat1: "No 12, Jalan Mawar 3",
    daerah: "Klang",
    status_kediaman: "Milik Sendiri Berbayar",
  },
});

// Options used in comparison selects
const daerahOptions = ["Petaling", "Klang", "Gombak"];
const statusKediamanOptions = [
  "Milik Sendiri Tidak Berbayar",
  "Milik Sendiri Berbayar",
  "Sewa",
  "Kuarters Majikan",
  "Tumpang Rumah Ibu/Bapa/Mertua",
  "Pusaka",
  "Sumbangan LZS / PPRT / RISDA",
  "Lain-lain",
];

// icon function removed as requested
</script>
