<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card v-if="currentSection == 1" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Permohonan Lengkap Online
          </h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepA }} dari {{ totalStepsA }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in stepsA"
              :key="step.id"
              class="text-center flex-1"
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
                currentStepA >= totalStepsA
                  ? 100
                  : (currentStepA / totalStepsA) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Section A Form - Step 1: Maklumat Peribadi -->
        <PeribadiForms
          v-if="currentStepA == 1"
          :form-data="formData"
          @next-step="nextStepA"
          @save-step="handleSaveStepA1"
        />

        <!-- Section A Form - Step 2: Maklumat Alamat -->
        <AlamatForms
          v-if="currentStepA === 2"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA2"
        />

        <!-- Section A Form - Step 3: Maklumat Pendidikan -->
        <PendidikanForms
          v-if="currentStepA === 3"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA3"
        />

        <!-- Section A Form - Step 4: Maklumat Islam -->
        <PengislamanForms
          v-if="currentStepA === 4"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA4"
        />

        <!-- Section A Form - Step 5: Maklumat Bank -->
        <PerbankanForms
          v-if="currentStepA === 5"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA5"
        />

        <!-- Section A Form - Step 6: Maklumat Kesihatan -->
        <KesihatanForms
          v-if="currentStepA === 6"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA6"
        />

        <!-- Section A Form - Step 7: Kemahiran -->
        <KemahiranForms
          v-if="currentStepA === 7"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA7"
        />

        <!-- Section A Form - Step 8: Maklumat Pinjaman Harta -->
        <PinjamanHartaForms
          v-if="currentStepA === 8"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA8"
        />

        <!-- Section A Form - Step 9: Maklumat Pemilikan Aset -->
        <PemilikanAsetForms
          v-if="currentStepA === 9"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA9"
        />

        <!-- Section A Form - Step 10: Maklumat Pekerjaan -->
        <PekerjaanForms
          v-if="currentStepA === 10"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA10"
        />

        <!-- Section A Form - Step 11: Maklumat Pendapatan & Perbelanjaan -->
        <PendapatanPerbelanjaanForms
          v-if="currentStepA === 11"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA11"
        />
      </template>
    </rs-card>

    <rs-card v-if="currentSection == 2" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Tanggungan Asnaf</h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepB }} dari {{ filteredStepsB.length }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in filteredStepsB"
              :key="step.id"
              class="text-center flex-1 cursor-pointer relative group"
              :class="{ 'font-semibold': currentStepB >= step.id }"
              @click="goToStepB(step.id)"
            >
              {{ step.label }}
              <!-- Tooltip for Pengesahan Pendapatan -->
              <div
                v-if="step.tooltip"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs"
              >
                {{ step.tooltip }}
                <!-- Arrow -->
                <div
                  class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"
                ></div>
              </div>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepB >= filteredStepsB.length
                  ? 100
                  : (currentStepB / filteredStepsB.length) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Section B Form Steps -->
        <!-- Tanggungan Selector and Management (Visible only during Steps 1-9) -->
        <div
          v-if="currentStepB >= 1 && currentStepB <= 9"
          class="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold">Senarai Tanggungan</h4>
            <rs-button
              type="button"
              variant="primary"
              @click="addTanggungan"
              class="text-sm"
              :disabled="tanggunganList.length >= 3"
            >
              + Tambah Tanggungan
              {{ tanggunganList.length >= 3 ? "(Maksimum 3)" : "" }}
            </rs-button>
          </div>

          <!-- Tanggungan Cards Display -->
          <div
            v-if="tanggunganList.length > 0"
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div
              v-for="(tanggungan, index) in tanggunganList"
              :key="tanggungan.id"
              class="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-all"
              :class="{
                'ring-2 ring-blue-500 border-blue-300':
                  currentTanggunganIndex === index,
                'border-green-300 bg-green-50':
                  isTanggunganComplete(tanggungan) &&
                  currentTanggunganIndex !== index,
                'border-yellow-300 bg-yellow-50':
                  !isTanggunganComplete(tanggungan) &&
                  currentTanggunganIndex !== index,
                'border-gray-200':
                  currentTanggunganIndex !== index &&
                  !isTanggunganComplete(tanggungan),
              }"
              @click="selectTanggungan(index)"
            >
              <!-- Card Header -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1 text-center">
                  <p class="text-sm text-gray-600">
                    {{ tanggungan.nama_tanggungan || "Nama belum diisi" }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ tanggungan.hubungan_pemohon || "Hubungan belum diisi" }}
                  </p>
                </div>

                <!-- Status Badge -->
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800':
                      isTanggunganComplete(tanggungan),
                    'bg-yellow-100 text-yellow-800':
                      !isTanggunganComplete(tanggungan),
                  }"
                >
                  {{
                    isTanggunganComplete(tanggungan)
                      ? "Lengkap"
                      : "Tidak Lengkap"
                  }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2 mt-4">
                <button
                  @click.stop="selectTanggungan(index)"
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  {{
                    currentTanggunganIndex === index ? "Sedang Edit" : "Edit"
                  }}
                </button>
              </div>
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
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB1"
        />

        <!-- Section B Form - Step 2: Maklumat Islam Tanggungan -->
        <TanggunganPengislamanForms
          v-if="currentStepB === 2"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB2"
        />

        <!-- Section B Form - Step 3: Maklumat Bank Tanggungan -->
        <TanggunganPerbankanForms
          v-if="currentStepB === 3"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB3"
        />

        <!-- Section B Form - Step 4: Maklumat Pendidikan Tanggungan -->
        <TanggunganPendidikanForms
          v-if="currentStepB === 4"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB4"
        />

        <!-- Section B Form - Step 5: Maklumat Kesihatan Tanggungan -->
        <TanggunganKesihatanForms
          v-if="currentStepB === 5"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB5"
        />

        <!-- Section B Form - Step 6: Maklumat Kemahiran Tanggungan -->
        <TanggunganKemahiranForms
          v-if="currentStepB === 6"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB6"
        />

        <!-- Section B Form - Step 7: Maklumat Pekerjaan Tanggungan -->
        <TanggunganPekerjaanForms
          v-if="currentStepB === 7"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB7"
        />

        <!-- Section B Form - Step 8: Maklumat Pemilikan Aset (Tanggungan) -->
        <TanggunganPemilikanAsetForms
          v-if="currentStepB === 8"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB8"
        />

        <!-- Section B Form - Step 9: Maklumat Pinjaman Harta (Tanggungan) -->
        <TanggunganPinjamanHartaForms
          v-if="currentStepB === 9"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB9"
        />

        <!-- Section B Form - Step 10: Pengesahan -->
        <TanggunganPengesahanForms
          v-if="currentStepB === 10"
          :screen-type="screenType"
          :form-data="formData"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB10"
        />

        <!-- Section B Form - Step 11: Pengesahan Pendapatan -->
        <TanggunganPengesahanPendapatanForms
          v-if="currentStepB === 11"
          :form-data="formData"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB11"
        />

        <!-- Section B Form - Step 12: Pengesahan Bermastautin -->
        <TanggunganPengesahanBermastauntinForms
          v-if="currentStepB === 12"
          :form-data="formData"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB12"
        />

        <!-- Section B Form - Step 13: Pegawai Pendaftar -->
        <TanggunganPegawaiPendaftarForms
          v-if="currentStepB === 13"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB13"
          @submit-form="handleSubmit"
        />
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import PeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PeribadiForms.vue";
import AlamatForms from "~/components/forms/borang-permohonan-lengkap/SectionA/AlamatForms.vue";
import PendidikanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendidikanForms.vue";
import PengislamanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PengislamanForms.vue";
import PerbankanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PerbankanForms.vue";
import KesihatanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/KesihatanForms.vue";
import KemahiranForms from "~/components/forms/borang-permohonan-lengkap/SectionA/KemahiranForms.vue";
import PinjamanHartaForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PinjamanHartaForms.vue";
import PemilikanAsetForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PemilikanAsetForms.vue";
import PekerjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PekerjaanForms.vue";
import PendapatanPerbelanjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendapatanPerbelanjaanForms.vue";
import TanggunganKemahiranForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganKemahiranForms.vue";
import TanggunganPeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPeribadiForms.vue";
import TanggunganPendidikanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPendidikanForms.vue";
import TanggunganPemilikanAsetForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPemilikanAsetForms.vue";
import TanggunganPinjamanHartaForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPinjamanHartaForms.vue";
import TanggunganPengislamanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengislamanForms.vue";
import TanggunganPengesahanPendapatanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengesahanPendapatanForms.vue";
import TanggunganPengesahanBermastauntinForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengesahanBermastauntinForms.vue";
import TanggunganPegawaiPendaftarForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPegawaiPendaftarForms.vue";
import TanggunganPerbankanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPerbankanForms.vue";
import TanggunganKesihatanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganKesihatanForms.vue";
import TanggunganPekerjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPekerjaanForms.vue";
import TanggunganPengesahanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengesahanForms.vue";

// ============================================================================
// ROUTER & TOAST SETUP
// ============================================================================
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Borang Permohonan Lengkap",
});

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================
const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/02",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/FR/02",
  },
  {
    name: " Pendaftaran Lengkap",
    type: "current",
    path: "/BF-PRF/AS/FR/02",
  },
]);

