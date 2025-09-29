<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4" v-if="currentSection === 'A'">
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

        <!-- Color Legend -->
        <!-- <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 class="text-sm font-semibold mb-3 text-gray-700">Petunjuk Warna Perbandingan:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-l-4 border-red-500 bg-red-50 rounded"></div>
              <span class="text-gray-600">Data Sebelum Kemaskini (Kad Merah)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-l-4 border-green-500 bg-green-50 rounded"></div>
              <span class="text-gray-600">Data Selepas Kemaskini (Kad Hijau)</span>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            * Kad berwarna untuk membezakan data sebelum dan selepas kemaskini
          </p>
        </div> -->

        <!-- Step 1: Peribadi - Perbandingan Sebelum vs Selepas Kemaskini -->
        <div
          v-if="currentStepA === 1"
          class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card class="border-red-500">
            <template #header>
              <div class="text-lg font-semibold text-red-800">Sebelum Kemaskini</div>
            </template>
            <template #body>
              <PeribadiForms
                :formData="peribadi"
                :readOnly="true"
                :showFooterButtons="false"
                :comparisonData="peribadiSelepas"
                :isComparison="true"
                :isBefore="true" />
            </template>
          </rs-card>

          <rs-card class="border-green-500">
            <template #header>
              <div class="text-lg font-semibold text-green-800">Selepas Kemaskini</div>
            </template>
            <template #body>
              <PeribadiForms
                :formData="peribadiSelepas"
                :readOnly="true"
                :showFooterButtons="false"
                :comparisonData="peribadi"
                :isComparison="true"
                :isBefore="false" />
            </template>
          </rs-card>

          <div class="flex justify-between w-full">
            <FormKit
              type="date"
              name="tarikh_kemaskini"
              label="Tarikh Kemaskini"
              value="2025-09-01"
              placeholder="dd-mm-yyyy"
              readonly
            />
            <FormKit
              type="date"
              name="tarikh"
              label="Tarikh"
              :value="new Date().toISOString().split('T')[0]"
              placeholder="dd-mm-yyyy"
              readonly
            />
          </div>
        </div>

        <!-- Step 2: Alamat - Perbandingan Sebelum vs Selepas Kemaskini -->
        <div
          v-if="currentStepA === 2"
          class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card class="border-red-500">
            <template #header>
              <div class="text-lg font-semibold text-red-800">Sebelum Kemaskini</div>
            </template>
            <template #body>
              <AlamatForms
                :formData="alamat"
                :readOnly="true"
                :showFooterButtons="false"
                :comparisonData="alamatSelepas"
                :isComparison="true"
                :isBefore="true" />
            </template>
          </rs-card>

          <rs-card class="border-green-500">
            <template #header>
              <div class="text-lg font-semibold text-green-800">Selepas Kemaskini</div>
            </template>
            <template #body>
              <AlamatForms
                :formData="alamatSelepas"
                :readOnly="true"
                :showFooterButtons="false"
                :comparisonData="alamat"
                :isComparison="true"
                :isBefore="false" />
            </template>
          </rs-card>

          <div class="flex justify-between w-full">
            <FormKit
              type="date"
              name="tarikh_kemaskini"
              label="Tarikh Kemaskini"
              value="2025-09-09"
              placeholder="dd-mm-yyyy"
              readonly
            />
            <FormKit
              type="date"
              name="tarikh"
              label="Tarikh"
              :value="new Date().toISOString().split('T')[0]"
              placeholder="dd-mm-yyyy"
              readonly
            />
          </div>
        </div>

        <!-- Step 3: Pendapatan & Perbelanjaan - Perbandingan Sebelum vs Selepas Kemaskini -->
        <div
          v-if="currentStepA === 3"
          class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card class="border-red-500">
            <template #header>
              <div class="text-lg font-semibold text-red-800">Sebelum Kemaskini</div>
            </template>
            <template #body>
              <PendapatanPerbelanjaanForms
                :formData="pendapatanPerbelanjaan"
                :readOnly="true"
                :showFooterButtons="false"
                :comparisonData="pendapatanPerbelanjaanSelepas"
                :isComparison="true"
                :isBefore="true" />
            </template>
          </rs-card>

          <rs-card class="border-green-500">
            <template #header>
              <div class="text-lg font-semibold text-green-800">Selepas Kemaskini</div>
            </template>
            <template #body>
              <PendapatanPerbelanjaanForms
                :formData="pendapatanPerbelanjaanSelepas"
                :readOnly="true"
                :showFooterButtons="false"
                :comparisonData="pendapatanPerbelanjaan"
                :isComparison="true"
                :isBefore="false" />
            </template>
          </rs-card>
          <div class="flex justify-between w-full">
            <FormKit
              type="date"
              name="tarikh_kemaskini"
              label="Tarikh Kemaskini"
              value="2025-09-09"
              placeholder="dd-mm-yyyy"
              readonly
            />
            <FormKit
              type="date"
              name="tarikh"
              label="Tarikh"
              :value="new Date().toISOString().split('T')[0]"
              placeholder="dd-mm-yyyy"
              readonly
            />
          </div>
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
          <rs-button type="button" variant="primary" @click="nextStepA">
            Pendapatan & Perbelanjaan
          </rs-button>
        </div>
        <div v-else-if="currentStepA === 3" class="flex justify-between gap-3">
          <rs-button type="button" variant="primary-outline" @click="prevStepA">
            Alamat
          </rs-button>
          <rs-button type="button" variant="primary" @click="goToSectionC">
            Komen Penyemak
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Section C: Komen Penyemak + Hantar -->
    <rs-card class="mt-4" v-if="currentSection === 'C'">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan & Hantar</h2>
        </div>
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <div>
            <label class="font-bold block mb-2">Komen Penyemak</label>
            <FormKit
              type="textarea"
              name="komen_penyemak_c"
              v-model="komenPenyemakC"
              :rows="5"
              placeholder="Masukkan komen penyemak keseluruhan"
            />
          </div>

          <div class="flex justify-between items-center border-t pt-4">
            <rs-button type="button" variant="primary-outline" @click="kembaliKeSectionA">
              Kembali ke Seksyen A
            </rs-button>
            <div class="flex-1"></div>
            <rs-button type="button" variant="danger" @click="tidakLengkap">Tidak Lengkap</rs-button>
            <rs-button type="button" variant="primary" @click="kiraHadKifayah" class="ml-3">
              Lengkap
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import PeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PeribadiForms.vue";
import AlamatForms from "~/components/forms/borang-permohonan-lengkap/SectionA/AlamatForms.vue";
import PendapatanPerbelanjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendapatanPerbelanjaanForms.vue";

