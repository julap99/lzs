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
              class="text-center flex-1 cursor-pointer flex items-center justify-center gap-1"
              :class="{ 'font-semibold': currentStepA >= step.id }"
              @click="goToStepA(step.id)"
            >
              <span>{{ step.label }}</span>
              <svg v-if="getDokumenLengkapIcon(step.id, 'A')" 
                   class="w-4 h-4" 
                   :class="getDokumenLengkapIcon(step.id, 'A')?.color" 
                   fill="currentColor" 
                   viewBox="0 0 20 20">
                <path fill-rule="evenodd" :d="getDokumenLengkapIcon(step.id, 'A')?.path" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepA >= totalStepsA
                  ? 100
                  : (currentStepA / totalStepsA) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Tabs - Start with Maklumat Peribadi (Section A: Step 1) -->
        <div class="mb-8">
          <PeribadiForms
            v-if="currentStepA === 1"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA1"
          />

          <AlamatForms
            v-if="currentStepA === 2"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA2"
          />

          <PendidikanForms
            v-if="currentStepA === 3"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA3"
          />

          <PengislamanForms
            v-if="currentStepA === 4"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA4"
          />

          <PerbankanForms
            v-if="currentStepA === 5"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA5"
          />

          <KesihatanForms
            v-if="currentStepA === 6"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA6"
          />

          <KemahiranForms
            v-if="currentStepA === 7"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA7"
          />

          <PinjamanHartaForms
            v-if="currentStepA === 8"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA8"
          />

          <PemilikanAsetForms
            v-if="currentStepA === 9"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA9"
          />

          <PekerjaanForms
            v-if="currentStepA === 10"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA10"
          />

          <PendapatanPerbelanjaanForms
            v-if="currentStepA === 11"
            :form-data="formData"
            :show-footer-buttons="false"
            :read-only="true"
            @prev-step="prevStepA"
            @next-step="nextStepA"
            @save-step="handleSaveStepA11"
          />

          <!--  Dokumen Lengkap -->
          <div class="mb-4 flex flex-col gap-4 border-t pt-4">
            <div>
              <label class="font-bold block mb-2">Dokumen Lengkap?</label>
              <FormKit
                type="radio"
                name="dokumen_lengkap"
                v-model="currentDokumenLengkap"
                :options="[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                  { label: 'Tiada Keperluan', value: 'Tiada' },
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

        <!-- Bottom Step Navigation -->
        <div class="mt-8 border-t pt-4 flex items-center justify-between">
          <rs-button
            v-if="currentStepA === 1"
            type="button"
            variant="primary-outline"
            @click="handleKembali"
          >
            Kembali
          </rs-button>

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
            :disabled="!isDokumenLengkapSelected"
            @click="nextStepA"
          >
            {{ stepsA[currentStepA].label }}
          </rs-button>

          <rs-button
            v-if="currentStepA === 11"
            type="button"
            variant="primary"
            :disabled="!isDokumenLengkapSelected"
            @click="goToSectionB"
          >
            Ke Seksyen B: Tanggungan
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
                class="text-center flex-1 cursor-pointer flex items-center justify-center gap-1"
                :class="{ 'font-semibold': currentStepB >= step.id }"
                @click="goToStepB(step.id)"
              >
                <span>{{ step.label }}</span>
                <svg v-if="getDokumenLengkapIcon(step.id, 'B')" 
                     class="w-4 h-4" 
                     :class="getDokumenLengkapIcon(step.id, 'B')?.color" 
                     fill="currentColor" 
                     viewBox="0 0 20 20">
                  <path fill-rule="evenodd" :d="getDokumenLengkapIcon(step.id, 'B')?.path" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-primary h-2.5 rounded-full transition-all duration-300"
                :style="`width: ${
                  currentStepB >= totalStepsB
                    ? 100
                    : (currentStepB / totalStepsB) * 100
                }%`"
              ></div>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <!-- Tanggungan Selector and Management (Visible only during Steps 1-9) -->
          <div
            v-if="currentStepB >= 1 && currentStepB <= 9"
            class="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-end gap-4 mb-4">
              <div class="flex-1">
                <h4 class="text-lg font-semibold mb-2">Senarai Tanggungan</h4>
                <FormKit
                  v-if="tanggunganList.length > 0"
                  type="select"
                  name="pilih_tanggungan"
                  label="Pilih Tanggungan"
                  :options="tanggunganOptions"
                  v-model="selectedTanggunganId"
                />
              </div>

              <div class="text-sm text-gray-600 mb-4">
                <div>
                  Jumlah: <span class="font-semibold">{{ tanggunganList.length }}</span>
                </div>
                <div v-if="selectedTanggunganId" class="mt-2">
                  <span
                    class="px-2 py-1 rounded text-xs"
                    :class="isAllStepsCompletedForTanggungan(selectedTanggunganId) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                  >
                    {{ isAllStepsCompletedForTanggungan(selectedTanggunganId) ? 'Lengkap' : 'Belum Lengkap' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Optional: brief summary of selected tanggungan -->
            <div v-if="getCurrentTanggungan()" class="p-3 bg-white border rounded">
              <div class="flex flex-wrap gap-4 text-sm text-gray-700">
                <div><span class="font-semibold">Nama:</span> {{ getCurrentTanggungan().nama_tanggungan || '-' }}</div>
                <div><span class="font-semibold">Hubungan:</span> {{ getCurrentTanggungan().hubungan_pemohon || '-' }}</div>
                <!-- <div><span class="font-semibold">No. ID:</span> {{ getCurrentTanggungan().pengenalan_id_tanggungan || '-' }}</div> -->
              </div>
            </div>
          </div>

          <!-- Section B Form - Step 1: Maklumat Peribadi Tanggungan -->
          <TanggunganPeribadiForms
            v-if="currentStepB === 1"
            :get-current-tanggungan="getCurrentTanggungan"
            :current-tanggungan-index="currentTanggunganIndex"
            :form-data="formData"
            :calculate-age="calculateAge"
            :calculate-total-tanggungan="calculateTotalTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 2: Maklumat Pengislaman Tanggungan -->
          <TanggunganPengislamanForms
            v-if="currentStepB === 2"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 3: Maklumat Perbankan Tanggungan -->
          <TanggunganPerbankanForms
            v-if="currentStepB === 3"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 4: Maklumat Pendidikan Tanggungan -->
          <TanggunganPendidikanForms
            v-if="currentStepB === 4"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 5: Maklumat Kesihatan Tanggungan -->
          <TanggunganKesihatanForms
            v-if="currentStepB === 5"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 6: Maklumat Kemahiran Tanggungan -->
          <TanggunganKemahiranForms
            v-if="currentStepB === 6"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 7: Maklumat Pemilikan Aset Tanggungan -->
          <TanggunganPemilikanAsetForms
            v-if="currentStepB === 7"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 8: Maklumat Pinjaman Harta Tanggungan -->
          <TanggunganPinjamanHartaForms
            v-if="currentStepB === 8"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />

          <!-- Section B Form - Step 9: Maklumat Pekerjaan Tanggungan -->
          <TanggunganPekerjaanForms
            v-if="currentStepB === 9"
            :get-current-tanggungan="getCurrentTanggungan"
            :show-footer-buttons="false"
            :read-only="true"
          />


          <!-- Dokumen Lengkap -->
          <div class="mb-4 flex flex-col gap-4 border-t pt-4">
            <div>
              <label class="font-bold block mb-2">Dokumen Lengkap?</label>
              <FormKit
                type="radio"
                name="dokumen_lengkap"
                v-model="currentDokumenLengkap"
                :options="[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                  { label: 'Tiada Keperluan', value: 'Tiada' },
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
        <!-- Bottom Step Navigation-->
        <div class="mt-8 border-t pt-4 flex items-center justify-between">
          <rs-button
            v-if="currentStepB === 1"
            type="button"
            variant="primary-outline"
            @click="goToSectionA"
          >
            Ke Seksyen A
          </rs-button>

          <rs-button
            v-if="currentStepB > 1"
            type="button"
            variant="primary-outline"
            @click="prevStepB"
          >
            {{ stepsB[currentStepB - 2].label }}
          </rs-button>

          <div class="flex-1"></div>

          <rs-button
            v-if="currentStepB === 9"
            type="button"
            variant="primary-outline"
            @click="goToSectionC"
            class="mr-2"
          >
            Komen Penyemak
          </rs-button>

          <rs-button
            v-if="currentStepB < totalStepsB"
            type="button"
            variant="primary"
            :disabled="!isDokumenLengkapSelected"
            @click="nextStepB"
          >
            {{ stepsB[currentStepB].label }}
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
            <rs-button type="button" variant="primary-outline" @click="kembaliKeSectionB">
              Kembali ke Seksyen B
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
import { ref, onMounted, computed } from "vue";
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
import TanggunganPeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPeribadiForms.vue";
import TanggunganPengislamanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengislamanForms.vue";
import TanggunganPerbankanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPerbankanForms.vue";
import TanggunganPendidikanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPendidikanForms.vue";
import TanggunganKesihatanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganKesihatanForms.vue";
import TanggunganKemahiranForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganKemahiranForms.vue";
import TanggunganPemilikanAsetForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPemilikanAsetForms.vue";
import TanggunganPinjamanHartaForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPinjamanHartaForms.vue";
import TanggunganPekerjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPekerjaanForms.vue";

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
    path: "/BF-PRF/AS/permohonan/list-semakan/semakan-data-lengkap",
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

const handleSaveStepA2 = () => {
  toast.success("Maklumat Alamat disimpan");
};

const handleSaveStepA3 = () => {
  toast.success("Maklumat Pendidikan disimpan");
};

const handleSaveStepA4 = () => {
  toast.success("Maklumat Islam disimpan");
};

const handleSaveStepA5 = () => {
  toast.success("Maklumat Bank disimpan");
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


const disemakOleh = ref("penyemak");
const tarikhSemakan = ref(
  new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
);

const kiraHadKifayah = () => {

  toast.success("Notifikasi sudah dihantar ke pemohon.");
  navigateTo("/BF-PRF/AS/FR/04");
};

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/permohonan/list-semakan");
};

  // Section C navigation/state
  const goToSectionC = () => {
    currentSection.value = 'C';
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const kembaliKeSectionB = () => {
    currentSection.value = 'B';
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const komenPenyemakC = ref("");

  const tidakLengkap = () => {
    toast.success("Notifikasi sudah dihantar.");
    navigateTo('/BF-PRF/AS/permohonan/list-semakan');
  };


// Track dokumen lengkap selection for each step
const dokumenLengkapSectionA = ref({});
const dokumenLengkapSectionB = ref({});

// Helpers for Section B: work per tanggungan and per step
const getCurrentTanggunganId = () => {
  const current = tanggunganList.value[currentTanggunganIndex.value];
  if (!current) return null;
  return current.id ?? currentTanggunganIndex.value + 1;
};

const getDokumenLengkapB = (stepId) => {
  const tid = getCurrentTanggunganId();
  if (!tid) return "";
  const map = dokumenLengkapSectionB.value || {};
  return map[tid]?.[stepId] || "";
};

const setDokumenLengkapB = (stepId, value) => {
  const tid = getCurrentTanggunganId();
  if (!tid) return;
  const map = dokumenLengkapSectionB.value || {};
  if (!map[tid]) map[tid] = {};
  map[tid][stepId] = value;
  dokumenLengkapSectionB.value = { ...map };
};

// Computed properties to check if dokumen lengkap is selected for current step
const isDokumenLengkapSelected = computed(() => {
  if (currentSection.value === 'A') {
    return (
      dokumenLengkapSectionA.value[currentStepA.value] &&
      dokumenLengkapSectionA.value[currentStepA.value] !== ""
    );
  } else {
    const val = getDokumenLengkapB(currentStepB.value);
    return !!val && val !== "";
  }
});

// Computed property for current step's dokumen lengkap value
const currentDokumenLengkap = computed({
  get() {
    if (currentSection.value === 'A') {
      return dokumenLengkapSectionA.value[currentStepA.value] || "";
    } else {
      return getDokumenLengkapB(currentStepB.value) || "";
    }
  },
  set(value) {
    if (currentSection.value === 'A') {
      dokumenLengkapSectionA.value[currentStepA.value] = value;
    } else {
      setDokumenLengkapB(currentStepB.value, value);
    }
  }
});

// Function to get the appropriate icon based on dokumen lengkap selection
const getDokumenLengkapIcon = (stepId, section = 'A') => {
  let selection = '';
  if (section === 'A') {
    selection = dokumenLengkapSectionA.value[stepId] || '';
  } else {
    selection = getDokumenLengkapB(stepId) || '';
  }
  
  if (!selection) return null;
  
  switch (selection) {
    case 'Ya':
      return {
        icon: 'checkmark',
        color: 'text-green-600',
        path: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
      };
    case 'Tidak':
      return {
        icon: 'x-mark',
        color: 'text-red-600',
        path: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
      };
    case 'Tiada':
      return {
        icon: 'minus',
        color: 'text-gray-600',
        path: 'M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
      };
    default:
      return null;
  }
};

// Section B (Tanggungan) stepper state - match AS/FR/02 (13 steps)
const currentStepB = ref(1);
const totalStepsB = 9;
const stepsB = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Pengislaman" },
  { id: 3, label: "Perbankan" },
  { id: 4, label: "Pendidikan" },
  { id: 5, label: "Kesihatan" },
  { id: 6, label: "Kemahiran" },
  { id: 7, label: "Pemilikan Aset" },
  { id: 8, label: "Pinjaman Harta" },
  { id: 9, label: "Pekerjaan" },
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

// Navigate back to Section A from Section B
const goToSectionA = () => {
  currentSection.value = "A";
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// ==========================
// Tanggungan Management
// ==========================
const currentTanggunganIndex = ref(0);
const tanggunganList = ref([]);

  // Options for tanggungan select input
  const tanggunganOptions = computed(() => {
    return (tanggunganList.value || []).map((t, idx) => {
      const id = t.id ?? idx + 1;
      const lengkap = isAllStepsCompletedForTanggungan(id);
      const base = `${t.nama_tanggungan || 'Nama belum diisi'} — ${t.hubungan_pemohon || 'Hubungan belum diisi'}`;
      const label = lengkap ? `${base} (Lengkap ✓)` : base;
      return { label, value: id };
    });
  });

  // Two-way computed binding for selected tanggungan by id
  const selectedTanggunganId = computed({
    get() {
      const current = tanggunganList.value[currentTanggunganIndex.value];
      return current ? (current.id ?? currentTanggunganIndex.value + 1) : null;
    },
    set(val) {
      const index = tanggunganList.value.findIndex((t, idx) => (t.id ?? idx + 1) === val);
      if (index !== -1) {
        currentTanggunganIndex.value = index;
        currentStepB.value = 1;
      }
    },
  });

  // Check if all steps (1..totalStepsB) have a dokumen lengkap selection for a tanggungan id
  const isAllStepsCompletedForTanggungan = (tanggunganId) => {
    const map = dokumenLengkapSectionB.value || {};
    const stepsMap = map[tanggunganId] || {};
    for (let s = 1; s <= totalStepsB; s++) {
      if (!stepsMap[s] || stepsMap[s] === '') return false;
    }
    return true;
  };

const getCurrentTanggungan = () => {
  return tanggunganList.value[currentTanggunganIndex.value];
};


// Helper functions used by Peribadi form
const calculateAge = (birthDate) => {
  if (!birthDate) return "";
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  } catch (e) {
    return "";
  }
};

const calculateTotalTanggungan = () => {
  if (tanggunganList.value.length === 0) return "0";
  let activeCount = 0;
  tanggunganList.value.forEach((t) => {
    if (t.warganegara_tanggungan === "Malaysia") {
      activeCount++;
    } else {
      if (t.tarikh_tamat_pasport) {
        try {
          const expiryDate = new Date(t.tarikh_tamat_pasport);
          const today = new Date();
          if (expiryDate > today) activeCount++;
        } catch (e) {
          activeCount++;
        }
      } else {
        activeCount++;
      }
    }
  });
  return activeCount.toString();
};

// Initialize with 3 tanggungan (mock data like AS/FR/02)
onMounted(() => {
  if (tanggunganList.value.length === 0) {
    // Initialize with 3 empty objects
    tanggunganList.value = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    // 1) Pasangan Pemohon
    tanggunganList.value[0] = {
      id: 1,
      hubungan_pemohon: "Pasangan Pemohon",
      nama_tanggungan: "ROHANA BINTI AHMAD",
      jenis_pengenalan_tanggungan: "MyKad",
      pengenalan_id_tanggungan: "801004035672",
      warganegara_tanggungan: "Malaysia",
      taraf_penduduk_tetap: "Y",
      tarikh_lahir_tanggungan: "1980-10-04",
      umur_tanggungan: "43",
      tempat_lahir_tanggungan: "Kelantan",
      jantina_tanggungan: "Perempuan",
      agama_tanggungan: "Islam",
      bangsa_tanggungan: "Melayu",
      no_telefon_bimbit_tanggungan: "0138202398",
      no_telefon_rumah_tanggungan: "038881234",
      emel_tanggungan: "rohana@email.com",
      tempoh_menetap_selangor_tanggungan: "20",
      tempoh_menetap_selangor_tanggungan_nilai: "20",
      tempoh_menetap_selangor_tanggungan_unit: "tahun",
      status_perkahwinan_tanggungan: "Berkahwin",
      situasi_kelulusan_khas: "Profiling",
      kelulusan_khas: "Y",
      jenis_id_tanggungan: "MyKad",
      no_pengenalan_tanggungan: "801004035672",
      tempoh_menetap_selangor: "20",
      no_telefon_tanggungan: "0138202398",

      // Islamic Information
      adakah_muallaf_tanggungan: "T",
      
      // Pendidikan data
      masih_bersekolah: "T",
      pendidikan_tertinggi: "SPM",
      tahap_pendidikan_dicapai: ["SPM"],
      sijil_pendidikan: [],
      education_entries: [
        {
          jenis_sekolah: "tinggi",
          kategori_sekolah: "SEK.MEN",
          tarikh_mula_pengajian: "2018-01-01",
          tarikh_tamat_pengajian: "2019-12-31",
          tahun_bersekolah: "2018",
          tingkatan: "Tingkatan 5",
          nama_sekolah: "SMK Seksyen 7",
          kategori_rendah: [],
          alamat1: "Jalan Masjid",
          alamat2: "Seksyen 7",
          alamat3: "",
          daerah: "Shah Alam",
          bandar: "Shah Alam",
          poskod: "40000",
          bidang_kursus: "sains",
          jurusan_bidang: "Sains Tulen",
          pembiayaan_pengajian: ["Tiada"],
          lain_pembiayaan: "",
          catatan: "Lulus dengan cemerlang"
        }
      ],
      tinggal_bersama_keluarga: "Y",
      asrama_rumah_sewa: "",
      nama_baitul: "",
      
      // Kesihatan data
      tahap_kesihatan_tanggungan: "Sihat",
      
      // Kemahiran data
      kemahiran_tanggungan: ["Memasak", "Mengasuh", "Perkhidmatan"],
      lain_kemahiran_tanggungan: "",
      
      // Pemilikan Aset data
      wang_simpanan: 5000.00,
      emas: 2000.00,
      saham: 0.00,
      kenderaan: "Proton Saga 2018",
      rumah: "Rumah Teres 2 Tingkat, Shah Alam",
      tanah_sawah: "",
      dokumen_pemilikan: [],
      
      // Pinjaman Harta data
      nama_institusi_pemberi_pinjaman: "Bank Islam Malaysia Berhad",
      jenis_pinjaman: "Perumahan",
      amaun_bayaran_bulanan: 1200.00,
      jumlah_keseluruhan_perbelanjaan: 180000.00,
      tahun_mula_pinjaman: "2020-01-01",
      tahun_akhir_pinjaman: "2035-01-01",
      dokumen_perjanjian_pinjaman: [],
      
      // Pekerjaan data
      pekerjaan_status: "Tidak Bekerja",
      sumber_pendapatan: ["Sumbangan Keluarga"],
      lain_lain_sumber_pendapatan: "",
      jenis_pekerjaan: "",
      sektor_pekerjaan: "",
      jawatan: "",
      status_jawatan: "",
      pendapatan_kasar: 0.00,
      lain_lain_sektor_pekerjaan: "",
      pengesahan_pendapatan: [],
      sebab_tidak_bekerja: "Suri Rumah",
      lain_lain_sebab_tidak_bekerja: "",
      
      // Perbankan data
      ada_akaun_bank_tanggungan: "Y",
      muflis_disenarai_hitam: "T",
      bank_accounts_tanggungan: [
        {
          nama_bank: "bank-islam",
          no_akaun_bank: "3063020371171",
          nama_pemegang_akaun: "ROHANA BINTI AHMAD",
          jenis_akaun: "individu",
          id_pengenalan: "801004035672",
          nama_bersama: "",
          hubungan: "",
          pengenalan_ids: []
        }
      ]
    };

    // 2) Anak Perempuan Dewasa
    tanggunganList.value[1] = {
      id: 2,
      hubungan_pemohon: "Anak",
      nama_tanggungan: "NUR NAJWA BINTI ADNAN",
      jenis_pengenalan_tanggungan: "MyKad",
      pengenalan_id_tanggungan: "060802030272",
      warganegara_tanggungan: "Malaysia",
      taraf_penduduk_tetap: "Y",
      tarikh_lahir_tanggungan: "2000-08-02",
      umur_tanggungan: "23",
      tempat_lahir_tanggungan: "Shah Alam",
      jantina_tanggungan: "Perempuan",
      agama_tanggungan: "Islam",
      bangsa_tanggungan: "Melayu",
      no_telefon_bimbit_tanggungan: "0197883456",
      no_telefon_rumah_tanggungan: "038881234",
      emel_tanggungan: "najwa@email.com",
      tempoh_menetap_selangor_tanggungan: "19",
      tempoh_menetap_selangor_tanggungan_nilai: "19",
      tempoh_menetap_selangor_tanggungan_unit: "tahun",
      status_perkahwinan_tanggungan: "Bujang",
      situasi_kelulusan_khas: "Dewasa",
      kelulusan_khas: "N",
      jenis_id_tanggungan: "MyKad",
      no_pengenalan_tanggungan: "060802030272",
      tempoh_menetap_selangor: "19",
      no_telefon_tanggungan: "0197883456",

      adakah_muallaf_tanggungan: "T",
      
      // Pendidikan data
      masih_bersekolah: "T",
      pendidikan_tertinggi: "Ijazah",
      tahap_pendidikan_dicapai: ["SPM", "Ijazah"],
      sijil_pendidikan: [],
      education_entries: [
        {
          jenis_sekolah: "tinggi",
          kategori_sekolah: "IPT",
          tarikh_mula_pengajian: "2020-09-01",
          tarikh_tamat_pengajian: "2024-06-30",
          tahun_bersekolah: "2020",
          tingkatan: "Tahun 4",
          nama_sekolah: "Universiti Teknologi MARA",
          kategori_rendah: [],
          alamat1: "Jalan Ilmu",
          alamat2: "Kampus Shah Alam",
          alamat3: "",
          daerah: "Shah Alam",
          bandar: "Shah Alam",
          poskod: "40450",
          bidang_kursus: "teknologi-maklumat",
          jurusan_bidang: "Sains Komputer",
          pembiayaan_pengajian: ["PTPTN"],
          lain_pembiayaan: "",
          catatan: "Mendapat CGPA 3.5"
        }
      ],
      tinggal_bersama_keluarga: "Y",
      asrama_rumah_sewa: "",
      nama_baitul: "",
      
      // Kesihatan data
      tahap_kesihatan_tanggungan: "Sihat",
      
      // Kemahiran data
      kemahiran_tanggungan: ["Pertukangan", "Perniagaan", "Perkhidmatan"],
      lain_kemahiran_tanggungan: "",
      
      // Pemilikan Aset data
      wang_simpanan: 2000.00,
      emas: 0.00,
      saham: 1000.00,
      kenderaan: "",
      rumah: "",
      tanah_sawah: "",
      dokumen_pemilikan: [],
      
      // Pinjaman Harta data
      nama_institusi_pemberi_pinjaman: "PTPTN",
      jenis_pinjaman: "Pendidikan",
      amaun_bayaran_bulanan: 300.00,
      jumlah_keseluruhan_perbelanjaan: 50000.00,
      tahun_mula_pinjaman: "2020-09-01",
      tahun_akhir_pinjaman: "2030-09-01",
      dokumen_perjanjian_pinjaman: [],
      
      // Pekerjaan data
      pekerjaan_status: "Bekerja",
      sumber_pendapatan: ["Pengajian", "Sumbangan Keluarga"],
      lain_lain_sumber_pendapatan: "",
      jenis_pekerjaan: "Pekerja Sambilan",
      sektor_pekerjaan: "Swasta",
      jawatan: "Pembantu Kedai",
      status_jawatan: "Kontrak",
      pendapatan_kasar: 800.00,
      lain_lain_sektor_pekerjaan: "",
      pengesahan_pendapatan: [],
      sebab_tidak_bekerja: "",
      lain_lain_sebab_tidak_bekerja: "",
      
      // Perbankan data
      ada_akaun_bank_tanggungan: "Y",
      muflis_disenarai_hitam: "T",
      bank_accounts_tanggungan: [
        {
          nama_bank: "maybank",
          no_akaun_bank: "512345678901",
          nama_pemegang_akaun: "NUR NAJWA BINTI ADNAN",
          jenis_akaun: "individu",
          id_pengenalan: "060802030272",
          nama_bersama: "",
          hubungan: "",
          pengenalan_ids: []
        }
      ]
    };

    // 3) Anak Perempuan Sekolah
    tanggunganList.value[2] = {
      id: 3,
      hubungan_pemohon: "Anak",
      nama_tanggungan: "NUR QISTINA BINTI ADNAN",
      jenis_pengenalan_tanggungan: "MyKad",
      pengenalan_id_tanggungan: "091108030442",
      warganegara_tanggungan: "Malaysia",
      taraf_penduduk_tetap: "Y",
      tarikh_lahir_tanggungan: "2009-11-08",
      umur_tanggungan: "14",
      tempat_lahir_tanggungan: "Petaling Jaya",
      jantina_tanggungan: "Perempuan",
      agama_tanggungan: "Islam",
      bangsa_tanggungan: "Melayu",
      no_telefon_bimbit_tanggungan: "01299982378",
      no_telefon_rumah_tanggungan: "038881234",
      emel_tanggungan: "qistina@email.com",
      tempoh_menetap_selangor_tanggungan: "13",
      tempoh_menetap_selangor_tanggungan_nilai: "13",
      tempoh_menetap_selangor_tanggungan_unit: "tahun",
      status_perkahwinan_tanggungan: "Bujang",
      situasi_kelulusan_khas: "Profiling",
      kelulusan_khas: "Y",
      jenis_id_tanggungan: "MyKad",
      no_pengenalan_tanggungan: "091108030442",
      tempoh_menetap_selangor: "16",
      no_telefon_tanggungan: "01299982378",

      adakah_muallaf_tanggungan: "T",
      
      // Pendidikan data
      masih_bersekolah: "Y",
      pendidikan_tertinggi: "Peringkat Rendah",
      tahap_pendidikan_dicapai: ["Peringkat Rendah"],
      sijil_pendidikan: [],
      education_entries: [
        {
          jenis_sekolah: "rendah",
          kategori_sekolah: "SRK",
          tarikh_mula_pengajian: "2023-01-01",
          tarikh_tamat_pengajian: "",
          tahun_bersekolah: "2023",
          tingkatan: "Tingkatan 1",
          nama_sekolah: "SK Seksyen 7",
          kategori_rendah: ["SRK"],
          alamat1: "Jalan Pendidikan",
          alamat2: "Seksyen 7",
          alamat3: "",
          daerah: "Shah Alam",
          bandar: "Shah Alam",
          poskod: "40000",
          bidang_kursus: "",
          jurusan_bidang: "",
          pembiayaan_pengajian: ["Tiada"],
          lain_pembiayaan: "",
          catatan: "Masih bersekolah"
        }
      ],
      tinggal_bersama_keluarga: "Y",
      asrama_rumah_sewa: "",
      nama_baitul: "",
      
      // Kesihatan data
      tahap_kesihatan_tanggungan: "Sihat",
      
      // Kemahiran data
      // dont have data since underage
      
      // Pemilikan Aset data - No assets (underage)
      
      // Pinjaman Harta data - No loans (underage)
      
      // Pekerjaan data - No employment (underage)
      pekerjaan_status: "Tidak Bekerja",
      sumber_pendapatan: ["Sumbangan Keluarga"],
      lain_lain_sumber_pendapatan: "",
      jenis_pekerjaan: "",
      sektor_pekerjaan: "",
      jawatan: "",
      status_jawatan: "",
      pendapatan_kasar: 0.00,
      lain_lain_sektor_pekerjaan: "",
      pengesahan_pendapatan: [],
      sebab_tidak_bekerja: "Pelajar",
      lain_lain_sebab_tidak_bekerja: "",
      
      // Perbankan data - No bank account (underage)
      ada_akaun_bank_tanggungan: "T",
      muflis_disenarai_hitam: "T",
      bank_accounts_tanggungan: [],
      sebab_tiada_akaun: "belum-cukup-umur",
      lain_lain_sebab_tiada_akaun: ""
    };

    currentTanggunganIndex.value = 0;
  }
});
</script>