// ============================================================================
// SECTION & STEP MANAGEMENT
// ============================================================================
const currentSection = ref(1);

// Section A - Main Form Steps
const currentStepA = ref(1);
const totalStepsA = 11;
const stepsA = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
  { id: 3, label: "Pendidikan" },
  { id: 4, label: "Pengislaman" },
  { id: 5, label: "Perbankan" },
  { id: 6, label: "Kesihatan" },
  { id: 7, label: "Kemahiran" },
  { id: 8, label: "Pinjaman Harta" },
  { id: 9, label: "Pemilikan Aset" },
  { id: 10, label: "Pekerjaan" },
  { id: 11, label: "Pendapatan & Perbelanjaan" },
];

// Section B - Tanggungan Form Steps (13 steps with separate tabs for different info sections)
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
  {
    id: 11,
    label: "Pengesahan Pendapatan",
    tooltip:
      "Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS",
  },
  { id: 12, label: "Pengesahan Bermastautin" },
  { id: 13, label: "Pegawai Pendaftar" },
];

// Computed property to filter stepsB based on current tanggungan's age
const filteredStepsB = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan) return stepsB;

  const age = parseInt(
    currentTanggungan.umur_tanggungan ||
      calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
  );

  // Hide Kemahiran tab (id: 6) if age is less than 19
  if (age < 19) {
    return stepsB.filter((step) => step.id !== 6);
  }

  return stepsB;
});


// ============================================================================
// FORM STATE VARIABLES
// ============================================================================

// Tanggungan Management Variables
const currentTanggunganIndex = ref(0);
const tanggunganList = ref([]);

// Screen context: 'selfservice' or 'pendaftar'
const screenType = ref("pendaftar");