const toast = useToast();

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

const currentSection = ref('A');
const currentStepA = ref(1);
const totalStepsA = 3;
const stepsA = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
  { id: 3, label: "Pendapatan & Perbelanjaan" },
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
  tempat_lahir: "Kuala Lumpur",
  jantina: "Lelaki",
  agama: "Islam",
  agama_lain: "",
  bangsa: "Melayu",
  bangsa_lain: "",
  no_telefon_bimbit: "0112233445",
  emel: "ahmad.updated@example.com",
  status_perkahwinan: "Duda",
  status_poligami: "tidak",
  bilangan_isteri: 0,
  isteri_list: [],
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
    alamat1: "No 12, Jalan Mawar 3",
    alamat2: "Taman Mawar Baru",
    alamat3: "Blok A-2-5",
    negeri: "Selangor",
    daerah: "Klang",
    bandar: "Klang",
    poskod: "41000",
    kariah: "Klang Utara",
    geolokasi: "",
    tempoh_menetap_selangor_nilai: 3,
    tempoh_menetap_selangor_unit: "tahun",
    kategori_menetap: "mukim",
    kelulusan_khas: "T",
    status_kediaman: "Milik Sendiri Berbayar",
    lain_lain_status_kediaman: "",
    keadaan_kediaman: "Sangat Baik",
    kadar_bayaran_bulanan: 1200,
    kadar_sewa_bulanan: null,
    dokumen_perjanjian_sewa: null,
  },
});

// Mock data for Pendapatan & Perbelanjaan (before & after)
const pendapatanPerbelanjaan = ref({
  // Perbelanjaan
  perbelanjaan_makanan_minuman: 800,
  sewa_bayaran_pinjaman_perumahan: 1200,
  perbelanjaan_persekolahan_anak: 300,
  pengangkutan_tambang_bas_sekolah: 150,
  bil_utiliti: 200,
  takaful: 100,
  sewa_rumah_tanah_kedai: 0,
  total_perbelanjaan: 2750,
  
  // Pendapatan
  gaji_elaun_pendapatan: 2500,
  pendapatan_isteri_suami_ibubapa_penjaga: 500,
  pencen_perkeso: 300,
  sumbangan_anak_anak: 200,
  bantuan_jkm: 100,
  pendapatan_tanggungan_serumah: 0,
  total_pendapatan: 3600,
  
  // Pendapatan Lain-lain
  pendapatan_lain_lain: []
});

const pendapatanPerbelanjaanSelepas = ref({
  // Perbelanjaan - Updated values
  perbelanjaan_makanan_minuman: 900,
  sewa_bayaran_pinjaman_perumahan: 1300,
  perbelanjaan_persekolahan_anak: 400,
  pengangkutan_tambang_bas_sekolah: 200,
  bil_utiliti: 250,
  takaful: 150,
  sewa_rumah_tanah_kedai: 0,
  total_perbelanjaan: 3200,
  
  // Pendapatan - Updated values
  gaji_elaun_pendapatan: 2800,
  pendapatan_isteri_suami_ibubapa_penjaga: 600,
  pencen_perkeso: 400,
  sumbangan_anak_anak: 300,
  bantuan_jkm: 150,
  pendapatan_tanggungan_serumah: 0,
  total_pendapatan: 4250,
  
  // Pendapatan Lain-lain
  pendapatan_lain_lain: []
});

// Section C functionality
const komenPenyemakC = ref("");

const goToSectionC = () => {
  currentSection.value = 'C';
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const kembaliKeSectionA = () => {
  currentSection.value = 'A';
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const tidakLengkap = () => {
  toast.success("Notifikasi sudah dihantar.");
  navigateTo('/BF-PRF/AS/permohonan/list-semakan');
};

const kiraHadKifayah = () => {
  toast.success("Notifikasi sudah dihantar ke pemohon.");
  navigateTo("/BF-PRF/AS/FR/04");
};

// Mock data setup completed
</script>
