<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Data Permohonan</h2>
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
              @click="goToStepA(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepA >= totalStepsA ? 100 : (currentStepA / totalStepsA) * 100
              }%`"
            ></div>
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
            @save-step="handleSaveStepA1"
          />

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
            :read-only="true"
          />

          <!-- Komen Penyemak and Dokumen Lengkap outside table -->
          <div class="mb-4 flex flex-col gap-4">
            <div>
              <label class="font-bold block mb-1">Komen Penyemak</label>
              <FormKit
                type="textarea"
                name="komen_penyemak"
                v-model="komenPenyemak"
                :rows="3"
                placeholder="Masukkan komen penyemak"
              />
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
                 ]"
               />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormKit
                  type="text"
                  name="disemak_oleh"
                  label="Disemak Oleh"
                  v-model="disemakOleh"
                  :readonly="true"
                />
              </div>
              <div>
                <FormKit
                  type="text"
                  name="tarikh_semakan"
                  label="Tarikh Semakan"
                  v-model="tarikhSemakan"
                  :readonly="true"
                />
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
            @click="prevStepA"
          >
            {{ stepsA[currentStepA - 2].label }}
          </rs-button>

          <div class="flex-1"></div>

          <rs-button
            v-if="currentStepA < totalStepsA"
            type="button"
            variant="primary"
            @click="nextStepA"
          >
            {{ stepsA[currentStepA].label }}
          </rs-button>
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
  if (dokumenLengkap.value === 'Tidak') {
    toast.success('Notifikasi sudah dihantar ke pemohon.');
    navigateTo('/BF-PRF/AS/permohonan/list-semakan');
    return; 
  }
  
  toast.success('Notifikasi sudah dihantar ke pemohon.');
  navigateTo('/BF-PRF/AS/FR/04');
};

const handleSimpanDraf = () => {
  toast.success("Permohonan disimpan sebagai draf.");
};

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/permohonan/list-semakan");
};

const dokumenLengkap = ref("");


</script>