// ============================================================================
// FORM DATA STRUCTURE
// ============================================================================
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  jenis_id: "",
  no_pengenalan: "",
  nama: "",
  warganegara: "",
  tarikh_lahir: "",
  umur: "",
  tempat_lahir: "",
  jantina: "",
  agama: "",
  bangsa: "",
  no_telefon_bimbit: "",
  no_telefon_rumah: "",
  emel: "",
  bersekolah: "",
  pendidikan_tertinggi: "",
  status_perkahwinan: "",
  status_poligami: "",
  bilangan_isteri: "",
  isteri_list: [],
  dokumen_surat_nikah: null,
  taraf_penduduk: "",
  nopassportlama: "",
  lain_warganegara: "",
  dokumen_id: null,
  agama_lain: "",
  bangsa_lain: "",

  // Section A - Maklumat Pendidikan
  masih_bersekolah: "",
  pendidikan_tertinggi: "",
  lain_pendidikan_tertinggi: "",
  tahap_pendidikan: [],
  lain_tahap_pendidikan: "",
  sijil_pendidikan: null,
  // Multiple education entries (new)
  education_entries: [],
  // Passport dates for foreign IDs (Peribadi)
  passportStartDate: "",
  passportEndDate: "",
  jenis_sekolah: "",
  kategori_sekolah: "",
  tahun_bersekolah: "",
  tahun_tingkatan: "",
  nama_sekolah: "",
  alamat_sekolah_1: "",
  alamat_sekolah_2: "",
  alamat_sekolah_3: "",
  daerah_sekolah: "",
  bandar_sekolah: "",
  poskod_sekolah: "",
  tinggal_bersama_keluarga: "",
  asrama_rumah_sewa: "",
  nama_baitul: "",
  bidang_kursus: "",
  jurusan_bidang: "",
  pembiayaan_pengajian: [],
  lain_pembiayaan: "",
  catatan_pendidikan: "",

  // Section A - Maklumat Islam
  adakah_muallaf: "",
  tarikh_masuk_islam: "",
  tarikh_masuk_kfam: "",
  nama_selepas_islam: "",
  nama_sebelum_islam: "",
  tarikh_keluar_muallaf: "",
  dokumen_pengislaman: null,

  // Bank Information
  nama_bank: "",
  no_akaun_bank: "",
  nama_pemegang_akaun: "",
  swift_code: "",
  ada_akaun_bank: "",
  sebab_tiada_akaun: "",
  lain_lain_sebab_tiada_akaun: "",
  sebab_tunai: "",
  // Multiple bank accounts (new)
  bank_accounts: [],

  // Section B - Maklumat Kesihatan
  tahap_kesihatan: "",
  keadaan_kesihatan_sakit: "",
  kos_penjagaan_sakit: "",
  perbelanjaan_bulanan_sakit: "",
  kesempurnaan_fizikal: "",
  sebab_kecacatan: "",
  tahap_kecacatan: "",
  perbelanjaan_bulanan_oku: "",
  keadaan_kesihatan_uzur: "",
  kos_penjagaan_uzur: "",
  perbelanjaan_bulanan_uzur: "",
  dokumen_sokongan_kesihatan: null,

  // Section C - Kemahiran
  kemahiran: "",
  lain_lain_kemahiran: "",

  // Section D - Maklumat Pekerjaan
  status_pekerjaan: "",
  jenis_pekerjaan: "",
  sektor_pekerjaan: "",
  lain_lain_sektor: "",
  no_telefon_pejabat: "",
  nama_majikan: "",
  no_telefon_majikan: "",
  alamat_majikan_1: "",
  alamat_majikan_2: "",
  alamat_majikan_3: "",
  bandar_majikan: "",
  poskod_majikan: "",
  daerah_majikan: "",
  negeri_majikan: "",
  negara_majikan: "",
  jawatan: "",
  status_jawatan: "",
  pendapatan_kasar: "",
  pengesahan_pendapatan: [],
  sumber_pendapatan: [],
  lain_lain_sumber_pendapatan: "",

  // Section E - Maklumat Pendapatan
  gaji_elaun_pendapatan: "",
  pendapatan_isteri_suami_ibubapa_penjaga: "",
  pencen_perkeso: "",
  sumbangan_anak_anak: "",
  bantuan_jkm: "",
  takaful: "",
  sewa_rumah_tanah_kedai: "",
  pendapatan_tanggungan_serumah: "",
  pendapatan_lain_lain: [{ amount: "" }],
  perbelanjaan_makanan_minuman: "",
  sewa_bayaran_pinjaman_perumahan: "",
  perbelanjaan_persekolahan_anak: "",
  pengangkutan_tambang_bas_sekolah: "",
  bil_utiliti: "",

  // Section F - Maklumat Alamat
  addressInfo: {
    alamat1: "",
    alamat2: "",
    alamat3: "",
    location: "",
    negeri: "Selangor",
    daerah: "",
    bandar: "",
    poskod: "",
    kariah: "",
    geolokasi: "",
    tempoh_menetap_selangor: "",
    tempoh_menetap_selangor_nilai: "",
    tempoh_menetap_selangor_unit: "",
    kategori_menetap: "",
    kelulusan_khas: "",
    kursus_terpilih: "",
    selectedKursus: null,
    selectedGuru: null,
    // Maklumat Tempat Tinggal
    status_kediaman: "",
    keadaan_kediaman: "",
    kadar_bayaran_bulanan: "",
    kadar_sewa_bulanan: "",
    dokumen_perjanjian_sewa: null,
    lain_lain_status_kediaman: "",
  },

  // Section H - Maklumat Pemilikan
  wang_simpanan: "",
  emas: "",
  saham: "",
  jenis_kenderaan: [],
  kenderaan_total: "",
  rumah_kedai: "",
  tanah_sawah: "",
  dokumen_pemilikan: null,

  // Section H1 - Maklumat Pinjaman Harta
  nama_institusi_pemberi_pinjaman: "",
  jenis_pinjaman: "",
  amaun_bayaran_bulanan: "",
  jumlah_keseluruhan_perbelanjaan: "",
  tahun_mula_pinjaman: "",
  tahun_akhir_pinjaman: "",
  dokumen_perjanjian_pinjaman: null,

  // Section J - Pengesahan
  pengesahan: {
    dibantu_penolong_amil: "",
    kariah_bantuan: "",
    nama_penolong_amil_bantuan: "",
    tarikh_bantuan: "",
    hubungan_pak: "",
    kariah_hubungan_pak: "",
    nama_pak_hubungan: "",
    jenis_hubungan_pak: "",
    tarikh_hubungan_pak: "",
    pdpa_consent: false,
    pendapatan_consent: false,
    hubungan_kakitangan_lzs: "",
    nama_kakitangan: "",
    jawatan_kakitangan: "",
    pejabat_kakitangan: "",
    hubungan_kakitangan: "",
    tarikh_perakuan: new Date().toISOString().slice(0, 10),
    // Fake data for PAK officer information display in bermastautin
    kariah_bermastautin: "masjid-al-hidayah",
    nama_pak_bermastautin: "ustaz-ahmad-abdullah",
    // Fake data for form fields in bermastautin
    nama_pengesah: "Ustaz Ahmad bin Abdullah",
    jawatan_pengesah: "Pegawai PAK",
    no_telefon_pengesah: "012-3456789",
    tarikh_pengesahan_permastautin: "2024-01-15",
  },

  // Section J1 - Pengesahan Pendapatan
  pengesahan_pendapatan: {
    nama_penolong_amil: "",
    jawatan_penolong_amil: "",
    no_telefon_penolong_amil: "",
    tarikh_pengesahan_pendapatan: "",
    dokumen_pengesahan_pendapatan: null,
    nama_pegawai_lzs: "",
    jawatan_pegawai_lzs: "",
    no_telefon_pegawai_lzs: "",
    tarikh_pengesahan_pegawai_lzs: "",
    dokumen_pengesahan_pegawai_lzs: null,
  },

  // Section K - Pengesahan Bermastautin
  ulasan_pengesahan: "",
  surat_pengesahan_bermastautin: null,

  // Section L - Maklumat Penolong Amil
  nama_penolong_amil: "",
  jenis_permohonan: "",
  tarikh_proses: "",

  // Section M - Penilaian Awal
  komitmen_tinggi: "",
  keperluan_mendesak: [],
  lain_keperluan: "",
  dokumen_sokongan: [],

  // Section B (Tanggungan) - Maklumat Peribadi Tanggungan
  // Note: Individual tanggungan fields are now handled in tanggunganList array
  // These fields are kept for backward compatibility but will be replaced

  // Tanggungan array for multiple dependents
  tanggungan: [],
});

// Mock file data for demonstration
onMounted(() => {
  // Set mock file data
  formData.value.dokumen_surat_nikah = [
    {
      name: "surat_nikah_sample.pdf",
      size: 2048576, // 2MB in bytes
      type: "application/pdf",
      file: new File(["mock content"], "surat_nikah_sample.pdf", {
        type: "application/pdf",
      }),
    },
  ];
});

// ============================================================================
// OPTIONS DATA
// ============================================================================

// moved into PerbankanForms

// Add/remove multiple bank accounts and helper
const addBankAccount = () => {
  formData.value.bank_accounts.push({
    nama_bank: "",
    no_akaun_bank: "",
    nama_pemegang_akaun: "",
    jenis_akaun: "",
    id_pengenalan: "",
    nama_bersama: "",
    hubungan: "",
  });
};

// Computed property for calculating Tarikh Keluar Muallaf
const tarikhKeluarMuallaf = computed(() => {
  if (formData.value.adakah_muallaf !== "Y") {
    return "";
  }

  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;

  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return "";
  }

  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;

  if (tarikhMasukIslam) {
    const [day, month, year] = tarikhMasukIslam.split("/");
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    }
  }

  if (tarikhMasukKFAM) {
    const [day, month, year] = tarikhMasukKFAM.split("/");
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    }
  }

  // Return the later date
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate =
      tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5
        ? tarikhMasukIslamPlus5
        : tarikhMasukKFAMPlus5;
    return `${String(laterDate.getDate()).padStart(2, "0")}/${String(
      laterDate.getMonth() + 1
    ).padStart(2, "0")}/${laterDate.getFullYear()}`;
  } else if (tarikhMasukIslamPlus5) {
    return `${String(tarikhMasukIslamPlus5.getDate()).padStart(
      2,
      "0"
    )}/${String(tarikhMasukIslamPlus5.getMonth() + 1).padStart(
      2,
      "0"
    )}/${tarikhMasukIslamPlus5.getFullYear()}`;
  } else if (tarikhMasukKFAMPlus5) {
    return `${String(tarikhMasukKFAMPlus5.getDate()).padStart(2, "0")}/${String(
      tarikhMasukKFAMPlus5.getMonth() + 1
    ).padStart(2, "0")}/${tarikhMasukKFAMPlus5.getFullYear()}`;
  }

  return "";
});

// ============================================================================
// WATCHERS
// ============================================================================
// Auto-populate applicant birth date from MyKad
watch(
  () => formData.value.no_pengenalan,
  (newVal) => {
    if (
      newVal &&
      !isInitializingMockData.value &&
      formData.value.jenis_id === "mykad"
    ) {
      if (newVal.length === 12 && /^\d{12}$/.test(newVal)) {
        const year = newVal.substring(0, 2);
        const month = newVal.substring(2, 4);
        const day = newVal.substring(4, 6);

        const century = parseInt(year) <= 29 ? "20" : "19";
        const fullYear = century + year;

        const birthDate = `${fullYear}-${month}-${day}`;
        formData.value.tarikh_lahir = birthDate;
      }
    }
  }
);

watch(
  () => formData.value.tarikh_lahir,
  (newVal) => {
    if (newVal) {
      formData.value.umur = calculateAge(newVal);
    } else {
      formData.value.umur = "";
    }
  },
  { immediate: true }
);

