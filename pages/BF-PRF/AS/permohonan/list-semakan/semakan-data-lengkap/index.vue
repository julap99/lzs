<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4" v-if="currentSection === 'A'">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Data Permohonan</h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepA }} dari {{ totalStepsA }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Stepper (Section A) -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in stepsA"
              :key="step.id"
              class="text-center flex-1 cursor-pointer"
              :class="{ 'font-semibold': currentStepA >= step.id }"
              @click="goToStepA(step.id)">
              {{ step.label }}
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

        <!-- Tabs - Start with Maklumat Peribadi (Section A: Step 1) -->
        <div class="mb-8">
          <PeribadiForms
            v-if="currentStepA === 1"
            :form-data="formData"
            :isteri-list="isteriList"
            :get-countries="getCountries"
            :show-footer-buttons="false"
            :read-only="true"
            @next-step="nextStepA"
            @save-step="handleSaveStepA1" />

          <AlamatForms
            v-if="currentStepA === 2"
            :form-data="formData"
            :negeri-options="negeriOptions"
            :daerah-options="daerahOptions"
            :bandar-options="bandarOptions"
            :poskod-options="poskodOptions"
            :kariah-options="kariahOptions"
            :jenis-id="formData.jenis_id"
            :show-footer-buttons="false"
            :read-only="true" />

          <PendidikanForms
            v-if="currentStepA === 3"
            :form-data="formData"
            :get-filtered-school-options="getFilteredSchoolOptions"
            :show-footer-buttons="false"
            :read-only="true"
            @add-education-entry="addEducationEntry"
            @remove-education-entry="removeEducationEntry"
            @select-school="onSelectSchool" />

          <PengislamanForms
            v-if="currentStepA === 4"
            :form-data="formData"
            :islamic-dates-validation="islamicDatesValidation"
            :show-footer-buttons="false"
            :read-only="true" />

          <PerbankanForms
            v-if="currentStepA === 5"
            :form-data="formData"
            :payment-method-options-main="paymentMethodOptionsMain"
            :bank-options="bankOptions"
            :no-payment-reason-options="noPaymentReasonOptions"
            :show-lain-lain-sebab-tiada-akaun="showLainLainSebabTiadaAkaun"
            :show-footer-buttons="false"
            :read-only="true"
            @add-bank-account="addBankAccount"
            @remove-bank-account="removeBankAccount" />

          <KesihatanForms
            v-if="currentStepA === 6"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA6" />

          <KemahiranForms
            v-if="currentStepA === 7"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA7" />

          <PinjamanHartaForms
            v-if="currentStepA === 8"
            :form-data="formData"
            :jenis-pinjaman-options="jenisPinjamanOptions"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA8" />

          <PemilikanAsetForms
            v-if="currentStepA === 9"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA9" />

          <PekerjaanForms
            v-if="currentStepA === 10"
            :form-data="formData"
            :jenis-id="formData.jenis_id"
            :show-lain-lain-sektor="false"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA10" />

          <PendapatanPerbelanjaanForms
            v-if="currentStepA === 11"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA11" />

          <div v-if="currentStepA === 11" class="mt-6 flex justify-end">
            <rs-button type="button" variant="primary" @click="goToSectionB">
              Ke Seksyen B: Tanggungan
            </rs-button>
          </div>

          <!-- Komen Penyemak and Dokumen Lengkap outside table -->
          <div class="mb-4 flex flex-col gap-4">
            <div>
              <label class="font-bold block mb-1">Komen Penyemak</label>
              <FormKit
                type="textarea"
                name="komen_penyemak"
                v-model="komenPenyemak"
                :rows="3"
                placeholder="Masukkan komen penyemak" />
            </div>

            <div>
              <label class="font-bold block mb-2">Dokumen Lengkap?</label>
              <FormKit
                type="radio"
                name="dokumen_lengkap"
                v-model="dokumenLengkap"
                :options="[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                ]" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormKit
                  type="text"
                  name="disemak_oleh"
                  label="Disemak Oleh"
                  v-model="disemakOleh"
                  :readonly="true" />
              </div>
              <div>
                <FormKit
                  type="text"
                  name="tarikh_semakan"
                  label="Tarikh Semakan"
                  v-model="tarikhSemakan"
                  :readonly="true" />
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Step Navigation (like AS/FR/02) -->
        <div class="mt-8 border-t pt-4 flex items-center justify-between">
          <rs-button
            v-if="currentStepA > 1"
            type="button"
            variant="primary-outline"
            @click="prevStepA">
            {{ stepsA[currentStepA - 2].label }}
          </rs-button>

          <div class="flex-1"></div>

          <rs-button
            v-if="currentStepA < totalStepsA"
            type="button"
            variant="primary"
            @click="nextStepA">
            {{ stepsA[currentStepA].label }}
          </rs-button>
        </div>
      </template>
    </rs-card>

    <rs-card class="mt-4" v-if="currentSection === 'B'">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tanggungan</h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepB }} dari {{ totalStepsB }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Stepper (Section B - Tanggungan) -->
        <div class="mt-2" ref="sectionBRef">
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <div
                v-for="step in stepsB"
                :key="step.id"
                class="text-center flex-1 cursor-pointer"
                :class="{ 'font-semibold': currentStepB >= step.id }"
                @click="goToStepB(step.id)">
                {{ step.label }}
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-primary h-2.5 rounded-full transition-all duration-300"
                :style="`width: ${
                  currentStepB >= totalStepsB
                    ? 100
                    : (currentStepB / totalStepsB) * 100
                }%`"></div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import { useToast } from "vue-toastification";
import PeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PeribadiForms.vue";
import AlamatForms from "~/components/forms/borang-permohonan-lengkap/SectionA/AlamatForms.vue";
import PengislamanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PengislamanForms.vue";
import PendidikanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendidikanForms.vue";
import PerbankanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PerbankanForms.vue";
import KesihatanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/KesihatanForms.vue";
import KemahiranForms from "~/components/forms/borang-permohonan-lengkap/SectionA/KemahiranForms.vue";
import PinjamanHartaForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PinjamanHartaForms.vue";
import PemilikanAsetForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PemilikanAsetForms.vue";
import PekerjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PekerjaanForms.vue";
import PendapatanPerbelanjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendapatanPerbelanjaanForms.vue";

const toast = useToast();

definePageMeta({
  title: "Semakan Data Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan",
    type: "current",
    path: "/BF-PRF/AS/permohonan",
  },
  {
    name: "Semakan Data",
    type: "current",
    path: "/BF-PRF/AS/permohonan/semakan-data",
  },
]);

// Stepper/Tab state (Section A)
const currentStepA = ref(1);
const totalStepsA = 11;
const stepsA = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
  { id: 3, label: "Pendidikan" },
  { id: 4, label: "Islam" },
  { id: 5, label: "Perbankan" },
  { id: 6, label: "Kesihatan" },
  { id: 7, label: "Kemahiran" },
  { id: 8, label: "Pinjaman" },
  { id: 9, label: "Pemilikan Aset" },
  { id: 10, label: "Pekerjaan" },
  { id: 11, label: "Pendapatan & Perbelanjaan" },
];

const goToStepA = (stepId) => {
  currentStepA.value = stepId;
};

const nextStepA = () => {
  if (currentStepA.value < totalStepsA) {
    currentStepA.value++;
  } else if (currentStepA.value === totalStepsA) {
    // When Section A is complete, move to Section B (like AS/FR/02)
    goToSectionB();
  }
};

const prevStepA = () => {
  if (currentStepA.value > 1) {
    currentStepA.value--;
  }
};

const handleSaveStepA1 = () => {
  toast.success("Maklumat Peribadi disimpan");
};

const handleSaveStepA6 = () => {
  toast.success("Maklumat Kesihatan disimpan");
};

const handleSaveStepA7 = () => {
  toast.success("Maklumat Kemahiran disimpan");
};

const handleSaveStepA8 = () => {
  toast.success("Maklumat Pinjaman disimpan");
};

const handleSaveStepA9 = () => {
  toast.success("Maklumat Pemilikan Aset disimpan");
};

const handleSaveStepA10 = () => {
  toast.success("Maklumat Pekerjaan disimpan");
};

const handleSaveStepA11 = () => {
  toast.success("Maklumat Pendapatan & Perbelanjaan disimpan");
};

const formData = ref({
  jenis_id: "mykad",
  no_pengenalan: "770319035991",
  dokumen_id: "",
  nama: "Adnan bin Abu",
  warganegara: "Malaysia",
  lain_warganegara: "",
  taraf_penduduk: "Ya",
  nopassportlama: "",
  passportStartDate: "",
  passportEndDate: "",
  negara_lain: "Malaysia",
  tarikh_lahir: "1977-03-19",
  umur: "48",
  tempat_lahir: "Kelantan",
  jantina: "Lelaki",
  agama: "Islam",
  agama_lain: "",
  bangsa: "Melayu",
  bangsa_lain: "",
  no_telefon_bimbit: "0191105544",
  emel: "adnan.abu@gmail.com",
  status_perkahwinan: "Berkahwin",
  status_poligami: "tidak",
  bilangan_isteri: "",
  isteri_list: [],

  addressInfo: {
    alamat1: "No 12, Jalan Mawar 3/2",
    alamat2: "Taman Mawar",
    alamat3: "",
    negeri: "Selangor",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40100",
    kariah: "Seksyen 7",
    geolokasi: "3.0733,101.5185",
    tempoh_menetap_selangor_nilai: 10,
    tempoh_menetap_selangor_unit: "tahun",
    kategori_menetap: "mukim",
    kelulusan_khas: "T",
    status_kediaman: "Sewa",
    lain_lain_status_kediaman: "",
    keadaan_kediaman: "Baik",
    kadar_bayaran_bulanan: null,
    kadar_sewa_bulanan: 800,
    dokumen_perjanjian_sewa: [],
  },

  adakah_muallaf: "T",

  masih_bersekolah: "T",
  pendidikan_tertinggi: "Peringkat Rendah",
  lain_pendidikan_tertinggi: "",
  tahap_pendidikan: ["Peringkat Rendah"],

  ada_akaun_bank: "Y",
  bank_accounts: [
    {
      nama_bank: "bank-islam",
      no_akaun_bank: "3063020371170",
      nama_pemegang_akaun: "adnan bin abu",
      jenis_akaun: "individu",
      id_pengenalan: "801004035672",
      nama_bersama: "",
      hubungan: "",
    },
  ],

  tahap_kesihatan: "Sihat",

  kemahiran: ["Perniagaan"],
});

const isteriList = ref([]);

// Keep isteriList in sync with bilangan_isteri like in AS/FR/02
watch(
  () => formData.value.bilangan_isteri,
  (newVal) => {
    const count = parseInt(newVal) || 0;
    isteriList.value = Array(count).fill({});
    formData.value.isteri_list = Array(count).fill({ no_kp: "", nama: "" });
  }
);

// Country options for PeribadiForms
const getCountries = [
  "Malaysia",
  "Indonesia",
  "Singapura",
  "Brunei",
  "Thailand",
];

// Basic options for AlamatForms
const negeriOptions = ["Selangor", "Wilayah Persekutuan", "Perak"];
const daerahOptions = ["Petaling", "Klang", "Gombak"];
const bandarOptions = ["Shah Alam", "Subang Jaya", "Kota Damansara"];
const poskodOptions = ["40100", "40000", "40460"];
const kariahOptions = ["Seksyen 7", "Seksyen 13", "Bukit Jelutong"];

const islamicDatesValidation = { isValid: true, message: "" };

// Minimal helpers for PendidikanForms
const getFilteredSchoolOptions = (kategori) => {
  if (kategori === "IPT") {
    return ["UM", "UiTM", "UKM"];
  }
  if (kategori === "SRK") {
    return ["SK Seksyen 7", "SK Seksyen 13"];
  }
  if (kategori === "SRA") {
    return ["SRA Seksyen 7", "SRA Seksyen 13"];
  }
  return [];
};

const addEducationEntry = () => {
  if (!formData.value.education_entries) formData.value.education_entries = [];
  formData.value.education_entries.push({
    jenis_sekolah: "",
    kategori_sekolah: "",
    tarikh_mula_pengajian: "",
    tarikh_tamat_pengajian: "",
    tahun_bersekolah: "",
    tahun_tingkatan: "",
    nama_sekolah: "",
    sekolah_rendah_kategori: [],
    alamat_sekolah_1: "",
    alamat_sekolah_2: "",
    alamat_sekolah_3: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    bidang_kursus: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan: "",
    catatan: "",
  });
};

const removeEducationEntry = (index) => {
  if (formData.value.education_entries) {
    formData.value.education_entries.splice(index, 1);
  }
};

const onSelectSchool = (index, value) => {
  if (
    formData.value.education_entries &&
    formData.value.education_entries[index]
  ) {
    formData.value.education_entries[index].nama_sekolah = value;
  }
};

// Minimal banking helpers/options
const paymentMethodOptionsMain = [
  { label: "Ya", value: "ya" },
  { label: "Tidak", value: "tidak" },
];
const bankOptions = ["Maybank", "CIMB", "Bank Islam", "RHB"];
const noPaymentReasonOptions = [
  { label: "Bukan Warganegara", value: "bukan-warganegara" },
  { label: "Sakit Terlantar", value: "sakit" },
  { label: "Lain-lain", value: "lain-lain" },
];
const showLainLainSebabTiadaAkaun = false;

const jenisPinjamanOptions = [
  { label: "Perumahan", value: "perumahan" },
  { label: "Kenderaan", value: "kenderaan" },
  { label: "Peribadi", value: "peribadi" },
  { label: "Pendidikan", value: "pendidikan" },
  { label: "Lain-lain", value: "lain-lain" },
];

const addBankAccount = () => {
  if (!formData.value.bank_accounts) formData.value.bank_accounts = [];
  formData.value.bank_accounts.push({
    nama_bank: "",
    no_akaun_bank: "",
    nama_pemegang_akaun: "",
    jenis_akaun: "individu",
    id_pengenalan: "",
    nama_bersama: "",
    hubungan: "",
  });
};

const removeBankAccount = (index) => {
  if (formData.value.bank_accounts) {
    formData.value.bank_accounts.splice(index, 1);
  }
};

const komenPenyemak = ref("");
const disemakOleh = ref("penyemak");
const tarikhSemakan = ref(
  new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
);

const handleHantar = () => {
  if (dokumenLengkap.value === "Tidak") {
    toast.success("Notifikasi sudah dihantar ke pemohon.");
    navigateTo("/BF-PRF/AS/permohonan/list-semakan");
    return;
  }

  toast.success("Notifikasi sudah dihantar ke pemohon.");
  navigateTo("/BF-PRF/AS/FR/04");
};

const handleSimpanDraf = () => {
  toast.success("Permohonan disimpan sebagai draf.");
};

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/permohonan/list-semakan");
};

const dokumenLengkap = ref("");

// Section B (Tanggungan) stepper state - match AS/FR/02 (13 steps)
const currentStepB = ref(1);
const totalStepsB = 13;
const stepsB = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Pengislaman" },
  { id: 3, label: "Perbankan" },
  { id: 4, label: "Pendidikan" },
  { id: 5, label: "Kesihatan" },
  { id: 6, label: "Kemahiran" },
  { id: 7, label: "Pekerjaan" },
  { id: 8, label: "Pemilikan Aset" },
  { id: 9, label: "Pinjaman Harta" },
  { id: 10, label: "Pengesahan" },
  { id: 11, label: "Pengesahan Pendapatan" },
  { id: 12, label: "Pengesahan Bermastautin" },
  { id: 13, label: "Pegawai Pendaftar" },
];

const goToStepB = (stepId) => {
  currentStepB.value = stepId;
};

const nextStepB = () => {
  if (currentStepB.value < totalStepsB) {
    currentStepB.value++;
  }
};

const prevStepB = () => {
  if (currentStepB.value > 1) {
    currentStepB.value--;
  }
};

// Navigate to Section B from Section A step 11
const sectionBRef = ref(null);
const currentSection = ref("A");
const goToSectionB = () => {
  currentSection.value = "B";
  currentStepB.value = 1;
  // Scroll to Section B stepper
  if (
    sectionBRef.value &&
    typeof sectionBRef.value.scrollIntoView === "function"
  ) {
    sectionBRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>