// Watch for kategori sekolah changes to clear nama sekolah selection
watch(
  () => formData.value.education_entries,
  (newEntries) => {
    if (!newEntries) return;
    newEntries.forEach((entry, index) => {
      // Watch each entry's kategori_sekolah
      watch(
        () => entry.kategori_sekolah,
        (newKategori, oldKategori) => {
          if (newKategori !== oldKategori && entry.nama_sekolah) {
            // Clear nama sekolah when kategori changes
            entry.nama_sekolah = "";
            entry.alamat_sekolah_1 = "";
            entry.alamat_sekolah_2 = "";
            entry.alamat_sekolah_3 = "";
            entry.daerah_sekolah = "";
            entry.bandar_sekolah = "";
            entry.poskod_sekolah = "";
          }
        },
        { deep: true }
      );
    });
  },
  { deep: true }
);

watch(
  () => formData.value.nama_bank,
  () => {
    // handled within PerbankanForms
  }
);

// Ensure at least one bank account entry when method is 'ya'
watch(
  () => formData.value.ada_akaun_bank,
  (method) => {
    if (method === "Y" && formData.value.bank_accounts.length === 0) {
      addBankAccount();
    }
  },
  { immediate: true }
);

// Ensure all existing tanggungan bank accounts have pengenalan_ids field
watch(
  () => tanggunganList.value,
  (tanggunganList) => {
    if (tanggunganList) {
      tanggunganList.forEach((tanggungan) => {
        if (tanggungan.bank_accounts) {
          tanggungan.bank_accounts.forEach((account) => {
            if (!account.pengenalan_ids) {
              account.pengenalan_ids = [];
            }
          });
        }
      });
    }
  },
  { deep: true, immediate: true }
);

// Keep legacy string `tempoh_menetap_selangor` in sync with split inputs
watch(
  () => [
    formData.value.addressInfo.tempoh_menetap_selangor_nilai,
    formData.value.addressInfo.tempoh_menetap_selangor_unit,
  ],
  ([nilai, unit]) => {
    if (nilai !== undefined && unit) {
      formData.value.addressInfo.tempoh_menetap_selangor = String(nilai);
    } else {
      formData.value.addressInfo.tempoh_menetap_selangor = "";
    }
  }
);

// Keep legacy string `tempoh_menetap_selangor_tanggungan` in sync with split inputs for all tanggungan
watch(
  () => formData.value.tanggungan,
  (tanggunganList) => {
    if (tanggunganList) {
      tanggunganList.forEach((tanggungan) => {
        if (
          tanggungan.tempoh_menetap_selangor_tanggungan_nilai !== undefined &&
          tanggungan.tempoh_menetap_selangor_tanggungan_unit
        ) {
          tanggungan.tempoh_menetap_selangor_tanggungan = String(
            tanggungan.tempoh_menetap_selangor_tanggungan_nilai
          );
        } else {
          tanggungan.tempoh_menetap_selangor_tanggungan = "";
        }
      });
    }
  },
  { deep: true }
);

// Seed one education entry when masih_bersekolah === 'Y'
watch(
  () => formData.value.masih_bersekolah,
  (val) => {
    if (val === "Y" && formData.value.education_entries.length === 0) {
      addEducationEntry();
    }
  },
  { immediate: true }
);

watch(
  () => formData.value.nama_bank_tanggungan,
  () => {
    // handled within TanggunganPerbankanForms
  }
);

// Watch for employment status changes to handle conditional validation
watch(
  () => formData.value.status_pekerjaan,
  (newVal) => {
    if (newVal === "tidak_bekerja") {
      // Clear employment-related fields when not working
      formData.value.jenis_pekerjaan = "";
      formData.value.sektor_pekerjaan = "";
      formData.value.lain_lain_sektor = "";
      formData.value.no_telefon_pejabat = "";
      formData.value.nama_majikan = "";
      formData.value.no_telefon_majikan = "";
      formData.value.alamat_majikan_1 = "";
      formData.value.alamat_majikan_2 = "";
      formData.value.alamat_majikan_3 = "";
      formData.value.bandar_majikan = "";
      formData.value.poskod_majikan = "";
      formData.value.daerah_majikan = "";
      formData.value.negeri_majikan = "";
      formData.value.negara_majikan = "";
      formData.value.jawatan = "";
      formData.value.status_jawatan = "";
      formData.value.pendapatan_kasar = "";
      formData.value.pengesahan_pendapatan = [];
      formData.value.sumber_pendapatan = [];

      // Watch for tanggungan birth date changes to auto-populate age
      watch(
        () => getCurrentTanggungan()?.tarikh_lahir_tanggungan,
        (newVal) => {
          if (newVal && !isInitializingMockData.value) {
            const currentTanggungan = getCurrentTanggungan();
            if (currentTanggungan && !currentTanggungan.umur_tanggungan) {
              // Only calculate age if it's not already set (for mock data)
              currentTanggungan.umur_tanggungan = calculateAge(newVal);
            }
          }
        }
      );

      // Watch for tanggungan MyKad changes to auto-populate birth date for Malaysians
      watch(
        () => getCurrentTanggungan()?.pengenalan_id_tanggungan,
        (newVal) => {
          if (
            newVal &&
            !isInitializingMockData.value &&
            getCurrentTanggungan()?.jenis_pengenalan_tanggungan === "MyKad" &&
            getCurrentTanggungan()?.warganegara_tanggungan === "Malaysia"
          ) {
            const currentTanggungan = getCurrentTanggungan();
            if (newVal.length === 12 && /^\d{12}$/.test(newVal)) {
              // Extract birth date from MyKad (format: YYMMDD)
              const year = newVal.substring(0, 2);
              const month = newVal.substring(2, 4);
              const day = newVal.substring(4, 6);

              // Determine century (00-29 = 2000s, 30-99 = 1900s)
              const century = parseInt(year) <= 29 ? "20" : "19";
              const fullYear = century + year;

              // Format as YYYY-MM-DD for date input
              const birthDate = `${fullYear}-${month}-${day}`;
              currentTanggungan.tarikh_lahir_tanggungan = birthDate;
              // Only calculate age if it's not already set (for mock data)
              if (!currentTanggungan.umur_tanggungan) {
                currentTanggungan.umur_tanggungan = calculateAge(birthDate);
              }
            }
          }
        }
      );

      // Watch for tanggungan Islamic dates changes to auto-calculate Tarikh Keluar Muallaf
      watch(
        () => [
          getCurrentTanggungan()?.adakah_muallaf_tanggungan,
          getCurrentTanggungan()?.tarikh_masuk_islam_tanggungan,
          getCurrentTanggungan()?.tarikh_masuk_kfam_tanggungan,
        ],
        () => {
          const currentTanggungan = getCurrentTanggungan();
          if (currentTanggungan?.adakah_muallaf_tanggungan === "Y") {
            currentTanggungan.tarikh_keluar_muallaf_tanggungan =
              calculateTarikhKeluarMuallafTanggungan();
          }
        },
        { deep: true }
      );

      // Watch mohon_ketua_keluarga for adults to auto-set situasi & kelulusan
      watch(
        () => [
          getCurrentTanggungan()?.mohon_ketua_keluarga,
          getCurrentTanggungan()?.tarikh_lahir_tanggungan,
        ],
        () => {
          const currentTanggungan = getCurrentTanggungan();
          if (!currentTanggungan) return;

          const age = parseInt(
            calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
          );
          if (Number.isFinite(age) && age < 18) {
            if (currentTanggungan.mohon_ketua_keluarga) {
              currentTanggungan.situasi_kelulusan_khas = "Profiling";
              currentTanggungan.kelulusan_khas = "Y";
            } else {
              currentTanggungan.kelulusan_khas = "N";
              currentTanggungan.situasi_kelulusan_khas = "";
            }
          }
        },
        { deep: true }
      );

      // Watch for bank selection to auto-populate Swift Code
      watch(
        () => getCurrentTanggungan()?.nama_bank_tanggungan,
        (newBankName) => {
          const currentTanggungan = getCurrentTanggungan();
        // handled within TanggunganPerbankanForms
        },
        { deep: true }
      );
      formData.value.lain_lain_sumber_pendapatan = "";
    }
  }
);

// Watch for Islamic dates changes to automatically calculate Tarikh Keluar Muallaf
watch(
  [
    () => formData.value.tarikh_masuk_islam,
    () => formData.value.tarikh_masuk_kfam,
  ],
  () => {
    if (formData.value.adakah_muallaf === "Y") {
      formData.value.tarikh_keluar_muallaf = tarikhKeluarMuallaf.value;
    }
  }
);

// Watch for muallaf status changes to clear Islamic fields when not muallaf
watch(
  () => formData.value.adakah_muallaf,
  (newVal) => {
    if (newVal === "T") {
      // Clear all Islamic fields when not muallaf
      formData.value.tarikh_masuk_islam = "";
      formData.value.tarikh_masuk_kfam = "";
      formData.value.nama_selepas_islam = "";
      formData.value.nama_sebelum_islam = "";
      formData.value.tarikh_keluar_muallaf = "";
      formData.value.dokumen_pengislaman = null;
    }
  }
);

// ============================================================================
// STEP NAVIGATION FUNCTIONS
// ============================================================================
const nextStepA = () => {
  if (currentStepA.value < totalStepsA) {
    currentStepA.value++;
  } else if (currentStepA.value === totalStepsA) {
    // When Section A is complete, move to Section B
    nextSection();
  }
};

const prevStepA = () => {
  if (currentStepA.value > 1) {
    currentStepA.value--;
  }
};

const nextStepB = () => {
  // Save current tanggungan data before moving to next step
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    // Update the tanggunganList with current form data
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
  }

  // Get the next step, skipping kemahiran if age < 19
  let nextStep = currentStepB.value + 1;
  const currentTanggungan = getCurrentTanggungan();

  if (currentTanggungan) {
    const age = parseInt(
      currentTanggungan.umur_tanggungan ||
        calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
    );

    // Skip kemahiran step (id: 6) if age is less than 19
    if (age < 19 && nextStep === 6) {
      nextStep = 7; // Skip to Pekerjaan step
    }
  }

  if (nextStep <= totalStepsB) {
    currentStepB.value = nextStep;
  } else {
    // All steps completed, go to next section
  }
};

const prevStepB = () => {
  // If already at first step of Section B, go back to Section A
  if (currentStepB.value === 1) {
    prevSection();
    return;
  }

  if (currentStepB.value > 1) {
    let prevStep = currentStepB.value - 1;
    const currentTanggungan = getCurrentTanggungan();

    if (currentTanggungan) {
      const age = parseInt(
        currentTanggungan.umur_tanggungan ||
          calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
      );

      // Skip kemahiran step (id: 6) if age is less than 19
      if (age < 19 && prevStep === 6) {
        prevStep = 5; // Skip to Kesihatan step
      }
    }

    currentStepB.value = prevStep;
  }
};

const nextSection = () => {
  currentSection.value = 2;
};

const prevSection = () => {
  currentSection.value = 1;
};

// ============================================================================
// TANGGUNGAN MANAGEMENT FUNCTIONS
// ============================================================================
const addTanggungan = (showNotification = true) => {
  // Prevent adding more than 3 tanggungan
  if (tanggunganList.value.length >= 3) {
    toast.error("Maksimum 3 tanggungan sahaja dibenarkan");
    return;
  }

  const newTanggungan = {
    id: Date.now(), // Unique ID for each tanggungan

    // Step 1: Maklumat Peribadi Tanggungan
    hubungan_pemohon: "",
    lain_lain_hubungan: "",
    nama_tanggungan: "",
    jenis_pengenalan_tanggungan: "",
    pengenalan_id_tanggungan: "",
    warganegara_tanggungan: "",
    lain_lain_warganegara: "",
    no_pasport_lama: "",
    taraf_penduduk_tetap: "",
    no_pasport: "",
    tarikh_mula_pasport: "",
    tarikh_tamat_pasport: "",
    tarikh_lahir_tanggungan: "",
    umur_tanggungan: "",
    mohon_ketua_keluarga: false,
    tempat_lahir_tanggungan: "",
    jantina_tanggungan: "",
    agama_tanggungan: "",
    lain_lain_agama: "",
    bangsa_tanggungan: "",
    lain_lain_bangsa: "",
    no_telefon_bimbit_tanggungan: "",
    no_telefon_rumah_tanggungan: "",
    emel_tanggungan: "",
    tempoh_menetap_selangor_tanggungan: "",
    tempoh_menetap_selangor_tanggungan_nilai: "",
    tempoh_menetap_selangor_tanggungan_unit: "",
    status_perkahwinan_tanggungan: "",
    lain_lain_status_perkahwinan: "",
    jumlah_tanggungan: "",

    // Special Approval for Minors
    situasi_kelulusan_khas: "",
    kelulusan_khas: "",

    // Legacy fields for backward compatibility
    jenis_id_tanggungan: "",
    no_pengenalan_tanggungan: "",
    tempoh_menetap_selangor: "",
    no_telefon_tanggungan: "",

    // Islamic Information (for Step 2)
    adakah_muallaf_tanggungan: "",
    nama_sebelum_islam_tanggungan: "",
    tarikh_masuk_islam_tanggungan: "",
    tarikh_masuk_kfam_tanggungan: "",
    nama_selepas_islam_tanggungan: "",
    tarikh_keluar_muallaf_tanggungan: "",
    dokumen_pengislaman_tanggungan: null,

    // Step 2: Maklumat Perbankan Tanggungan
    nama_bank_tanggungan: "",
    swift_code_tanggungan: "",
    no_akaun_bank_tanggungan: "",
    nama_pemegang_akaun_tanggungan: "",
    ada_akaun_bank_tanggungan: "",
    sebab_tiada_akaun_tanggungan: "",
    lain_lain_sebab_tiada_akaun_tanggungan: "",
    // Multiple bank accounts for tanggungan (new)
    bank_accounts: [],

    // Step 3: Maklumat Pendidikan Tanggungan
    masih_bersekolah: "",
    bersekolah_tanggungan: "",
    pendidikan_tertinggi_tanggungan: "",
    lain_pendidikan_tertinggi_tanggungan: "",
    tahap_pendidikan_dicapai: [],
    lain_tahap_pendidikan_dicapai: "",
    sijil_pendidikan_tanggungan: null,
    jenis_sekolah_institusi: "",
    kategori_sekolah_institusi: "",
    tahun_bersekolah: "",
    tahun_tingkatan_pengajian: "",
    nama_sekolah_institusi: "",
    alamat1_sekolah: "",
    alamat2_sekolah: "",
    alamat3_sekolah: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    nama_baitul: "",
    bidang_kursus_pengajian: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan_pengajian: "",
    catatan_pendidikan_tanggungan: "",
    // Multiple education entries for tanggungan (new)
    education_entries: [],
    // Legacy fields for backward compatibility
    jenis_sekolah: "",
    nama_sekolah: "",
    alamat_sekolah: "",
    negeri_sekolah: "",
    nama_sekolah_agama: "",
    alamat_sekolah_agama: "",
    daerah_sekolah_agama: "",
    negeri_sekolah_agama: "",
    poskod_sekolah_agama: "",

    // Step 4: Maklumat Kesihatan Tanggungan
    tahap_kesihatan_tanggungan: "",
    keadaan_kesihatan_sakit_tanggungan: "",
    kos_penjagaan_sakit_tanggungan: "",
    perbelanjaan_bulanan_sakit_tanggungan: "",
    kesempurnaan_fizikal_tanggungan: "",
    sebab_kecacatan_tanggungan: "",
    tahap_kecacatan_tanggungan: "",
    perbelanjaan_bulanan_oku_tanggungan: "",
    keadaan_kesihatan_uzur_tanggungan: "",
    kos_penjagaan_uzur_tanggungan: "",
    perbelanjaan_bulanan_uzur_tanggungan: "",
    // Dokumen Sokongan Kesihatan
    dokumen_sakit_kronik_tanggungan: null,
    dokumen_oku_tanggungan: null,
    dokumen_uzur_tanggungan: null,

    // Step 5: Kemahiran Tanggungan
    kemahiran_tanggungan: "",

    // Step 6: Maklumat Pekerjaan Tanggungan
    pekerjaan_status: "",

    // Sumber Pendapatan
    sumber_pendapatan: [],
    lain_lain_sumber_pendapatan: "",

    // Butiran Pekerjaan
    jenis_pekerjaan: "",
    sektor_pekerjaan: "",
    lain_lain_sektor_pekerjaan: "",
    jawatan: "",
    status_jawatan: "",
    pendapatan_kasar: "",
    pengesahan_pendapatan: null,

    // Maklumat Majikan
    no_telefon_pejabat: "",
    nama_majikan: "",
    no_tel_majikan: "",
    alamat_majikan_1: "",
    alamat_majikan_2: "",
    alamat_majikan_3: "",
    bandar_majikan: "",
    poskod_majikan: "",
    daerah_majikan: "",
    negeri_majikan: "",
    negara_majikan: "",

    // Jawatan & Status
    jawatan: "",
    status_jawatan: "",

    // Pendapatan
    pendapatan_kasar: "",
    dokumen_pendapatan: null,
  };

  tanggunganList.value.push(newTanggungan);
  currentTanggunganIndex.value = tanggunganList.value.length - 1;
  currentStepB.value = 1;

  // Update formData.tanggungan array
  formData.value.tanggungan = tanggunganList.value;

  // Only show notification if requested
  if (showNotification) {
    toast.success(`Tanggungan ${tanggunganList.value.length} berjaya ditambah`);
  }
};

const selectTanggungan = (index) => {
  // Save current tanggungan data before switching
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
  }
  currentTanggunganIndex.value = index;
  currentStepB.value = 1;
};

// Helper functions for simplified interface
const isTanggunganComplete = (tanggungan) => {
  return (
    tanggungan.nama_tanggungan &&
    tanggungan.hubungan_pemohon &&
    tanggungan.jenis_id_tanggungan &&
    tanggungan.jantina_tanggungan &&
    tanggungan.tarikh_lahir_tanggungan
  );
};

const getCurrentTanggungan = () => {
  if (tanggunganList.value.length === 0) {
    // Initialize with first tanggungan if none exists
    addTanggungan(false); // Don't show notification during initialization
  }
  return tanggunganList.value[currentTanggunganIndex.value];
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  if (!birthDate) return "";

  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age.toString();
  } catch (error) {
    return "";
  }
};

// Helper function to calculate total tanggungan
const calculateTotalTanggungan = () => {
  if (tanggunganList.value.length === 0) return "0";

  // Count active tanggungan (excluding those with expired passports)
  let activeCount = 0;

  tanggunganList.value.forEach((tanggungan) => {
    if (tanggungan.warganegara_tanggungan === "Malaysia") {
      activeCount++;
    } else {
      // Check if passport is expired for non-Malaysians
      if (tanggungan.tarikh_tamat_pasport) {
        try {
          const expiryDate = new Date(tanggungan.tarikh_tamat_pasport);
          const today = new Date();
          if (expiryDate > today) {
            activeCount++;
          }
        } catch (error) {
          // If date parsing fails, count as active
          activeCount++;
        }
      } else {
        activeCount++;
      }
    }
  });

  return activeCount.toString();
};

// Helper function to calculate Tarikh Keluar Muallaf for tanggungan
const calculateTarikhKeluarMuallafTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.adakah_muallaf_tanggungan ||
    currentTanggungan.adakah_muallaf_tanggungan !== "Y"
  ) {
    return "";
  }

  const tarikhMasukIslam = currentTanggungan.tarikh_masuk_islam_tanggungan;
  const tarikhMasukKFAM = currentTanggungan.tarikh_masuk_kfam_tanggungan;

  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return "";
  }

  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;

  if (tarikhMasukIslam) {
    try {
      const date = new Date(tarikhMasukIslam);
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    } catch (error) {
      console.error("Error parsing tarikh masuk Islam:", error);
    }
  }

  if (tarikhMasukKFAM) {
    try {
      const date = new Date(tarikhMasukKFAM);
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    } catch (error) {
      console.error("Error parsing tarikh masuk KFAM:", error);
    }
  }

  // Return the later date (more recent)
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate =
      tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5
        ? tarikhMasukIslamPlus5
        : tarikhMasukKFAMPlus5;
    return laterDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  } else if (tarikhMasukIslamPlus5) {
    return tarikhMasukIslamPlus5.toISOString().split("T")[0];
  } else if (tarikhMasukKFAMPlus5) {
    return tarikhMasukKFAMPlus5.toISOString().split("T")[0];
  }

  return "";
};

// Flag to prevent watchers from running during mock data initialization
const isInitializingMockData = ref(true);

// Initialize with 3 tanggungan by default on component mount
onMounted(() => {
  // Initialize mock data for Section A - Maklumat Peribadi
  formData.value = {
    ...formData.value,
    // Mock data for Maklumat Peribadi
    jenis_id: "mykad",
    dokumen_id: "mykad.pdf",
    no_pengenalan: "770319035991",
    nama: "Adnan bin Abu",
    warganegara: "Malaysia",
    tarikh_lahir: "1977-03-19",
    umur: "48",
    tempat_lahir: "Kelantan",
    jantina: "Lelaki",
    agama: "Islam",
    bangsa: "Melayu",
    no_telefon_bimbit: "0191105544",
    emel: "adnan.abu@gmail.com",
    status_perkahwinan: "Berkahwin",
    status_poligami: "tidak",

    // Mock data for Maklumat Pendidikan
    masih_bersekolah: "T",
    pendidikan_tertinggi: "Peringkat Rendah",
    tahap_pendidikan: ["Peringkat Rendah"],

    // Mock data for Maklumat Islam
    adakah_muallaf: "T",

    // Mock data for Maklumat Perbankan
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

    // Mock data for Maklumat Kesihatan
    tahap_kesihatan: "Sihat",

    // Mock data for Maklumat Kemahiran
    kemahiran: ["Perniagaan"],

    // Mock data for Maklumat Pekerjaan
    status_pekerjaan: "bekerja",
    jenis_pekerjaan: "Berniaga",
    sektor_pekerjaan: "Kerja Sendiri",
    pendapatan_kasar: "1000.00",
    pengesahan_pendapatan: [],
    sumber_pendapatan: ["Lain-lain"],
    lain_lain_sumber_pendapatan: "Perniagaan",

    // Mock data for Maklumat Pendapatan & Perbelanjaan
    gaji_elaun_pendapatan: "1000.00",
    pendapatan_isteri_suami_ibubapa_penjaga: "0.00",
    pencen_perkeso: "0.00",
    sumbangan_anak_anak: "0.00",
    bantuan_jkm: "0.00",
    takaful: "0.00",
    sewa_rumah_tanah_kedai: "0.00",
    pendapatan_tanggungan_serumah: "0.00",
    pendapatan_lain_lain: [{ amount: "300.00" }],
    perbelanjaan_makanan_minuman: "500.00",
    sewa_bayaran_pinjaman_perumahan: "0.00",
    perbelanjaan_persekolahan_anak: "100.00",
    pengangkutan_tambang_bas_sekolah: "50.00",
    bil_utiliti: "100.00",

    // Mock data for Maklumat Pinjaman Harta
    // nama_institusi_pemberi_pinjaman: "Bank Islam Malaysia Berhad",
    // jenis_pinjaman: "Pinjaman Peribadi",
    // amaun_bayaran_bulanan: "500.00",
    // jumlah_keseluruhan_perbelanjaan: "15000.00",
    // tahun_mula_pinjaman: "2023-01-01",
    // tahun_akhir_pinjaman: "2025-12-31",
    // dokumen_perjanjian_pinjaman: null,

    // Mock data for Maklumat Tempat Tinggal
    addressInfo: {
      ...formData.value.addressInfo,
      alamat1: "32,jalan4/7a",
      alamat2: "bandar baru bangi",
      negeri: "selangor",
      daerah: "hulu-langat",
      bandar: "kajang",
      poskod: "43000",
      kariah: "kariah masjid al hidayah",
      geolokasi: "lokasi semasa",
      tempoh_menetap_selangor: "28",
      status_kediaman: "Milik Sendiri Tidak Berbayar",
      keadaan_kediaman: "Baik",
    },

    // Mock data for Maklumat Pendapatan & Perbelanjaan
  };

  if (tanggunganList.value.length === 0) {
    // Add 3 tanggungan by default with mock data
    addTanggungan(false); // First tanggungan
    addTanggungan(false); // Second tanggungan
    addTanggungan(false); // Third tanggungan

    // Set mock data for the 3 tanggungan
    if (tanggunganList.value.length === 3) {
      // First Tanggungan - Pasangan Pemohon
      tanggunganList.value[0] = {
        ...tanggunganList.value[0],
        hubungan_pemohon: "Pasangan Pemohon",
        nama_tanggungan: "ROHANA BINTI AHMAD",
        dokumen_surat_nikah: "test.pdf",
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

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "801004035672",
        tempoh_menetap_selangor: "20",
        no_telefon_tanggungan: "0138202398",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "ROHANA BINTI WONG",
        tarikh_masuk_islam_tanggungan: "1995-01-01",
        tarikh_masuk_kfam_tanggungan: "1995-01-01",
        nama_selepas_islam_tanggungan: "ROHANA BINTI AHMAD",
        tarikh_keluar_muallaf_tanggungan: "2000-01-01",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "maybank",
        swift_code_tanggungan: "MBBEMYKL",
        no_akaun_bank_tanggungan: "1234567890",
        nama_pemegang_akaun_tanggungan: "ROHANA BINTI AHMAD",
        kaedah_pembayaran_tanggungan: "akaun",
        sebab_tiada_akaun_tanggungan: "",

        // Pendidikan Tanggungan
        masih_bersekolah: "T",
        bersekolah_tanggungan: "Tidak",
        pendidikan_tertinggi_tanggungan: "Diploma",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["SPM", "Sijil", "Diploma"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SMK",
        kategori_sekolah_institusi: "SEK.MEN",
        tahun_bersekolah: "2020",
        tahun_tingkatan_pengajian: "Tingkatan 5",
        nama_sekolah_institusi: "SMK Kuala Lumpur",
        alamat1_sekolah: "Jalan Sultan, Kuala Lumpur",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Kuala Lumpur",
        bandar_sekolah: "Kuala Lumpur",
        poskod_sekolah: "50000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "Diploma",
        jurusan_bidang: "Pengurusan Perniagaan",
        pembiayaan_pengajian: ["PTPTN"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Tamat pengajian pada tahun 2020",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Menengah",
        nama_sekolah: "SMK Kuala Lumpur",
        alamat_sekolah: "Jalan Sultan, Kuala Lumpur",
        negeri_sekolah: "Kuala Lumpur",
        nama_sekolah_agama: "Sekolah Agama Kuala Lumpur",
        alamat_sekolah_agama: "Jalan Agama, Kuala Lumpur",
        daerah_sekolah_agama: "Kuala Lumpur",
        negeri_sekolah_agama: "Kuala Lumpur",
        poskod_sekolah_agama: "50000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Komputer, Bahasa Inggeris",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: ["Pengajian", "Sumbangan Keluarga"],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "Kerani",
        sektor_pekerjaan: "Swasta",
        lain_lain_sektor_pekerjaan: "",
        jawatan: "Kerani Pentadbiran",
        status_jawatan: "Tetap",
        pendapatan_kasar: "2500.00",
        pengesahan_pendapatan: null,

        // Maklumat Majikan
        no_telefon_pejabat: "038881234",
        nama_majikan: "Syarikat ABC Sdn Bhd",
        no_tel_majikan: "038881234",
        alamat_majikan_1: "Jalan Majikan, Kuala Lumpur",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "Kuala Lumpur",
        poskod_majikan: "50000",
        daerah_majikan: "Kuala Lumpur",
        negeri_majikan: "Kuala Lumpur",
        negara_majikan: "Malaysia",

        // Jawatan & Status
        jawatan: "Kerani",
        status_jawatan: "Tetap",

        // Pendapatan
        pendapatan_kasar: "2500.00",
        dokumen_pendapatan: null,
      };

      // Second Tanggungan - Anak Perempuan
      tanggunganList.value[1] = {
        ...tanggunganList.value[1],
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

        // Adult Status - Eligible for Head of Household
        situasi_kelulusan_khas: "Dewasa",
        kelulusan_khas: "N",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "060802030272",
        tempoh_menetap_selangor: "19",
        no_telefon_tanggungan: "0197883456",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "",
        tarikh_masuk_islam_tanggungan: "",
        tarikh_masuk_kfam_tanggungan: "",
        nama_selepas_islam_tanggungan: "",
        tarikh_keluar_muallaf_tanggungan: "",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "cimb",
        swift_code_tanggungan: "CIBBMYKL",
        no_akaun_bank_tanggungan: "0987654321",
        nama_pemegang_akaun_tanggungan: "NUR NAJWA BINTI ADNAN",
        kaedah_pembayaran_tanggungan: "akaun",
        sebab_tiada_akaun_tanggungan: "",

        // Pendidikan Tanggungan
        masih_bersekolah: "T",
        bersekolah_tanggungan: "Ya",
        pendidikan_tertinggi_tanggungan: "SPM",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["SPM"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "IPTA",
        kategori_sekolah_institusi: "IPTA",
        tahun_bersekolah: "2025",
        tahun_tingkatan_pengajian: "Tahun 1 / Semester 2",
        nama_sekolah_institusi: "Universiti Putra Malaysia (UPM)",
        alamat1_sekolah: "Universiti Putra Malaysia",
        alamat2_sekolah: "Serdang, Seri Kembangan",
        alamat3_sekolah: "",
        daerah_sekolah: "Seri Petaling",
        bandar_sekolah: "Serdang",
        poskod_sekolah: "43400",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "Diploma",
        jurusan_bidang: "Perniagaan Tani",
        pembiayaan_pengajian: ["Tiada"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Upload sijil SPM",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Menengah",
        nama_sekolah: "SMK Shah Alam",
        alamat_sekolah: "Jalan Sekolah, Shah Alam",
        negeri_sekolah: "Selangor",
        nama_sekolah_agama: "Sekolah Agama Shah Alam",
        alamat_sekolah_agama: "Jalan Agama, Shah Alam",
        daerah_sekolah_agama: "Petaling",
        negeri_sekolah_agama: "Selangor",
        poskod_sekolah_agama: "40000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Bahasa Melayu, Matematik, Sains",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Tidak Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: [],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "",
        sektor_pekerjaan: "",
        lain_lain_sektor_pekerjaan: "",
        jawatan: "",
        status_jawatan: "",
        pendapatan_kasar: "",
        pengesahan_pendapatan: null,

        // Maklumat Majikan
        no_telefon_pejabat: "",
        nama_majikan: "",
        no_tel_majikan: "",
        alamat_majikan_1: "",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "",
        poskod_majikan: "",
        daerah_majikan: "",
        negeri_majikan: "",
        negara_majikan: "",

        // Jawatan & Status
        jawatan: "",
        status_jawatan: "",

        // Pendapatan
        pendapatan_kasar: "",
        dokumen_pendapatan: null,
      };

      // Third Tanggungan - Anak Perempuan
      tanggunganList.value[2] = {
        ...tanggunganList.value[2],
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

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "091108030442",
        tempoh_menetap_selangor: "16",
        no_telefon_tanggungan: "01299982378",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "",
        tarikh_masuk_islam_tanggungan: "",
        tarikh_masuk_kfam_tanggungan: "",
        nama_selepas_islam_tanggungan: "",
        tarikh_keluar_muallaf_tanggungan: "",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "",
        swift_code_tanggungan: "",
        no_akaun_bank_tanggungan: "",
        nama_pemegang_akaun_tanggungan: "",
        ada_akaun_bank_tanggungan: "T",
        sebab_tiada_akaun_tanggungan: "bukan-warganegara",

        // Pendidikan Tanggungan
        masih_bersekolah: "Y",
        bersekolah_tanggungan: "Ya",
        pendidikan_tertinggi_tanggungan: "UPSR",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["Peringkat Rendah"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SRK",
        kategori_sekolah_institusi: "SRK",
        tahun_bersekolah: "2024",
        tahun_tingkatan_pengajian: "Tahun 6",
        nama_sekolah_institusi: "SK Petaling Jaya",
        alamat1_sekolah: "Jalan Sekolah, Petaling Jaya",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Petaling",
        bandar_sekolah: "Petaling Jaya",
        poskod_sekolah: "46000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "",
        jurusan_bidang: "",
        pembiayaan_pengajian: ["Tiada"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Masih bersekolah di Tahun 6",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Rendah",
        nama_sekolah: "SK Petaling Jaya",
        alamat_sekolah: "Jalan Sekolah, Petaling Jaya",
        negeri_sekolah: "Selangor",
        nama_sekolah_agama: "Sekolah Agama Petaling Jaya",
        alamat_sekolah_agama: "Jalan Agama, Petaling Jaya",
        daerah_sekolah_agama: "Petaling",
        negeri_sekolah_agama: "Selangor",
        poskod_sekolah_agama: "46000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Membaca, Menulis, Mengira",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Tidak Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: [],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "",
        sektor_pekerjaan: "",
        lain_lain_sektor_pekerjaan: "",
        jawatan: "",
        status_jawatan: "",
        pendapatan_kasar: "",
        pengesahan_pendapatan: null,

        // Maklumat Majikan
        no_telefon_pejabat: "",
        nama_majikan: "",
        no_tel_majikan: "",
        alamat_majikan_1: "",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "",
        poskod_majikan: "",
        daerah_majikan: "",
        negeri_majikan: "",
        negara_majikan: "",

        // Jawatan & Status
        jawatan: "",
        status_jawatan: "",

        // Pendapatan
        pendapatan_kasar: "",
        dokumen_pendapatan: null,
      };

      // Update formData.tanggungan array
      formData.value.tanggungan = tanggunganList.value;

      // Ensure Section B defaults to the first tanggungan on initial load
      currentTanggunganIndex.value = 0;

      // Set flag to false after mock data initialization is complete
      isInitializingMockData.value = false;
    }
  }
});

// ============================================================================
// STEP JUMP FUNCTIONS
// ============================================================================
const goToStepA = (stepNumber) => {
  currentStepA.value = stepNumber;
};

const goToStepB = (stepNumber) => {
  const currentTanggungan = getCurrentTanggungan();

  if (currentTanggungan) {
    const age = parseInt(
      currentTanggungan.umur_tanggungan ||
        calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
    );

    // Prevent navigation to kemahiran step (id: 6) if age is less than 19
    if (age < 19 && stepNumber === 6) {
      return; // Do not navigate to kemahiran step
    }
  }

  // Allow direct navigation to any step
  currentStepB.value = stepNumber;
};

// ============================================================================
// FORM SUBMISSION FUNCTIONS
// ============================================================================

const handleSubmit = async () => {
  try {
    toast.success("Permohonan berjaya dihantar");
    router.push("/BF-PRF/AS/FR/01");
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya dihantar");
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION A
// ============================================================================
const handleSaveStepA1 = async () => {
  try {
    toast.success("Maklumat Peribadi berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA2 = async () => {
  try {
    toast.success("Maklumat Alamat berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA3 = async () => {
  try {
    toast.success("Maklumat Pendidikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA4 = async () => {
  try {
    toast.success("Maklumat Pengislaman berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA5 = async () => {
  try {
    toast.success("Maklumat Perbankan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA6 = async () => {
  try {
    toast.success("Maklumat Kesihatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA7 = async () => {
  try {
    toast.success("Maklumat Kemahiran berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA8 = async () => {
  try {
    toast.success("Maklumat Pinjaman Harta berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA9 = async () => {
  try {
    toast.success("Maklumat Pemilikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA10 = async () => {
  try {
    toast.success("Maklumat Pekerjaan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepA11 = async () => {
  try {
    toast.success("Maklumat Pendapatan & Perbelanjaan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION B
// ============================================================================
const handleSaveStepB1 = async () => {
  try {
    toast.success("Maklumat Peribadi Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB2 = async () => {
  try {
    toast.success("Maklumat Pengislaman Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB3 = async () => {
  try {
    toast.success("Maklumat Perbankan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB4 = async () => {
  try {
    toast.success("Maklumat Pendidikan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB5 = async () => {
  try {
    toast.success("Maklumat Kesihatan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB6 = async () => {
  try {
    toast.success("Maklumat Kemahiran Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB7 = async () => {
  try {
    toast.success("Maklumat Pekerjaan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB8 = async () => {
  try {
    toast.success("Maklumat Pemilikan Aset berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB9 = async () => {
  try {
    toast.success("Maklumat Pinjaman Harta berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB10 = async () => {
  try {
    toast.success("Maklumat Pengesahan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB11 = async () => {
  try {
    toast.success("Maklumat Pengesahan Pendapatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB12 = async () => {
  try {
    toast.success("Maklumat Pengesahan Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

const handleSaveStepB13 = async () => {
  try {
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
  }
};

// ============================================================================
// EDUCATION ENTRIES MANAGEMENT FUNCTIONS
// ============================================================================
const addEducationEntry = () => {
  formData.value.education_entries.push({
    jenis_sekolah: "",
    sekolah_rendah_kategori: [],
    kategori_sekolah: "",
    tarikh_mula_pengajian: "",
    tarikh_tamat_pengajian: "",
    tahun_bersekolah: "",
    tahun_tingkatan: "",
    nama_sekolah: "",
    alamat_sekolah_1: "",
    alamat_sekolah_2: "",
    alamat_sekolah_3: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    bidang_kursus: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan: "",
    catatan: "",
  });
};

</script>

<style scoped></style>
